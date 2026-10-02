import { expect, test } from "@playwright/test";

test.describe("mobile menu", () => {
  test.skip(({ isMobile }) => !isMobile, "Phone layout only");

  test("opens as a modal, closes with Escape and returns focus", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Open menu" });
    await trigger.click();

    const menu = page.getByRole("dialog", { name: "Menu" });
    await expect(menu).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    // Focus stays inside the dialog while it's open.
    await page.keyboard.press("Tab");
    expect(await menu.evaluate((el) => el.contains(document.activeElement))).toBe(true);

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("navigates to a service and closes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    await menu.getByText("Services", { exact: true }).click();
    await menu.getByRole("link", { name: "Basement Waterproofing" }).click();
    await expect(page).toHaveURL(/\/services\/basement-waterproofing$/);
    await expect(menu).toBeHidden();
  });

  test("shows the quick-contact bar only after the hero CTAs scroll away", async ({ page }) => {
    await page.goto("/services/terrace-roof-waterproofing");
    const nav = page.locator('nav[aria-label="Quick contact"]');
    const bar = nav.locator("..");
    await expect(bar).toHaveAttribute("inert", "");
    await page.evaluate(() => window.scrollTo(0, 1600));
    await expect(bar).not.toHaveAttribute("inert", "");
    await expect(nav.getByRole("link", { name: /free inspection/i })).toHaveAttribute(
      "href",
      "/contact?service=terrace-roof-waterproofing",
    );
  });

  test("the quick-contact bar fits a 320px phone", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/services/terrace-roof-waterproofing");
    await page.evaluate(() => window.scrollTo(0, 1600));
    const nav = page.locator('nav[aria-label="Quick contact"]');
    await expect(nav.locator("..")).not.toHaveAttribute("inert", "");
    for (const link of await nav.getByRole("link").all()) {
      // On screen, with the whole label showing.
      const fits = await link.evaluate((a) => {
        const box = a.getBoundingClientRect();
        return box.left >= 0 && box.right <= document.documentElement.clientWidth && a.scrollWidth <= a.clientWidth;
      });
      expect(fits, (await link.textContent()) ?? "").toBe(true);
    }
  });
});

test.describe("desktop navigation", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop layout only");

  test("services mega-menu opens, closes with Escape and returns focus", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Services" });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const panel = page.locator("#menu-services");
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("link", { name: /Bathroom Waterproofing/ })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("skip link moves focus to the main content", async ({ page }) => {
    await page.goto("/about");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });

  test("phone number is visible in the header", async ({ page }) => {
    await page.goto("/faq");
    await expect(page.getByRole("banner").getByRole("link", { name: /\+91 97020 08187/ }).first()).toBeVisible();
  });
});
