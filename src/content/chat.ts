import { cta, differentiators, site } from "@/config/site";
import type { ChatWidgetConfig } from "@/lib/chat/types";
import type { ChatKnowledgeEntry } from "@/types/content";

/**
 * The website assistant ("Ask us a question", bottom right).
 *
 * It answers only from this site's content. Most of what it knows is read
 * automatically from the rest of src/content — services, FAQs, areas,
 * symptoms, sectors — by src/lib/chat/knowledge.ts, so a new service, area or
 * FAQ is picked up without touching this file. This file holds what it says,
 * the questions it suggests, the extra answers below, and the words people
 * use for things. Anything flagged `placeholder` is never used, even in
 * preview mode, because an answer can't carry a "Sample" badge.
 */

const { contact } = site;

const whatsappIsPhone = contact.whatsappNumber === contact.phone.href.replace(/\D/g, "");

/** "call or WhatsApp us on +91 97020 08187" */
const reachUs = whatsappIsPhone
  ? `call or WhatsApp us on ${contact.phone.display}`
  : `call us on ${contact.phone.display} or WhatsApp us on +${contact.whatsappNumber}`;

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** What the widget shows. Sent to the browser, so keep it short. */
export const chatWidget: ChatWidgetConfig = {
  name: site.shortName,
  tagline: "Answers from our website",
  launcherLabel: "Ask us a question",
  welcome:
    "Hi! I can answer questions about our waterproofing services, the areas we cover, inspections and how to reach us. What's happening at your place?",
  placeholder: "Type your question…",
  notice: "Automated answers from our website. Please don't share personal details here.",
  suggestions: [
    "My bathroom is leaking into the flat below",
    site.inspection.isFree ? "Is the inspection really free?" : "Do you charge for inspections?",
    "Which areas do you cover?",
    "How much does waterproofing cost?",
    "How can I contact you?",
  ],
};

/** Fixed replies. The fallback is used whenever the site's content doesn't answer the question. */
export const chatReplies = {
  fallback: `Sorry, I don't have that information. Our team can help — ${reachUs}.`,
  greeting: "Hello! Ask me about leaks, damp walls, our services, the areas we cover or booking an inspection.",
  thanks: "You're welcome! Anything else I can help with?",
  acknowledge: "Anything else I can help with?",
  goodbye: `Thanks for stopping by. If you need us, ${reachUs}.`,
  identity: `I'm an automated assistant: I answer from the information on this website. For anything else, ${reachUs}.`,
  human: `To talk to our team, ${reachUs}. Or send us a request and we'll call you back.`,
};

/**
 * Facts the optional language model may always use (see "Website assistant"
 * in the README). Keep to confirmed facts from src/config/site.ts.
 */
export const chatCompanyFacts = [
  `${site.name} is a waterproofing and leak-repair company based in ${contact.address.locality}, ${contact.address.city}.`,
  `It works across ${site.market.serviceRegion}.`,
  whatsappIsPhone
    ? `Phone and WhatsApp: ${contact.phone.display}.`
    : `Phone: ${contact.phone.display}. WhatsApp: +${contact.whatsappNumber}.`,
  `Email: ${contact.email}.`,
  `Office: ${contact.address.full}.`,
  site.inspection.isFree
    ? "Site inspections are free, with no obligation to go ahead."
    : "There's a small inspection charge, given when you book.",
  cta.quoteNote,
  ...(site.hours ? [`Office hours: ${site.hours.display}.`] : []),
  ...(site.responseTime ? [`${site.responseTime}.`] : []),
].join("\n");

/**
 * Answers on top of what the assistant reads from the rest of the content.
 * Add your own here: a question, the words people might use, and a confirmed
 * answer. Mark anything unconfirmed `placeholder: true` until it's real.
 */
export const chatKnowledge: ChatKnowledgeEntry[] = [
  {
    id: "contact",
    question: "How can I contact you?",
    keywords: ["contact", "reach", "phone", "call", "whatsapp", "email", "talk", "speak", "enquiry", "touch"],
    answer: `${capitalise(reachUs)}, or email ${contact.email}.\n\nYou can also send a request from our contact page. ${cta.callback}.`,
    links: [{ label: "Contact page", href: "/contact" }],
    actions: ["call", "whatsapp", "inspection"],
  },
  {
    id: "phone",
    question: "What's your phone number?",
    keywords: ["phone", "number", "mobile", "call", "whatsapp"],
    answer: whatsappIsPhone
      ? `Our number is ${contact.phone.display}. You can call or WhatsApp us on it.`
      : `Call us on ${contact.phone.display}, or WhatsApp us on +${contact.whatsappNumber}.`,
    actions: ["call", "whatsapp"],
  },
  {
    id: "email",
    question: "What's your email address?",
    keywords: ["email", "mail", "write"],
    answer: `Email us at ${contact.email}. You can also ${reachUs}.`,
    links: [{ label: "Contact page", href: "/contact" }],
    actions: ["call", "whatsapp"],
  },
  {
    id: "office",
    question: "Where is your office?",
    keywords: ["office", "address", "located", "location", "where", "visit", "directions", "map", contact.address.locality],
    answer: `Our office is at ${contact.address.full}.\n\nCall or WhatsApp before visiting so someone is there to meet you.`,
    links: [
      { label: "Open in Google Maps", href: contact.mapsUrl },
      { label: "Contact page", href: "/contact" },
    ],
    actions: ["call", "whatsapp"],
  },
  {
    id: "hours",
    question: "What are your office hours?",
    keywords: ["hours", "timings", "open", "opening", "sunday", "saturday", "today", "holiday"],
    answer: site.hours
      ? `We're open ${site.hours.display}.`
      : `I don't have our office hours to hand. Please ${reachUs} to check.`,
    actions: ["call", "whatsapp"],
  },
  {
    id: "photos",
    question: "Can I send photos of the problem?",
    keywords: ["photo", "picture", "video", "send", "share", "upload", "image"],
    answer: whatsappIsPhone
      ? `Yes. Send photos or a short video of the problem on WhatsApp to ${contact.phone.display}. It helps us prepare for the inspection.`
      : `Yes. Send photos or a short video of the problem on WhatsApp to +${contact.whatsappNumber}. It helps us prepare for the inspection.`,
    actions: ["whatsapp"],
  },
  {
    id: "quote",
    question: "How do I get a quotation?",
    keywords: ["quote", "quotation", "estimate", "proposal"],
    answer: `${cta.quoteNote} ${
      site.inspection.isFree
        ? "The inspection is free, with no obligation to go ahead."
        : "There's a small inspection charge, which we tell you when you book."
    }\n\nTo book one, ${reachUs}, or send the form on our contact page.`,
    links: [{ label: "Contact page", href: "/contact" }],
    actions: ["inspection", "call", "whatsapp"],
  },
  {
    id: "about",
    question: `What does ${site.name} do?`,
    keywords: ["company", "business", "firm", "who", "background", site.shortName],
    answer: `We're a waterproofing and leak-repair company based in ${contact.address.locality}, ${contact.address.city}. We waterproof terraces, bathrooms, external walls, basements and water tanks for flats, housing societies and businesses across ${site.market.serviceRegion}.\n\n${differentiators[0].description}`,
    links: [
      { label: "About us", href: "/about" },
      { label: "Our services", href: "/services" },
    ],
    actions: ["inspection"],
  },
];

/**
 * Other ways people ask questions the site already answers, by knowledge id:
 * "faq:<faq id>", "service:<slug>", "area:<slug>", "problem:<slug>",
 * "entry:<id>" for the answers above, or "areas", "services", "process",
 * "why-us", "sectors", "clients". Add phrasings here when the assistant picks
 * the wrong answer for a common question.
 */
export const chatAlsoAsked: Record<string, string[]> = {
  "faq:duration-typical": ["How long does it take?", "How many days does the work take?"],
  "faq:cost-how-much": ["What are your rates?", "What is the rate per sq ft?"],
  "faq:booking-how-soon": ["When can you visit?", "How soon can someone come?"],
  "faq:booking-urgent": ["Can you come today?", "It's leaking right now"],
  "entry:hours": ["Are you open today?", "What time do you open?"],
  areas: ["Where do you work?", "Do you come to my area?"],
  services: ["Waterproofing", "Waterproofing services", "What do you do?"],
};

/**
 * Words people use for the same thing — including Hinglish — so "toilet"
 * finds bathroom answers and "kharcha" finds cost answers. Single words only;
 * the first word of each entry is the one used in the content.
 */
export const chatSynonyms: Record<string, string[]> = {
  bathroom: ["toilet", "washroom", "restroom", "wc", "loo", "shower", "bath", "sauchalay"],
  terrace: ["roof", "rooftop", "chhat", "chhath", "chhatt"],
  leak: ["leakage", "leakages", "leaking", "leaky", "seepage", "seeping", "seep", "drip", "dripping", "tapak", "tapakna", "tapakta", "tapka"],
  damp: ["dampness", "moisture", "moist", "seelan", "silan", "seelapan", "sil"],
  mould: ["mold", "mildew", "fungus", "fungal", "algae"],
  crack: ["fissure", "darar", "daraar"],
  cost: ["price", "pricing", "rate", "charge", "fee", "budget", "expensive", "cheap", "afford", "kharcha", "kharch", "kimat", "keemat", "paisa", "paise"],
  quote: ["quotation"],
  inspection: ["inspect", "survey", "checkup", "assessment"],
  water: ["paani", "pani"],
  wall: ["deewar", "diwar", "deewaar"],
  tank: ["tanki", "sump"],
  society: ["chs", "societies"],
  urgent: ["emergency", "immediately", "asap", "jaldi"],
  photo: ["picture", "pic", "image", "video"],
  warranty: ["guarantee", "guaranty", "warrantee"],
  book: ["booking", "schedule", "appointment"],
  where: ["wheres"],
  email: ["mail", "gmail"],
};

/** Phrases rewritten before searching (lower case). */
export const chatPhrases: [RegExp, string][] = [
  [/\bwater[\s-]+proof/g, "waterproof"],
  [/\bhow much\b(?!\s+(time|days?|long))/g, "cost"],
  [/\bkitn[ae]\b(?!\s+(time|din|days?))/g, "cost"],
  [/\b(price list|rate card|rate list)\b/g, "cost"],
  [/\b(per )?(sq\.? ?ft|sqft|square (feet|foot|metres?|meters?)|sq\.? ?m)\b/g, "cost"],
  [/\b(phone|contact|mobile|whatsapp) (number|no)\b/g, "phone"],
  [/\btimings?\b/g, "hours"],
  [/\bget in touch\b/g, "contact"],
  [/\bsite visit\b/g, "inspection"],
  [/\bright now\b/g, "urgent"],
];
