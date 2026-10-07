#!/usr/bin/env node
/**
 * Keeps the sitemap's <lastmod> dates honest: a page's date moves only when
 * what it shows changes. Search engines trust lastmod only while it's accurate.
 *
 * Reads the live build (.next, or NEXT_DIST_DIR), fingerprints every page in its
 * sitemap (title, description, and the text, image alt text, links and
 * structured data inside <main>) and records the fingerprints in
 * src/content/generated/page-dates.json. Pages whose fingerprint changed, and
 * new pages, get today's date (India time); src/app/sitemap.ts publishes it.
 *
 *   npm run sitemap:dates                   builds the live site, then updates the dates (run after
 *                                           changing content, before deploying)
 *   node scripts/page-dates.mjs --check     compares without writing; exits 1 if a date is out of date
 *                                           (the e2e suite runs this against the build it just made)
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const appDir = join(root, process.env.NEXT_DIST_DIR || ".next", "server/app");
const outFile = join(root, "src/content/generated/page-dates.json");
const check = process.argv.includes("--check");

function fail(message) {
  console.error(message);
  process.exit(1);
}

const sitemapFile = join(appDir, "sitemap.xml.body");
if (!existsSync(sitemapFile)) fail(`No build in ${appDir}. Run \`npm run sitemap:dates\`, which builds the site first.`);
const urls = [...readFileSync(sitemapFile, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));
// The build's NEXT_PUBLIC_SITE_URL. It's removed from structured data, so local and production builds match.
const origin = urls[0]?.origin ?? "";

function fingerprint(html) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? "";
  const main = html.match(/<main\b[^>]*>([\s\S]*)<\/main>/)?.[1];
  if (main === undefined) return null;
  const title = head.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "";
  const description = head.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  const structuredData = [...main.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) =>
    match[1].replaceAll(origin, ""),
  );
  const content = main
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, " ")
    .replace(/<img\b[^>]*?\salt="([^"]*)"[^>]*>/g, " $1 ")
    .replace(/<a\b[^>]*?\shref="([^"]*)"[^>]*>/g, " $1 ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return createHash("sha256").update([title, description, ...structuredData, content].join("\n")).digest("hex").slice(0, 16);
}

const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
const previous = existsSync(outFile) ? JSON.parse(readFileSync(outFile, "utf8")) : {};
const dates = {};
const changed = [];

for (const { pathname } of urls) {
  const file = join(appDir, pathname === "/" ? "index.html" : `${pathname.slice(1)}.html`);
  if (!existsSync(file)) fail(`${pathname} is in the sitemap but has no prerendered page (${file}).`);
  const html = readFileSync(file, "utf8");
  // PlaceholderBadge's tooltip: sample content is only rendered in preview mode.
  if (html.includes("Placeholder content")) fail(`${appDir} is a preview build (sample content shown). Build the live site.`);
  const print = fingerprint(html);
  if (!print) fail(`${pathname} has no <main> element to fingerprint.`);
  if (previous[pathname]?.fingerprint === print) {
    dates[pathname] = previous[pathname];
  } else {
    dates[pathname] = { lastModified: today, fingerprint: print };
    changed.push(pathname);
  }
}
const removed = Object.keys(previous).filter((path) => !(path in dates));
const sorted = Object.fromEntries(Object.entries(dates).sort(([a], [b]) => a.localeCompare(b)));

if (check) {
  if (changed.length || removed.length) {
    fail(
      [
        "The sitemap's lastmod dates are out of date.",
        ...changed.map((path) => `  changed or new: ${path}`),
        ...removed.map((path) => `  no longer in the sitemap: ${path}`),
        "Run `npm run sitemap:dates` and commit src/content/generated/page-dates.json.",
      ].join("\n"),
    );
  }
  console.log(`All ${urls.length} sitemap dates match the pages' content.`);
} else if (changed.length || removed.length) {
  writeFileSync(outFile, `${JSON.stringify(sorted, null, 2)}\n`);
  for (const path of changed) console.log(`  ${today}  ${path}`);
  for (const path of removed) console.log(`  removed  ${path}`);
  console.log(`Updated ${changed.length + removed.length} of ${urls.length} pages in src/content/generated/page-dates.json.`);
} else {
  console.log(`All ${urls.length} sitemap dates are current.`);
}
