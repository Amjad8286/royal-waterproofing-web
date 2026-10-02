import { ArrowRight, CalendarCheck } from "lucide-react";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { SiteImage } from "@/components/media/site-image";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cta, site } from "@/config/site";
import type { IconName } from "@/types/content";

/** General facts about Mumbai's climate and buildings — no claims about the company. */
const conditions: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "cloud-rain",
    title: "Four months of heavy rain",
    text: "Mumbai typically gets more than 2,000 mm of rain between June and September, often in short, heavy bursts. Every weak joint on a terrace or wall gets tested.",
  },
  {
    icon: "wind",
    title: "Wind-driven rain",
    text: "On high-rises and sea-facing walls, rain is pushed sideways into hairline cracks and window joints. Paint alone can't keep it out.",
  },
  {
    icon: "sun",
    title: "Sun, then rain",
    text: "Months of heat before the monsoon make terraces expand and contract. That movement is what cracks screeds and old brickbat coba.",
  },
  {
    icon: "waves",
    title: "Salt air near the sea",
    text: "Along the coast, salty air breaks down paint, sealants and exposed steel faster, so materials have to be chosen for it.",
  },
];

export function MumbaiSection({ location }: { location: string }) {
  return (
    <Section tone="navy" labelledBy="mumbai-title">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
        <div className="relative pb-6 lg:pb-0">
          <SiteImage
            image="mumbai-society"
            fill
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="aspect-[4/3] rounded-sm lg:aspect-[4/5]"
            imgClassName="object-[45%_50%]"
          />
          <div className="absolute -bottom-0 left-4 right-4 flex items-start gap-3 rounded-sm bg-white p-5 text-ink shadow-float sm:left-auto sm:right-4 sm:max-w-xs lg:-bottom-6 lg:-right-6">
            <CalendarCheck className="mt-0.5 size-6 shrink-0 text-royal-700" aria-hidden="true" />
            <div>
              <p className="font-heading text-h4 text-navy-900">Best time to waterproof</p>
              <p className="mt-1 text-sm text-ink-muted">October to May, while surfaces are dry — before the next monsoon arrives.</p>
            </div>
          </div>
        </div>
        <div>
          <SectionHeading
            id="mumbai-title"
            tone="dark"
            eyebrow={`Built for ${site.market.primaryCity}`}
            title="Waterproofing that has to survive the monsoon"
            intro={`${site.market.primaryCity} is hard on buildings. We choose each system for the conditions it will actually face.`}
          />
          <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {conditions.map((item, i) => (
              <li key={item.title} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 2) * 80}ms` }}>
                <span className="flex size-11 items-center justify-center rounded-sm bg-navy-800 text-wave-300 ring-1 ring-white/10">
                  <Icon name={item.icon} className="size-5" />
                </span>
                <h3 className="mt-4 font-heading text-h4 text-white">{item.title}</h3>
                <p className="mt-1.5 text-[0.9375rem] text-white/75">{item.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/contact" size="lg" track={{ event: "cta_click", location }}>
              {cta.primary}
            </Button>
            <Button
              href="/service-areas"
              size="lg"
              variant="outline-light"
              iconRight={<ArrowRight className="size-5" aria-hidden="true" />}
            >
              Areas we cover
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
