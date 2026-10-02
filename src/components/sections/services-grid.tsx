import type { ReactNode } from "react";
import { ServiceCard } from "@/components/cards/service-card";
import { serviceGroups } from "@/content/services";
import { cn } from "@/lib/utils";
import type { Service } from "@/types/content";

const groupLabel = Object.fromEntries(serviceGroups.map((g) => [g.id, g.label.split(",")[0].split(" & ")[0]]));

export function ServicesGrid({
  services,
  showGroup = true,
  showImages = true,
  compactOnMobile = false,
  eagerCount = 0,
  extra,
  className,
}: {
  services: Service[];
  showGroup?: boolean;
  showImages?: boolean;
  /** Row layout with a small photo on phones, to keep long grids short. */
  compactOnMobile?: boolean;
  /** How many leading cards load their photo immediately (those that start on screen). */
  eagerCount?: number;
  /** Optional last tile, e.g. a call to action that fills an empty grid slot. */
  extra?: ReactNode;
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3", className)}>
      {services.map((service, i) => (
        <li key={service.slug} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 70}ms` }}>
          <ServiceCard
            service={service}
            groupLabel={showGroup ? groupLabel[service.group] : undefined}
            showImage={showImages}
            compactOnMobile={compactOnMobile}
            eager={i < eagerCount}
          />
        </li>
      ))}
      {extra ? <li data-reveal>{extra}</li> : null}
    </ul>
  );
}
