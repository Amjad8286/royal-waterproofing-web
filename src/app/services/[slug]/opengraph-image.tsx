import { site } from "@/config/site";
import { getService, getServices } from "@/lib/content";
import { ogSize, renderOgImage } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = `${site.name} service`;

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);
  return renderOgImage({
    eyebrow: `${site.name} · ${site.market.primaryCity}`,
    title: service?.name ?? "Waterproofing services",
    subtitle: service?.summary,
  });
}
