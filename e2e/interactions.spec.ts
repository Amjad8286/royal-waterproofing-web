import { expect, test } from "@playwright/test";
import { clients } from "../src/content/clients";

test("FAQ search filters and opens matching answers", async ({ page }) => {
  await page.goto("/faq");
  await page.getByLabel("Search the FAQs").fill("solar");
  await expect(page.getByRole("status").filter({ hasText: /matching/ })).toHaveText("1 matching answer");
  await expect(page.getByText(/Mounts and pipes need to be detailed/)).toBeVisible();
});

test("the office map loads only when asked for", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator('iframe[title^="Map showing"]')).toHaveCount(0);
  await page.route(/google\.com\/maps/, (route) => route.abort()); // don't load Google Maps itself
  await page.getByRole("button", { name: "Load interactive map" }).click();
  await expect(page.locator('iframe[title^="Map showing"]')).toHaveAttribute("src", /google\.com\/maps.*Santacruz/);
});

test("the home page shows every client, a few rows at a time on phones", async ({ page, isMobile }) => {
  await page.goto("/");
  const section = page.locator('section[aria-labelledby="clients-title"]');
  await expect(section.getByRole("heading", { name: "Trusted by leading organisations" })).toBeVisible();
  // A CSS locator, not getByRole: on phones the collapsed tiles are hidden, and roles skip hidden elements.
  const tiles = section.locator("ul > li");
  await expect(tiles).toHaveCount(clients.length);
  for (const client of clients) {
    const mark = client.logo
      ? section.getByRole("img", { name: client.name, exact: true })
      : section.getByText(client.name, { exact: true });
    await expect(mark, client.name).toHaveCount(1);
  }

  const showAll = section.getByRole("button", { name: `Show all ${clients.length} clients` });
  if (isMobile) {
    await expect(tiles.filter({ visible: true })).toHaveCount(10);
    await expect(showAll).toHaveAttribute("aria-expanded", "false");
    await showAll.click();
    await expect(section.getByRole("button", { name: "Show fewer clients" })).toHaveAttribute("aria-expanded", "true");
  } else {
    await expect(showAll).toBeHidden();
  }
  await expect(tiles.filter({ visible: true })).toHaveCount(clients.length);
});
