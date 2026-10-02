import { expect, test } from "@playwright/test";
import { allRoutes, hiddenRoutes } from "./routes";

test.describe("SEO guards", () => {
  test.skip(({ isMobile }) => isMobile, "Runs once");

  test("robots.txt blocks crawlers while indexing is disabled", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();
    expect(body).toMatch(/Disallow: \//);
  });

  test("pages carry noindex until indexing is enabled", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("sitemap lists every page except thank-you", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const route of allRoutes.filter((r) => r !== "/thank-you")) {
      expect(xml, route).toContain(`${route === "/" ? "" : route}</loc>`);
    }
    expect(xml).not.toContain("/thank-you</loc>");
    for (const route of hiddenRoutes) expect(xml, route).not.toContain(`${route}</loc>`);
  });

  test("service pages expose Service, FAQPage and BreadcrumbList structured data", async ({ page }) => {
    await page.goto("/services/basement-waterproofing");
    const types = (await page.locator('script[type="application/ld+json"]').allTextContents())
      .flatMap((json) => {
        const data = JSON.parse(json);
        return Array.isArray(data) ? data : [data];
      })
      .map((item) => item["@type"]);
    expect(types).toEqual(expect.arrayContaining(["HomeAndConstructionBusiness", "Service", "FAQPage", "BreadcrumbList"]));
    expect(types).not.toContain("AggregateRating");
  });

  test("the business structured data has the real contact details", async ({ page }) => {
    await page.goto("/");
    const business = (await page.locator('script[type="application/ld+json"]').allTextContents())
      .map((json) => JSON.parse(json))
      .find((item) => item["@type"] === "HomeAndConstructionBusiness");
    expect(business).toMatchObject({
      telephone: "+919702008187",
      email: "info@royalwaterproofingco.com",
      address: { addressLocality: "Mumbai", addressRegion: "Maharashtra", postalCode: "400055", addressCountry: "IN" },
    });
    expect(business.openingHoursSpecification).toBeUndefined();
  });

  test("security headers are set", async ({ request }) => {
    const headers = (await request.get("/")).headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-powered-by"]).toBeUndefined();
  });
});
