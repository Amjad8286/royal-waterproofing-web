import { Section } from "@/components/layout/section";
import { GalleryGrid, type GalleryEntry } from "@/components/media/gallery-grid";
import { CTASection } from "@/components/sections/cta-section";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/hero-section";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { getImage } from "@/content/images";
import { getFormOptions, getGallery, getServices } from "@/lib/content";
import { buildMetadata, withCta } from "@/lib/seo";
import { whatsappMessage } from "@/lib/whatsapp";

export const metadata = buildMetadata({
  title: "Waterproofing Photo Gallery",
  description: withCta("Before-and-after photos from terrace, bathroom, basement, wall and roof waterproofing jobs across Mumbai."),
  path: "/gallery",
});

export default async function GalleryPage() {
  const [gallery, services, formOptions] = await Promise.all([getGallery(), getServices(), getFormOptions()]);
  // The gallery only exists once there are photos of real jobs.
  if (gallery.length === 0) notFound();

  const items: GalleryEntry[] = gallery.map((item) => ({
    id: item.id,
    kind: item.kind,
    caption: item.caption,
    service: item.service,
    tag: item.tag,
    href: item.project ? `/projects/${item.project}` : undefined,
    image: item.image ? getImage(item.image) : undefined,
    before: item.before ? getImage(item.before) : undefined,
    after: item.after ? getImage(item.after) : undefined,
  }));
  const filters = services
    .map((service) => ({
      value: service.slug,
      label: service.shortName.charAt(0).toUpperCase() + service.shortName.slice(1),
      count: gallery.filter((g) => g.service === service.slug).length,
    }))
    .filter((option) => option.count > 0);

  return (
    <>
      <HeroSection
        variant="page"
        breadcrumbs={[{ name: "Gallery", href: "/gallery" }]}
        eyebrow="Gallery"
        title="Photo gallery"
        intro="Before-and-after comparisons from finished jobs. Select any image to view it larger and compare."
      >
        <PlaceholderBadge label="Sample illustrations — replace with photos of your own jobs" />
      </HeroSection>

      <Section spacing="tight" labelledBy="gallery-title">
        <h2 id="gallery-title" className="sr-only">
          Images
        </h2>
        <GalleryGrid items={items} filters={filters} />
      </Section>

      <CTASection formOptions={formOptions} whatsappText={whatsappMessage()} location="gallery-cta" />
    </>
  );
}
