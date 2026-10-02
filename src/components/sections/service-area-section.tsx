import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import { Section, type SectionTone } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { cta, site } from "@/config/site";
import { cn } from "@/lib/utils";
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp";
import type { Area } from "@/types/content";

export function AreaLinks({ areas, showZone = true, className }: { areas: Area[]; showZone?: boolean; className?: string }) {
  return (
    <ul className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {areas.map((area) => (
        <li key={area.slug}>
          <Link
            href={`/service-areas/${area.slug}`}
            className="group flex min-h-16 items-center gap-4 rounded-sm border border-concrete-300 bg-white px-4 py-3 transition-colors hover:border-royal-700"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-royal-50 text-royal-700">
              <MapPin className="size-5" aria-hidden="true" />
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-navy-900">{area.name}</span>
              {showZone ? <span className="block text-sm text-ink-subtle">{area.zone}</span> : null}
            </span>
            <ArrowRight className="size-4 text-royal-700 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ServiceAreaSection({
  areas,
  tone = "concrete",
  title = `Waterproofing across ${site.market.primaryCity}`,
}: {
  areas: Area[];
  tone?: SectionTone;
  title?: string;
}) {
  return (
    <Section tone={tone} labelledBy="areas-title">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <SectionHeading
            id="areas-title"
            eyebrow="Service areas"
            title={title}
            intro={`We work across ${site.market.serviceRegion}. Pick your area to see the problems we come across most often there.`}
          />
          <div className="mt-8 rounded-sm border border-dashed border-concrete-400 p-5">
            <p className="flex items-center gap-2 font-semibold text-navy-900">
              <MessageCircle className="size-5 text-royal-700" aria-hidden="true" />
              Don&apos;t see your area?
            </p>
            <p className="mt-1 text-[0.9375rem] text-ink-muted">Ask us — larger jobs can often be arranged further afield.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button href="/contact" size="sm" track={{ event: "cta_click", location: "areas-section" }}>
                {cta.primaryShort}
              </Button>
              <Button href={whatsappUrl(whatsappMessage())} size="sm" variant="outline" track={{ event: "whatsapp_click", location: "areas-section" }}>
                Ask on WhatsApp
              </Button>
            </div>
          </div>
        </div>
        <div>
          <AreaLinks areas={areas} />
          <Link href="/service-areas" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-royal-700 underline-offset-4 hover:underline">
            All service areas <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
