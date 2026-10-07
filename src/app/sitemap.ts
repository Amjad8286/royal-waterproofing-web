import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import pageDates from "@/content/generated/page-dates.json";
import { getImage } from "@/content/images";
import { getAreas, getAvailability, getGallery, getHeroSlides, getProjects, getServices } from "@/lib/content";

/** When each page's content last changed, kept by `npm run sitemap:dates` (scripts/page-dates.mjs). */
const dates: Record<string, { lastModified: string } | undefined> = pageDates;

const url = (path: string) => `${site.url}${path}`;

/** The company's own photos: no sample illustrations, stock photos or third-party artwork such as client logos. */
function ownPhotos(ids: (string | undefined)[]) {
  const photos = ids
    .filter((id): id is string => id !== undefined)
    .map(getImage)
    .filter((image) => !image.placeholder && !image.credit && !image.source);
  return [...new Set(photos.map((image) => url(image.src)))];
}

/** A sitemap entry: the page's lastmod when it's on record, and its own photos for image search. */
function entry(path: string, photoIds: (string | undefined)[] = []): MetadataRoute.Sitemap[number] {
  const lastModified = dates[path]?.lastModified;
  const images = ownPhotos(photoIds);
  return { url: url(path), ...(lastModified ? { lastModified } : {}), ...(images.length ? { images } : {}) };
}

/**
 * Every indexable page, built from content, so new services, projects and areas
 * are included automatically and pages without real content are left out.
 *
 * - lastmod is the day a page's content last changed, never the build time:
 *   search engines ignore dates that change on every deploy.
 * - No changefreq or priority, which Google and Bing both ignore.
 * - Image entries list the company's own photos; stock photos and samples
 *   don't belong in image search under this site.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects, areas, gallery, heroSlides, available] = await Promise.all([
    getServices(),
    getProjects(),
    getAreas(),
    getGallery(),
    getHeroSlides(),
    getAvailability(),
  ]);

  return [
    entry("/", heroSlides.map((slide) => slide.image)),
    entry("/services"),
    entry("/contact"),
    entry("/projects"),
    entry("/service-areas"),
    ...(available.reviews ? [entry("/reviews")] : []),
    ...(available.gallery ? [entry("/gallery", gallery.flatMap((item) => [item.image, item.before, item.after]))] : []),
    entry("/about"),
    entry("/faq"),
    entry("/privacy-policy"),
    entry("/terms"),
    ...services.map((service) => entry(`/services/${service.slug}`, [service.image])),
    ...areas.map((area) => entry(`/service-areas/${area.slug}`)),
    ...projects.map((project) => entry(`/projects/${project.slug}`, [project.cover, project.before, project.after, ...project.gallery])),
  ];
}
