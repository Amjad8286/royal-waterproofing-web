import { CircleCheck, CircleX, ShieldCheck } from "lucide-react";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { isShown } from "@/lib/samples";
import type { Fact, Warranty } from "@/types/content";

export function WarrantyBlock({ warranty, term }: { warranty: Warranty; term?: Fact }) {
  return (
    <div className="overflow-hidden rounded-sm border border-concrete-300">
      <div className="tone-navy flex flex-wrap items-center gap-4 bg-navy-900 p-6 text-white">
        <span className="flex size-12 items-center justify-center rounded-sm bg-wave-300 text-navy-950">
          <ShieldCheck className="size-6" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <p className="font-heading text-h4 text-white">Written warranty</p>
          {term && isShown(term) ? (
            <p className="mt-0.5 text-sm text-white/75">
              {term.value} <PlaceholderBadge show={term.placeholder} />
            </p>
          ) : null}
        </div>
        <PlaceholderBadge show={warranty.placeholder} label="Sample terms" />
      </div>
      <div className="bg-white p-6">
        <p className="text-ink">{warranty.summary}</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <p className="font-semibold text-navy-900">Covered</p>
            <ul className="mt-3 space-y-2.5">
              {warranty.covered.map((item) => (
                <li key={item} className="flex gap-2.5 text-[0.9375rem] text-ink-muted">
                  <CircleCheck className="mt-0.5 size-5 shrink-0 text-success-700" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-navy-900">Not covered</p>
            <ul className="mt-3 space-y-2.5">
              {warranty.notCovered.map((item) => (
                <li key={item} className="flex gap-2.5 text-[0.9375rem] text-ink-muted">
                  <CircleX className="mt-0.5 size-5 shrink-0 text-ink-subtle" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
