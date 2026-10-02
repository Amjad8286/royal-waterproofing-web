import { Phone, ScanSearch, Target } from "lucide-react";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { CTASection } from "@/components/sections/cta-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProblemsGrid } from "@/components/sections/problems-grid";
import { ServicesGrid } from "@/components/sections/services-grid";
import { Button } from "@/components/ui/button";
import { cta, inCity, site } from "@/config/site";
import { getFormOptions, getProblems, getServicesByGroup } from "@/lib/content";
import { buildMetadata, withCity, withCta } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { whatsappMessage } from "@/lib/whatsapp";

export const metadata = buildMetadata({
  title: withCity("Waterproofing Services"),
  description: withCta(
    "Terrace, bathroom, basement and external wall waterproofing in Mumbai, crack and leak repairs, plus commercial, industrial and new-build work.",
  ),
  path: "/services",
});

const groupEyebrow: Record<string, string> = { residential: "For homes", repairs: "Repairs", commercial: "For larger sites" };

function DiagnoseTile() {
  return (
    <div className="tone-navy flex h-full flex-col rounded-sm bg-navy-900 p-6 text-white">
      <span className="flex size-10 items-center justify-center rounded-sm bg-wave-300 text-navy-950">
        <ScanSearch className="size-5" aria-hidden="true" />
      </span>
      <p className="mt-4 font-heading text-h4 font-bold text-white">Not sure what&apos;s causing it?</p>
      <p className="mt-2 text-[0.9375rem] text-white/75">
        Start with a diagnosis. We trace the water before anything gets broken, then tell you which repair you actually need.
      </p>
      <Button href="/contact?service=leakage-detection-repair" className="mt-auto self-start" track={{ event: "cta_click", location: "services-diagnose-tile" }}>
        {cta.primaryShort}
      </Button>
    </div>
  );
}

export default async function ServicesPage() {
  const [groups, problems, formOptions] = await Promise.all([getServicesByGroup(), getProblems(), getFormOptions()]);

  return (
    <>
      <HeroSection
        variant="page"
        breadcrumbs={[{ name: "Services", href: "/services" }]}
        eyebrow="Services"
        title={`Waterproofing services${inCity}`}
        image="plans-tools"
        intro={`Every job starts the same way: we find where the water is getting in, then recommend the treatment that actually fixes it — for flats, housing societies and businesses across ${site.market.serviceRegion}.`}
      >
        <div id="hero-cta" className="flex flex-wrap gap-3">
          <Button href="/contact" size="lg" track={{ event: "cta_click", location: "services-hero" }}>
            {cta.primary}
          </Button>
          <Button
            href={site.contact.phone.href}
            size="lg"
            variant="outline"
            icon={<Phone className="size-5" aria-hidden="true" />}
            track={{ event: "call_click", location: "services-hero" }}
          >
            {site.contact.phone.display}
          </Button>
        </div>
      </HeroSection>

      {groups.map((group, i) => (
        <Section key={group.id} tone={i % 2 === 0 ? "white" : "concrete"} labelledBy={`group-${group.id}`}>
          <SectionHeading id={`group-${group.id}`} eyebrow={groupEyebrow[group.id]} title={group.label} intro={group.description} />
          <ServicesGrid
            services={group.services}
            showGroup={false}
            extra={group.services.length % 3 === 2 ? <DiagnoseTile /> : undefined}
            className={cn("mt-10", group.services.length === 4 && "lg:grid-cols-4")}
          />
        </Section>
      ))}

      <Section tone="concrete" labelledBy="finder-title">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div>
            <SectionHeading
              id="finder-title"
              eyebrow="Not sure what you need?"
              title="Start with what you can see"
              intro="Most people don't know what their leak is called — that's our job. Pick the symptom that matches."
            />
            <div className="mt-8 flex gap-3 rounded-sm border border-concrete-300 bg-white p-5">
              <Target className="mt-0.5 size-6 shrink-0 text-royal-700" aria-hidden="true" />
              <p className="text-[0.9375rem] text-ink-muted">
                <strong className="font-semibold text-navy-900">We diagnose first.</strong> {cta.quoteNote} If the cause turns
                out to be something we don&apos;t fix, we&apos;ll tell you.
              </p>
            </div>
          </div>
          <ProblemsGrid problems={problems} className="lg:grid-cols-2" />
        </div>
      </Section>

      <CTASection formOptions={formOptions} whatsappText={whatsappMessage()} location="services-cta" />
    </>
  );
}
