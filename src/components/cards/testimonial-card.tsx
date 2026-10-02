import { Quote } from "lucide-react";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { RatingStars } from "@/components/ui/rating-stars";
import { areaName, serviceShortName } from "@/lib/content";
import { cn, formatMonthYear } from "@/lib/utils";
import type { Review } from "@/types/content";
import { ExpandableQuote } from "./expandable-quote";

export function TestimonialCard({ review, className }: { review: Review; className?: string }) {
  return (
    <figure className={cn("flex h-full flex-col rounded-sm border border-concrete-300 bg-white p-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <RatingStars rating={review.rating} />
        <PlaceholderBadge show={review.placeholder} label="Sample review" />
      </div>
      <Quote className="mt-5 size-6 text-wave-500" aria-hidden="true" />
      <blockquote className="mt-2 flex-1 text-ink">
        <ExpandableQuote>{review.quote}</ExpandableQuote>
      </blockquote>
      <figcaption className="mt-6 border-t border-concrete-300 pt-4 text-sm">
        <span className="block font-semibold text-navy-900">{review.name}</span>
        <span className="mt-0.5 block text-ink-muted">
          {areaName(review.area)} · {serviceShortName(review.service)} ·{" "}
          <time dateTime={review.date}>{formatMonthYear(review.date)}</time>
        </span>
      </figcaption>
    </figure>
  );
}
