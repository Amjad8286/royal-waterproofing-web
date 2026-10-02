import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { expect, test } from "@playwright/test";
import { images } from "../src/content/images";
import { allRoutes } from "./routes";

/**
 * Site-wide image scan. Every image a visitor can see must come from the
 * reviewed manifest in src/content/images.ts (stock photos checked for people,
 * illustrations generated without figures). Nothing else may slip in — no
 * stray files, CSS background photos or images hot-linked from other sites.
 */
const approved = new Set(Object.values(images).map((image) => image.src));
/** Blurred loading placeholders, generated from the approved images themselves. */
const approvedBlurs = new Set(Object.values(images).flatMap((image) => (image.blurDataURL ? [image.blurDataURL] : [])));

/** next/image paints the blur placeholder as an SVG background wrapping the image's blurDataURL. */
function isApprovedBlur(background: string) {
  const inner = decodeURIComponent(background).match(/href='(data:image\/[a-z]+;base64,[^']+)'/);
  return Boolean(inner && approvedBlurs.has(inner[1]));
}

function filesIn(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? filesIn(full) : [full];
  });
}

/** next/image serves /_next/image?url=/images/...; plain files are served as-is. */
function sourceOf(src: string) {
  const url = new URL(src, "http://localhost");
  return url.pathname === "/_next/image" ? (url.searchParams.get("url") ?? "") : url.pathname;
}

test("every image on every page is from the reviewed, people-free set", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "One crawl is enough");
  test.setTimeout(180_000);
  const unexpected: string[] = [];
  let seen = 0;

  for (const route of allRoutes) {
    await page.goto(route);
    const found = await page.evaluate(() => {
      const srcs = Array.from(document.images, (img) => img.currentSrc || img.src);
      const backgrounds = Array.from(document.querySelectorAll<HTMLElement>("body *"))
        .map((el) => getComputedStyle(el).backgroundImage)
        .filter((bg) => bg.includes("url("));
      return { srcs, backgrounds };
    });
    for (const src of found.srcs) {
      if (src.startsWith("blob:")) continue;
      seen += 1;
      if (!approved.has(sourceOf(src))) unexpected.push(`${route}: ${src}`);
    }
    for (const bg of found.backgrounds) if (!isApprovedBlur(bg)) unexpected.push(`${route}: CSS background ${bg.slice(0, 120)}`);
  }

  expect(seen).toBeGreaterThan(50);
  expect(unexpected).toEqual([]);
});

test("public/images holds only manifest images", () => {
  const root = join(process.cwd(), "public");
  const files = filesIn(join(root, "images")).map((file) => `/${relative(root, file).split(sep).join("/")}`);
  expect(files.filter((file) => !approved.has(file))).toEqual([]);
});
