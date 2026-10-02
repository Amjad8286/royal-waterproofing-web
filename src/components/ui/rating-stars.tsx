import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({ rating, className, size = "size-4" }: { rating: number; className?: string; size?: string }) {
  const filled = Math.round(rating);
  return (
    <span role="img" aria-label={`Rated ${rating} out of 5`} className={cn("inline-flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(size, i <= filled ? "fill-wave-500 text-wave-500" : "fill-concrete-300 text-concrete-300")}
        />
      ))}
    </span>
  );
}
