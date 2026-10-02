"use client";

import { Suspense, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar, type FilterOption } from "@/components/ui/filter-bar";
import { useQueryFilters } from "@/components/ui/use-query-filters";

/** Cards are rendered on the server and passed in, so content stays out of the client bundle. */
export interface ExplorerItem {
  key: string;
  services: string[];
  propertyType: string;
  node: ReactNode;
}

function ProjectsView({
  items,
  serviceOptions,
  typeOptions,
  service,
  type,
  onChange,
  onClear,
}: {
  items: ExplorerItem[];
  serviceOptions: FilterOption[];
  typeOptions: FilterOption[];
  service: string;
  type: string;
  onChange?: (key: "service" | "type", value: string) => void;
  onClear?: () => void;
}) {
  const filtered = items.filter(
    (item) => (!service || item.services.includes(service)) && (!type || item.propertyType === type),
  );
  const filtering = Boolean(service || type);

  return (
    <>
      <div className="grid gap-4 border-b border-concrete-300 pb-6 sm:gap-3">
        <FilterBar label="Service" options={serviceOptions} value={service} onChange={(v) => onChange?.("service", v)} />
        <FilterBar label="Property" options={typeOptions} value={type} onChange={(v) => onChange?.("type", v)} />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p role="status" className="text-sm text-ink-muted">
          Showing {filtered.length} of {items.length} projects
        </p>
        {filtering && onClear ? (
          <button type="button" onClick={onClear} className="text-sm font-semibold text-royal-700 underline-offset-4 hover:underline">
            Clear filters
          </button>
        ) : null}
      </div>
      {filtered.length > 0 ? (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <li key={item.key}>{item.node}</li>
          ))}
        </ul>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="No projects match those filters"
            action={
              onClear ? (
                <Button variant="outline" onClick={onClear}>
                  Clear filters
                </Button>
              ) : null
            }
          >
            We may still have done exactly this job — ask us and we&apos;ll share examples.
          </EmptyState>
        </div>
      )}
    </>
  );
}

function ProjectsWithQuery(props: { items: ExplorerItem[]; serviceOptions: FilterOption[]; typeOptions: FilterOption[] }) {
  const { values, set, clear } = useQueryFilters(["service", "type"] as const);
  return <ProjectsView {...props} service={values.service} type={values.type} onChange={set} onClear={clear} />;
}

export function ProjectsExplorer(props: { items: ExplorerItem[]; serviceOptions: FilterOption[]; typeOptions: FilterOption[] }) {
  return (
    <Suspense fallback={<ProjectsView {...props} service="" type="" />}>
      <ProjectsWithQuery {...props} />
    </Suspense>
  );
}
