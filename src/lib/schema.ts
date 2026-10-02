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

const compact = <T extends Record<string, unknown>>(obj: T) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== "" && v !== null));

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
    logo: abs("/icon.svg"),
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
    areaServed: [
      { "@type": "City", name: site.market.primaryCity },
      ...areas.map((area) => ({ "@type": "Place", name: `${area.name}, ${area.zone === "Thane" || area.zone === "Navi Mumbai" ? area.zone : site.market.primaryCity}` })),
    ],
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

export function serviceJsonLd(service: Service, areas: Area[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${abs(`/services/${service.slug}`)}#service`,
    name: service.name,
    serviceType: service.name,
    description: service.seo.description,
    url: abs(`/services/${service.slug}`),
    provider: { "@id": BUSINESS_ID },
    areaServed: areas.map((area) => ({ "@type": "Place", name: area.name })),
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
