import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { allRoutes } from "./routes";

/** How many pixels the page is wider than the window (0 = no horizontal scrolling). */
const overflowX = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

/**
 * Every route: renders with 200, one h1, a branded title, a canonical URL,
 * valid JSON-LD, no console errors, no serious WCAG 2.2 AA violations and no
 * horizontal scrolling (at this size and on a 320px phone).
 */
for (const route of allRoutes) {
  test(`page ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    const response = await page.goto(route);
    expect(response?.status()).toBe(200);

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/Royal Waterproofing Co\./);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical && new URL(canonical).pathname).toBe(route);

    for (const json of await page.locator('script[type="application/ld+json"]').allTextContents()) {
      const data = JSON.parse(json);
      for (const item of Array.isArray(data) ? data : [data]) expect(item["@type"]).toBeTruthy();
    }

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(
      serious.map((v) => ({ rule: v.id, help: v.help, targets: v.nodes.slice(0, 5).map((n) => n.target.join(" ")) })),
    ).toEqual([]);

    expect(await overflowX(page), "horizontal scrolling").toBeLessThanOrEqual(0);
    await page.setViewportSize({ width: 320, height: 640 });
    expect(await overflowX(page), "horizontal scrolling at 320px").toBeLessThanOrEqual(0);

    expect(errors).toEqual([]);
  });
}

test("unknown pages return the custom 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/couldn.t find that page/i);
  await expect(page.getByRole("link", { name: /get free inspection/i }).first()).toBeVisible();
});

test("unknown service slugs are 404s, not empty pages", async ({ request }) => {
  const response = await request.get("/services/not-a-real-service");
  expect(response.status()).toBe(404);
});
