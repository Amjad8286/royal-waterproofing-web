import { MessageCircle } from "lucide-react";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { ZoneMap } from "@/components/media/zone-map";
import { CTASection } from "@/components/sections/cta-section";
import { HeroSection } from "@/components/sections/hero-section";
import { AreaLinks } from "@/components/sections/service-area-section";
import { Button } from "@/components/ui/button";
import { cta, site } from "@/config/site";
import { getAreas, getFormOptions } from "@/lib/content";
import { buildMetadata, withCity, withCta } from "@/lib/seo";
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp";

export const metadata = buildMetadata({
  title: withCity("Areas We Serve"),
  description: withCta(`The areas we cover across ${site.market.serviceRegion}, with the waterproofing problems we come across most often in each one.`),
  path: "/service-areas",
});

export default async function ServiceAreasPage() {
  const [areas, formOptions] = await Promise.all([getAreas(), getFormOptions()]);
  const zones = Array.from(new Set(areas.map((area) => area.zone))).map((zone) => ({
    name: zone,
    areas: areas.filter((area) => area.zone === zone),
  }));

  return (
    <>
      <HeroSection
        variant="page"
        breadcrumbs={[{ name: "Service areas", href: "/service-areas" }]}
        eyebrow="Service areas"
        title={`Waterproofing across ${site.market.serviceRegion}`}
        intro={`From our office in ${site.contact.address.locality} we cover ${site.market.serviceRegion}. Pick your area to see the problems we come across most often there.`}
      />

      <Section labelledBy="areas-list-title">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
          <div>
            <SectionHeading id="areas-list-title" eyebrow={`${areas.length} areas · ${zones.length} zones`} title="Choose your area" />
            <div className="mt-8 space-y-8">
              {zones.map((zone) => (
                <section key={zone.name} aria-labelledby={`zone-${zone.name.replace(/\W+/g, "-").toLowerCase()}`}>
                  <h3
                    id={`zone-${zone.name.replace(/\W+/g, "-").toLowerCase()}`}
                    className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-subtle"
                  >
                    {zone.name}
                  </h3>
                  <AreaLinks areas={zone.areas} showZone={false} />
                </section>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-4 rounded-sm border border-dashed border-concrete-400 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-2 text-[0.9375rem] text-ink-muted">
                <MessageCircle className="mt-0.5 size-5 shrink-0 text-royal-700" aria-hidden="true" />
                <span>
                  <strong className="font-semibold text-navy-900">Not listed?</strong> Ask us — larger jobs can often be arranged further afield.
                </span>
              </p>
              <Button href={whatsappUrl(whatsappMessage())} variant="outline" size="sm" className="shrink-0" track={{ event: "whatsapp_click", location: "areas-index" }}>
                Ask on WhatsApp
              </Button>
            </div>
          </div>
          <figure className="self-start rounded-sm border border-concrete-300 bg-white p-4 lg:sticky lg:top-28">
            <ZoneMap className="mx-auto max-w-sm" />
            <figcaption className="mt-3 text-sm text-ink-subtle">
              Schematic of the areas we cover (not to scale). Our office is in {site.contact.address.locality}.
            </figcaption>
          </figure>
        </div>
      </Section>

      <CTASection
        title={`${cta.contactHeading.replace(/^./, (c) => c.toUpperCase())} near you`}
        intro={`Choose your area in the form and we'll arrange a visit. ${cta.quoteNote}`}
        formOptions={formOptions}
        whatsappText={whatsappMessage()}
        location="areas-cta"
      />
    </>
  );
}
