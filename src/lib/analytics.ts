/**
 * Analytics adapter. Does nothing until an analytics tool is added; events
 * are pushed to `window.dataLayer` if one exists (e.g. Google Tag Manager)
 * and dispatched as a DOM event for anything else that wants to listen.
 *
 * Never put personal data (names, phone numbers, emails) in event props.
 */

export type AnalyticsEvent =
  | "cta_click"
  | "call_click"
  | "whatsapp_click"
  | "form_start"
  | "form_submit_success"
  | "form_submit_error"
  /** The website assistant was opened. */
  | "chat_open"
  /** A question was answered; props say how it was asked and whether it was answered. Never the question itself. */
  | "chat_question";

type Props = Record<string, string | number | boolean | undefined>;

export function track(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: unknown[] };
  w.dataLayer?.push({ event, ...props });
  window.dispatchEvent(new CustomEvent("rwc:track", { detail: { event, ...props } }));
}

/**
 * Data attributes for server-rendered links. `AnalyticsListener` handles the
 * click, so links don't need to be client components.
 */
export function trackAttrs(event: AnalyticsEvent, location: string) {
  return { "data-track": event, "data-track-location": location };
}

const ATTRIBUTION_KEY = "rwc:attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export type Attribution = Partial<Record<(typeof UTM_KEYS)[number] | "landing_page" | "referrer", string>>;

/** Store first-touch attribution for this visit (sessionStorage). */
export function captureAttribution() {
  try {
    if (sessionStorage.getItem(ATTRIBUTION_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const data: Attribution = { landing_page: window.location.pathname };
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) data[key] = value.slice(0, 120);
    }
    if (document.referrer && !document.referrer.startsWith(window.location.origin)) {
      data.referrer = document.referrer.slice(0, 200);
    }
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(data));
  } catch {
    // Storage blocked (private mode, strict settings) — attribution is optional.
  }
}

export function readAttribution(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) ?? "{}") as Attribution;
  } catch {
    return {};
  }
}
