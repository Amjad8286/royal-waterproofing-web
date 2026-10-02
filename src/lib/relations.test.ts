import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { site } from "@/config/site";
import { areas } from "@/content/areas";
import { clients } from "@/content/clients";
import { faqs } from "@/content/faqs";
import { gallery } from "@/content/gallery";
import { heroSlides } from "@/content/hero";
import { images } from "@/content/images";
import { problems } from "@/content/problems";
import { projects } from "@/content/projects";
import { reviews } from "@/content/reviews";
import { sectors } from "@/content/sectors";
import { services } from "@/content/services";
import { getAreas, getFaqs, getGallery, getProjects, getReviews, getStats, getTeam } from "./content";
import {
  areasForService,
  findBrokenReferences,
  projectsForArea,
  projectsForService,
  relatedProjects,
  resolveSlugs,
  reviewsForService,
} from "./relations";

const index = { services, projects, reviews, areas, problems, gallery, sectors, heroSlides, clients, imageIds: Object.keys(images) };

describe("content integrity", () => {
  it("has no broken slug or image references", () => {
    expect(findBrokenReferences(index)).toEqual([]);
  });

  it("reports a broken reference when one is introduced", () => {
    const broken = { ...projects[0], area: "atlantis", services: ["not-a-service"] };
    const errors = findBrokenReferences({ ...index, projects: [broken, ...projects.slice(1)] });
    expect(errors.some((e) => e.includes('unknown area "atlantis"'))).toBe(true);
    expect(errors.some((e) => e.includes('unknown service "not-a-service"'))).toBe(true);
  });

  it("uses unique slugs and ids", () => {
    for (const list of [services.map((s) => s.slug), projects.map((p) => p.slug), areas.map((a) => a.slug), reviews.map((r) => r.id), faqs.map((f) => f.id)]) {
      expect(new Set(list).size).toBe(list.length);
    }
  });

  it("lists each client once, and never the company itself", () => {
    const key = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");
    expect(new Set(clients.map((c) => c.slug)).size).toBe(clients.length);
    expect(new Set(clients.map((c) => key(c.name))).size).toBe(clients.length);
    for (const client of clients) expect(key(client.name), client.name).not.toContain(key(site.shortName));
  });

  it("points every image at a file that exists in /public", () => {
    for (const image of Object.values(images)) {
      expect(existsSync(join(process.cwd(), "public", image.src)), image.src).toBe(true);
    }
  });

  it("gives every service enough content for a full page", () => {
    for (const service of services) {
      expect(service.signs.length, service.slug).toBeGreaterThanOrEqual(4);
      expect(service.systems.length, service.slug).toBeGreaterThanOrEqual(3);
      expect(service.process.length, service.slug).toBeGreaterThanOrEqual(4);
      expect(service.faqs.length, service.slug).toBeGreaterThanOrEqual(4);
    }
  });

  it("never shares intro copy between area pages", () => {
    const paragraphs = areas.flatMap((area) => area.intro);
    expect(new Set(paragraphs).size).toBe(paragraphs.length);
  });

  it("gives every non-sample image a source: the company's own photo or a credited stock photo", () => {
    for (const image of Object.values(images)) {
      if (image.placeholder) continue;
      expect(image.src.startsWith("/images/photos/") ? Boolean(image.credit) : true, image.id).toBe(true);
    }
  });
});

describe("sample content", () => {
  // NEXT_PUBLIC_PREVIEW_SAMPLES is not set in tests, so this is what the live site gets.
  it("is hidden on the live site", async () => {
    const lists = await Promise.all([getProjects(), getReviews(), getGallery(), getTeam(), getStats(), getFaqs(), getAreas()]);
    for (const list of lists) {
      expect(list.every((item) => !("placeholder" in item) || !item.placeholder)).toBe(true);
    }
  });

  it("still keeps the real content", async () => {
    expect((await getAreas()).length).toBe(areas.filter((a) => !a.placeholder).length);
    expect((await getFaqs()).length).toBe(faqs.filter((f) => !f.placeholder).length);
  });
});

describe("relation helpers", () => {
  it("finds projects and reviews for a service", () => {
    const basementProjects = projectsForService(projects, "basement-waterproofing");
    expect(basementProjects.length).toBeGreaterThan(0);
    expect(basementProjects.every((p) => p.services.includes("basement-waterproofing"))).toBe(true);
    expect(reviewsForService(reviews, "basement-waterproofing").every((r) => r.service === "basement-waterproofing")).toBe(true);
  });

  it("finds projects for an area", () => {
    const thane = projectsForArea(projects, "thane");
    expect(thane.length).toBeGreaterThan(0);
    expect(thane.every((p) => p.area === "thane")).toBe(true);
  });

  it("falls back to every area when a service isn't featured anywhere", () => {
    expect(areasForService(areas, "unknown-service")).toEqual(areas);
  });

  it("resolves slugs in order and skips unknown ones", () => {
    const resolved = resolveSlugs(services, ["crack-repair-sealing", "nope", "bathroom-waterproofing"]);
    expect(resolved.map((s) => s.slug)).toEqual(["crack-repair-sealing", "bathroom-waterproofing"]);
  });

  it("ranks related projects by shared services and never returns the project itself", () => {
    const project = projects[0];
    const related = relatedProjects(projects, project, 3);
    expect(related).not.toContainEqual(project);
    expect(related.length).toBeLessThanOrEqual(3);
    if (related.length > 0) {
      const shares = (p: (typeof projects)[number]) => p.services.some((s) => project.services.includes(s));
      expect(shares(related[0]) || related[0].area === project.area).toBe(true);
    }
  });
});
