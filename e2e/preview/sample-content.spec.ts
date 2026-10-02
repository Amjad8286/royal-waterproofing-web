import { expect, test } from "@playwright/test";
import { projects } from "../../src/content/projects";

/**
 * Runs against the preview build (NEXT_PUBLIC_PREVIEW_SAMPLES=true), where the
 * sample projects, gallery and reviews are shown with "Sample" badges. These
 * sections appear on the live site automatically once real content exists.
 */

test("sample content is badged so it can't be mistaken for real", async ({ page }) => {
  await page.goto("/reviews");
  await expect(page.getByText("Sample review").first()).toBeVisible();
  await page.goto("/projects");
  await expect(page.getByText(/Sample projects/).first()).toBeVisible();
});

test("project filters update the URL and the results", async ({ page, isMobile }) => {
  await page.goto("/projects");
  const status = page.getByRole("status").filter({ hasText: /Showing/ });
  await expect(status).toHaveText(`Showing ${projects.length} of ${projects.length} projects`);

  if (isMobile) {
    await page.getByLabel("Service", { exact: true }).selectOption("basement-waterproofing");
  } else {
    await page.getByRole("group", { name: "Filter by service" }).getByRole("button", { name: /^Basement/ }).click();
  }
  const basement = projects.filter((p) => p.services.includes("basement-waterproofing")).length;
  const industrial = projects.filter((p) => p.propertyType === "industrial").length;
  await expect(page).toHaveURL(/service=basement-waterproofing/);
  await expect(status).toHaveText(`Showing ${basement} of ${projects.length} projects`);

  // Filtered URLs are shareable: loading one applies the filter.
  await page.goto("/projects?type=industrial");
  await expect(status).toHaveText(`Showing ${industrial} of ${projects.length} projects`);
});

test("before/after slider works from the keyboard", async ({ page }) => {
  await page.goto("/projects/bungalow-basement-storage-room");
  const slider = page.getByRole("slider", { name: /Compare before and after/ }).first();
  await slider.focus();
  await expect(slider).toHaveValue("50");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveValue("60");
  await page.keyboard.press("Home");
  await expect(slider).toHaveValue("0");
  await expect(slider).toHaveAttribute("aria-valuetext", "0% before, 100% after");
});

test("gallery lightbox: keyboard navigation, Escape, focus return", async ({ page, isMobile }) => {
  test.skip(isMobile, "Swipe/keyboard behaviour is covered on desktop");
  await page.goto("/gallery");
  const thumbs = page.getByRole("button", { name: /Open in image viewer/ });
  const total = await thumbs.count();
  const second = thumbs.nth(1);
  await second.click();

  const viewer = page.getByRole("dialog", { name: "Image viewer" });
  await expect(viewer).toBeVisible();
  await expect(viewer.getByText(`2 / ${total}`)).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(viewer.getByText(`3 / ${total}`)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(viewer).toBeHidden();
  await expect(second).toBeFocused();
});

test("navigation links to the gallery and reviews once they have content", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop navigation");
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Reviews" })).toBeVisible();
  await page.getByRole("button", { name: "Projects" }).click();
  await expect(page.locator("#menu-projects").getByRole("link", { name: /Photo gallery/ })).toBeVisible();
});

test("sample pages also use only reviewed, people-free images", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "preview-desktop", "One crawl is enough");
  const { images } = await import("../../src/content/images");
  const { previewRoutes } = await import("../routes");
  const approved = new Set(Object.values(images).map((image) => image.src));
  const unexpected: string[] = [];
  for (const route of previewRoutes) {
    await page.goto(route);
    const srcs = await page.evaluate(() => Array.from(document.images, (img) => img.currentSrc || img.src));
    for (const src of srcs) {
      const url = new URL(src, "http://localhost");
      const file = url.pathname === "/_next/image" ? url.searchParams.get("url") : url.pathname;
      if (!file || !approved.has(file)) unexpected.push(`${route}: ${src}`);
    }
  }
  expect(unexpected).toEqual([]);
});
