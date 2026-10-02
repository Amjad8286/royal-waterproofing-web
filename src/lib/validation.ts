// zod/mini: same Zod 4 engine, tree-shakable API — keeps the form's client bundle small.
import * as z from "zod/mini";

/** Shared by the client form (React Hook Form) and the server action. */

export const propertyTypeOptions = [
  { value: "apartment", label: "Flat" },
  { value: "society", label: "Housing society" },
  { value: "house", label: "Bungalow / row house" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
  { value: "new-build", label: "Under construction" },
] as const;

export const timeWindowOptions = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
] as const;

export const contactMethodOptions = [
  { value: "call", label: "Phone call" },
  { value: "whatsapp", label: "WhatsApp" },
] as const;

export const NOT_SURE = "not-sure";
export const OTHER_AREA = "other";

const allowed = (values: readonly { value: string }[]) => {
  const set = new Set(values.map((v) => v.value));
  return (value: string | undefined) => !value || set.has(value);
};

/**
 * Indian numbers: 10 digits starting 2–9 (a mobile, or a landline with its STD
 * code), optionally written with +91, 91 or a leading 0. A number that starts
 * with another country code (+971…) is accepted at 8–15 digits.
 */
export function isValidPhone(value: string): boolean {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+") && !trimmed.startsWith("+91")) return digits.length >= 8 && digits.length <= 15;
  let national = digits;
  if (national.length === 12 && national.startsWith("91")) national = national.slice(2);
  else if (national.length === 11 && national.startsWith("0")) national = national.slice(1);
  return /^[2-9]\d{9}$/.test(national);
}

/** YYYY-MM-DD for "yesterday" — tolerant of time zones between browser and server. */
function earliestAllowedDate() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export const leadSchema = z
  .object({
    name: z
      .string()
      .check(z.trim(), z.minLength(2, "Please enter your name."), z.maxLength(80, "Please keep your name under 80 characters.")),
    phone: z
      .string()
      .check(
        z.trim(),
        z.minLength(1, "Please enter a phone number so we can call you back."),
        z.refine((v) => /^\+?[\d\s\-().]+$/.test(v), "Use digits only — spaces, dashes and a leading + are fine."),
        z.refine(
          (v) => !/^\+?[\d\s\-().]+$/.test(v) || isValidPhone(v),
          "Enter a 10-digit mobile number, or add your country code if you're outside India.",
        ),
      ),
    service: z.string().check(z.minLength(1, "Choose the service you need, or “Not sure”.")),
    area: z.string().check(z.minLength(1, "Choose your area, or “Other”.")),
    areaOther: z.optional(z.string().check(z.trim(), z.maxLength(80))),
    propertyType: z.optional(z.string().check(z.refine(allowed(propertyTypeOptions), "Choose a property type."))),
    email: z.optional(z.union([z.literal(""), z.email("Please enter a valid email address, or leave it blank.")])),
    message: z.optional(z.string().check(z.trim(), z.maxLength(1500, "Please keep this under 1,500 characters."))),
    preferredDate: z.optional(
      z.string().check(z.refine((v) => !v || v >= earliestAllowedDate(), "Please choose today or a later date.")),
    ),
    timeWindow: z.optional(z.string().check(z.refine(allowed(timeWindowOptions)))),
    contactMethod: z.optional(z.string().check(z.refine(allowed(contactMethodOptions)))),
    // Context and attribution (hidden fields)
    sourcePage: z.optional(z.string().check(z.maxLength(200))),
    attribution: z.optional(z.record(z.string(), z.string().check(z.maxLength(200)))),
    photoCount: z.optional(z.int().check(z.minimum(0), z.maximum(5))),
    // Spam protection: honeypot must stay empty; time-to-submit in ms
    website: z.optional(z.string().check(z.maxLength(0))),
    elapsedMs: z.optional(z.int().check(z.minimum(0))),
  })
  .check(
    z.superRefine((data, ctx) => {
      if (data.area === OTHER_AREA && !data.areaOther) {
        ctx.addIssue({ code: "custom", path: ["areaOther"], message: "Tell us which area you're in.", input: data.areaOther });
      }
    }),
  );

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

export type LeadResult =
  | { ok: true; reference: string }
  | { ok: false; error: "validation" | "server"; message: string; fieldErrors?: Record<string, string[] | undefined> };

/** Client-side photo rules (photos aren't uploaded in the prototype). */
export const photoRules = {
  maxFiles: 5,
  maxBytes: 10 * 1024 * 1024,
  accept: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
};
