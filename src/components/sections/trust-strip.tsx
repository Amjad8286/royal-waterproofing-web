import { Icon } from "@/components/ui/icon";
import { trustPoints } from "@/config/site";
import { cn } from "@/lib/utils";

/** Compact trust signals for heroes and CTA bands. Only confirmed facts — see `trustPoints` in config. */
export function TrustStrip({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <ul
      className={cn(
        "grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2",
        tone === "dark" ? "text-white/85" : "text-ink-muted",
        className,
      )}
    >
      {trustPoints.map((point) => (
        <li key={point.text} className="flex items-center gap-2.5">
          <Icon name={point.icon} className={cn("size-[1.125rem] shrink-0", tone === "dark" ? "text-wave-300" : "text-royal-700")} />
          <span>{point.text}</span>
        </li>
      ))}
    </ul>
  );
}
