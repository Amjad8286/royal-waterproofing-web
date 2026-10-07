import { spawnSync } from "node:child_process";
import { expect, test, type Page } from "@playwright/test";
import { allRoutes, hiddenRoutes } from "./routes";

/** Every JSON-LD item on the page, with arrays flattened. */
async function structuredData(page: Page) {
  return (await page.locator('script[type="application/ld+json"]').allTextContents()).flatMap((json) => {
    const data = JSON.parse(json);
    return Array.isArray(data) ? data : [data];
  });
}

const decode = (text: string) => text.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');

test.describe("SEO guards", () => {
  test.skip(({ isMobile }) => isMobile, "Runs once");

  test("every page has its own title and a description that fits in search results", async ({ request }) => {
    const seen = new Map<string, string>();
    for (const route of allRoutes) {
      const html = await (await request.get(route)).text();
      const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
      const description = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
      expect(seen.get(title), `${route} has the same title as ${seen.get(title)}`).toBeUndefined();
      seen.set(title, route);
      expect(description.length, `${route}: "${description}"`).toBeGreaterThanOrEqual(50);
      expect(description.length, `${route}: "${description}"`).toBeLessThanOrEqual(165);
    }
  });

  test("the home page names the site, and service pages share their own card", async ({ page }) => {
    await page.goto("/");
    expect((await structuredData(page)).map((item) => item["@type"])).toContain("WebSite");
    const image = page.locator('meta[property="og:image"]');
    await expect(image).toHaveAttribute("content", /\/opengraph-image$/);

    await page.goto("/service-areas/thane");
    await expect(image).toHaveAttribute("content", /\/opengraph-image$/);

    await page.goto("/services/basement-waterproofing");
    await expect(image).toHaveAttribute("content", /\/services\/basement-waterproofing\/opengraph-image$/);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", /\/services\/basement-waterproofing\/opengraph-image$/);
  });

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
    // Every page carries the day its content last changed.
    expect(xml.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g)?.length).toBe(xml.match(/<url>/g)?.length);
  });

  test("the sitemap's lastmod dates match what the pages show", () => {
    // Fingerprints the live build this suite just made and compares it with src/content/generated/page-dates.json.
    const result = spawnSync(process.execPath, ["scripts/page-dates.mjs", "--check"], { encoding: "utf8" });
    expect(result.status, `${result.stdout}${result.stderr}`).toBe(0);
  });

  test("service pages expose Service, FAQPage and BreadcrumbList structured data", async ({ page }) => {
    await page.goto("/services/basement-waterproofing");
    const types = (await structuredData(page)).map((item) => item["@type"]);
    expect(types).toEqual(expect.arrayContaining(["HomeAndConstructionBusiness", "Service", "FAQPage", "BreadcrumbList"]));
    expect(types).not.toContain("AggregateRating");
  });

  test("the business structured data has the real contact details", async ({ page }) => {
    await page.goto("/");
    const business = (await structuredData(page)).find((item) => item["@type"] === "HomeAndConstructionBusiness");
    expect(business).toMatchObject({
      telephone: "+919702008187",
      email: "info@royalwaterproofingco.com",
      address: { addressLocality: "Mumbai", addressRegion: "Maharashtra", postalCode: "400055", addressCountry: "IN" },
    });
    expect(business.openingHoursSpecification).toBeUndefined();
    // Thane and Navi Mumbai are cities in their own right, not parts of Mumbai.
    expect(business.areaServed).toEqual(
      expect.arrayContaining([
        { "@type": "City", name: "Mumbai" },
        { "@type": "City", name: "Thane" },
        { "@type": "City", name: "Navi Mumbai" },
      ]),
    );
  });

  test("security headers are set", async ({ request }) => {
    const headers = (await request.get("/")).headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-powered-by"]).toBeUndefined();
  });
});
