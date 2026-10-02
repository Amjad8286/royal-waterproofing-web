import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteImage } from "@/components/media/site-image";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { Service } from "@/types/content";

/** Whole card is clickable via a stretched link on the title (one link per card for screen readers). */
export function ServiceCard({
  service,
  groupLabel,
  showImage = true,
  compactOnMobile = false,
  eager = false,
  className,
}: {
  service: Service;
  groupLabel?: string;
  showImage?: boolean;
  /** Below 640px, lay the card out as a row with a small photo, to keep long grids short on phones. */
  compactOnMobile?: boolean;
  /** Load the photo immediately (cards that start on screen). */
  eager?: boolean;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex h-full overflow-hidden rounded-sm border border-concrete-300 bg-white transition-[border-color,box-shadow] duration-200 hover:border-navy-900/40 hover:shadow-lift",
        "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-royal-700",
        compactOnMobile ? "flex-row sm:flex-col" : "flex-col",
        className,
      )}
    >
      {showImage ? (
        <SiteImage
          image={service.image}
          alt=""
          fill
          eager={eager}
          sizes={compactOnMobile ? "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 7rem" : "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"}
          className={cn(
            "bg-concrete-200",
            compactOnMobile ? "w-28 shrink-0 self-stretch sm:aspect-[16/10] sm:w-auto sm:self-auto" : "aspect-[16/10]",
          )}
          imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      ) : null}
      <div className={cn("flex min-w-0 flex-1 flex-col", compactOnMobile ? "p-4 sm:p-6" : "p-6")}>
        <div className={cn("items-center justify-between gap-3", compactOnMobile ? "hidden sm:flex" : "flex")}>
          <span className="flex size-10 items-center justify-center rounded-sm bg-royal-50 text-royal-700">
            <Icon name={service.icon} className="size-5" />
          </span>
          {groupLabel ? <Badge tone="outline">{groupLabel}</Badge> : null}
        </div>
        <h3 className={cn("font-heading text-h4 text-navy-900", compactOnMobile ? "sm:mt-4" : "mt-4")}>
          <Link href={`/services/${service.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {service.name}
          </Link>
        </h3>
        <p className={cn("mt-2 text-[0.9375rem] text-ink-muted", compactOnMobile && "line-clamp-2 sm:line-clamp-none")}>
          {service.summary}
        </p>
        <span
          aria-hidden="true"
          className={cn("mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-royal-700", compactOnMobile ? "pt-3 sm:pt-5" : "pt-5")}
        >
          Learn more
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
