import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { ProjectCard } from "@/components/cards/project-card";
import { TestimonialCard } from "@/components/cards/testimonial-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Eyebrow, SectionHeading } from "@/components/layout/section-heading";
import { ZoneMap } from "@/components/media/zone-map";
import { CTASection } from "@/components/sections/cta-section";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { HeroCtas } from "@/components/sections/hero-ctas";
import { ServicesGrid } from "@/components/sections/services-grid";
import { TrustStrip } from "@/components/sections/trust-strip";
import { JsonLd } from "@/components/seo/json-ld";
import { getArea, getAreas, getFormOptions, getProjects, getReviews, getServices, serviceName } from "@/lib/content";
import { projectsForArea, resolveSlugs, reviewsForArea } from "@/lib/relations";
import { faqJsonLd } from "@/lib/schema";
import { buildMetadata, withCta } from "@/lib/seo";
import { whatsappMessage } from "@/lib/whatsapp";

export const dynamicParams = false;

export async function generateStaticParams() {
  const areas = await getAreas();
  return areas.map((area) => ({ area: area.slug }));
}

export async function generateMetadata({ params }: PageProps<"/service-areas/[area]">): Promise<Metadata> {
  const { area: slug } = await params;
  const area = await getArea(slug);
  if (!area) return {};
  return buildMetadata({
    title: `Waterproofing in ${area.name}`,
    description: withCta(
      `Waterproofing and leakage repair in ${area.name}: ${area.commonProblems.map((p) => p.problem.toLowerCase()).join(", ")}.`,
    ),
    path: `/service-areas/${area.slug}`,
  });
}

export default async function AreaPage({ params }: PageProps<"/service-areas/[area]">) {
  const { area: slug } = await params;
  const area = await getArea(slug);
  if (!area) notFound();

  const [areas, services, projects, reviews, formOptions] = await Promise.all([
    getAreas(),
    getServices(),
    getProjects(),
    getReviews(),
    getFormOptions(),
  ]);
  const featured = resolveSlugs(services, area.featuredServices);
  const localProjects = projectsForArea(projects, area.slug);
  const localReviews = reviewsForArea(reviews, area.slug);
  const nearby = resolveSlugs(areas, area.nearby);
  const waText = whatsappMessage({ area: area.name });

  return (
    <>
      <section aria-labelledby="hero-title" className="tone-navy bg-navy-900 text-white">
        <Container className="grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:py-20">
          <div>
            <Breadcrumbs
              tone="dark"
              className="mb-8"
              items={[
                { name: "Service areas", href: "/service-areas" },
                { name: area.name, href: `/service-areas/${area.slug}` },
              ]}
            />
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Eyebrow tone="dark">{area.zone}</Eyebrow>
            </div>
            <h1 id="hero-title" className="text-h1 text-white">
              Waterproofing services in {area.name}
            </h1>
            <p className="mt-5 max-w-xl text-lead text-white/80">{area.intro[0]}</p>
            <HeroCtas className="mt-8" contactHref={`/contact?area=${area.slug}`} whatsappText={waText} location={`area-${area.slug}`} />
            <TrustStrip className="mt-10 border-t border-white/15 pt-8" />
          </div>
          <div className="hidden rounded-sm bg-white p-4 lg:block">
            <ZoneMap highlight={area.slug} className="mx-auto max-w-sm" />
          </div>
        </Container>
      </section>
      <JsonLd data={faqJsonLd(area.faqs)} />

      <Section labelledBy="local-title">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <SectionHeading id="local-title" eyebrow={`About ${area.name}`} title={`Common problems in ${area.name}`} />
            <div className="prose-site mt-6 text-ink-muted">
              {area.intro.slice(1).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <ul className="space-y-3 self-start">
            {area.commonProblems.map((item) => (
              <li key={item.problem}>
                <Link
                  href={`/services/${item.service}`}
                  className="group flex items-center gap-4 rounded-sm border border-concrete-300 p-4 transition-colors hover:border-royal-700"
                >
                  <MapPin className="size-5 shrink-0 text-royal-700" aria-hidden="true" />
                  <span className="flex-1">
                    <span className="block font-semibold text-navy-900">{item.problem}</span>
                    <span className="block text-sm text-royal-700">{serviceName(item.service)}</span>
                  </span>
                  <ArrowRight className="size-4 text-royal-700 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="concrete" labelledBy="area-services-title">
        <SectionHeading
          id="area-services-title"
          eyebrow="Services"
          title={`Most requested in ${area.name}`}
          intro="We offer every service in every area — these are the ones we're asked for most here."
        />
        <ServicesGrid services={featured} showGroup={false} compactOnMobile className="mt-10 lg:grid-cols-4" />
      </Section>

      {localProjects.length > 0 ? (
        <Section labelledBy="area-projects-title">
          <SectionHeading id="area-projects-title" eyebrow="Local projects" title={`Recent work in ${area.name}`} />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {localProjects.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {localReviews.length > 0 ? (
        <Section tone={localProjects.length > 0 ? "concrete" : "white"} labelledBy="area-reviews-title">
          <SectionHeading id="area-reviews-title" eyebrow="Local reviews" title={`What customers in ${area.name} say`} />
          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {localReviews.map((review) => (
              <li key={review.id}>
                <TestimonialCard review={review} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section labelledBy="area-faq-title">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div>
            <SectionHeading id="area-faq-title" eyebrow="FAQ" title={`Questions from ${area.name}`} />
            {nearby.length > 0 ? (
              <div className="mt-8">
                <p className="text-sm font-semibold text-navy-900">Nearby areas</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {nearby.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/service-areas/${item.slug}`}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-concrete-400 px-4 text-sm font-medium text-navy-900 hover:border-navy-600"
                      >
                        <MapPin className="size-4 text-royal-700" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <FAQAccordion faqs={area.faqs} />
        </div>
      </Section>

      <CTASection
        title={`Book an inspection in ${area.name}`}
        intro="Tell us what you're seeing and where. We'll arrange a visit, find the cause and give you a written quotation."
        formOptions={formOptions}
        defaultArea={area.slug}
        whatsappText={waText}
        location={`area-${area.slug}-cta`}
      />
    </>
  );
}
