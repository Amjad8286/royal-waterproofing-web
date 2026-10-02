import { expect, test } from "@playwright/test";
import { allRoutes, hiddenRoutes } from "./routes";

/**
 * The live site must never show invented content or the old placeholder
 * contact details. Sample content is shown only in the preview build.
 */
test.describe("live site content", () => {
  test.skip(({ isMobile }) => isMobile, "Runs once");

  test("pages that would only hold sample content don't exist yet", async ({ request }) => {
    for (const route of hiddenRoutes) {
      expect((await request.get(route)).status(), route).toBe(404);
    }
  });

  test("no page shows sample badges, invented claims or placeholder contact details", async ({ request }) => {
    const forbidden = [
      "Placeholder content", // the sample badge's tooltip
      "+00 0000",
      "000000000000",
      "example.com",
      "to be confirmed",
      "in your area",
      "Google reviews", // the sample rating
      "10-year",
      "Written warranty",
      "working hours", // the unconfirmed call-back promise
    ];
    for (const route of allRoutes) {
      const html = await (await request.get(route)).text();
      for (const text of forbidden) expect(html.includes(text), `${route} contains "${text}"`).toBe(false);
    }
  });

  test("every call, WhatsApp and email link uses the real details", async ({ page }) => {
    for (const route of ["/", "/contact", "/services/bathroom-waterproofing", "/service-areas/santacruz"]) {
      await page.goto(route);
      const tel = await page.locator("a[href^='tel:']").evaluateAll((els) => els.map((el) => el.getAttribute("href")));
      expect(tel.length).toBeGreaterThan(0);
      expect(new Set(tel)).toEqual(new Set(["tel:+919702008187"]));

      const wa = await page.locator("a[href*='wa.me']").evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
      expect(wa.length).toBeGreaterThan(0);
      for (const href of wa) expect(href.startsWith("https://wa.me/919702008187"), href).toBe(true);

      const mail = await page.locator("a[href^='mailto:']").evaluateAll((els) => els.map((el) => el.getAttribute("href")));
      expect(new Set(mail)).toEqual(new Set(["mailto:info@royalwaterproofingco.com"]));
    }
  });

  test("the office address appears in the footer and on the contact page", async ({ page }) => {
    const address = "S-9, Adarsh Apartment, 7th Rd, Sen Nagar, Santacruz East, Mumbai, Maharashtra 400055";
    await page.goto("/contact");
    await expect(page.getByRole("contentinfo").getByText(address)).toBeVisible();
    await expect(page.getByRole("main").getByText(address).first()).toBeVisible();
  });
});
