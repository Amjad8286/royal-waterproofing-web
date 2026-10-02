import { Clock } from "lucide-react";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { isShown } from "@/lib/samples";
import { cn } from "@/lib/utils";
import type { Fact, TitledText } from "@/types/content";

type Step = TitledText & { timing?: Fact };

/**
 * Numbered steps. Horizontal with a connecting rule on large screens when
 * `layout="row"`; always a vertical timeline on phones.
 */
export function ProcessSteps({ steps, layout = "row", className }: { steps: Step[]; layout?: "row" | "column"; className?: string }) {
  const row = layout === "row";
  return (
    <ol className={cn("relative grid gap-8", row && "lg:grid-cols-5 lg:gap-6", className)}>
      {row ? (
        <span aria-hidden="true" className="absolute left-[10%] right-[10%] top-6 hidden h-px bg-concrete-400 lg:block" />
      ) : null}
      {steps.map((step, i) => (
        <li
          key={step.title}
          data-reveal
          style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
          className={cn("relative flex gap-5", row && "lg:flex-col lg:gap-0")}
        >
          {!row || i < steps.length - 1 ? (
            <span
              aria-hidden="true"
              className={cn("absolute left-6 top-14 -bottom-8 w-px bg-concrete-400", row && "lg:hidden", i === steps.length - 1 && "hidden")}
            />
          ) : null}
          <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-sm bg-navy-900 font-heading text-xl font-bold text-white ring-8 ring-[var(--section-bg,var(--color-white))]">
            {i + 1}
          </span>
          <div className={cn(row && "lg:mt-5")}>
            <h3 className="font-heading text-h4 text-navy-900">{step.title}</h3>
            <p className="mt-1.5 text-[0.9375rem] text-ink-muted">{step.description}</p>
            {step.timing && isShown(step.timing) ? (
              <p className="mt-3 inline-flex flex-wrap items-center gap-2 text-sm font-medium text-navy-900">
                <span className="inline-flex items-center gap-1.5 rounded-xs bg-concrete-100 px-2 py-1">
                  <Clock className="size-3.5 text-royal-700" aria-hidden="true" />
                  {step.timing.value}
                </span>
                <PlaceholderBadge show={step.timing.placeholder} />
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
