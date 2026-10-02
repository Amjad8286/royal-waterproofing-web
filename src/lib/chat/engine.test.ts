import { describe, expect, it, vi } from "vitest";
import { certifications, processSteps, site, stats } from "@/config/site";
import { areas } from "@/content/areas";
import { chatKnowledge, chatWidget } from "@/content/chat";
import { faqCategories, faqs } from "@/content/faqs";
import { projects } from "@/content/projects";
import { reviews } from "@/content/reviews";
import { services } from "@/content/services";
import { team } from "@/content/team";
import { answerQuestion } from "./engine";
import { getKnowledge, type KnowledgeDoc } from "./knowledge";

const ask = (question: string, options: { previous?: string[]; page?: string } = {}) =>
  answerQuestion({ question, ...options });

const hrefs = (reply: { links: { href: string }[] }) => reply.links.map((link) => link.href);

describe("website assistant: answers from the site's content", () => {
  it.each(chatWidget.suggestions)("answers its own suggested question: %s", async (question) => {
    expect((await ask(question)).kind).toBe("answer");
  });

  it("gives the real contact details", async () => {
    const phone = await ask("What's your phone number?");
    expect(phone.text).toContain(site.contact.phone.display);
    expect(phone.actions).toEqual(expect.arrayContaining(["call", "whatsapp"]));

    expect((await ask("email id?")).text).toContain(site.contact.email);
    expect((await ask("Where is your office?")).text).toContain(site.contact.address.full);
  });

  it("matches a symptom to the services that fix it", async () => {
    const reply = await ask("My bathroom is leaking into the flat below");
    expect(hrefs(reply)).toContain("/services/bathroom-waterproofing");
    expect(reply.actions).toContain("inspection");
  });

  it("explains what a price depends on, without inventing one", async () => {
    const reply = await ask("How much does bathroom waterproofing cost?");
    const bathroom = services.find((service) => service.slug === "bathroom-waterproofing")!;
    expect(reply.text).toContain(bathroom.costFactors[0]);
    expect(reply.text).not.toMatch(/₹|\brs\.?\s*\d|per sq/i);
  });

  it("knows the areas it covers, and says so honestly when it doesn't", async () => {
    expect((await ask("Do you work in Thane?")).text).toMatch(/Thane/);
    expect(hrefs(await ask("Do you come to Kalina?"))).toContain("/service-areas/santacruz");
    expect((await ask("Do you work in Pune?")).kind).toBe("fallback");
  });

  it("follows up on the service being discussed, or the page being read", async () => {
    const followUp = await ask("How much does it cost?", { previous: ["Tell me about terrace waterproofing"] });
    expect(hrefs(followUp)).toContain("/services/terrace-roof-waterproofing#cost");

    const onPage = await ask("How much does it cost?", { page: "/services/basement-waterproofing" });
    expect(hrefs(onPage)).toContain("/services/basement-waterproofing#cost");
  });

  it("copes with typos and Hinglish", async () => {
    expect(hrefs(await ask("basment waterprofing"))).toContain("/services/basement-waterproofing");
    expect(hrefs(await ask("kitna kharcha hoga bathroom ka"))).toContain("/services/bathroom-waterproofing#cost");
    expect(hrefs(await ask("chhat se paani tapak raha hai"))).toContain("/services/terrace-roof-waterproofing");
  });

  it.each([
    "Do you repair laptops?",
    "What's the weather tomorrow?",
    "Who won the cricket match?",
    // Not confirmed yet, so not on the live site: the assistant must not guess.
    "Do you give a warranty?",
    "How many years of experience do you have?",
    "What is your Google rating?",
    "Do you have reviews?",
  ])("doesn't guess: %s", async (question) => {
    const reply = await ask(question);
    expect(reply.kind).toBe("fallback");
    expect(reply.text).toContain(site.contact.phone.display);
    expect(reply.actions).toEqual(["call", "whatsapp"]);
  });

  it("handles greetings, thanks and requests for a person", async () => {
    expect(await ask("Hi")).toMatchObject({ kind: "smalltalk", suggestions: chatWidget.suggestions.slice(0, 3) });
    expect((await ask("thanks!")).kind).toBe("smalltalk");
    expect((await ask("Are you a bot?")).text).toMatch(/automated/);
    const person = await ask("Can I talk to someone?");
    expect(person.kind).toBe("smalltalk");
    expect(person.actions).toEqual(["call", "whatsapp", "inspection"]);
  });

  it("offers related questions it can answer", async () => {
    const reply = await ask("Bathroom Waterproofing");
    expect(reply.suggestions.length).toBeGreaterThan(0);
    for (const suggestion of reply.suggestions) expect((await ask(suggestion)).kind, suggestion).toBe("answer");
  });
});

/** Every invented value in the content: none may reach the assistant. */
function sampleText() {
  return [
    ...stats.filter((stat) => stat.placeholder).flatMap((stat) => [`${stat.value}${stat.suffix}`, stat.label]),
    ...(site.rating.placeholder ? [String(site.rating.average), `${site.rating.count} reviews`] : []),
    ...(site.warranty.placeholder ? [site.warranty.headline, site.warranty.upTo.value] : []),
    ...processSteps.flatMap((step) => (step.timing?.placeholder ? [step.timing.value] : [])),
    ...certifications.filter((item) => item.placeholder).map((item) => item.title),
    ...services.flatMap((service) => [
      ...(service.keyFacts.duration.placeholder ? [service.keyFacts.duration.value] : []),
      ...(service.keyFacts.warranty.placeholder ? [service.keyFacts.warranty.value] : []),
      ...(service.warranty.placeholder ? [service.warranty.summary] : []),
    ]),
    ...faqs.filter((faq) => faq.placeholder).map((faq) => faq.answer),
    ...areas.filter((area) => area.placeholder).map((area) => area.intro[0]),
    ...projects.filter((project) => project.placeholder).map((project) => project.title),
    ...reviews.filter((review) => review.placeholder).map((review) => review.quote),
    ...team.filter((member) => member.placeholder).flatMap((member) => [member.name, member.bio]),
    ...chatKnowledge.filter((entry) => entry.placeholder).map((entry) => entry.answer),
  ];
}

function expectNoSamples(docs: KnowledgeDoc[]) {
  const samples = sampleText();
  expect(samples.length).toBeGreaterThan(10);
  for (const doc of docs) {
    const text = [doc.title, doc.body, doc.answer, ...(doc.alsoAsked ?? [])].join("\n");
    for (const sample of samples) expect(text.includes(sample), `${doc.id} contains "${sample}"`).toBe(false);
  }
}

describe("website assistant: knowledge", () => {
  it("never includes sample content", async () => {
    expectNoSamples((await getKnowledge()).docs);
  });

  it("leaves sample content out in preview mode too, where the site shows it with badges", async () => {
    vi.stubEnv("NEXT_PUBLIC_PREVIEW_SAMPLES", "true");
    vi.resetModules();
    try {
      const { buildKnowledge } = await import("./knowledge");
      expectNoSamples(await buildKnowledge());
    } finally {
      vi.unstubAllEnvs();
      vi.resetModules();
    }
  });

  it("only links to pages and sections that exist", async () => {
    const pages = new Set([
      "/",
      "/services",
      "/service-areas",
      "/projects",
      "/about",
      "/faq",
      "/contact",
      ...services.map((service) => `/services/${service.slug}`),
      ...areas.filter((area) => !area.placeholder).map((area) => `/service-areas/${area.slug}`),
    ]);
    const serviceSections = new Set(["signs", "causes", "solution", "process", "results", "warranty", "cost", "faq"]);
    const faqSections = new Set<string>(faqCategories.map((category) => category.id));

    for (const doc of (await getKnowledge()).docs) {
      for (const { href } of doc.links) {
        if (!href.startsWith("/")) {
          expect(href, doc.id).toMatch(/^https:\/\//);
          continue;
        }
        const [path, section] = href.split("#");
        expect(pages.has(path), `${doc.id}: ${href}`).toBe(true);
        if (section && path.startsWith("/services/")) expect(serviceSections.has(section), `${doc.id}: ${href}`).toBe(true);
        if (section && path === "/faq") expect(faqSections.has(section), `${doc.id}: ${href}`).toBe(true);
      }
    }
  });

  it("has one answer per question", async () => {
    const titles = (await getKnowledge()).docs.map((doc) => doc.title.toLowerCase());
    expect(new Set(titles).size).toBe(titles.length);
  });
});
