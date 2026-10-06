import { expect, test, type Page } from "@playwright/test";

const form = (page: Page) => page.locator("main form").first();

async function fillRequired(page: Page, name: string) {
  const f = form(page);
  await f.getByLabel("Your name").fill(name);
  await f.getByLabel("Phone number").fill("98200 12345");
  await f.getByLabel("Service needed").selectOption("bathroom-waterproofing");
  await f.getByLabel("Your area").selectOption("andheri");
}

test.describe("lead form", () => {
  test("shows an error summary and focuses the first invalid field", async ({ page }) => {
    await page.goto("/contact");
    await form(page).getByRole("button", { name: /get free inspection/i }).click();

    const summary = form(page).getByRole("alert");
    await expect(summary).toContainText("Please fix these 4 before sending");
    await expect(form(page).getByLabel("Your name")).toBeFocused();
    await expect(form(page).getByLabel("Your name")).toHaveAttribute("aria-invalid", "true");
  });

  test("validates the phone number on blur", async ({ page }) => {
    await page.goto("/contact");
    const phone = form(page).getByLabel("Phone number");
    await phone.fill("12");
    await phone.blur();
    await expect(form(page).getByText(/Enter a 10-digit mobile number/)).toBeVisible();
  });

  test("pre-fills the service and area from the link", async ({ page }) => {
    await page.goto("/contact?service=basement-waterproofing&area=thane");
    await expect(form(page).getByLabel("Service needed")).toHaveValue("basement-waterproofing");
    await expect(form(page).getByLabel("Your area")).toHaveValue("thane");
  });

  test("submits and lands on the thank-you page", async ({ page }) => {
    await page.goto("/contact");
    await fillRequired(page, "Priya Shah");
    await page.waitForTimeout(1600); // faster than a human = treated as a bot
    await form(page).getByRole("button", { name: /get free inspection/i }).click();
    await expect(page).toHaveURL(/\/thank-you\?ref=RW-/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/we.ve got your request/i);
    await expect(page.getByText(/Your reference:/)).toBeVisible();
  });

  test("keeps the details and offers alternatives when sending fails", async ({ page }) => {
    await page.goto("/contact");
    await fillRequired(page, "Test Error");
    await page.waitForTimeout(1600);
    await form(page).getByRole("button", { name: /get free inspection/i }).click();

    const alert = form(page).getByRole("alert");
    await expect(alert).toContainText("We couldn't send your request just now");
    await expect(alert.getByRole("link", { name: /whatsapp us/i })).toBeVisible();
    await expect(form(page).getByLabel("Your name")).toHaveValue("Test Error");
    await expect(page).toHaveURL(/\/contact$/);
  });

  test("doesn't ask about WhatsApp updates on either form", async ({ page }) => {
    await page.goto("/contact");
    await expect(form(page).getByRole("checkbox")).toHaveCount(0);
    await expect(form(page).getByText(/send me updates/i)).toHaveCount(0);

    await page.goto("/services/crack-repair-sealing");
    const ctaForm = page.locator("#cta-title").locator("xpath=ancestor::section[1]").locator("form");
    await expect(ctaForm.getByRole("checkbox")).toHaveCount(0);
  });

  test("the compact form on a service page is pre-set to that service", async ({ page }) => {
    await page.goto("/services/crack-repair-sealing");
    const ctaForm = page.locator("#cta-title").locator("xpath=ancestor::section[1]").locator("form");
    await expect(ctaForm.getByLabel("Service needed")).toHaveValue("crack-repair-sealing");
  });
});
