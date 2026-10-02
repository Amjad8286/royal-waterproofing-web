"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import { Expand } from "lucide-react";
import { FilterBar, type FilterOption } from "@/components/ui/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { useQueryFilters } from "@/components/ui/use-query-filters";
import { cn } from "@/lib/utils";
import { Lightbox, type LightboxItem } from "./lightbox";
import { SiteImage } from "./site-image";

export type GalleryEntry = LightboxItem & { service: string };

/** Static split preview of a before/after pair for thumbnails. */
function PairThumb({ item, eager, preload }: { item: GalleryEntry; eager?: boolean; preload?: boolean }) {
  if (!item.before || !item.after) return null;
  const sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw";
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-concrete-200">
      <SiteImage image={item.after} alt="" fill eager={eager} preload={preload} sizes={sizes} className="absolute inset-0" />
      <div className="absolute inset-0" style={{ clipPath: "inset(0 50% 0 0)" }}>
        <SiteImage image={item.before} alt="" fill eager={eager} preload={preload} sizes={sizes} className="absolute inset-0" />
      </div>
      <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-white" />
      <span className="absolute left-3 top-3 rounded-xs bg-navy-900/85 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">Before</span>
      <span className="absolute right-3 top-3 rounded-xs bg-white/95 px-2 py-1 text-xs font-bold uppercase tracking-wider text-navy-900">After</span>
    </div>
  );
}

function GalleryView({
  items,
  filters,
  service,
  onServiceChange,
  onClear,
}: {
  items: GalleryEntry[];
  filters: FilterOption[];
  service: string;
  onServiceChange?: (value: string) => void;
  onClear?: () => void;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const filtered = service ? items.filter((item) => item.service === service) : items;
  const closeViewer = useCallback(() => {
    setIndex(null);
    trigger.current?.focus();
  }, []);

  return (
    <>
      {filters.length > 0 ? (
        <>
          <FilterBar label="Service" options={filters} value={service} onChange={onServiceChange} />
          <p role="status" className="mt-6 text-sm text-ink-muted">
            Showing {filtered.length} of {items.length} images
          </p>
        </>
      ) : null}

      {filtered.length > 0 ? (
        <ul className={cn("columns-1 gap-5 sm:columns-2 lg:columns-3", filters.length > 0 && "mt-6")}>
          {filtered.map((item, i) => (
            <li key={item.id} className="mb-5 break-inside-avoid">
              <button
                type="button"
                onClick={(event) => {
                  trigger.current = event.currentTarget;
                  setIndex(i);
                }}
                className="group block w-full overflow-hidden rounded-sm border border-concrete-300 bg-white text-left transition-colors hover:border-navy-900/40"
              >
                <span className="relative block">
                  {item.kind === "pair" ? (
                    <PairThumb item={item} eager={i < 3} preload={i === 0} />
                  ) : item.image ? (
                    <SiteImage
                      image={item.image}
                      eager={i < 3}
                      preload={i === 0}
                      alt=""
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    />
                  ) : null}
                  <span className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-navy-900 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Expand className="size-4" aria-hidden="true" />
                  </span>
                </span>
                <span className="flex items-start justify-between gap-3 p-4">
                  <span className="text-[0.9375rem] font-semibold leading-snug text-navy-900">{item.caption}</span>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
                      item.kind === "pair" ? "bg-royal-100 text-royal-800" : "bg-concrete-200 text-ink-muted",
                    )}
                  >
                    {item.tag ?? (item.kind === "pair" ? "Before & after" : "In progress")}
                  </span>
                </span>
                <span className="sr-only">Open in image viewer</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="No images for this service yet"
            action={
              onClear ? (
                <Button variant="outline" onClick={onClear}>
                  Show all images
                </Button>
              ) : null
            }
          >
            Try another service, or ask us for photos of similar jobs.
          </EmptyState>
        </div>
      )}

      <Lightbox items={filtered} index={index} onClose={closeViewer} onNavigate={setIndex} />
    </>
  );
}

function GalleryWithQuery({ items, filters }: { items: GalleryEntry[]; filters: FilterOption[] }) {
  const { values, set, clear } = useQueryFilters(["service"] as const);
  return (
    <GalleryView
      items={items}
      filters={filters}
      service={values.service}
      onServiceChange={(value) => set("service", value)}
      onClear={clear}
    />
  );
}

/** Filterable gallery; the unfiltered grid renders statically before the URL is read. */
export function GalleryGrid({ items, filters }: { items: GalleryEntry[]; filters: FilterOption[] }) {
  if (filters.length === 0) return <GalleryView items={items} filters={filters} service="" />;
  return (
    <Suspense fallback={<GalleryView items={items} filters={filters} service="" />}>
      <GalleryWithQuery items={items} filters={filters} />
    </Suspense>
  );
}
