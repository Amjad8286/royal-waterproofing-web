import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { chatWidget } from "../src/content/chat";

/**
 * The website assistant: answers come from the site's content, unknown
 * questions get an honest answer and the phone number, and the window works
 * on phones (full screen) and desktop (a panel beside the page).
 */

async function openChat(page: Page, route = "/") {
  await page.goto(route);
  // Like the other quick-contact buttons, the chat button appears once the hero's CTAs have scrolled away.
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.getByRole("button", { name: chatWidget.launcherLabel }).click();
  const chat = page.getByRole("dialog", { name: chatWidget.name });
  await expect(chat).toBeVisible();
  return chat;
}

async function ask(chat: Locator, question: string) {
  const input = chat.getByLabel("Your question");
  await input.fill(question);
  await input.press("Enter");
}

test("the assistant answers from the site's content", async ({ page }) => {
  const chat = await openChat(page);
  const log = chat.getByRole("log", { name: "Conversation" });

  await chat.getByRole("button", { name: "Is the inspection really free?" }).click();
  await expect(log.getByText("Yes. We visit, diagnose the problem")).toBeVisible();

  await ask(chat, "What's your phone number?");
  await expect(log.getByText(/^Our number is/)).toBeVisible();
  await expect(log.getByRole("link", { name: "+91 97020 08187" })).toHaveAttribute("href", "tel:+919702008187");
  await expect(log.getByRole("link", { name: "Call Now" }).last()).toHaveAttribute("href", "tel:+919702008187");
  await expect(log.getByRole("link", { name: "WhatsApp" }).last()).toHaveAttribute("href", /^https:\/\/wa\.me\/919702008187\?text=/);
});

test("the assistant says when it doesn't know, instead of guessing", async ({ page }) => {
  const chat = await openChat(page);
  await ask(chat, "Do you repair laptops?");
  const log = chat.getByRole("log", { name: "Conversation" });
  await expect(log.getByText(/^Sorry, I don't have that information\./)).toBeVisible();
  await expect(log.getByRole("link", { name: "Call Now" })).toHaveAttribute("href", "tel:+919702008187");
});

test("the conversation lasts for the visit, and can be started again", async ({ page }) => {
  let chat = await openChat(page, "/services");
  await ask(chat, "Which areas do you cover?");
  await expect(chat.getByText(/^We work across/)).toBeVisible();

  await page.reload();
  chat = await openChat(page, "/services");
  await expect(chat.getByText(/^We work across/)).toBeVisible();

  await chat.getByRole("button", { name: "Start a new chat" }).click();
  await expect(chat.getByText(/^We work across/)).toHaveCount(0);
  await expect(chat.getByRole("button", { name: chatWidget.suggestions[0] })).toBeVisible();
});

test("on phones the chat fills the screen and closes back to its button", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Phone layout");
  const chat = await openChat(page, "/services/bathroom-waterproofing");
  const box = await chat.boundingBox();
  const viewport = page.viewportSize();
  expect(box?.width).toBe(viewport?.width);
  expect(Math.abs((box?.height ?? 0) - (viewport?.height ?? 0))).toBeLessThanOrEqual(1);

  await chat.getByRole("button", { name: "Close chat" }).click();
  await expect(chat).toBeHidden();
  await expect(page.getByRole("button", { name: chatWidget.launcherLabel })).toBeFocused();
});

test("on desktop the chat sits beside the page and closes with Escape", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop layout");
  const chat = await openChat(page);
  await expect(chat.getByLabel("Your question")).toBeFocused();
  // The page behind stays usable.
  await expect(page.getByRole("link", { name: "Get Free Inspection" }).first()).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(chat).toBeHidden();
  await expect(page.getByRole("button", { name: chatWidget.launcherLabel })).toBeFocused();
});

test("the open chat meets WCAG 2.2 AA", async ({ page }) => {
  const chat = await openChat(page, "/faq");
  await chat.getByRole("button", { name: "How can I contact you?" }).click();
  await expect(chat.getByText(/Call or WhatsApp us on/)).toBeVisible();

  const results = await new AxeBuilder({ page })
    .include("#chat-panel")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious.map((v) => ({ rule: v.id, targets: v.nodes.slice(0, 5).map((n) => n.target.join(" ")) }))).toEqual([]);
});

test.describe("chat API", () => {
  test.skip(({ isMobile }) => isMobile, "Runs once");

  test("never answers with unconfirmed claims", async ({ request }) => {
    const questions = [
      "Do you give a warranty?",
      "How many projects have you completed?",
      "What is your Google rating?",
      "How many years have you been in business?",
      "How quickly do you call back?",
    ];
    for (const question of questions) {
      const response = await request.post("/api/chat", { data: { question } });
      expect(response.ok(), question).toBe(true);
      const body = JSON.stringify(await response.json());
      for (const claim of ["10-year", "Written warranty", "working hours", "4.9", "127", "750+"]) {
        expect(body.includes(claim), `${question} → ${claim}`).toBe(false);
      }
    }
  });

  test("rejects bad requests", async ({ request }) => {
    expect((await request.post("/api/chat", { data: { question: "" } })).status()).toBe(400);
    expect((await request.get("/api/chat")).status()).toBe(405);
  });
});
