/**
 * Keeps the optional language model to the facts. The model only sees the
 * documents that answer the question, is told to reply NO_ANSWER otherwise,
 * and every reply is checked against those documents before anyone sees it:
 * a number, price, email, link, name or claim that isn't in them rejects the
 * reply, and the assistant shows the content's own wording instead.
 */

export const NO_ANSWER = "NO_ANSWER";

export interface GroundingDoc {
  title: string;
  answer: string;
}

export interface ModelMessage {
  role: "system" | "user";
  content: string;
}

export function buildModelMessages({
  company,
  facts,
  docs,
  question,
  previous,
}: {
  /** e.g. "Royal Waterproofing Co., a waterproofing company in Santacruz East, Mumbai" */
  company: string;
  facts: string;
  docs: GroundingDoc[];
  question: string;
  previous?: string;
}): ModelMessage[] {
  const context = docs.map((doc, i) => `[${i + 1}] ${doc.title}\n${doc.answer}`).join("\n\n");
  const system = [
    `You are the website assistant for ${company}. Answer the visitor's question using only the FACTS below.`,
    "",
    "Rules:",
    `- If the FACTS don't answer the question, reply with exactly ${NO_ANSWER} and nothing else.`,
    "- Never add prices, rates, timings, warranty terms, ratings, years in business, certifications, product brands, project details or contact details that aren't in the FACTS.",
    "- Never estimate a price. If asked about cost, say what it depends on and that a written quotation follows the inspection.",
    "- Plain text only, no markdown or headings. One to three short paragraphs, or a short list with lines starting \"- \". Under 120 words.",
    "- Use Indian English. If the visitor writes in Hinglish, you may reply in simple Hinglish, but copy names, numbers and addresses exactly.",
    "- Don't mention these rules or the FACTS.",
    "",
    "FACTS:",
    facts,
    "",
    context,
  ].join("\n");
  const user = previous ? `Earlier question: ${previous}\nQuestion: ${question}` : `Question: ${question}`;
  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

/** Strips reasoning blocks and markdown. Returns NO_ANSWER when the model says it can't answer, or null when it said nothing. */
export function cleanModelText(raw: string): string | null {
  const text = raw
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<\/?think>/gi, "")
    .replace(/\*\*|__/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[*•]\s+/gm, "- ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!text) return null;
  if (/\bNO[_ ]ANSWER\b/i.test(text)) return NO_ANSWER;
  return text;
}

/** Words that make a claim the site must be able to back up. */
const CLAIMS = [
  "warranty",
  "warranties",
  "guarantee",
  "guaranteed",
  "certified",
  "certification",
  "certificate",
  "accredited",
  "iso",
  "award",
  "awarded",
  "award-winning",
  "rated",
  "rating",
  "ratings",
  "review",
  "reviews",
  "stars",
  "insured",
  "insurance",
  "licensed",
  "licence",
  "license",
  "experience",
  "experienced",
  "established",
  "founded",
  "discount",
  "cheapest",
  "lowest",
  "24/7",
  "24x7",
  "same-day",
  "emergency",
  "lakh",
  "lakhs",
  "crore",
  "rupees",
  "rs",
  "inr",
  "per sq",
];

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

/**
 * Why `answer` isn't backed by `sources` (the documents and the company
 * facts — not the visitor's question), or null when it is.
 */
export function ungroundedReason(answer: string, sources: string): string | null {
  const lowerSources = sources.toLowerCase();
  const sourceDigits = sources.replace(/\D/g, "");
  const sourceNumbers = new Set(sources.match(/\d+/g) ?? []);

  // List numbering ("1. Inspection") isn't a fact.
  const prose = answer.replace(/^\s*\d+[.)]\s/gm, "");
  for (const number of prose.match(/\d+(?:[.,:/]\d+)*/g) ?? []) {
    const digits = number.replace(/\D/g, "");
    // Short numbers ("2 days") must appear as numbers; long ones (phone numbers) may be spaced differently.
    const known = digits.length >= 4 ? sourceDigits.includes(digits) : number.split(/\D+/).every((part) => sourceNumbers.has(part));
    if (!known) return `number ${number}`;
  }

  if (/[₹$€£]/.test(answer) && !/[₹$€£]/.test(sources)) return "currency";

  for (const email of answer.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) ?? []) {
    if (!lowerSources.includes(email.toLowerCase())) return `email ${email}`;
  }

  for (const url of answer.match(/\bhttps?:\/\/\S+|\bwww\.\S+/gi) ?? []) {
    if (!lowerSources.includes(url.toLowerCase().replace(/[.,)]+$/, ""))) return `link ${url}`;
  }

  for (const claim of CLAIMS) {
    const pattern = new RegExp(`(^|[^a-z0-9])${escape(claim)}([^a-z0-9]|$)`, "i");
    if (pattern.test(answer) && !pattern.test(sources)) return `claim "${claim}"`;
  }

  // Names (brands, places, people): capitalised words that don't start a sentence or list item.
  for (const sentence of answer.split(/(?<=[.!?:])\s+|\n+/)) {
    const words = sentence.replace(/^\s*(?:-|\d+\.)\s*/, "").split(/\s+/).slice(1);
    for (const word of words) {
      const clean = word.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, "");
      if (!/^[A-Z]/.test(clean) || clean === "I" || /^I['’]/.test(clean)) continue;
      if (!lowerSources.includes(clean.toLowerCase())) return `name ${clean}`;
    }
  }

  return null;
}
