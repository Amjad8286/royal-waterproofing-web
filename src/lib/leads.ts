import "server-only";
import type { Lead, LeadResult } from "@/lib/validation";

/**
 * The ONLY integration seam for enquiries.
 *
 * Today it simulates delivery. To go live, replace the marked block with one
 * (or more) of:
 *   - an email to the office (Resend, Postmark, Amazon SES, SMTP)
 *   - a CRM record (HubSpot, Zoho, Pipedrive, Google Sheets via API)
 *   - a WhatsApp Business API notification to the sales phone
 * Keep API keys in server-only environment variables (no NEXT_PUBLIC_ prefix).
 *
 * Testing hooks:
 *   LEAD_SUBMIT_MODE=error   → every submission fails (try the error UI)
 *   LEAD_TEST_HOOKS=true     → a submission named "Test Error" fails (used by e2e tests)
 */

const MIN_HUMAN_MS = 1500;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function reference() {
  return `RW-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export async function submitLead(lead: Lead): Promise<LeadResult> {
  // Likely bot: honeypot filled or submitted impossibly fast. Pretend success
  // so bots get no signal, but drop the lead.
  if (lead.website || (lead.elapsedMs !== undefined && lead.elapsedMs < MIN_HUMAN_MS)) {
    return { ok: true, reference: reference() };
  }

  await delay(700);

  const forceError =
    process.env.LEAD_SUBMIT_MODE === "error" || (process.env.LEAD_TEST_HOOKS === "true" && lead.name === "Test Error");
  if (forceError) {
    return { ok: false, error: "server", message: "We couldn't send your request just now." };
  }

  // ── Integration point ────────────────────────────────────────────────
  // await sendLeadEmail(lead);  /  await createCrmContact(lead);
  // ────────────────────────────────────────────────────────────────────

  return { ok: true, reference: reference() };
}
