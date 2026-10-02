import type { IconName } from "@/types/content";

/** Serialisable navigation data passed from the server layout to client nav components. */
export interface NavService {
  slug: string;
  name: string;
  summary: string;
  icon: IconName;
}

export interface NavGroup {
  id: string;
  label: string;
  description: string;
  services: NavService[];
}

/** slug → display name, for page-aware CTA and WhatsApp messages. */
export interface NavLookups {
  services: Record<string, string>;
  areas: Record<string, string>;
}

/** Which optional pages have real content (and so belong in the navigation). */
export interface NavAvailability {
  caseStudies: boolean;
  gallery: boolean;
  reviews: boolean;
}
