import "server-only";
import { cta, differentiators, processSteps, site } from "@/config/site";
import { chatAlsoAsked, chatKnowledge } from "@/content/chat";
import { faqCategories } from "@/content/faqs";
import {
  getAreas,
  getClients,
  getFaqs,
  getProblems,
  getSectors,
  getServices,
  getServicesByGroup,
} from "@/lib/content";
import type { Area, ChatAction, ChatLink, FAQ, FAQCategory, Service, TitledText } from "@/types/content";
import { createSearchIndex } from "./search";

/**
 * What the website assistant knows: one short document per question it can
 * answer, assembled from the site's own content. Answers are the content's
 * own words with a little connecting text, never new facts.
 *
 * Sample content (`placeholder: true`) is left out even in preview mode: an
 * answer can't carry the "Sample" badge, so it would read as fact.
 */
export interface KnowledgeDoc {
  id: string;
  /** The question or topic. Searched with the most weight, and offered as a follow-up chip. */
  title: string;
  /** Other ways people ask it (from `chatAlsoAsked` in src/content/chat.ts). */
  alsoAsked?: string[];
  /** Other words for it. Searched, never shown. */
  keywords: string[];
  /** Extra searchable text that isn't part of the answer. */
  body: string;
  /** Shown word for word, and the only facts the optional language model may use. */
  answer: string;
  links: ChatLink[];
  actions: ChatAction[];
  /** "service:<slug>" or "area:<slug>", for follow-up questions and the page the visitor is on. */
  topic?: string;
}

const confirmed = <T extends { placeholder?: boolean }>(items: T[]) => items.filter((item) => !item.placeholder);

const list = (items: string[]) => items.map((item) => `- ${item}`).join("\n");

const numbered = (items: TitledText[]) => items.map((step, i) => `${i + 1}. ${step.title}: ${step.description}`).join("\n");

/** "Exposed terraces" → "exposed terraces", but "PU membranes" stays. */
const lowerFirst = (text: string) => (/^[A-Z][a-z]/.test(text) ? text.charAt(0).toLowerCase() + text.slice(1) : text);

/** Capitalised words that don't start a sentence — the place names in an area's copy (Vakola, Kalina…). */
function placeNames(text: string) {
  const names = new Set<string>();
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    for (const word of sentence.split(/\s+/).slice(1)) {
      const clean = word.replace(/[^A-Za-z-]/g, "");
      if (/^[A-Z][a-z]{3,}/.test(clean)) names.add(clean);
    }
  }
  return [...names];
}

const categoryKeywords: Record<FAQCategory, string[]> = {
  cost: ["cost", "price", "quote", "payment"],
  inspection: ["inspection", "visit", "survey", "diagnosis"],
  duration: ["time", "long", "days", "duration", "disruption"],
  warranty: ["warranty"],
  solutions: ["system", "material", "product", "method"],
  maintenance: ["maintenance", "care", "upkeep"],
  booking: ["book", "appointment"],
};

const categoryActions: Partial<Record<FAQCategory, ChatAction[]>> = {
  cost: ["inspection"],
  inspection: ["inspection"],
  booking: ["inspection", "call", "whatsapp"],
};

function faqDoc(faq: FAQ, extra: Pick<KnowledgeDoc, "links" | "actions" | "keywords"> & { topic?: string }): KnowledgeDoc {
  return { id: `faq:${faq.id}`, title: faq.question, body: "", answer: faq.answer, ...extra };
}

function serviceDocs(service: Service): KnowledgeDoc[] {
  const page = `/services/${service.slug}`;
  const topic = `service:${service.slug}`;
  const link = (section?: string): ChatLink => ({ label: service.name, href: section ? `${page}#${section}` : page });
  const docs: KnowledgeDoc[] = confirmed(service.faqs).map((faq) =>
    faqDoc(faq, { keywords: [service.shortName], links: [link("faq")], actions: [], topic }),
  );

  docs.push(
    {
      id: topic,
      title: service.name,
      keywords: [service.shortName, ...service.applications],
      body: [
        service.summary,
        ...service.signs,
        ...service.causes.map((cause) => cause.title),
        ...service.benefits.map((benefit) => benefit.title),
      ].join(". "),
      answer: `${service.intro}\n\nHow we fix it:\n${list(service.systems.map((system) => `${system.name}, for ${lowerFirst(system.bestFor)}`))}`,
      links: [link()],
      actions: ["inspection"],
      topic,
    },
    {
      id: `${topic}:cost`,
      title: `How much does ${service.name.toLowerCase()} cost?`,
      keywords: [service.shortName, "cost", "price", "quote", "estimate"],
      body: "",
      answer: `The price depends on:\n${list(service.costFactors)}\n\n${cta.quoteNote}`,
      links: [link("cost")],
      actions: ["inspection"],
      topic,
    },
    {
      id: `${topic}:process`,
      title: `The ${service.name.toLowerCase()} process`,
      keywords: [service.shortName, "process", "steps", "method", "procedure", "stages"],
      body: "",
      answer: numbered(service.process),
      links: [link("process")],
      actions: ["inspection"],
      topic,
    },
    {
      id: `${topic}:causes`,
      title: service.causesTitle ?? `What causes the problem? (${service.name})`,
      keywords: [service.shortName, "why", "cause", "reason"],
      body: "",
      answer: list(service.causes.map((cause) => `${cause.title}: ${cause.description}`)),
      links: [link("causes")],
      actions: ["inspection"],
      topic,
    },
  );

  if (!service.keyFacts.duration.placeholder) {
    docs.push({
      id: `${topic}:duration`,
      title: `How long does ${service.name.toLowerCase()} take?`,
      keywords: [service.shortName, "time", "long", "days", "duration"],
      body: "",
      answer: `${service.keyFacts.duration.value}. Your quotation includes the schedule.`,
      links: [link()],
      actions: ["inspection"],
      topic,
    });
  }

  if (!service.warranty.placeholder) {
    const length = service.keyFacts.warranty.placeholder ? "" : `\n\nLength: ${service.keyFacts.warranty.value}.`;
    docs.push({
      id: `${topic}:warranty`,
      title: `${service.name} warranty`,
      keywords: [service.shortName, "warranty"],
      body: "",
      answer: `${service.warranty.summary}${length}\n\nCovered:\n${list(service.warranty.covered)}\n\nNot covered:\n${list(service.warranty.notCovered)}`,
      links: [link("warranty")],
      actions: ["inspection"],
      topic,
    });
  }

  return docs;
}

function areaDocs(area: Area): KnowledgeDoc[] {
  const topic = `area:${area.slug}`;
  const link: ChatLink = { label: `Waterproofing in ${area.name}`, href: `/service-areas/${area.slug}` };
  return [
    {
      id: topic,
      title: `Waterproofing in ${area.name}`,
      keywords: [area.name, area.zone, ...placeNames(area.intro.join(" "))],
      body: [...area.intro, ...area.commonProblems.map((item) => item.problem)].join(" "),
      answer: `${area.intro[0]}\n\nCommon problems we fix here:\n${list(area.commonProblems.map((item) => item.problem))}`,
      links: [link],
      actions: ["inspection"],
      topic,
    },
    ...confirmed(area.faqs).map((faq) => faqDoc(faq, { keywords: [area.name], links: [link], actions: [], topic })),
  ];
}

export async function buildKnowledge(): Promise<KnowledgeDoc[]> {
  const [services, groups, areas, faqs, problems, sectors, clients] = await Promise.all([
    getServices(),
    getServicesByGroup(),
    getAreas(),
    getFaqs(),
    getProblems(),
    getSectors(),
    getClients(),
  ]);
  const realAreas = confirmed(areas);
  const serviceBySlug = new Map(services.map((service) => [service.slug, service]));
  const zones = [...new Set(realAreas.map((area) => area.zone))];

  const docs: KnowledgeDoc[] = [
    ...confirmed(chatKnowledge).map((entry) => ({
      id: `entry:${entry.id}`,
      title: entry.question,
      keywords: entry.keywords ?? [],
      body: "",
      answer: entry.answer,
      links: entry.links ?? [],
      actions: entry.actions ?? [],
    })),
    {
      id: "areas",
      title: "Which areas do you cover?",
      keywords: ["areas", "cover", "serve", "where", "locations", "localities", "suburbs", "work", site.market.serviceRegion],
      body: realAreas.map((area) => area.name).join(", "),
      answer: `We work across ${site.market.serviceRegion}:\n${list(
        zones.map((zone) => `${zone}: ${realAreas.filter((area) => area.zone === zone).map((area) => area.name).join(", ")}`),
      )}\n\nIf you're nearby but not listed, ask us.`,
      links: [{ label: "Service areas", href: "/service-areas" }],
      actions: ["inspection"],
    },
    {
      id: "services",
      title: "What services do you offer?",
      keywords: ["services", "offer", "provide", "types", "list", "work", "waterproofing"],
      body: services.map((service) => service.name).join(", "),
      answer: `We fix leaks and waterproof flats, housing societies and businesses:\n${list(
        groups.map((group) => `${group.label}: ${group.services.map((service) => service.name).join(", ")}`),
      )}`,
      links: [{ label: "All services", href: "/services" }],
      actions: ["inspection"],
    },
    ...confirmed(faqs).map((faq) => {
      const category = faqCategories.find((item) => item.id === faq.category);
      return faqDoc(faq, {
        keywords: faq.category ? categoryKeywords[faq.category] : [],
        links: category ? [{ label: `More on ${category.label.toLowerCase()}`, href: `/faq#${category.id}` }] : [],
        actions: (faq.category && categoryActions[faq.category]) || [],
      });
    }),
    ...problems.map((problem): KnowledgeDoc => {
      const fixes = problem.services.flatMap((slug) => serviceBySlug.get(slug) ?? []);
      return {
        id: `problem:${problem.slug}`,
        title: problem.title,
        keywords: [],
        body: problem.description,
        answer: `${problem.title}: ${lowerFirst(problem.description)}\n\nServices for this problem:\n${list(
          fixes.map((service) => service.name),
        )}\n\n${differentiators[0].description}`,
        links: fixes.map((service) => ({ label: service.name, href: `/services/${service.slug}` })),
        actions: ["inspection", "whatsapp"],
      };
    }),
    ...services.flatMap(serviceDocs),
    ...realAreas.flatMap(areaDocs),
    {
      id: "process",
      title: "How does the process work?",
      keywords: ["process", "steps", "how", "work", "next", "happens", "procedure", "start"],
      body: "",
      answer: numbered(
        processSteps.map((step) => ({
          title: step.title,
          description: step.timing && !step.timing.placeholder ? `${step.description} (${step.timing.value})` : step.description,
        })),
      ),
      links: [{ label: "Contact page", href: "/contact" }],
      actions: ["inspection"],
    },
    {
      id: "why-us",
      title: `Why choose ${site.shortName}?`,
      keywords: ["why", "choose", "different", "better", "trust", "reliable", "quality", "best", "good"],
      body: "",
      answer: list(differentiators.map((item) => `${item.title}: ${item.description}`)),
      links: [{ label: "About us", href: "/about" }],
      actions: ["inspection"],
    },
    {
      id: "sectors",
      title: "Who do you work for?",
      keywords: ["who", "types", "buildings", "properties", "residential", "commercial", "industrial"],
      body: sectors.map((sector) => sector.description).join(" "),
      answer: `We work for:\n${list(sectors.map((sector) => `${sector.title}: ${lowerFirst(sector.summary)}`))}`,
      links: [{ label: "Who we work for", href: "/projects" }],
      actions: ["inspection"],
    },
    ...(clients.length
      ? [
          {
            id: "clients",
            title: "Which clients have you worked with?",
            keywords: ["who", "clients", "customers", "companies", "organisations", "portfolio", "references", "developers", "builders"],
            body: "",
            answer: `Organisations we've worked for include ${clients
              .slice(0, 8)
              .map((client) => client.name)
              .join(", ")}. The full list is on our home page.`,
            links: [{ label: "Our clients", href: "/#clients-title" }],
            actions: [],
          } satisfies KnowledgeDoc,
        ]
      : []),
  ];

  // The first document with a given question wins (e.g. the areas list over the shorter FAQ answer).
  const seen = new Set<string>();
  return docs
    .filter((doc) => {
      const key = doc.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((doc) => (chatAlsoAsked[doc.id] ? { ...doc, alsoAsked: chatAlsoAsked[doc.id] } : doc));
}

export type Knowledge = Awaited<ReturnType<typeof createKnowledge>>;

async function createKnowledge() {
  const docs = await buildKnowledge();
  return { docs, ...createSearchIndex(docs) };
}

let knowledge: ReturnType<typeof createKnowledge> | undefined;

/** Built once per server process; the content is static. */
export function getKnowledge() {
  knowledge ??= createKnowledge().catch((error: unknown) => {
    knowledge = undefined;
    throw error;
  });
  return knowledge;
}
