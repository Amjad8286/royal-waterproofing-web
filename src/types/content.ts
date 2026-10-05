/**
 * Content model. Everything the site renders comes from data shaped by these
 * types, so a CMS can replace the local files in `src/content` later.
 *
 * `placeholder: true` marks invented sample data. It is hidden on the live site
 * (shown with a "Sample" badge only in preview mode) until it is replaced with
 * real, confirmed content. `npm run check:content` lists every flagged item.
 */

export type IconName =
  | "cloud-rain"
  | "shower-head"
  | "layers-down"
  | "brick-wall"
  | "crack"
  | "scan-search"
  | "building"
  | "factory"
  | "hard-hat"
  | "droplets"
  | "waves"
  | "sprout"
  | "shield-check"
  | "clipboard-check"
  | "file-text"
  | "clock"
  | "sparkle-clean"
  | "gauge"
  | "thermometer"
  | "paint-roller"
  | "ruler"
  | "receipt"
  | "target"
  | "eye"
  | "award"
  | "badge-check"
  | "house"
  | "store"
  | "hotel"
  | "school"
  | "hospital"
  | "warehouse"
  | "parking"
  | "construction"
  | "map-pin"
  | "wind"
  | "sun";

/** A displayed fact that may still be sample data. */
export interface Fact {
  value: string;
  placeholder: boolean;
}

export interface ImageAsset {
  id: string;
  /** Path under /public, e.g. /images/photos/mumbai-monsoon-skyline.webp */
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  /** How bright the photo's light areas are (90th-percentile relative luminance, 0–1), from `npm run images:meta`. */
  highlights?: number;
  /** Client logos: how light the artwork is (mean luma of its non-white pixels, 0–1), from `npm run images:meta`. */
  ink?: number;
  /** True for sample illustrations that stand in for the company's own project photos. */
  placeholder: boolean;
  /** Licensed stock photo: where it came from. Replace with your own photo when you can. */
  credit?: { source: "Pexels"; url: string };
  /** Third-party artwork, such as a client's logo: the page the file came from, so its origin stays on record. */
  source?: string;
  /** What the company's own photo should show (feeds docs/PHOTO_SHOT_LIST.md). */
  brief: string;
}

export type ServiceGroup = "residential" | "repairs" | "commercial";

export interface ServiceSystem {
  name: string;
  description: string;
  bestFor: string;
}

export interface TitledText {
  title: string;
  description: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: FAQCategory;
  /** The answer makes an unconfirmed claim (e.g. warranty terms), so it's hidden until confirmed. */
  placeholder?: boolean;
}

export type FAQCategory =
  | "cost"
  | "inspection"
  | "duration"
  | "warranty"
  | "solutions"
  | "maintenance"
  | "booking";

export interface Warranty {
  summary: string;
  covered: string[];
  notCovered: string[];
  placeholder: boolean;
}

export interface Service {
  slug: string;
  name: string;
  /** Short label for chips, menus and the form select. */
  shortName: string;
  group: ServiceGroup;
  icon: IconName;
  /** One-line benefit used on cards. */
  summary: string;
  /** Problem-aware subhead for the service hero. */
  intro: string;
  image: string;
  keyFacts: {
    duration: Fact;
    warranty: Fact;
    suitableFor: string;
  };
  signs: string[];
  /** Overrides the "Signs you need it" heading. */
  signsTitle?: string;
  causes: TitledText[];
  /** Overrides the "Why it happens" heading. */
  causesTitle?: string;
  solutionIntro: string;
  systems: ServiceSystem[];
  benefits: TitledText[];
  process: TitledText[];
  applications: string[];
  costFactors: string[];
  warranty: Warranty;
  faqs: FAQ[];
  related: string[];
  seo: { title: string; description: string };
}

export interface Problem {
  slug: string;
  title: string;
  description: string;
  icon: IconName;
  services: string[];
}

export type PropertyType = "residential" | "commercial" | "industrial";

export interface Project {
  slug: string;
  title: string;
  /** One-line outcome for cards. */
  outcome: string;
  summary: string;
  services: string[];
  propertyType: PropertyType;
  propertyLabel: string;
  area: string;
  year: string;
  areaTreated: string;
  duration: string;
  challenge: string;
  solution: string[];
  result: string;
  cover: string;
  before: string;
  after: string;
  gallery: string[];
  review?: string;
  featured?: boolean;
  placeholder: boolean;
}

export interface Review {
  id: string;
  /** First name + initial for real reviews; a role label for samples. */
  name: string;
  area: string;
  service: string;
  project?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  source: "sample" | "google" | "direct";
  placeholder: boolean;
}

export interface Area {
  slug: string;
  name: string;
  zone: string;
  /** Unique intro paragraphs — never shared between areas. */
  intro: string[];
  commonProblems: { problem: string; service: string }[];
  featuredServices: string[];
  nearby: string[];
  faqs: FAQ[];
  placeholder: boolean;
}

/** An organisation the company has worked for, shown in the home page's client wall. */
export interface Client {
  /** Stable id for keys and tests. */
  slug: string;
  /** The name as it should be shown and read out. */
  name: string;
  /** Manifest id of the client's logo (src/content/images.ts). Without one, the name is set as a wordmark. */
  logo?: string;
}

/** A kind of building or client, used on the Projects page. */
export interface Sector {
  id: string;
  title: string;
  icon: IconName;
  image: string;
  /** One line for compact tiles. */
  summary: string;
  description: string;
  /** Typical scope of work for this kind of building. */
  scope: string[];
  services: string[];
}

/** A photo in the home hero slideshow. */
export interface HeroSlide {
  /** Short caption on the slide picker, describing what the photo shows. */
  label: string;
  /** Image id of the 16:9 photo for wide screens. */
  image: string;
  /** Image id of a 4:5 crop of the same photo, for phones and tablets held upright. */
  portraitImage: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  placeholder: boolean;
}

export interface Certification {
  id: string;
  kind: "certification" | "licence" | "insurance" | "membership";
  title: string;
  detail: string;
  placeholder: boolean;
}

export interface GalleryItem {
  id: string;
  kind: "photo" | "pair";
  /** For kind "photo". */
  image?: string;
  /** For kind "pair". */
  before?: string;
  after?: string;
  caption: string;
  service: string;
  project?: string;
  /** Short label on the thumbnail; defaults to "Before & after" or "In progress". */
  tag?: string;
}

export interface Stat {
  id: string;
  value: number;
  /** Rendered after the number, e.g. "+" or "k sq ft". */
  suffix: string;
  prefix?: string;
  label: string;
  placeholder: boolean;
}

export interface ProcessStep {
  title: string;
  description: string;
  /** Typical timing for the step; hidden while it's a placeholder. */
  timing?: Fact;
}

/** A next step the website assistant can offer under an answer. */
export type ChatAction = "call" | "whatsapp" | "inspection";

export interface ChatLink {
  label: string;
  /** A page on this site ("/contact", "/faq#cost") or an external URL. */
  href: string;
}

/**
 * A question the website assistant can answer, on top of what it reads from
 * the rest of the content (services, FAQs, areas, symptoms). The answer is
 * shown word for word, so it must be confirmed fact.
 */
export interface ChatKnowledgeEntry {
  id: string;
  question: string;
  /** Other words people use for this; searched, never shown. */
  keywords?: string[];
  /** Plain text. A blank line starts a new paragraph; lines starting "- " become a list. */
  answer: string;
  links?: ChatLink[];
  actions?: ChatAction[];
  /** Not confirmed yet: the assistant never uses it, even in preview mode. */
  placeholder?: boolean;
}
