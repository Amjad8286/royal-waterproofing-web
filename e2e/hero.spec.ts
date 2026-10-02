import { expect, test, type Page } from "@playwright/test";

/** The home hero slideshow: controls, keyboard, swipe, autoplay and loading. */
const carousel = (page: Page) => page.getByRole("group", { name: "Photo slideshow" });
const photoButtons = (page: Page) => carousel(page).getByRole("group", { name: "Choose a photo" }).getByRole("button");

test.describe("home hero slideshow", () => {
  test("the controls change the photo, announce it and stop autoplay", async ({ page }) => {
    await page.goto("/");
    await expect(carousel(page)).toHaveAttribute("aria-roledescription", "carousel");
    await expect(photoButtons(page)).toHaveCount(5);
    await expect(photoButtons(page).first()).toHaveAttribute("aria-current", "true");

    await carousel(page).getByRole("button", { name: "Next photo" }).click();
    await expect(photoButtons(page).nth(1)).toHaveAttribute("aria-current", "true");
    await expect(carousel(page).getByRole("button", { name: "Play slideshow" })).toBeVisible();
    const live = carousel(page).locator("[aria-live]");
    await expect(live).toHaveAttribute("aria-live", "polite");
    await expect(live).toContainText("Photo 2 of 5");

    await carousel(page).getByRole("button", { name: "Previous photo" }).click();
    await carousel(page).getByRole("button", { name: "Previous photo" }).click();
    await expect(photoButtons(page).nth(4)).toHaveAttribute("aria-current", "true");

    await photoButtons(page).nth(2).click();
    await expect(photoButtons(page).nth(2)).toHaveAttribute("aria-current", "true");
  });

  test("arrow keys move along the photo buttons", async ({ page, isMobile }) => {
    test.skip(isMobile, "Keyboard");
    await page.goto("/");
    await photoButtons(page).first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(photoButtons(page).nth(1)).toHaveAttribute("aria-current", "true");
    await expect(photoButtons(page).nth(1)).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(photoButtons(page).nth(4)).toHaveAttribute("aria-current", "true");
  });

  test("plays on its own, and the pause button stops it", async ({ page, isMobile }) => {
    test.skip(isMobile, "Timing checked once");
    await page.goto("/");
    await page.mouse.move(0, 0);
    await expect(carousel(page).getByRole("button", { name: "Pause slideshow" })).toBeVisible();
    await expect(photoButtons(page).nth(1)).toHaveAttribute("aria-current", "true", { timeout: 12_000 });

    await carousel(page).getByRole("button", { name: "Pause slideshow" }).click();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(8000);
    await expect(photoButtons(page).nth(1)).toHaveAttribute("aria-current", "true");
  });

  test("doesn't play for people who prefer reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(carousel(page).getByRole("button", { name: "Play slideshow" })).toBeVisible();
  });

  test("swiping the hero changes the photo on phones", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Touch");
    await page.goto("/");
    const title = page.locator("#hero-title");
    const box = await title.boundingBox();
    if (!box) throw new Error("Hero title not rendered");
    const swipe = async (from: number, to: number) => {
      const y = box.y + box.height / 2;
      await title.dispatchEvent("pointerdown", { pointerType: "touch", clientX: from, clientY: y, isPrimary: true });
      await title.dispatchEvent("pointerup", { pointerType: "touch", clientX: to, clientY: y, isPrimary: true });
    };
    await swipe(box.x + 280, box.x + 60);
    await expect(photoButtons(page).nth(1)).toHaveAttribute("aria-current", "true");
    await swipe(box.x + 60, box.x + 280);
    await expect(photoButtons(page).first()).toHaveAttribute("aria-current", "true");
  });

  test("only the first photo loads with the page, eagerly", async ({ request }) => {
    const html = await (await request.get("/")).text();
    const pictures = html.match(/<picture>[\s\S]*?<\/picture>/g) ?? [];
    expect(pictures).toHaveLength(1);
    expect(pictures[0]).toMatch(/fetchPriority="high"|fetchpriority="high"/);
    expect(pictures[0]).toMatch(/<source media="\(max-width: 1023px\) and \(orientation: portrait\)"/);
  });
});
