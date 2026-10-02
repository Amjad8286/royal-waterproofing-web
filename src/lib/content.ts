import { certifications, stats } from "@/config/site";
import { areas } from "@/content/areas";
import { clients } from "@/content/clients";
import { faqs } from "@/content/faqs";
import { gallery } from "@/content/gallery";
import { heroSlides } from "@/content/hero";
import { getImage } from "@/content/images";
import { problems } from "@/content/problems";
import { projects } from "@/content/projects";
import { reviews } from "@/content/reviews";
import { sectors } from "@/content/sectors";
import { serviceGroups, services } from "@/content/services";
import { team } from "@/content/team";
import { bySlug } from "@/lib/relations";
import { isShown, shownOnly } from "@/lib/samples";
import type { GalleryItem } from "@/types/content";

/**
 * Content access layer. Pages only read content through these async getters,
 * so the local files in src/content can later be swapped for a CMS or API
 * without touching any page or component.
 *
 * Sample (placeholder) records are filtered out here unless preview mode is
 * on, so every page automatically shows only real content.
 */

export async function getServices() {
  return services;
}

export async function getService(slug: string) {
  return bySlug(services, slug) ?? null;
}

export async function getServicesByGroup() {
  return serviceGroups.map((group) => ({
    ...group,
    services: services.filter((service) => service.group === group.id),
  }));
}

export async function getProblems() {
  return problems;
}

export async function getHeroSlides() {
  return heroSlides;
}

export async function getSectors() {
  return sectors;
}

export async function getClients() {
  return clients;
}

export async function getProjects() {
  return shownOnly(projects);
}

export async function getProject(slug: string) {
  return bySlug(shownOnly(projects), slug) ?? null;
}

export async function getFeaturedProjects(limit = 3) {
  return shownOnly(projects)
    .filter((project) => project.featured)
    .slice(0, limit);
}

export async function getReviews() {
  return shownOnly(reviews).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getReview(id: string) {
  return shownOnly(reviews).find((review) => review.id === id) ?? null;
}

export async function getAreas() {
  return shownOnly(areas);
}

export async function getArea(slug: string) {
  return bySlug(shownOnly(areas), slug) ?? null;
}

export async function getFaqs() {
  return shownOnly(faqs);
}

export async function getFaqsByIds(ids: string[]) {
  return ids
    .map((id) => faqs.find((faq) => faq.id === id))
    .filter((faq) => faq !== undefined)
    .filter((faq) => isShown(faq));
}

export async function getTeam() {
  return shownOnly(team);
}

/** A gallery item is the company's own work only if none of its images are samples. */
function galleryItemShown(item: GalleryItem) {
  const ids = [item.image, item.before, item.after].filter((id): id is string => Boolean(id));
  return ids.every((id) => isShown(getImage(id)));
}

export async function getGallery() {
  return gallery.filter(galleryItemShown);
}

export async function getStats() {
  return shownOnly(stats);
}

export async function getCertifications() {
  return shownOnly(certifications);
}

/** Which optional sections have real content, so navigation only links to pages that exist. */
export async function getAvailability() {
  const [caseStudies, galleryItems, reviewItems] = await Promise.all([getProjects(), getGallery(), getReviews()]);
  return {
    caseStudies: caseStudies.length > 0,
    gallery: galleryItems.length > 0,
    reviews: reviewItems.length > 0,
  };
}

/** Minimal option lists for the enquiry form (keeps client payloads small). */
export async function getFormOptions() {
  return {
    services: services.map(({ slug, name }) => ({ slug, name })),
    areas: shownOnly(areas).map(({ slug, name }) => ({ slug, name })),
  };
}

/** Synchronous name lookups for labels inside components. */
export function serviceName(slug: string) {
  return bySlug(services, slug)?.name ?? slug;
}

export function serviceShortName(slug: string) {
  return bySlug(services, slug)?.shortName ?? slug;
}

export function areaName(slug: string) {
  return bySlug(areas, slug)?.name ?? slug;
}
