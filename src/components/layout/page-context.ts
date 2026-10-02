import { whatsappMessage } from "@/lib/whatsapp";
import type { NavLookups } from "./nav-types";

/**
 * Works out which service or area page the visitor is on, so persistent CTAs
 * (action bar, floating WhatsApp) can pre-fill the form and the message.
 */
export function pageContext(pathname: string, lookups: NavLookups) {
  const [, section, slug] = pathname.split("/");
  const service = section === "services" && slug && lookups.services[slug] ? slug : undefined;
  const area = section === "service-areas" && slug && lookups.areas[slug] ? slug : undefined;

  const params = new URLSearchParams();
  if (service) params.set("service", service);
  if (area) params.set("area", area);
  const query = params.toString();

  return {
    contactHref: query ? `/contact?${query}` : "/contact",
    message: whatsappMessage({
      service: service ? lookups.services[service] : undefined,
      area: area ? lookups.areas[area] : undefined,
    }),
  };
}
