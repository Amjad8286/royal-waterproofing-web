import type { HeroSlide } from "@/types/content";

/**
 * Photos in the home hero slideshow, in order. The first one loads with the
 * page, so keep the strongest photo there; each of the others loads while the
 * one before it is on screen.
 *
 * Labels describe what each photo shows. They're licensed stock photos, never
 * presented as the company's own work — swap in your own (docs/PHOTO_SHOT_LIST.md).
 */
export const heroSlides: HeroSlide[] = [
  { label: "Mumbai monsoon", image: "home-hero", portraitImage: "home-hero-portrait" },
  { label: "Terraces & roofs", image: "hero-terrace", portraitImage: "hero-terrace-portrait" },
  { label: "Wall cracks", image: "hero-wall-crack", portraitImage: "hero-wall-crack-portrait" },
  { label: "Basements", image: "hero-basement", portraitImage: "hero-basement-portrait" },
  { label: "Coating systems", image: "hero-coatings", portraitImage: "hero-coatings-portrait" },
];
