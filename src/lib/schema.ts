import { site } from "@/config/site";
import type { Area, FAQ, Service } from "@/types/content";

/**
 * JSON-LD builders (schema.org). Rendered with <JsonLd>.
 *
 * Deliberately no Review / AggregateRating markup: Google ignores self-hosted
 * reviews for local businesses, and nothing unverified belongs in structured data.
 */

const abs = (path: string) => `${site.url}${path}`;
export const BUSINESS_ID = `${site.url}/#business`;
const WEBSITE_ID = `${site.url}/#website`;

const compact = <T extends Record<string, unknown>>(obj: T) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== "" && v !== null));

const cities: readonly string[] = site.market.cities;
const cityPlaces = () => cities.map((name) => ({ "@type": "City", name }));

/**
 * The cities covered, then each area page by the name it's published under.
 * Areas aren't tagged with a city: some pages span two (Dahisar & Mira Road).
 */
function areaServed(areas: Area[]) {
  return [
    ...cityPlaces(),
    ...areas.filter((area) => !cities.includes(area.name)).map((area) => ({ "@type": "Place", name: area.name })),
  ];
}

/** Site name for search results. Belongs on the home page only. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    alternateName: site.shortName,
    url: abs("/"),
    inLanguage: site.language,
    publisher: { "@id": BUSINESS_ID },
  };
}

export function businessJsonLd(areas: Area[], services: Service[]) {
  const { address, geo, phone, email } = site.contact;
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": BUSINESS_ID,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    slogan: site.tagline,
    url: site.url,
    // The app icon as a 512px PNG: raster logos are the safest choice for search engines.
    logo: abs("/icons/icon-512.png"),
    image: abs("/opengraph-image"),
    telephone: phone.href.replace("tel:", ""),
    email,
    address: compact({
      "@type": "PostalAddress",
      streetAddress: `${address.street}, ${address.locality}`,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    }),
    hasMap: site.contact.mapsUrl,
    ...(geo ? { geo: { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lng } } : {}),
    ...(site.hours
      ? {
          openingHoursSpecification: site.hours.spec.map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.days,
            opens: h.opens,
            closes: h.closes,
          })),
        }
      : {}),
    areaServed: areaServed(areas),
    ...(site.social.length ? { sameAs: site.social.map((s) => s.href) } : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Waterproofing services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service.name, url: abs(`/services/${service.slug}`) },
      })),
    },
  };
}

/** Every service is offered in every area, so a service serves all the cities covered. */
export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${abs(`/services/${service.slug}`)}#service`,
    name: service.name,
    serviceType: service.name,
    description: service.seo.description,
    url: abs(`/services/${service.slug}`),
    provider: { "@id": BUSINESS_ID },
    areaServed: cityPlaces(),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

export function faqJsonLd(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
