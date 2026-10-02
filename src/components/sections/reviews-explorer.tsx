"use client";

import { Suspense, type ReactNode } from "react";
import { FilterBar, type FilterOption } from "@/components/ui/filter-bar";
import { useQueryFilters } from "@/components/ui/use-query-filters";

export interface ReviewItem {
  key: string;
  service: string;
  node: ReactNode;
}

function ReviewsView({
  items,
  options,
  service,
  onChange,
}: {
  items: ReviewItem[];
  options: FilterOption[];
  service: string;
  onChange?: (value: string) => void;
}) {
  const filtered = service ? items.filter((item) => item.service === service) : items;
  return (
    <>
      <FilterBar label="Service" options={options} value={service} onChange={onChange} />
      <p role="status" className="mt-6 text-sm text-ink-muted">
        Showing {filtered.length} of {items.length} reviews
      </p>
      <ul className="mt-6 columns-1 gap-6 md:columns-2 lg:columns-3">
        {filtered.map((item) => (
          <li key={item.key} className="mb-6 break-inside-avoid">
            {item.node}
          </li>
        ))}
      </ul>
    </>
  );
}

function ReviewsWithQuery({ items, options }: { items: ReviewItem[]; options: FilterOption[] }) {
  const { values, set } = useQueryFilters(["service"] as const);
  return <ReviewsView items={items} options={options} service={values.service} onChange={(v) => set("service", v)} />;
}

export function ReviewsExplorer({ items, options }: { items: ReviewItem[]; options: FilterOption[] }) {
  return (
    <Suspense fallback={<ReviewsView items={items} options={options} service="" />}>
      <ReviewsWithQuery items={items} options={options} />
    </Suspense>
  );
}
