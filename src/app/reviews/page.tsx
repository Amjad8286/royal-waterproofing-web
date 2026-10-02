import { ExternalLink } from "lucide-react";
import { TestimonialCard } from "@/components/cards/testimonial-card";
import { Section } from "@/components/layout/section";
import { CTASection } from "@/components/sections/cta-section";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/hero-section";
import { RatingSummary } from "@/components/sections/rating-summary";
import { ReviewsExplorer } from "@/components/sections/reviews-explorer";
import { Button } from "@/components/ui/button";
import { links } from "@/config/site";
import { getFormOptions, getReviews, getServices } from "@/lib/content";
import { buildMetadata, withCta } from "@/lib/seo";
import { whatsappMessage } from "@/lib/whatsapp";

export const metadata = buildMetadata({
  title: "Customer Reviews",
  description: withCta("What flat owners, housing societies and businesses say about our waterproofing, leakage repair and damp treatment work."),
  path: "/reviews",
});

export default async function ReviewsPage() {
  const [reviews, services, formOptions] = await Promise.all([getReviews(), getServices(), getFormOptions()]);
  // Only real, verifiable reviews are published; the page appears once there are some.
  if (reviews.length === 0) notFound();
  const items = reviews.map((review) => ({ key: review.id, service: review.service, node: <TestimonialCard review={review} /> }));
  const options = services
    .map((service) => ({
      value: service.slug,
      label: service.shortName.charAt(0).toUpperCase() + service.shortName.slice(1),
      count: reviews.filter((r) => r.service === service.slug).length,
    }))
    .filter((option) => option.count > 0);

  return (
    <>
      <HeroSection
        variant="page"
        breadcrumbs={[{ name: "Reviews", href: "/reviews" }]}
        eyebrow="Reviews"
        title="Customer reviews"
        intro="Each review shows the area and the service, so you can find feedback on jobs like yours."
      >
        <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-center">
          <RatingSummary />
          <div className="max-w-md">
            <p className="text-ink-muted">
              Worked with us? A short review helps other people find a contractor they can trust.
            </p>
            <Button
              href={links.googleReview}
              variant="outline"
              className="mt-4"
              iconRight={<ExternalLink className="size-4" aria-hidden="true" />}
            >
              Leave a Google review
            </Button>
          </div>
        </div>
      </HeroSection>

      <Section spacing="tight" labelledBy="reviews-list-title">
        <h2 id="reviews-list-title" className="sr-only">
          All reviews
        </h2>
        <ReviewsExplorer items={items} options={options} />
      </Section>

      <CTASection
        title="Join them — book an inspection"
        formOptions={formOptions}
        whatsappText={whatsappMessage()}
        location="reviews-cta"
      />
    </>
  );
}
