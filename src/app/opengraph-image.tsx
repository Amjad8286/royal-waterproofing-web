import { site } from "@/config/site";
import { ogSize, renderOgImage } from "@/lib/og";

export const alt = `${site.name} — ${site.tagline}`;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage({
    eyebrow: `Waterproofing & leakage repair · ${site.market.primaryCity}`,
    title: "Waterproofing that fixes the cause, not just the stain",
    subtitle: "Terraces, bathrooms, external walls and basements — diagnosed first, fixed properly.",
  });
}
