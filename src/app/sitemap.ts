import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getAreas, getAvailability, getProjects, getServices } from "@/lib/content";

/** Built from content, so new services, projects and areas are included automatically. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects, areas, available] = await Promise.all([getServices(), getProjects(), getAreas(), getAvailability()]);
  const lastModified = new Date();
  const url = (path: string) => `${site.url}${path}`;

  const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.9, changeFrequency: "yearly" },
    { path: "/projects", priority: 0.8, changeFrequency: "weekly" },
    { path: "/service-areas", priority: 0.8, changeFrequency: "monthly" },
    ...(available.reviews ? [{ path: "/reviews", priority: 0.7, changeFrequency: "weekly" as const }] : []),
    ...(available.gallery ? [{ path: "/gallery", priority: 0.6, changeFrequency: "weekly" as const }] : []),
    { path: "/about", priority: 0.6, changeFrequency: "yearly" },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
    { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  ];

  return [
    ...pages.map((page) => ({ url: url(page.path), lastModified, changeFrequency: page.changeFrequency, priority: page.priority })),
    ...services.map((s) => ({ url: url(`/services/${s.slug}`), lastModified, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...areas.map((a) => ({ url: url(`/service-areas/${a.slug}`), lastModified, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...projects.map((p) => ({ url: url(`/projects/${p.slug}`), lastModified, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
