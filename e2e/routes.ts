import { areas } from "../src/content/areas";
import { gallery } from "../src/content/gallery";
import { images } from "../src/content/images";
import { projects } from "../src/content/projects";
import { reviews } from "../src/content/reviews";
import { services } from "../src/content/services";

/** On the live site, sample content (placeholder: true) is hidden. */
const real = <T extends { placeholder?: boolean }>(items: T[]) => items.filter((item) => !item.placeholder);

const hasReviews = real(reviews).length > 0;
const hasGallery = gallery.some((item) =>
  [item.image, item.before, item.after].filter((id): id is string => Boolean(id)).every((id) => !images[id].placeholder),
);

export const staticRoutes = [
  "/",
  "/services",
  "/projects",
  "/service-areas",
  "/about",
  "/faq",
  "/contact",
  "/thank-you",
  "/privacy-policy",
  "/terms",
  ...(hasReviews ? ["/reviews"] : []),
  ...(hasGallery ? ["/gallery"] : []),
];

/** Every page on the live site, derived from content so new pages are tested automatically. */
export const allRoutes = [
  ...staticRoutes,
  ...services.map((s) => `/services/${s.slug}`),
  ...real(projects).map((p) => `/projects/${p.slug}`),
  ...real(areas).map((a) => `/service-areas/${a.slug}`),
];

/** Pages that only exist once they have real content — 404s on the live site until then. */
export const hiddenRoutes = [
  ...(hasReviews ? [] : ["/reviews"]),
  ...(hasGallery ? [] : ["/gallery"]),
  ...projects.filter((p) => p.placeholder).map((p) => `/projects/${p.slug}`),
];

/** Pages that show sample content in the preview build. */
export const previewRoutes = ["/projects", "/gallery", "/reviews", ...projects.map((p) => `/projects/${p.slug}`)];
