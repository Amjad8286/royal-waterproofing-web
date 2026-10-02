import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { BeforeAfterGallery } from "@/components/sections/before-after-gallery";
import { ClientsSection } from "@/components/sections/clients-section";
import { CTASection } from "@/components/sections/cta-section";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { HeroSection } from "@/components/sections/hero-section";
import { MumbaiSection } from "@/components/sections/mumbai-section";
import { ProblemsGrid } from "@/components/sections/problems-grid";
import { ProcessSteps } from "@/components/sections/process-steps";
import { SectorTiles } from "@/components/sections/sectors";
import { ServiceAreaSection } from "@/components/sections/service-area-section";
import { ServicesGrid } from "@/components/sections/services-grid";
import { StatsSection } from "@/components/sections/stats-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { cta, processSteps, site } from "@/config/site";
import { homeFaqIds } from "@/content/faqs";
import {
  getAreas,
  getClients,
  getFaqsByIds,
  getFeaturedProjects,
  getFormOptions,
  getHeroSlides,
  getProblems,
  getReviews,
  getSectors,
  getServices,
  getStats,
} from "@/lib/content";
import { buildMetadata, withCity } from "@/lib/seo";
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp";

// The root layout's title template doesn't apply to the root page, so the home title is absolute.
export const metadata = buildMetadata({
  title: `${withCity("Waterproofing Services")} | ${site.name}`,
  absoluteTitle: true,
  description: `Terrace, bathroom, external wall and basement waterproofing in ${site.market.primaryCity}. We find the cause of the leak first, then give you a written quotation. ${cta.primary}.`,
  path: "/",
});

export default async function HomePage() {
  const [heroSlides, problems, services, clients, sectors, featured, stats, reviews, areas, faqs, formOptions] = await Promise.all([
    getHeroSlides(),
    getProblems(),
    getServices(),
    getClients(),
    getSectors(),
    getFeaturedProjects(3),
    getStats(),
    getReviews(),
    getAreas(),
    getFaqsByIds(homeFaqIds),
    getFormOptions(),
  ]);

  return (
    <>
      <HeroSection variant="home" formOptions={formOptions} slides={heroSlides} />

      <Section labelledBy="problems-title">
        <SectionHeading
          id="problems-title"
          eyebrow="Start with the symptom"
          title="What's the problem?"
          intro="Pick what you're seeing. We'll show you what usually causes it and how it's fixed."
        />
        <ProblemsGrid problems={problems} className="mt-10" />
      </Section>

      <Section tone="concrete" labelledBy="services-title">
        <SectionHeading
          id="services-title"
          eyebrow="Services"
          title="Waterproofing for every part of a building"
          intro="From a single bathroom to a factory roof — every job starts with finding where the water gets in."
          action={
            <Button href="/services" variant="outline" iconRight={<ArrowRight className="size-4" aria-hidden="true" />}>
              All services
            </Button>
          }
        />
        <ServicesGrid services={services} compactOnMobile className="mt-12" />
      </Section>

      <ClientsSection clients={clients} />

      <MumbaiSection location="home-mumbai" />

      <WhyChooseUs />

      {featured.length > 0 ? (
        <Section tone="navy" labelledBy="results-title">
          <SectionHeading
            id="results-title"
            tone="dark"
            eyebrow="Results"
            title="Before and after"
            intro="Drag the slider to compare."
            action={
              <Button href="/projects" variant="outline-light" iconRight={<ArrowRight className="size-4" aria-hidden="true" />}>
                See all projects
              </Button>
            }
          />
          <BeforeAfterGallery projects={featured} className="mt-12" />
        </Section>
      ) : null}

      <Section tone={featured.length > 0 ? "white" : "concrete"} labelledBy="process-title">
        <SectionHeading
          id="process-title"
          eyebrow="How it works"
          title="From first call to a dry building"
          intro={`Five clear steps, no surprises. ${cta.quoteNote}`}
        />
        <ProcessSteps steps={processSteps} className="mt-14" />
        <div className="mt-12 flex flex-wrap gap-3">
          <Button href="/contact" size="lg" track={{ event: "cta_click", location: "home-process" }}>
            {cta.primary}
          </Button>
          <Button href="/contact" size="lg" variant="outline" track={{ event: "cta_click", location: "home-process-quote" }}>
            {cta.quote}
          </Button>
        </div>
      </Section>

      <Section tone={featured.length > 0 ? "concrete" : "white"} labelledBy="sectors-title">
        <SectionHeading
          id="sectors-title"
          eyebrow="Who we work for"
          title="From one flat to whole societies and factories"
          intro="Homes, housing societies, businesses and builders — each kind of building has its own problems and its own way of working."
          action={
            <Button href="/projects" variant="outline" iconRight={<ArrowRight className="size-4" aria-hidden="true" />}>
              See our work
            </Button>
          }
        />
        <SectorTiles sectors={sectors} className="mt-10" />
      </Section>

      {stats.length > 0 ? (
        <Section tone="concrete" spacing="tight" labelledBy="stats-title">
          <h2 id="stats-title" className="sr-only">
            {site.name} in numbers
          </h2>
          <StatsSection stats={stats} />
        </Section>
      ) : null}

      <TestimonialsSection reviews={reviews} />

      <ServiceAreaSection areas={areas} />

      <Section labelledBy="faq-title">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div>
            <SectionHeading
              id="faq-title"
              eyebrow="FAQ"
              title="Questions we're asked most"
              intro="Straight answers on cost, inspections, timing and working with housing societies."
            />
            <div className="mt-8 flex flex-col items-start gap-3">
              <Button href="/faq" variant="outline" iconRight={<ArrowRight className="size-4" aria-hidden="true" />}>
                All FAQs
              </Button>
              <Button
                href={whatsappUrl(whatsappMessage())}
                variant="link"
                icon={<WhatsAppIcon className="size-4" />}
                track={{ event: "whatsapp_click", location: "home-faq" }}
              >
                Still have a question? WhatsApp us
              </Button>
            </div>
          </div>
          <FAQAccordion faqs={faqs} />
        </div>
      </Section>

      <CTASection formOptions={formOptions} whatsappText={whatsappMessage()} location="home-cta" />
    </>
  );
}
