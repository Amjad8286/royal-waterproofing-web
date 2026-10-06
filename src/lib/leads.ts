import "server-only";
import { isIP } from "node:net";
import { features } from "@/config/site";
import { areaName, serviceName } from "@/lib/content";
import { createRateLimit } from "@/lib/rate-limit";
import { NOT_SURE, OTHER_AREA, type Lead, type LeadResult } from "@/lib/validation";

/**
 * The ONLY integration seam for enquiries, and the only file that calls the
 * lead API: the ERP's Django `leads` app, which saves the enquiry and sends the
 * email and WhatsApp notifications (docs/API_NOTIFICATION_ARCHITECTURE.md).
 *
 * Configured by server-only env vars: LEADS_API_URL, LEADS_API_KEY and
 * LEADS_API_TIMEOUT_MS. With LEADS_API_URL unset, delivery is simulated, so
 * local development and the e2e suite don't need Django — but nothing is
 * delivered anywhere.
 *
 * Testing hooks:
 *   LEAD_SUBMIT_MODE=error   → every submission fails (try the error UI)
 *   LEAD_TEST_HOOKS=true     → a submission named "Test Error" fails, and the per-visitor
 *                              limit is off (the e2e tests all submit from one address)
 */

const MIN_HUMAN_MS = 1500;
const DEFAULT_TIMEOUT_MS = 8000;

/** Per visitor, ahead of the API's own limit (10 an hour by default). Real visitors send one or two. */
export const MAX_LEADS_PER_WINDOW = 5;
const allowLeadRequest = createRateLimit({ max: MAX_LEADS_PER_WINDOW, windowMs: 10 * 60_000 });

const SERVER_ERROR: LeadResult = { ok: false, error: "server", message: "We couldn't send your request just now." };
const RATE_LIMITED: LeadResult = {
  ok: false,
  error: "rate-limited",
  message: "You've sent a few requests already. Please call or WhatsApp us instead.",
};

/** Fields a visitor can correct. The API's errors on anything else are a bug on our side, not theirs. */
const VISITOR_FIELDS = new Set([
  "name",
  "phone",
  "service",
  "area",
  "areaOther",
  "email",
  "propertyType",
  "message",
  "preferredDate",
  "timeWindow",
  "contactMethod",
]);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function reference() {
  return `RW-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

/**
 * The visitor's IP address, for the per-visitor limits here and in the API.
 * The first X-Forwarded-For entry is only trustworthy when the host sets the
 * header itself: Vercel does; behind nginx, overwrite it with `$remote_addr`.
 */
export function clientIpFrom(headers: Headers): string | null {
  for (const candidate of [headers.get("x-forwarded-for")?.split(",")[0], headers.get("x-real-ip")]) {
    const ip = candidate?.trim();
    if (ip && isIP(ip)) return ip;
  }
  return null;
}

export async function submitLead(lead: Lead, { clientIp }: { clientIp: string | null }): Promise<LeadResult> {
  // Likely bot: honeypot filled or submitted impossibly fast. Pretend success
  // so bots get no signal, but drop the lead.
  if (lead.website || (lead.elapsedMs !== undefined && lead.elapsedMs < MIN_HUMAN_MS)) {
    return { ok: true, reference: reference() };
  }

  const testHooks = process.env.LEAD_TEST_HOOKS === "true";
  if (!testHooks && !allowLeadRequest(clientIp ?? "unknown")) return RATE_LIMITED;

  const forceError = process.env.LEAD_SUBMIT_MODE === "error" || (testHooks && lead.name === "Test Error");
  const api = apiConfig();
  if (!api) {
    warnNotDelivered();
    await delay(700);
    return forceError ? SERVER_ERROR : { ok: true, reference: reference() };
  }
  if (forceError) return SERVER_ERROR;
  return deliver(api, lead, clientIp);
}

/* ------------------------------------------------------------------ */
/* Lead API                                                            */
/* ------------------------------------------------------------------ */

interface ApiConfig {
  url: string;
  key: string;
  timeoutMs: number;
}

function apiConfig(): ApiConfig | null {
  const base = process.env.LEADS_API_URL?.trim().replace(/\/+$/, "");
  if (!base) return null;
  const timeoutMs = Number(process.env.LEADS_API_TIMEOUT_MS);
  return {
    url: `${base}/leads/inspection-request/`,
    key: process.env.LEADS_API_KEY?.trim() ?? "",
    timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : DEFAULT_TIMEOUT_MS,
  };
}

let warned = false;
function warnNotDelivered() {
  if (warned || process.env.NODE_ENV !== "production") return;
  warned = true;
  console.warn("[leads] LEADS_API_URL is not set: enquiries from the form are not delivered anywhere.");
}

/**
 * What the API stores, and nothing else: the bot-check fields never leave the
 * site. Service and area names are looked up here from the site's content
 * rather than taken from the browser.
 */
function apiBody(lead: Lead) {
  return {
    name: lead.name,
    phone: lead.phone,
    service: lead.service,
    serviceName: lead.service === NOT_SURE ? "Not sure — needs diagnosis" : serviceName(lead.service),
    area: lead.area,
    areaName: lead.area === OTHER_AREA ? "Other" : areaName(lead.area),
    areaOther: lead.area === OTHER_AREA ? lead.areaOther : undefined,
    propertyType: lead.propertyType,
    email: lead.email,
    message: lead.message,
    preferredDate: lead.preferredDate,
    timeWindow: lead.timeWindow,
    contactMethod: lead.contactMethod,
    // Not asked on the form: every customer gets the WhatsApp confirmation while the feature is on.
    whatsappOptIn: features.customerWhatsApp,
    sourcePage: lead.sourcePage,
    formLocation: lead.formLocation,
    attribution: lead.attribution,
    photoCount: lead.photoCount ?? 0,
  };
}

async function deliver(api: ApiConfig, lead: Lead, clientIp: string | null): Promise<LeadResult> {
  if (!api.key) {
    console.error("[leads] LEADS_API_URL is set but LEADS_API_KEY is empty, so the API would refuse every enquiry.");
    return SERVER_ERROR;
  }
  // The API refuses an enquiry without one, rather than putting every visitor in one rate-limit bucket.
  if (!clientIp) {
    console.error("[leads] No visitor IP in X-Forwarded-For or X-Real-IP: check the proxy in front of the site.");
    return SERVER_ERROR;
  }

  let response: Response;
  try {
    response = await fetch(api.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Site-Key": api.key,
        // The form sends the same ID on every retry, so the API answers a retry
        // with the first result instead of saving a second enquiry.
        "Idempotency-Key": lead.submissionId ?? crypto.randomUUID(),
        "X-Client-IP": clientIp,
      },
      body: JSON.stringify(apiBody(lead)),
      signal: AbortSignal.timeout(api.timeoutMs),
      cache: "no-store",
      // Following a redirect would turn the POST into a GET (e.g. http:// → https:// in LEADS_API_URL).
      redirect: "error",
    });
  } catch (error) {
    console.error("[leads] Lead API unreachable:", describe(error));
    return SERVER_ERROR;
  }

  // 201 for a new enquiry; 200 when it's a retry of one already saved, with the same reference.
  if (response.ok) {
    const data = await readJson(response);
    const ref = typeof data?.reference === "string" ? data.reference : "";
    // The enquiry is saved either way, so the visitor still gets the thank-you page.
    if (!ref) console.error("[leads] Lead API saved the enquiry but sent no reference.");
    return { ok: true, reference: ref };
  }

  if (response.status === 400) {
    const errors = fieldErrorsFrom(await readJson(response));
    const visitorErrors = Object.fromEntries(Object.entries(errors).filter(([key]) => VISITOR_FIELDS.has(key)));
    const otherErrors = Object.fromEntries(Object.entries(errors).filter(([key]) => !VISITOR_FIELDS.has(key)));
    if (Object.keys(otherErrors).length > 0) console.error("[leads] Lead API rejected the request:", JSON.stringify(otherErrors));
    if (Object.keys(visitorErrors).length > 0) {
      return { ok: false, error: "validation", message: "Please check the highlighted fields.", fieldErrors: visitorErrors };
    }
    return SERVER_ERROR;
  }

  if (response.status === 429) return RATE_LIMITED;

  // For a 401, Django's detail says which: a wrong key, or lead capture not set up on its side.
  const data = await readJson(response);
  console.error(`[leads] Lead API answered ${response.status}:`, typeof data?.detail === "string" ? data.detail : "");
  return SERVER_ERROR;
}

async function readJson(response: Response): Promise<Record<string, unknown> | null> {
  try {
    const data: unknown = await response.json();
    return data && typeof data === "object" && !Array.isArray(data) ? (data as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** `{"errors": {field: ["message", …]}}` → the form's field errors. */
function fieldErrorsFrom(data: Record<string, unknown> | null): Record<string, string[]> {
  const errors = data?.errors;
  if (!errors || typeof errors !== "object") return {};
  const out: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(errors)) {
    const messages = (Array.isArray(value) ? value : [value]).filter((m): m is string => typeof m === "string");
    if (messages.length > 0) out[key] = messages;
  }
  return out;
}

function describe(error: unknown) {
  if (!(error instanceof Error)) return String(error);
  const cause = error.cause instanceof Error ? ` (${error.cause.message})` : "";
  return `${error.name}: ${error.message}${cause}`;
}
