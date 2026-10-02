import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { serviceShortName } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Problem } from "@/types/content";

/** Symptom tiles → the service that fixes them. */
export function ProblemsGrid({ problems, className }: { problems: Problem[]; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4", className)}>
      {problems.map((problem, i) => {
        const primary = problem.services[0];
        return (
          <li key={problem.slug} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 4) * 60}ms` }}>
            <Link
              href={`/services/${primary}`}
              className="group flex h-full flex-col rounded-sm border border-concrete-300 bg-white p-4 sm:p-5 transition-colors duration-200 hover:border-royal-700 hover:bg-royal-50/40"
            >
              <span className="flex size-11 items-center justify-center rounded-sm bg-navy-900 text-wave-300">
                <Icon name={problem.icon} className="size-5" />
              </span>
              <span className="mt-4 font-heading text-[1.125rem] font-bold leading-tight text-navy-900 sm:text-[1.3125rem]">{problem.title}</span>
              <span className="mt-1.5 hidden text-[0.9375rem] leading-snug text-ink-muted sm:block">{problem.description}</span>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-royal-700">
                {serviceShortName(primary)}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
