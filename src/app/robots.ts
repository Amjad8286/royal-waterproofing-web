import type { MetadataRoute } from "next";
import { flags, site } from "@/config/site";

/**
 * Indexing guard: crawlers are blocked unless NEXT_PUBLIC_ALLOW_INDEXING=true,
 * so preview deployments with placeholder content never get indexed.
 */
export default function robots(): MetadataRoute.Robots {
  if (!flags.allowIndexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/thank-you"] },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
