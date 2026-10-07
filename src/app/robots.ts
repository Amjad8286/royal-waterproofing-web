import type { MetadataRoute } from "next";
import { flags, site } from "@/config/site";

/**
 * Indexing guard: crawlers are blocked unless NEXT_PUBLIC_ALLOW_INDEXING=true,
 * so preview deployments with placeholder content never get indexed.
 *
 * Once indexing is on, /thank-you stays crawlable: it's kept out of results by
 * its noindex tag, which crawlers can only see if they may fetch the page.
 */
export default function robots(): MetadataRoute.Robots {
  if (!flags.allowIndexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
