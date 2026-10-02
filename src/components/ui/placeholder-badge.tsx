import { flags } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Marks sample content in preview mode (NEXT_PUBLIC_PREVIEW_SAMPLES=true) so
 * the owner can see what still needs replacing. Never rendered on the live
 * site, where sample content is hidden altogether.
 */
export function PlaceholderBadge({
  show = true,
  label = "Sample",
  className,
}: {
  show?: boolean;
  label?: string;
  className?: string;
}) {
  if (!flags.previewSamples || !show) return null;
  return (
    <span
      title="Placeholder content — replace before launch"
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border border-dashed border-warning-700 bg-warning-100 px-2 py-0.5",
        "align-middle text-[0.6875rem] font-semibold uppercase leading-4 tracking-wider text-navy-900",
        className,
      )}
    >
      {label}
    </span>
  );
}
