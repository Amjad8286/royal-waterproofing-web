import { Section } from "@/components/layout/section";
import { CTASection } from "@/components/sections/cta-section";
import { FAQExplorer } from "@/components/sections/faq-explorer";
import { HeroSection } from "@/components/sections/hero-section";
import { JsonLd } from "@/components/seo/json-ld";
import { faqCategories } from "@/content/faqs";
import { getFaqs, getFormOptions } from "@/lib/content";
import { faqJsonLd } from "@/lib/schema";
import { buildMetadata, withCta } from "@/lib/seo";
import { whatsappMessage } from "@/lib/whatsapp";

export const metadata = buildMetadata({
  title: "Waterproofing FAQs",
  description: withCta("Answers on waterproofing costs in Mumbai, inspections, how long work takes, disruption, materials, maintenance and the best time to book."),
  path: "/faq",
});

export default async function FaqPage() {
  const [faqs, formOptions] = await Promise.all([getFaqs(), getFormOptions()]);
  const groups = faqCategories
    .map((category) => ({ id: category.id, label: category.label, faqs: faqs.filter((faq) => faq.category === category.id) }))
    .filter((group) => group.faqs.length > 0);

  return (
    <>
      <HeroSection
        variant="page"
        breadcrumbs={[{ name: "FAQ", href: "/faq" }]}
        eyebrow="FAQ"
        title="Frequently asked questions about waterproofing"
        intro="Straight answers about cost, inspections, timing, housing societies and looking after the work. Can't find yours? Ask us on WhatsApp."
      />
      <JsonLd data={faqJsonLd(faqs)} />

      <Section spacing="tight" labelledBy="faq-list-title">
        <h2 id="faq-list-title" className="sr-only">
          Questions and answers
        </h2>
        <FAQExplorer groups={groups} />
      </Section>

      <CTASection
        title="Still have a question?"
        intro="Ask us anything — or book an inspection and we'll answer it on site, with the evidence in front of you."
        formOptions={formOptions}
        whatsappText={whatsappMessage()}
        location="faq-cta"
      />
    </>
  );
}
