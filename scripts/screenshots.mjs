#!/usr/bin/env node
/**
 * Full-page screenshots for visual review.
 *
 *   node scripts/screenshots.mjs [baseUrl] [outDir] [routes,comma,separated] [widths]
 *
 * Defaults: http://localhost:3000, ./screenshots, "/", "390,1440".
 * Requires Playwright's Chromium: npx playwright install chromium
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3000";
const outDir = process.argv[3] ?? "screenshots";
const routes = (process.argv[4] ?? "/").split(",");
const widths = (process.argv[5] ?? "390,1440").split(",").map(Number);

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: width < 768 ? 844 : 900 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  for (const route of routes) {
    await page.goto(new URL(route, base).toString(), { waitUntil: "load" });
    // Scroll through the page so lazy images load, then back to the top.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(300);
    const name = `${route === "/" ? "home" : route.replace(/^\//, "").replace(/[/?=&]/g, "_")}-${width}.png`;
    await page.screenshot({ path: join(outDir, name), fullPage: true });
    console.log(`${name}${errors.length ? `  console errors: ${errors.join(" | ")}` : ""}`);
    errors.length = 0;
  }
  await context.close();
}
await browser.close();
