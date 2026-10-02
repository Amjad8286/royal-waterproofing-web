import { CountUp } from "@/components/ui/count-up";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { cn } from "@/lib/utils";
import type { Stat } from "@/types/content";

/** Count-up figures. Pass only real stats (getStats()); renders nothing when there are none. */
export function StatsSection({ stats, className }: { stats: Stat[]; className?: string }) {
  if (stats.length === 0) return null;
  return (
    <dl className={cn("grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-concrete-300 lg:grid-cols-4", className)}>
      {stats.map((stat) => (
        <div key={stat.id} className="flex flex-col-reverse bg-white p-6 sm:p-8">
          <dt className="mt-2 flex flex-wrap items-center gap-2 text-sm font-medium text-ink-muted">
            {stat.label}
            <PlaceholderBadge show={stat.placeholder} />
          </dt>
          <dd className="font-heading text-stat font-bold text-navy-900">
            <CountUp value={stat.value} decimals={stat.value % 1 === 0 ? 0 : 1} prefix={stat.prefix} suffix={stat.suffix} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
