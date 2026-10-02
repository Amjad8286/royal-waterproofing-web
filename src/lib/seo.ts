import type { Metadata } from "next";
import { cta, flags, inCity, site } from "@/config/site";

const SUFFIX = ` | ${site.name}`;
const MAX_TITLE = 60;
const MAX_DESCRIPTION = 165;

/** Adds " in Mumbai" to a title topic when the full title (with the brand suffix) still fits. */
export function withCity(topic: string) {
  const candidate = `${topic}${inCity}`;
  return `${candidate}${SUFFIX}`.length <= MAX_TITLE ? candidate : topic;
}

/** Ends a description with the primary call to action when it fits. */
export function withCta(description: string) {
  const candidate = `${description} ${cta.primary}.`;
  return candidate.length <= MAX_DESCRIPTION ? candidate : description;
}

/**
 * Indexing guard: nothing is indexable unless NEXT_PUBLIC_ALLOW_INDEXING=true,
 * so preview deployments with placeholder content never reach search results.
 */
export function robotsFor(noindex = false): Metadata["robots"] {
  const index = flags.allowIndexing && !noindex;
  return { index, follow: flags.allowIndexing, googleBot: { index, follow: flags.allowIndexing } };
}

interface PageMetaInput {
  /** Title without the site-name suffix (the root layout template adds it). */
  title: string;
  description: string;
  /** Path beginning with "/", used for the canonical URL. */
  path: string;
  noindex?: boolean;
  /** Use the title as-is, without the " | Royal Waterproofing Co." suffix. */
  absoluteTitle?: boolean;
}


/**
 * Complete metadata for a page. Metadata objects merge shallowly between
 * segments, so nested objects (openGraph, robots) are always built in full here.
 */
export function buildMetadata({ title, description, path, noindex = false, absoluteTitle = false }: PageMetaInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title}${SUFFIX}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale,
      title: fullTitle,
      description,
      url: path,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
    robots: robotsFor(noindex),
  };
}
