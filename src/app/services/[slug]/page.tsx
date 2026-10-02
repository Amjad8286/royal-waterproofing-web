import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowRight, Check, CircleAlert, ClipboardCheck, Clock, House, MapPin, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { ProjectCard } from "@/components/cards/project-card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { BeforeAfterSlider } from "@/components/media/before-after-slider";
import { CTASection } from "@/components/sections/cta-section";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { HeroSection } from "@/components/sections/hero-section";
import { ProcessSteps } from "@/components/sections/process-steps";
import { AreaLinks } from "@/components/sections/service-area-section";
import { ServicesGrid } from "@/components/sections/services-grid";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { WarrantyBlock } from "@/components/sections/warranty-block";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { cta, inCity, site } from "@/config/site";
import { getImage } from "@/content/images";
import { serviceGroups } from "@/content/services";
import { getAreas, getFormOptions, getProjects, getReviews, getService, getServices } from "@/lib/content";
import { areasForService, projectsForService, resolveSlugs, reviewsForService } from "@/lib/relations";
import { isShown } from "@/lib/samples";
import { faqJsonLd, serviceJsonLd } from "@/lib/schema";
import { buildMetadata, withCity, withCta } from "@/lib/seo";
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp";

export const dynamicParams = false;

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return buildMetadata({
    title: withCity(service.seo.title),
    description: withCta(service.seo.description),
    path: `/services/${service.slug}`,
  });
}

const toc = [
  { id: "signs", label: "Signs" },
  { id: "causes", label: "Causes" },
  { id: "solution", label: "How we fix it" },
  { id: "process", label: "Process" },
  { id: "results", label: "Results" },
  { id: "warranty", label: "Warranty" },
  { id: "cost", label: "Cost" },
  { id: "faq", label: "FAQ" },
];

function Block({ id, title, intro, children }: { id: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28">
      <h2 id={`${id}-title`} className="text-h2">
        {title}
      </h2>
      {intro ? <p className="mt-3 max-w-2xl text-lead text-ink-muted">{intro}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const [services, projects, reviews, areas, formOptions] = await Promise.all([
    getServices(),
    getProjects(),
    getReviews(),
    getAreas(),
    getFormOptions(),
  ]);
  const related = resolveSlugs(services, service.related);
  const serviceProjects = projectsForService(projects, service.slug);
  const showcase = serviceProjects[0];
  const serviceReviews = reviewsForService(reviews, service.slug);
  const serviceAreas = areasForService(areas, service.slug);
  const group = serviceGroups.find((g) => g.id === service.group);
  const contactHref = `/contact?service=${service.slug}`;
  const waText = whatsappMessage({ service: service.name });
  const location = `service-${service.slug}`;
  const showWarranty = isShown(service.warranty);
  const sections = toc.filter(
    (item) => (item.id !== "results" || serviceProjects.length > 0) && (item.id !== "warranty" || showWarranty),
  );

  return (
    <>
      <HeroSection
        variant="split"
        breadcrumbs={[
          { name: "Services", href: "/services" },
          { name: service.name, href: `/services/${service.slug}` },
        ]}
        eyebrow={group?.label ?? "Service"}
        title={`${service.name}${inCity}`}
        intro={service.intro}
        image={service.image}
        facts={[
          // Confirmed facts first; unconfirmed ones are hidden on the live site and the hero shows the first three.
          { icon: <Clock className="size-5" />, label: "Typical duration", fact: service.keyFacts.duration },
          { icon: <ShieldCheck className="size-5" />, label: "Warranty", fact: service.keyFacts.warranty },
          { icon: <House className="size-5" />, label: "Suitable for", fact: { value: service.keyFacts.suitableFor, placeholder: false } },
          {
            icon: <ClipboardCheck className="size-5" />,
            label: "Inspection",
            fact: { value: site.inspection.isFree ? "Free site visit" : "Site visit before quoting", placeholder: false },
          },
          { icon: <MapPin className="size-5" />, label: "Where", fact: { value: site.market.serviceRegion, placeholder: false } },
        ]}
        contactHref={contactHref}
        whatsappText={waText}
        location={location}
      />
      <JsonLd data={[serviceJsonLd(service, serviceAreas), faqJsonLd(service.faqs)]} />

      <div className="bg-white py-16 sm:py-20 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 space-y-20">
            <Block id="signs" title={service.signsTitle ?? "Signs you need it"}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {service.signs.map((sign) => (
                  <li key={sign} className="flex gap-3 rounded-sm border border-concrete-300 bg-concrete-50 p-4">
                    <CircleAlert className="mt-0.5 size-5 shrink-0 text-royal-700" aria-hidden="true" />
                    <span className="text-[0.9375rem] text-ink">{sign}</span>
                  </li>
                ))}
              </ul>
            </Block>

            <Block id="causes" title={service.causesTitle ?? "Why it happens"}>
              <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {service.causes.map((cause, i) => (
                  <div key={cause.title} className="border-l-2 border-wave-500 pl-5">
                    <dt className="font-heading text-h4 font-bold text-navy-900">
                      <span className="mr-2 text-ink-subtle">{i + 1}.</span>
                      {cause.title}
                    </dt>
                    <dd className="mt-1.5 text-[0.9375rem] text-ink-muted">{cause.description}</dd>
                  </div>
                ))}
              </dl>
            </Block>

            <Block id="solution" title="How we fix it" intro={service.solutionIntro}>
              <ul className="grid gap-4">
                {service.systems.map((system) => (
                  <li key={system.name} className="grid gap-3 rounded-sm border border-concrete-300 p-5 sm:grid-cols-[minmax(0,1fr)_13rem] sm:gap-6">
                    <div>
                      <h3 className="font-heading text-h4 text-navy-900">{system.name}</h3>
                      <p className="mt-1.5 text-[0.9375rem] text-ink-muted">{system.description}</p>
                    </div>
                    <p className="self-start rounded-xs bg-royal-50 p-3 text-sm text-royal-800">
                      <span className="block text-xs font-bold uppercase tracking-wider">Best for</span>
                      {system.bestFor}
                    </p>
                  </li>
                ))}
              </ul>
              <h3 className="mt-12 font-heading text-h3 text-navy-900">What you get</h3>
              <ul className="mt-5 grid gap-5 sm:grid-cols-2">
                {service.benefits.map((benefit) => (
                  <li key={benefit.title} className="flex gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-royal-700 text-white">
                      <Check className="size-4" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-semibold text-navy-900">{benefit.title}</span>
                      <span className="mt-0.5 block text-[0.9375rem] text-ink-muted">{benefit.description}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Block>

            <Block id="process" title="Our process" intro="What happens, in order, from the inspection to the handover.">
              <ProcessSteps steps={service.process} layout="column" />
              <div className="mt-10 rounded-sm bg-concrete-100 p-5">
                <p className="font-semibold text-navy-900">Suitable for</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {service.applications.map((application) => (
                    <li key={application} className="rounded-full border border-concrete-400 bg-white px-3 py-1.5 text-sm text-ink">
                      {application}
                    </li>
                  ))}
                </ul>
              </div>
            </Block>

            {showcase ? (
              <Block id="results" title="Before and after" intro="Drag the slider to compare.">
                <figure>
                  <BeforeAfterSlider
                    before={getImage(showcase.before)}
                    after={getImage(showcase.after)}
                    label={showcase.title}
                    sizes="(min-width: 1280px) 50rem, (min-width: 1024px) 60vw, 100vw"
                  />
                  <figcaption className="mt-3 text-sm text-ink-muted">
                    <Link href={`/projects/${showcase.slug}`} className="font-semibold text-royal-700 underline underline-offset-4">
                      {showcase.title}
                    </Link>{" "}
                    — {showcase.outcome}
                  </figcaption>
                </figure>
                {serviceProjects.length > 1 ? (
                  <ul className="mt-10 grid gap-6 sm:grid-cols-2">
                    {serviceProjects.slice(1, 3).map((project) => (
                      <li key={project.slug}>
                        <ProjectCard project={project} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Block>
            ) : null}

            {showWarranty ? (
              <Block id="warranty" title="Warranty">
                <WarrantyBlock warranty={service.warranty} term={service.keyFacts.warranty} />
              </Block>
            ) : null}

            <Block id="cost" title="What affects the cost" intro="We don't publish one-size prices because the cause decides the treatment. These are the things that move the price.">
              <ul className="grid gap-3 sm:grid-cols-2">
                {service.costFactors.map((factor) => (
                  <li key={factor} className="flex gap-3 text-[0.9375rem] text-ink">
                    <Sparkles className="mt-0.5 size-5 shrink-0 text-royal-700" aria-hidden="true" />
                    {factor}
                  </li>
                ))}
              </ul>
              <div className="tone-navy mt-8 flex flex-col gap-4 rounded-sm bg-navy-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md">
                  <span className="block font-heading text-h4 text-white">Get an exact price</span>
                  <span className="mt-1 block text-sm text-white/75">{cta.quoteNote}</span>
                </p>
                <Button href={contactHref} track={{ event: "cta_click", location: `${location}-cost` }}>
                  {cta.quote}
                </Button>
              </div>
            </Block>

            <Block id="faq" title={`${service.shortName.charAt(0).toUpperCase()}${service.shortName.slice(1)} FAQs`}>
              <FAQAccordion faqs={service.faqs} />
              <p className="mt-6 text-[0.9375rem] text-ink-muted">
                More questions?{" "}
                <Link href="/faq" className="font-semibold text-royal-700 underline underline-offset-4">
                  Read all FAQs
                </Link>{" "}
                or{" "}
                <a
                  href={whatsappUrl(waText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-royal-700 underline underline-offset-4"
                >
                  ask us on WhatsApp
                </a>
                .
              </p>
            </Block>
          </div>

          <aside className="hidden lg:block" aria-label="Book this service">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-sm border border-concrete-300 bg-white p-6 shadow-card">
                <p className="font-heading text-h4 font-bold text-navy-900">{cta.contactHeading}</p>
                <p className="mt-1 text-sm text-ink-muted">{cta.callback}.</p>
                <div className="mt-5 grid gap-3">
                  <Button href={contactHref} fullWidth track={{ event: "cta_click", location: `${location}-sidebar` }}>
                    {cta.primary}
                  </Button>
                  <Button
                    href={site.contact.phone.href}
                    variant="outline"
                    fullWidth
                    icon={<Phone className="size-4" aria-hidden="true" />}
                    track={{ event: "call_click", location: `${location}-sidebar` }}
                  >
                    {site.contact.phone.display}
                  </Button>
                  <Button
                    href={whatsappUrl(waText)}
                    variant="whatsapp"
                    fullWidth
                    icon={<WhatsAppIcon className="size-4" />}
                    track={{ event: "whatsapp_click", location: `${location}-sidebar` }}
                  >
                    {cta.whatsapp}
                  </Button>
                </div>
                <ul className="mt-5 space-y-2 border-t border-concrete-300 pt-5 text-sm text-ink-muted">
                  {[
                    "Diagnosis before every quotation",
                    site.inspection.isFree ? "Free site inspection" : "Inspection before quoting",
                    "No obligation to go ahead",
                  ].map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <Check className="size-4 text-success-700" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <nav aria-label="On this page" className="rounded-sm border border-concrete-300 p-5">
                <p className="eyebrow text-royal-700">On this page</p>
                <ul className="mt-3 space-y-0.5 text-sm">
                  {sections.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="block rounded-xs px-2 py-1.5 text-ink-muted hover:bg-concrete-100 hover:text-navy-900">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
        </Container>
      </div>

      {serviceReviews.length > 0 ? (
        <TestimonialsSection
          reviews={serviceReviews}
          title={`What customers say about our ${service.shortName.toLowerCase()} work`}
          intro="Reviews from customers who had this service."
          tone="concrete"
          showSummary={false}
        />
      ) : null}

      <Section tone={serviceReviews.length > 0 ? "white" : "concrete"} labelledBy="related-title">
        <SectionHeading
          id="related-title"
          eyebrow="Related services"
          title="Often needed together"
          action={
            <Button href="/services" variant="outline" iconRight={<ArrowRight className="size-4" aria-hidden="true" />}>
              All services
            </Button>
          }
        />
        <ServicesGrid services={related} showGroup={false} compactOnMobile className="mt-10" />
      </Section>

      <Section tone={serviceReviews.length > 0 ? "concrete" : "white"} labelledBy="areas-title">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <SectionHeading
            id="areas-title"
            eyebrow="Where we work"
            title={`${service.shortName.replace(/^./, (c) => c.toUpperCase())} across ${site.market.primaryCity}`}
            intro="We offer this service in every area we cover — these are the areas where it's asked for most. Don't see yours? Ask us."
          />
          <div>
            <AreaLinks areas={serviceAreas} />
          </div>
        </div>
      </Section>

      <CTASection
        title={`Book your ${service.shortName.toLowerCase()} inspection`}
        intro={`Tell us what's happening. We'll find the cause, explain it, and give you a written quotation for the right ${service.shortName.toLowerCase()} treatment.`}
        formOptions={formOptions}
        defaultService={service.slug}
        whatsappText={waText}
        location={`${location}-cta`}
      />
    </>
  );
}
