import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { SiteImage } from "@/components/media/site-image";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { serviceShortName } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Sector } from "@/types/content";

/** Compact icon tiles (home page), each linking to its section on the Projects page. */
export function SectorTiles({ sectors, className }: { sectors: Sector[]; className?: string }) {
  return (
    <ul className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {sectors.map((sector, i) => (
        <li key={sector.id} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 60}ms` }}>
          <Link
            href={`/projects#${sector.id}`}
            className="group flex h-full items-start gap-4 rounded-sm border border-concrete-300 bg-white p-5 transition-colors duration-200 hover:border-royal-700"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-navy-900 text-wave-300">
              <Icon name={sector.icon} className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2 font-heading text-h4 text-navy-900">
                {sector.title}
                <ArrowRight
                  className="size-4 shrink-0 text-royal-700 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
              <span className="mt-1 block text-[0.9375rem] text-ink-muted">{sector.summary}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Full sector cards (Projects page): photo, what the work involves and the related services. */
export function SectorCards({ sectors, className }: { sectors: Sector[]; className?: string }) {
  return (
    <ul className={cn("grid gap-8 md:grid-cols-2", className)}>
      {sectors.map((sector) => (
        <li key={sector.id} id={sector.id} className="scroll-mt-28">
          <article className="flex h-full flex-col overflow-hidden rounded-sm border border-concrete-300 bg-white">
            <SiteImage
              image={sector.image}
              alt=""
              fill
              sizes="(min-width: 1280px) 38rem, (min-width: 768px) 48vw, 100vw"
              className="aspect-[16/9] bg-concrete-200"
            />
            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-sm bg-navy-900 text-wave-300">
                  <Icon name={sector.icon} className="size-5" />
                </span>
                <h3 className="font-heading text-h3 text-navy-900">{sector.title}</h3>
              </div>
              <p className="mt-4 text-ink-muted">{sector.description}</p>
              <p className="mt-6 text-xs font-bold uppercase tracking-wider text-ink-subtle">Typical work</p>
              <ul className="mt-3 grid gap-2.5">
                {sector.scope.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[0.9375rem] text-ink">
                    <Check className="mt-0.5 size-4 shrink-0 text-success-700" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-7">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-subtle">Related services</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {sector.services.map((slug) => (
                    <li key={slug}>
                      <Link
                        href={`/services/${slug}`}
                        className="inline-flex min-h-10 items-center rounded-full border border-concrete-400 px-3.5 text-sm font-medium text-navy-900 hover:border-navy-600"
                      >
                        {serviceShortName(slug).replace(/^./, (c) => c.toUpperCase())}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Button
                  href={`/contact?service=${sector.services[0]}`}
                  variant="outline"
                  className="mt-6"
                  iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
                  track={{ event: "cta_click", location: `projects-sector-${sector.id}` }}
                >
                  Discuss your building
                </Button>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
