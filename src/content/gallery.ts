import type { GalleryItem } from "@/types/content";
import { projects } from "./projects";

/**
 * Gallery = every project's before/after pair, plus the finished ("after")
 * shot on its own. Derived from projects so there's one source of truth.
 * Stock photos never appear here: the gallery is for the company's own work.
 */
const pairs: GalleryItem[] = projects.map((project) => ({
  id: `pair-${project.slug}`,
  kind: "pair",
  before: project.before,
  after: project.after,
  caption: project.title,
  service: project.services[0],
  project: project.slug,
}));

const finished: GalleryItem[] = projects.map((project) => ({
  id: `photo-${project.slug}`,
  kind: "photo",
  image: project.after,
  caption: `${project.title} — finished`,
  service: project.services[0],
  project: project.slug,
  tag: "Finished",
}));

/** Interleave pairs and single photos so the grid has rhythm. */
export const gallery: GalleryItem[] = pairs.flatMap((pair, i) => [pair, finished[i]]);
