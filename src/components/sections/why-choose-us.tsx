import { ClipboardCheck } from "lucide-react";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { SiteImage } from "@/components/media/site-image";
import { Icon } from "@/components/ui/icon";
import { differentiators, site } from "@/config/site";

export function WhyChooseUs({ tone = "white" }: { tone?: "white" | "concrete" }) {
  return (
    <Section tone={tone} labelledBy="why-title">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="relative self-start lg:sticky lg:top-28">
          <SiteImage
            image="site-plans"
            fill
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="aspect-[4/3] rounded-sm"
          />
          <div className="tone-navy absolute -bottom-6 left-4 right-4 flex items-start gap-3 rounded-sm bg-navy-900 p-5 text-white shadow-float sm:left-auto sm:max-w-xs">
            <ClipboardCheck className="mt-0.5 size-6 shrink-0 text-wave-300" aria-hidden="true" />
            <div>
              <p className="font-heading text-h4 text-white">
                {site.inspection.isFree ? "Free site inspection" : "Inspection before any quotation"}
              </p>
              <p className="mt-1 text-sm text-white/75">We visit, find the cause and explain it before you decide anything.</p>
            </div>
          </div>
        </div>
        <div className="pt-6 lg:pt-0">
          <SectionHeading
            id="why-title"
            eyebrow="Why Royal Waterproofing"
            title="Built on diagnosis, not guesswork"
            intro="Most leaks come back because the repair treated the symptom. Here's how we make sure ours don't."
          />
          <ol className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {differentiators.map((item, i) => (
              <li key={item.title} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 2) * 80}ms` }}>
                <div className="flex items-center gap-3">
                  <span className="font-heading text-[1.75rem] font-bold leading-none text-navy-900/25" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex size-9 items-center justify-center rounded-sm bg-royal-50 text-royal-700">
                    <Icon name={item.icon} className="size-5" />
                  </span>
                </div>
                <h3 className="mt-3 font-heading text-h4 text-navy-900">{item.title}</h3>
                <p className="mt-1.5 text-[0.9375rem] text-ink-muted">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
