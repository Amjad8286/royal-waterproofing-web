import { ExternalLink } from "lucide-react";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { RatingStars } from "@/components/ui/rating-stars";
import { links, site } from "@/config/site";
import { isShown } from "@/lib/samples";
import { cn } from "@/lib/utils";

/** Google rating card. Renders nothing until the rating is real (or in preview mode). */
export function RatingSummary({ className }: { className?: string }) {
  if (!isShown(site.rating)) return null;
  const { average, count, source, placeholder } = site.rating;
  return (
    <div className={cn("tone-navy rounded-sm bg-navy-900 p-6 text-white sm:p-8", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow text-wave-300">Customer rating</p>
        <PlaceholderBadge show={placeholder} />
      </div>
      <p className="mt-4 flex items-end gap-3">
        <span className="font-heading text-stat font-bold text-white">{average}</span>
        <span className="pb-2 text-white/70">out of 5</span>
      </p>
      <RatingStars rating={average} size="size-5" className="mt-2" />
      <p className="mt-3 text-sm text-white/75">
        Average from {count} {source} reviews.
      </p>
      <div className="mt-6 flex flex-col gap-2 border-t border-white/15 pt-5 text-sm font-semibold">
        <a
          href={links.googleProfile}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white hover:text-wave-300"
        >
          Read our reviews on Google <ExternalLink className="size-4" aria-hidden="true" />
        </a>
        <a
          href={links.googleReview}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-wave-300 hover:text-white"
        >
          Leave us a review <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
