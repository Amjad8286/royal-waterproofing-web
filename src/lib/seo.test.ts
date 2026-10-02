import { describe, expect, it } from "vitest";
import { site } from "@/config/site";
import { services } from "@/content/services";
import { buildMetadata, robotsFor, withCity, withCta } from "./seo";

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

  it("blocks indexing unless explicitly allowed", () => {
    // NEXT_PUBLIC_ALLOW_INDEXING is not set in tests.
    expect(robotsFor()).toMatchObject({ index: false, follow: false });
  });

  it("builds a canonical URL and complete Open Graph data", () => {
    const meta = buildMetadata({ title: "FAQ", description: "Answers.", path: "/faq" });
    expect(meta.alternates?.canonical).toBe("/faq");
    expect(meta.openGraph).toMatchObject({ siteName: site.name, url: "/faq", title: `FAQ | ${site.name}` });
  });

  it("can opt a page out of indexing", () => {
    expect(buildMetadata({ title: "Thanks", description: "", path: "/thank-you", noindex: true }).robots).toMatchObject({ index: false });
  });
});
