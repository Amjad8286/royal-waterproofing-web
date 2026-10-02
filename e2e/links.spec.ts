import { expect, test } from "@playwright/test";
import { allRoutes } from "./routes";

test.describe.configure({ mode: "serial" });

/** Crawls every page once and checks each internal link and image resolves. */
test("internal links and images all resolve", async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Link checking only needs to run once.");
  test.setTimeout(180_000);

  const links = new Set<string>();
  const images = new Set<string>();

  for (const route of allRoutes) {
    await page.goto(route);
    const hrefs = await page.locator("a[href^='/']").evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
    for (const href of hrefs) links.add(href.split("#")[0]);
    const srcs = await page.locator("img").evaluateAll((els) => els.map((el) => (el as HTMLImageElement).currentSrc || (el as HTMLImageElement).src));
    for (const src of srcs) if (src && !src.startsWith("blob:") && !src.startsWith("data:")) images.add(src);
  }

  const broken: string[] = [];
  for (const href of links) {
    if (!href) continue;
    const response = await request.get(href);
    if (response.status() !== 200) broken.push(`${href} → ${response.status()}`);
  }
  for (const src of images) {
    const response = await request.get(src);
    if (response.status() !== 200) broken.push(`${src} → ${response.status()}`);
  }

  expect(links.size).toBeGreaterThan(40);
  expect(broken).toEqual([]);
});
