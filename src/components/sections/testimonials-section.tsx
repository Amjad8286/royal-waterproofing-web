import { ArrowRight } from "lucide-react";
import { TestimonialCard } from "@/components/cards/testimonial-card";
import { Section, type SectionTone } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import type { Review } from "@/types/content";
import { RatingSummary } from "./rating-summary";

/** Rating summary + review cards. Hidden entirely when there are no reviews. */
export function TestimonialsSection({
  reviews,
  title = "What customers say",
  intro = "Reviews from flat owners, housing societies and businesses we've worked with.",
  tone = "white",
  showSummary = true,
}: {
  reviews: Review[];
  title?: string;
  intro?: string;
  tone?: SectionTone;
  showSummary?: boolean;
}) {
  if (reviews.length === 0) return null;
  return (
    <Section tone={tone} labelledBy="reviews-title">
      <SectionHeading
        id="reviews-title"
        eyebrow="Reviews"
        title={title}
        intro={intro}
        action={
          <Button href="/reviews" variant="outline" iconRight={<ArrowRight className="size-4" aria-hidden="true" />}>
            All reviews
          </Button>
        }
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-4">
        {showSummary ? <RatingSummary className="lg:col-span-1" /> : null}
        <ul className={showSummary ? "grid gap-6 md:grid-cols-3 lg:col-span-3" : "grid gap-6 md:grid-cols-3 lg:col-span-4"}>
          {reviews.slice(0, 3).map((review, i) => (
            <li key={review.id} data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }} className={i === 2 ? "hidden md:block" : undefined}>
              <TestimonialCard review={review} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
