import type { Certification, IconName, ProcessStep, Stat, TitledText } from "@/types/content";

/**
 * Single source of truth for business facts.
 *
 * Confirmed facts (name, phone, email, office address, Mumbai, free
 * inspection) are used as-is. Anything not yet confirmed is either left out
 * (`null`) or flagged `placeholder: true`, which hides it on the live site.
 * `pendingFacts` lists what is still missing.
 */

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const flags = {
  /**
   * Preview mode for reviewing layouts: shows the invented sample content
   * (projects, reviews, gallery, team, stats, credentials, warranty terms)
   * with "Sample" badges. Off by default, so the live site only shows real,
   * confirmed content.
   */
  previewSamples: process.env.NEXT_PUBLIC_PREVIEW_SAMPLES === "true",
  /** Search engines may index the site only when explicitly enabled. */
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
};

export const features = {
  /**
   * Photo uploads on the enquiry form. Off until the form backend stores files
   * (src/lib/leads.ts) — until then the form points people to WhatsApp, which
   * does reach you, instead of collecting photos that would be lost.
   */
  photoUploads: false,
  /**
   * The website assistant ("Ask us a question", bottom right). It answers
   * from the site's own content only (src/content/chat.ts), costs nothing to
   * run and needs no outside service. Set false to remove it everywhere.
   */
  chatAssistant: true,
};

const address = {
  /** Shown everywhere exactly as written. Keep it identical to the Google Business Profile. */
  full: "S-9, Adarsh Apartment, 7th Rd, Sen Nagar, Santacruz East, Mumbai, Maharashtra 400055",
  street: "S-9, Adarsh Apartment, 7th Rd, Sen Nagar",
  locality: "Santacruz East",
  city: "Mumbai",
  region: "Maharashtra",
  postalCode: "400055",
  /** ISO 3166-1 code, used in structured data. */
  country: "IN",
};

interface Hours {
  display: string;
  short: string;
  spec: { days: string[]; opens: string; closes: string }[];
}

export const site = {
  name: "Royal Waterproofing Co.",
  shortName: "Royal Waterproofing",
  legalName: "Royal Waterproofing Co.",
  tagline: "Diagnosed first. Fixed properly.",
  description:
    "Waterproofing and leakage repair in Mumbai for terraces, bathrooms, external walls, basements and water tanks — for flats, housing societies and businesses. Free site inspection.",
  url: siteUrl,
  /** Open Graph locale and the <html lang> value. */
  locale: "en_IN",
  language: "en-IN",

  market: {
    country: "India",
    primaryCity: "Mumbai",
    /** The wider area covered, for copy such as "across Mumbai, Thane and Navi Mumbai". */
    serviceRegion: "Mumbai, Thane and Navi Mumbai",
    areaUnit: "sq ft",
    rainySeason: "the monsoon",
  },

  contact: {
    phone: { display: "+91 97020 08187", href: "tel:+919702008187" },
    /** International format, digits only — used for wa.me links. */
    whatsappNumber: "919702008187",
    email: "info@royalwaterproofingco.com",
    address,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.full)}`,
    /** Text passed to the Google Maps embed on the contact page. */
    mapEmbedQuery: address.full as string | null,
    /** Map pin coordinates for structured data. Add them from Google Maps when convenient. */
    geo: null as { lat: number; lng: number } | null,
  },

  /** Business hours. Hidden everywhere until confirmed. */
  hours: null as Hours | null,

  urgentLeak: {
    enabled: true,
    label: "Leaking right now? Call us",
  },

  inspection: {
    /** Drives every CTA label. Set false if inspections are charged. */
    isFree: true,
  },

  /** Call-back promise, e.g. "We call back within 2 working hours". Hidden until confirmed. */
  responseTime: null as string | null,

  foundedYear: null as number | null,

  rating: {
    average: 4.9,
    count: 127,
    source: "Google",
    placeholder: true,
  },

  warranty: {
    headline: "Written warranty on every job",
    upTo: { value: "Up to 10-year written warranty", placeholder: true },
    placeholder: true,
  },

  social: [] as { label: string; href: string }[],

  googleProfileUrl: null as string | null,
  googleReviewUrl: null as string | null,

  /** Phone numbers are validated as Indian numbers unless they start with another country code. */
  phoneHint: "10-digit mobile or landline. Outside India? Start with your country code, e.g. +971.",
} as const;

const googleSearch = `https://www.google.com/search?q=${encodeURIComponent(`${site.name} ${address.locality} ${address.city}`)}`;

export const links = {
  googleProfile: site.googleProfileUrl ?? googleSearch,
  googleReview: site.googleReviewUrl ?? googleSearch,
};

export const cta = {
  primary: site.inspection.isFree ? "Get Free Inspection" : "Book an Inspection",
  primaryShort: site.inspection.isFree ? "Free Inspection" : "Book Inspection",
  quote: "Request a Quote",
  contactHeading: site.inspection.isFree ? "Get a free inspection" : "Book an inspection",
  call: "Call Now",
  whatsapp: "WhatsApp Us",
  quoteNote: "We inspect first, then give you a written quotation.",
  noObligation: "No obligation.",
  /** What happens after someone gets in touch. Uses the response-time promise once it's confirmed. */
  callback: site.responseTime ?? "We call you back to understand the problem and fix a visit time",
};

/** " in Mumbai" — appended to headings and titles. */
export const inCity = ` in ${site.market.primaryCity}`;

/**
 * Honest trust signals shown beside CTAs. Only confirmed facts and the way the
 * company works belong here — never ratings, warranties or numbers until real.
 */
export const trustPoints: { icon: IconName; text: string }[] = [
  ...(site.inspection.isFree ? [{ icon: "clipboard-check" as const, text: "Free site inspection" }] : []),
  { icon: "file-text", text: "Written, itemised quotation" },
  { icon: "map-pin", text: `Based in ${address.locality}, ${address.city}` },
  { icon: "building", text: "Flats, societies & businesses" },
];

export const stats: Stat[] = [
  { id: "projects", value: 750, suffix: "+", label: "Projects completed", placeholder: true },
  { id: "years", value: 12, suffix: "+", label: "Years in waterproofing", placeholder: true },
  {
    id: "area",
    value: 1.5,
    suffix: "M+",
    label: `${site.market.areaUnit} waterproofed`,
    placeholder: true,
  },
  { id: "warranty", value: 10, suffix: " yrs", label: "Longest written warranty", placeholder: true },
];

/** How the company works. Confirm each one is accurate before launch. */
export const differentiators: (TitledText & { icon: IconName })[] = [
  {
    icon: "target",
    title: "Diagnosis before quoting",
    description:
      "We find where the water is actually getting in before we price anything, so you pay to fix the cause, not the stain.",
  },
  {
    icon: "receipt",
    title: "Written, itemised quotations",
    description:
      "Scope, system, quantities and schedule in writing. No vague lump sums and no surprise extras halfway through.",
  },
  {
    icon: "gauge",
    title: "The right system for the surface",
    description:
      "PU, acrylic, cementitious, crystalline or membrane — chosen for your surface, exposure and use, not out of habit.",
  },
  {
    icon: "clipboard-check",
    title: "Tested before handover",
    description:
      "Where the area allows it, the finished work is flood- or water-tested so you see it holding before we leave.",
  },
  {
    icon: "sparkle-clean",
    title: "Clean, supervised work",
    description:
      "Floors and furniture protected, debris cleared every day, and one supervisor accountable for your job.",
  },
  {
    icon: "map-pin",
    title: "Local to Mumbai",
    description:
      "Based in Santacruz East. We know Mumbai's buildings — old society blocks, sea-facing towers — and what four months of monsoon does to them.",
  },
];

/** Shared five-step process. Timings are placeholders (hidden) until confirmed. */
export const processSteps: ProcessStep[] = [
  {
    title: "Tell us what's happening",
    description: "Call, WhatsApp or send the form. Photos or a short video of the leak help us prepare.",
    timing: { value: "Call back within 2 working hours", placeholder: true },
  },
  {
    title: site.inspection.isFree ? "Free inspection & diagnosis" : "Inspection & diagnosis",
    description:
      "We visit and trace the water path with moisture readings and visual checks, plus flood or pressure tests where needed.",
    timing: { value: "Usually within 1–3 days", placeholder: true },
  },
  {
    title: "Written quotation",
    description: "You get the cause, the recommended system, an itemised price and the schedule, in writing.",
    timing: { value: "Within 48 hours of inspection", placeholder: true },
  },
  {
    title: "Treatment",
    description:
      "Surface preparation, repairs and the waterproofing system applied in the specified coats, with checks at each stage.",
    timing: { value: "Most homes: 1–5 working days", placeholder: true },
  },
  {
    title: "Water test & handover",
    description:
      "Where the area allows it, the finished work is water-tested. Then we clean up and hand over with simple care instructions.",
  },
];

/** Credentials render only from this list; unconfirmed entries stay hidden. */
export const certifications: Certification[] = [
  {
    id: "trained",
    kind: "certification",
    title: "Manufacturer-trained applicators",
    detail: "Crews trained on the waterproofing systems we install.",
    placeholder: true,
  },
  {
    id: "registered",
    kind: "licence",
    title: "Registered business",
    detail: "Registration details available on request.",
    placeholder: true,
  },
  {
    id: "insured",
    kind: "insurance",
    title: "Insured work",
    detail: "Public liability cover for work on your property.",
    placeholder: true,
  },
  {
    id: "safety",
    kind: "membership",
    title: "Safety-trained crews",
    detail: "Working-at-height and site-safety procedures on every job.",
    placeholder: true,
  },
];

/**
 * Facts still to confirm. `npm run check:content` prints these; remove an
 * entry once the real value is in place. `blocksLaunch` marks facts that affect
 * what visitors see today — everything else is hidden until it's provided.
 */
export const pendingFacts: { field: string; note: string; blocksLaunch: boolean }[] = [
  { field: "contact.whatsappNumber", note: "Confirm WhatsApp is on +91 97020 08187", blocksLaunch: true },
  { field: "areas", note: "Confirm the areas you serve (src/content/areas.ts lists ten across Mumbai, Thane and Navi Mumbai)", blocksLaunch: true },
  { field: "differentiators / processSteps", note: "Confirm every 'how we work' statement is accurate", blocksLaunch: true },
  { field: "urgentLeak", note: "Confirm you take urgent leak calls (\"Leaking right now? Call us\" in the header)", blocksLaunch: true },
  { field: "legalName", note: "Registered business name, used in the footer and legal pages (and GSTIN, if you want it shown)", blocksLaunch: true },
  { field: "NEXT_PUBLIC_SITE_URL", note: "Production domain (royalwaterproofingco.com, matching the email domain?)", blocksLaunch: true },
  {
    field: "clients",
    note: "Confirm the client list on the home page (src/content/clients.ts): permission to show each name and logo (37 logos: 16 official files from Commons or the companies' websites, 21 supplied by the owner); that the supplied files match the listed names — Alpine Vistara (logo reads Alpinepeak Developers), IBC Developers (India Builders Corp.), Poonam Highrise (Poonam Group), Runwal (Runwal Realty); that \"Tropicana\" is the Tropicana juice brand (the supplied logo is its wordmark); whether \"Tropicana\" / \"Delhi Tropicana\" and \"IBC Knowledge Park\" / \"IBC Developers\" are different clients; and the spelling \"Shree Gopal Housing Plantations\" (supplied as \"Ghree\")",
    blocksLaunch: true,
  },
  { field: "logo", note: "Original vector logo files, if you have them (public/images/brand/ holds a trace of the supplied PNG)", blocksLaunch: false },
  { field: "contact.geo", note: "Office map-pin coordinates (optional; improves the business structured data)", blocksLaunch: false },
  { field: "hours", note: "Business hours — hidden until provided", blocksLaunch: false },
  { field: "responseTime", note: "Call-back promise, e.g. \"within 2 working hours\" — hidden until provided", blocksLaunch: false },
  { field: "foundedYear", note: "Year founded / years in business — hidden until provided", blocksLaunch: false },
  { field: "stats", note: "Projects completed, area treated, years — hidden until real", blocksLaunch: false },
  { field: "rating", note: "Google rating and review count — hidden until real and verifiable", blocksLaunch: false },
  { field: "warranty", note: "Warranty terms per service — hidden until provided", blocksLaunch: false },
  { field: "certifications", note: "Registrations, insurance, training — hidden until provided", blocksLaunch: false },
  { field: "materialBrands", note: "Material brands used (names/logos only if confirmed and permitted)", blocksLaunch: false },
  { field: "googleProfileUrl", note: "Google Business Profile and review links", blocksLaunch: false },
  { field: "social", note: "Social profile links (Instagram, Facebook, YouTube)", blocksLaunch: false },
];
