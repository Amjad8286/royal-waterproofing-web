import type { Area, Client, GalleryItem, HeroSlide, Problem, Project, Review, Sector, Service } from "@/types/content";

/**
 * Pure helpers that resolve slug references between content types.
 * Kept free of I/O so they can be unit-tested and reused by scripts.
 */

export function bySlug<T extends { slug: string }>(items: T[], slug: string): T | undefined {
  return items.find((item) => item.slug === slug);
}

export function resolveSlugs<T extends { slug: string }>(items: T[], slugs: string[]): T[] {
  return slugs.map((slug) => bySlug(items, slug)).filter((item): item is T => Boolean(item));
}

export function projectsForService(projects: Project[], serviceSlug: string) {
  return projects.filter((project) => project.services.includes(serviceSlug));
}

export function projectsForArea(projects: Project[], areaSlug: string) {
  return projects.filter((project) => project.area === areaSlug);
}

export function reviewsForService(reviews: Review[], serviceSlug: string) {
  return reviews.filter((review) => review.service === serviceSlug);
}

export function reviewsForArea(reviews: Review[], areaSlug: string) {
  return reviews.filter((review) => review.area === areaSlug);
}

/** Areas where a service is featured; falls back to every area. */
export function areasForService(areas: Area[], serviceSlug: string) {
  const featured = areas.filter((area) => area.featuredServices.includes(serviceSlug));
  return featured.length > 0 ? featured : areas;
}

/** Projects that share services, area or property type, best matches first. */
export function relatedProjects(projects: Project[], project: Project, limit = 3) {
  return projects
    .filter((candidate) => candidate.slug !== project.slug)
    .map((candidate) => {
      const sharedServices = candidate.services.filter((s) => project.services.includes(s)).length;
      const score =
        sharedServices * 3 +
        (candidate.area === project.area ? 1 : 0) +
        (candidate.propertyType === project.propertyType ? 1 : 0);
      return { candidate, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

interface ReferenceIndex {
  services: Service[];
  projects: Project[];
  reviews: Review[];
  areas: Area[];
  problems: Problem[];
  gallery: GalleryItem[];
  sectors: Sector[];
  heroSlides: HeroSlide[];
  clients: Client[];
  imageIds: string[];
}

/** Every slug or id reference that doesn't resolve. Empty means the content is consistent. */
export function findBrokenReferences(index: ReferenceIndex): string[] {
  const errors: string[] = [];
  const serviceSlugs = new Set(index.services.map((s) => s.slug));
  const areaSlugs = new Set(index.areas.map((a) => a.slug));
  const projectSlugs = new Set(index.projects.map((p) => p.slug));
  const reviewIds = new Set(index.reviews.map((r) => r.id));
  const imageIds = new Set(index.imageIds);

  const check = (ok: boolean, message: string) => {
    if (!ok) errors.push(message);
  };

  for (const service of index.services) {
    check(imageIds.has(service.image), `service ${service.slug}: unknown image "${service.image}"`);
    for (const related of service.related) check(serviceSlugs.has(related), `service ${service.slug}: unknown related service "${related}"`);
  }
  for (const problem of index.problems) {
    for (const slug of problem.services) check(serviceSlugs.has(slug), `problem ${problem.slug}: unknown service "${slug}"`);
  }
  for (const project of index.projects) {
    check(areaSlugs.has(project.area), `project ${project.slug}: unknown area "${project.area}"`);
    for (const slug of project.services) check(serviceSlugs.has(slug), `project ${project.slug}: unknown service "${slug}"`);
    for (const id of [project.cover, project.before, project.after, ...project.gallery]) {
      check(imageIds.has(id), `project ${project.slug}: unknown image "${id}"`);
    }
    if (project.review) check(reviewIds.has(project.review), `project ${project.slug}: unknown review "${project.review}"`);
  }
  for (const review of index.reviews) {
    check(areaSlugs.has(review.area), `review ${review.id}: unknown area "${review.area}"`);
    check(serviceSlugs.has(review.service), `review ${review.id}: unknown service "${review.service}"`);
    if (review.project) check(projectSlugs.has(review.project), `review ${review.id}: unknown project "${review.project}"`);
  }
  for (const area of index.areas) {
    for (const slug of [...area.featuredServices, ...area.commonProblems.map((p) => p.service)]) {
      check(serviceSlugs.has(slug), `area ${area.slug}: unknown service "${slug}"`);
    }
    for (const slug of area.nearby) check(areaSlugs.has(slug), `area ${area.slug}: unknown nearby area "${slug}"`);
  }
  for (const sector of index.sectors) {
    check(imageIds.has(sector.image), `sector ${sector.id}: unknown image "${sector.image}"`);
    for (const slug of sector.services) check(serviceSlugs.has(slug), `sector ${sector.id}: unknown service "${slug}"`);
  }
  for (const slide of index.heroSlides) {
    for (const id of [slide.image, slide.portraitImage]) check(imageIds.has(id), `hero slide "${slide.label}": unknown image "${id}"`);
  }
  for (const client of index.clients) {
    if (client.logo) check(imageIds.has(client.logo), `client ${client.slug}: unknown logo "${client.logo}"`);
  }
  for (const item of index.gallery) {
    check(serviceSlugs.has(item.service), `gallery ${item.id}: unknown service "${item.service}"`);
    for (const id of [item.image, item.before, item.after].filter((x): x is string => Boolean(x))) {
      check(imageIds.has(id), `gallery ${item.id}: unknown image "${id}"`);
    }
  }
  return errors;
}
