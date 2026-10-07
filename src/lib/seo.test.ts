import { afterEach, describe, expect, it, vi } from "vitest";
import { cta, site } from "@/config/site";
import { images } from "@/content/images";
import { services } from "@/content/services";
import { buildMetadata, describeList, robotsFor, withCity, withCta } from "./seo";

/** Imports a module fresh with the given NEXT_PUBLIC_* values (the flags are read at import time). */
async function withEnv<T>(env: Record<string, string>, load: () => Promise<T>) {
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
  vi.resetModules();
  return load();
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.doUnmock("@/content/images");
  vi.resetModules();
});

describe("SEO helpers", () => {
  it("keeps every service title within ~60 characters including the site name", () => {
    for (const service of services) {
      const full = `${withCity(service.seo.title)} | ${site.name}`;
      expect(full.length, full).toBeLessThanOrEqual(60);
    }
  });

  it("keeps service meta descriptions to a sensible length", () => {
    for (const service of services) {
      const description = withCta(service.seo.description);
      expect(description.length, service.slug).toBeGreaterThanOrEqual(110);
      expect(description.length, service.slug).toBeLessThanOrEqual(165);
    }
  });

  it("lists as many items as fit, keeping the call to action when it can", () => {
    const short = describeList("Repairs in Thane", ["terrace leaks", "damp walls", "bathroom seepage"]);
    expect(short).toBe(`Repairs in Thane: terrace leaks, damp walls, bathroom seepage. ${cta.primary}.`);

    const long = "a problem described in quite a lot of detail, so that only a couple of them fit";
    const trimmed = describeList("Repairs in Thane", [long, long, long]);
    expect(trimmed.length).toBeLessThanOrEqual(165);
    expect(trimmed).toContain(long);

    const single = describeList("Repairs in Thane", ["x".repeat(200)]);
    expect(single).toBe(`Repairs in Thane: ${"x".repeat(200)}.`);
  });

  it("blocks indexing unless explicitly allowed", () => {
    // NEXT_PUBLIC_ALLOW_INDEXING is not set in tests.
    expect(robotsFor()).toMatchObject({ index: false, follow: false });
  });

  it("allows indexing once enabled, but never in preview mode", async () => {
    const live = await withEnv({ NEXT_PUBLIC_ALLOW_INDEXING: "true" }, () => import("./seo"));
    expect(live.robotsFor()).toMatchObject({ index: true, follow: true });
    expect(live.robotsFor(true)).toMatchObject({ index: false, follow: true });

    const preview = await withEnv({ NEXT_PUBLIC_ALLOW_INDEXING: "true", NEXT_PUBLIC_PREVIEW_SAMPLES: "true" }, () => import("./seo"));
    expect(preview.robotsFor()).toMatchObject({ index: false, follow: false });
  });

  it("builds a canonical URL and complete Open Graph data", () => {
    const meta = buildMetadata({ title: "FAQ", description: "Answers.", path: "/faq" });
    expect(meta.alternates?.canonical).toBe("/faq");
    expect(meta.openGraph).toMatchObject({ siteName: site.name, url: "/faq", title: `FAQ | ${site.name}` });
  });

  it("uses the site-wide share card unless a page has its own", () => {
    const meta = buildMetadata({ title: "FAQ", description: "Answers.", path: "/faq" });
    expect(meta.openGraph?.images).toEqual([expect.objectContaining({ url: "/opengraph-image", width: 1200, height: 630 })]);

    const card = { url: "/services/basement-waterproofing/opengraph-image", alt: "Basement Waterproofing in Mumbai" };
    const service = buildMetadata({ title: "Basement", description: "Dry basements.", path: "/services/basement-waterproofing", image: card });
    expect(service.openGraph?.images).toEqual([{ ...card, width: 1200, height: 630 }]);
  });

  it("can opt a page out of indexing", () => {
    expect(buildMetadata({ title: "Thanks", description: "", path: "/thank-you", noindex: true }).robots).toMatchObject({ index: false });
  });
});

describe("robots.txt and sitemap", () => {
  const url = "https://royalwaterproofingco.com";

  it("blocks every crawler while indexing is off", async () => {
    const { default: robots } = await import("@/app/robots");
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });

  it("opens the site and points at the sitemap once indexing is on", async () => {
    const { default: robots } = await withEnv({ NEXT_PUBLIC_ALLOW_INDEXING: "true", NEXT_PUBLIC_SITE_URL: url }, () => import("@/app/robots"));
    const result = robots();
    expect(result.sitemap).toBe(`${url}/sitemap.xml`);
    // /thank-you must stay crawlable, or search engines can't see its noindex.
    expect(result.rules).toEqual({ userAgent: "*", allow: "/", disallow: ["/api/"] });
  });

  it("lists production URLs with the day each page last changed, and nothing search engines ignore", async () => {
    const { default: sitemap } = await withEnv({ NEXT_PUBLIC_SITE_URL: url }, () => import("@/app/sitemap"));
    const entries = await sitemap();
    expect(entries.length).toBeGreaterThan(20);
    for (const entry of entries) {
      expect(entry.url.startsWith(`${url}/`), entry.url).toBe(true);
      // From src/content/generated/page-dates.json; a new page needs `npm run sitemap:dates`.
      expect(entry.lastModified, `${entry.url}: run npm run sitemap:dates`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(entry).not.toHaveProperty("changeFrequency");
      expect(entry).not.toHaveProperty("priority");
    }
    expect(entries.map((entry) => entry.url)).not.toContain(`${url}/thank-you`);
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length);
  });

  it("lists no stock photos, sample illustrations or client logos for image search", async () => {
    const { default: sitemap } = await withEnv({ NEXT_PUBLIC_SITE_URL: url }, () => import("@/app/sitemap"));
    const listed = (await sitemap()).flatMap((entry) => entry.images ?? []);
    const notOurs = Object.values(images)
      .filter((image) => image.placeholder || image.credit || image.source)
      .map((image) => `${url}${image.src}`);
    for (const src of listed) expect(notOurs, src).not.toContain(src);
  });

  it("adds the company's own photos to the page that shows them", async () => {
    // Today every service photo is stock; pretend the basement one is the company's own.
    const own = { ...images["service-basement"], credit: undefined };
    vi.doMock("@/content/images", async (importOriginal) => {
      const actual = await importOriginal<typeof import("@/content/images")>();
      return { ...actual, getImage: (id: string) => (id === own.id ? own : actual.getImage(id)) };
    });
    const { default: sitemap } = await withEnv({ NEXT_PUBLIC_SITE_URL: url }, () => import("@/app/sitemap"));
    const entries = await sitemap();
    expect(entries.find((entry) => entry.url === `${url}/services/basement-waterproofing`)?.images).toEqual([`${url}${own.src}`]);
    expect(entries.filter((entry) => entry.images)).toHaveLength(1);
  });
});
