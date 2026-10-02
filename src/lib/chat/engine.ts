import "server-only";
import { chatReplies, chatWidget } from "@/content/chat";
import type { ChatAction } from "@/types/content";
import { getKnowledge, type KnowledgeDoc } from "./knowledge";
import { askModel, modelConfig } from "./model";
import type { SearchHit } from "./search";
import type { ChatLink, ChatReply, ChatRequest } from "./types";

/**
 * Answers one question. In order:
 *  1. greetings, thanks and "are you a bot?" get a fixed reply;
 *  2. the question is matched against the site's content (src/lib/chat/knowledge.ts);
 *  3. if a self-hosted model is configured, it words the answer from the
 *     matching content only, and its reply is fact-checked (src/lib/chat/grounding.ts);
 *  4. otherwise the best match is shown word for word — or, when nothing
 *     matches well enough, an honest "I don't have that information" with the
 *     phone number.
 */

/**
 * How much of the question an answer must cover to be shown (see
 * SearchHit.coverage). Above one half, so a single word found only in body
 * text ("reviews" in "we review the drawings") is never enough.
 */
const ANSWER_COVERAGE = 0.6;
/** Matches worth giving the model, which may still reply that it doesn't know. */
const MODEL_COVERAGE = 0.3;
/** Matches worth offering as "related questions" under an answer: ones that would be answered too. */
const RELATED_COVERAGE = ANSWER_COVERAGE;
/** Near misses worth offering as "you could ask" under the fallback. */
const NEAR_MISS_COVERAGE = 0.35;
const NEAR_MISS_TITLE_COVERAGE = 0.2;
/** Answers about the service or area being discussed (or on screen) rank higher… */
const TOPIC_BOOST = 2;
/** …and answers about other services or areas a little lower than general ones. */
const OTHER_TOPIC = 0.85;
const MAX_SUGGESTIONS = 3;
const MAX_LINKS = 3;

type Hit = SearchHit<KnowledgeDoc>;

const SMALLTALK: { pattern: RegExp; reply: keyof typeof chatReplies; actions: ChatAction[]; suggest?: boolean }[] = [
  {
    pattern:
      /^(hi+|hello+|hey+|hiya|helo|hallo|namaste|namaskar|greetings|good (morning|afternoon|evening))( (there|team|sir|madam|ji|all|everyone))?[\s!.,]*$/i,
    reply: "greeting",
    actions: [],
    suggest: true,
  },
  {
    pattern:
      /^((ok(ay)?|great|perfect|nice)[\s,!.]+)?(thanks?|thank (you|u)|thx|ty|tysm|dhanyava+d|dhanyawad|shukriya)( (a lot|so much|very much|again))?[\s!.,]*$/i,
    reply: "thanks",
    actions: [],
  },
  { pattern: /^(ok(ay)?|great|perfect|cool|nice|got it|noted|fine|alright|sure)[\s!.,]*$/i, reply: "acknowledge", actions: [], suggest: true },
  {
    pattern: /^(ok(ay)? )?(bye|bye bye|goodbye|good bye|see you|see ya|that'?s all|nothing else)[\s!.,]*$/i,
    reply: "goodbye",
    actions: ["call", "whatsapp"],
  },
  {
    pattern:
      /\b(are|r) (you|u) (a |an )?(bot|robot|human|real|person|ai|machine|computer|chatbot)\b|\bwho (are|r) (you|u)\b|\bwhat are you\b|\b(talking|speaking|chatting) (to|with) (a )?(bot|human|machine|person)\b/i,
    reply: "identity",
    actions: ["call", "whatsapp"],
  },
  {
    pattern:
      /\b(talk|speak|chat|connect|transfer)\b.{0,30}\b(human|person|someone|somebody|agent|representative|executive|staff|team|owner|manager|engineer|expert)\b|\b(call me|call back|callback|ring me)\b/i,
    reply: "human",
    actions: ["call", "whatsapp", "inspection"],
  },
];

function smalltalkReply(question: string): ChatReply | null {
  const match = SMALLTALK.find(({ pattern }) => pattern.test(question.trim()));
  if (!match) return null;
  return {
    kind: "smalltalk",
    text: chatReplies[match.reply],
    links: [],
    actions: match.actions,
    suggestions: match.suggest ? chatWidget.suggestions.slice(0, MAX_SUGGESTIONS) : [],
  };
}

/** /services/bathroom-waterproofing → "service:bathroom-waterproofing" */
function topicFromPage(page?: string) {
  const [, section, slug] = (page ?? "").split(/[/?#]/);
  if (section === "services" && slug) return `service:${slug}`;
  if (section === "service-areas" && slug) return `area:${slug}`;
  return undefined;
}

const isConfident = (hit?: Hit): hit is Hit => hit !== undefined && hit.coverage >= ANSWER_COVERAGE;

/** "service:cost", "area:faq"… — so suggestions don't offer the cost of three different services. */
function kindOf(doc: KnowledgeDoc) {
  if (!doc.topic) return doc.id;
  const part = doc.id.startsWith("faq:") ? "faq" : (doc.id.split(":")[2] ?? "overview");
  return `${doc.topic.split(":")[0]}:${part}`;
}

/** Other good matches first (one of each kind from other services or areas), then more about the same service or area. */
function relatedQuestions(top: KnowledgeDoc, hits: Hit[], docs: KnowledgeDoc[]) {
  const out: string[] = [];
  const kinds = new Set<string>();
  const add = (doc: KnowledgeDoc) => {
    if (doc === top || out.includes(doc.title) || out.length >= MAX_SUGGESTIONS) return;
    const kind = kindOf(doc);
    if (doc.topic && doc.topic !== top.topic) {
      if (kinds.has(kind)) return;
      kinds.add(kind);
    }
    out.push(doc.title);
  };
  for (const hit of hits) if (hit.coverage >= RELATED_COVERAGE && hit.titleCoverage > 0) add(hit.doc);
  if (top.topic) for (const doc of docs) if (doc.topic === top.topic) add(doc);
  return out;
}

function linksFrom(docs: KnowledgeDoc[]): ChatLink[] {
  const links: ChatLink[] = [];
  for (const link of docs.flatMap((doc) => doc.links)) {
    if (links.length < MAX_LINKS && !links.some((existing) => existing.href === link.href)) links.push(link);
  }
  return links;
}

function fallbackReply(hits: Hit[]): ChatReply {
  const nearMisses = hits
    .filter((hit) => hit.coverage >= NEAR_MISS_COVERAGE && hit.titleCoverage >= NEAR_MISS_TITLE_COVERAGE)
    .map((hit) => hit.doc.title);
  return {
    kind: "fallback",
    text: chatReplies.fallback,
    links: [{ label: "Frequently asked questions", href: "/faq" }],
    actions: ["call", "whatsapp"],
    suggestions: (nearMisses.length ? nearMisses : chatWidget.suggestions).slice(0, MAX_SUGGESTIONS),
  };
}

export async function answerQuestion({ question, previous = [], page }: ChatRequest): Promise<ChatReply> {
  const smalltalk = smalltalkReply(question);
  if (smalltalk) return smalltalk;

  const knowledge = await getKnowledge();
  const earlier = previous.at(-1);
  const earlierHits = earlier ? knowledge.search(earlier).filter(isConfident) : [];
  const earlierTop = earlierHits[0];
  // Follow-ups lean towards the service or area being discussed, otherwise the one on screen.
  const topic = earlierHits.slice(0, 3).find((hit) => hit.doc.topic)?.doc.topic || topicFromPage(page);
  const boost = (doc: KnowledgeDoc) => (!doc.topic ? 1 : doc.topic === topic ? TOPIC_BOOST : OTHER_TOPIC);

  let hits = knowledge.search(question, { boost });
  // "How long does it take?" may only make sense together with the earlier question.
  if (earlier && !hits.some(isConfident)) {
    const combined = knowledge.search(`${earlier} ${question}`, { boost });
    const answer = combined.find(isConfident);
    if (answer && answer.doc !== earlierTop?.doc) hits = combined;
  }
  // The best-ranked answer that covers the question; otherwise the best partial match (for the model).
  const best = hits.find(isConfident) ?? hits[0];

  const model = modelConfig();
  if (model && best && best.coverage >= MODEL_COVERAGE) {
    const docs = [best, ...hits.filter((hit) => hit !== best && hit.coverage >= MODEL_COVERAGE)].slice(0, 4).map((hit) => hit.doc);
    const result = await askModel(model, { question, previous: earlier, docs });
    if (result.status === "answered") {
      return {
        kind: "answer",
        text: result.text,
        links: linksFrom(docs.slice(0, 2)),
        actions: best.doc.actions,
        suggestions: relatedQuestions(best.doc, hits, knowledge.docs),
      };
    }
    if (result.status === "failed") console.warn(`[chat] model answer not used: ${result.reason}`);
  }

  if (!isConfident(best)) return fallbackReply(hits);
  return {
    kind: "answer",
    text: best.doc.answer,
    links: linksFrom([best.doc]),
    actions: best.doc.actions,
    suggestions: relatedQuestions(best.doc, hits, knowledge.docs),
  };
}
