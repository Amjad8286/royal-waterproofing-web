import type { ImageAsset } from "@/types/content";
import imageMeta from "./generated/image-meta.json";

/**
 * Image manifest. Every image on the site is referenced by id from here.
 *
 * - Photos are licensed stock (Pexels; free for commercial use) chosen to
 *   illustrate services and Mumbai. None show people, and none are presented
 *   as the company's own work. `scripts/stock-photos.mjs` downloads and crops them.
 * - Illustrations are sample before/after pairs used only by the sample
 *   projects and gallery (preview mode).
 *
 * To use your own photo: put it in public/images/, point `src` at it, rewrite
 * `alt`, remove `credit` (or set `placeholder: false` for a project photo),
 * then run `npm run images:meta`.
 */

type Entry = Omit<ImageAsset, "id" | "width" | "height" | "blurDataURL" | "highlights" | "ink">;

const meta = imageMeta as Record<string, { width: number; height: number; blurDataURL?: string; highlights?: number; ink?: number }>;

const pexels = (id: number) => ({ source: "Pexels" as const, url: `https://www.pexels.com/photo/${id}/` });

const entries: Record<string, Entry> = {
  // The logo, as vectors traced from the supplied artwork. Swap in the original
  // vector files if you have them (same file names), then run `npm run images:meta`.
  "brand-logo": {
    src: "/images/brand/royal-waterproofing-logo.svg",
    alt: "Royal Waterproofing Co.",
    placeholder: false,
    brief: "The company logo for light backgrounds — not a photo.",
  },
  "brand-logo-reversed": {
    src: "/images/brand/royal-waterproofing-logo-reversed.svg",
    alt: "Royal Waterproofing Co.",
    placeholder: false,
    brief: "The company logo for navy backgrounds (white script and wordmark) — not a photo.",
  },

  // Client logos for the home page's client wall: official marks, either from Wikimedia
  // Commons where the file's source is the company's own website, or as published on
  // the company's own website (`npm run images:clients`). `source` is where each came from.
  // They're trademarks — show them only for confirmed clients, with permission.
  "client-adani": {
    src: "/images/clients/adani.svg",
    alt: "Adani",
    placeholder: false,
    source: "https://commons.wikimedia.org/wiki/File:Adani_logo_2012.svg",
    brief: "Client logo (Adani) — not a photo.",
  },
  "client-tata": {
    src: "/images/clients/tata.svg",
    alt: "Tata",
    placeholder: false,
    source: "https://commons.wikimedia.org/wiki/File:Tata_logo.svg",
    brief: "Client logo (Tata) — not a photo.",
  },
  "client-godrej-boyce": {
    src: "/images/clients/godrej-boyce.svg",
    alt: "Godrej & Boyce",
    placeholder: false,
    source: "https://commons.wikimedia.org/wiki/File:GnB-logo.svg",
    brief: "Client logo (Godrej & Boyce) — not a photo.",
  },
  "client-mahindra": {
    src: "/images/clients/mahindra.svg",
    alt: "Mahindra",
    placeholder: false,
    source: "https://commons.wikimedia.org/wiki/File:Mahindra_Rise_New_Logo.svg",
    brief: "Client logo (Mahindra) — not a photo.",
  },
  "client-navneet": {
    src: "/images/clients/navneet.png",
    alt: "Navneet",
    placeholder: false,
    source: "https://navneet.com/wp-content/uploads/2018/03/Navneet-Logo-Name_2-1.png",
    brief: "Client logo (Navneet Education) — not a photo.",
  },
  "client-spjimr": {
    src: "/images/clients/spjimr.png",
    alt: "SPJIMR",
    placeholder: false,
    source: "https://www.spjimr.org/wp-content/uploads/2022/07/footer-logo.png",
    brief: "Client logo (SPJIMR) — not a photo.",
  },
  "client-capacite": {
    src: "/images/clients/capacite.svg",
    alt: "Capacit'e Infraprojects",
    placeholder: false,
    source: "https://capacite.in/wp-content/uploads/2024/06/logo.svg",
    brief: "Client logo (Capacit'e Infraprojects) — not a photo.",
  },
  "client-parsvnath": {
    src: "/images/clients/parsvnath.png",
    alt: "Parsvnath Developers",
    placeholder: false,
    source: "https://www.parsvnath.com/wp-content/themes/storefront/assets/icon/logo-parsvnaths.png",
    brief: "Client logo (Parsvnath Developers) — not a photo.",
  },
  "client-hinduja-hospital": {
    src: "/images/clients/hinduja-hospital.svg",
    alt: "P. D. Hinduja Hospital",
    placeholder: false,
    source: "https://www.hindujahospital.com/static/Logo-3570dad3506eee206a594d7e761b3a4a.svg",
    brief: "Client logo (P. D. Hinduja Hospital) — not a photo.",
  },
  "client-mj-shah": {
    src: "/images/clients/mj-shah.svg",
    alt: "MJ Shah Group",
    placeholder: false,
    source: "https://mjshahgroup.com/images/MJ-Shah-logo-white.svg (white original, coloured as https://mjshahgroup.com/images/MJ-Shah.png)",
    brief: "Client logo (MJ Shah Group) — not a photo.",
  },
  "client-rustomjee": {
    src: "/images/clients/rustomjee.svg",
    alt: "Rustomjee",
    placeholder: false,
    source: "https://www.rustomjee.com/_next/static/media/header-logo.0789e56b.svg",
    brief: "Client logo (Rustomjee) — not a photo.",
  },
  "client-dosti": {
    src: "/images/clients/dosti.png",
    alt: "Dosti",
    placeholder: false,
    source: "https://assets.dostirealty.com/uploads/dosti_full_logo_1a122c7082.png",
    brief: "Client logo (Dosti Realty) — not a photo.",
  },
  "client-piramal": {
    src: "/images/clients/piramal.png",
    alt: "Piramal",
    placeholder: false,
    source: "https://www.piramal.com/assets/images/piramal-logo.png",
    brief: "Client logo (Piramal Group) — not a photo.",
  },
  "client-kolte-patil": {
    src: "/images/clients/kolte-patil.png",
    alt: "Kolte-Patil",
    placeholder: false,
    source: "https://www.koltepatil.com/assets/dist/images/logo.jpg",
    brief: "Client logo (Kolte-Patil Developers) — not a photo.",
  },
  "client-chandigarh-university": {
    src: "/images/clients/chandigarh-university.png",
    alt: "Chandigarh University",
    placeholder: false,
    source: "https://www.cuchd.in/includes/assets/images/header-footer/cu-logo-dark-new.webp",
    brief: "Client logo (Chandigarh University) — not a photo.",
  },
  "client-chandak": {
    src: "/images/clients/chandak.svg",
    alt: "Chandak Group",
    placeholder: false,
    source: "https://www.chandakgroup.com/assets/images/Chandak-Group-Final-Logo.svg",
    brief: "Client logo (Chandak Group) — not a photo.",
  },

  // Supplied by the owner (October 2026, client-logo/): trimmed to the artwork, at most
  // 320 px tall; the small ones were upscaled and anything changed is noted in `source`.
  "client-abrol": {
    src: "/images/clients/abrol.png",
    alt: "Abrol Ventures",
    placeholder: false,
    source: "Supplied by the owner",
    brief: "Client logo (Abrol Ventures) — not a photo.",
  },
  "client-alpine-vistara": {
    src: "/images/clients/alpine-vistara.png",
    alt: "Alpinepeak Developers",
    placeholder: false,
    source: "Supplied by the owner",
    brief: "Client logo (Alpinepeak Developers) — not a photo.",
  },
  "client-arcons": {
    src: "/images/clients/arcons.png",
    alt: "ARCONS Infrastructures & Constructions",
    placeholder: false,
    source: "Supplied by the owner; upscaled ×4 (Real-ESRGAN) for sharpness, colours kept; the small company-name line enlarged plainly so its letters stay true; white background removed",
    brief: "Client logo (ARCONS Infrastructures & Constructions) — not a photo.",
  },
  "client-avanish-realty": {
    src: "/images/clients/avanish-realty.png",
    alt: "Avanish Group",
    placeholder: false,
    source: "Supplied by the owner",
    brief: "Client logo (Avanish Group) — not a photo.",
  },
  "client-balaji-constructions": {
    src: "/images/clients/balaji-constructions.png",
    alt: "Balaji Constructions",
    placeholder: false,
    source: "Supplied by the owner",
    brief: "Client logo (Balaji Constructions) — not a photo.",
  },
  "client-banka-infracon": {
    src: "/images/clients/banka-infracon.png",
    alt: "Banka Infracon",
    placeholder: false,
    source: "Supplied by the owner; supplied as white lettering for dark backgrounds; the white set in charcoal, the red kept",
    brief: "Client logo (Banka Infracon) — not a photo.",
  },
  "client-chandiwala": {
    src: "/images/clients/chandiwala.png",
    alt: "Chandiwala",
    placeholder: false,
    source: "Supplied by the owner; white background removed",
    brief: "Client logo (Chandiwala) — not a photo.",
  },
  "client-dipti": {
    src: "/images/clients/dipti.png",
    alt: "Dipti Group",
    placeholder: false,
    source: "Supplied by the owner; upscaled ×4 (Real-ESRGAN) for sharpness, colours kept",
    brief: "Client logo (Dipti Group) — not a photo.",
  },
  "client-duville-estate": {
    src: "/images/clients/duville-estate.png",
    alt: "Duville Estates",
    placeholder: false,
    source: "Supplied by the owner; upscaled ×4 (Real-ESRGAN) for sharpness, colours kept; supplied as white lettering for dark backgrounds, the white set in charcoal, the red kept",
    brief: "Client logo (Duville Estates) — not a photo.",
  },
  "client-ibc-developers": {
    src: "/images/clients/ibc-developers.png",
    alt: "India Builders Corp.",
    placeholder: false,
    source: "Supplied by the owner; white background removed",
    brief: "Client logo (India Builders Corp.) — not a photo.",
  },
  "client-jk-associates": {
    src: "/images/clients/jk-associates.png",
    alt: "JK Associates",
    placeholder: false,
    source: "Supplied by the owner; the white tagline set in charcoal so it shows on light backgrounds",
    brief: "Client logo (JK Associates) — not a photo.",
  },
  "client-mi-construction": {
    src: "/images/clients/mi-construction.png",
    alt: "M.I. Construction & Consulting",
    placeholder: false,
    source: "Supplied by the owner; upscaled ×4 (Real-ESRGAN) for sharpness, colours kept",
    brief: "Client logo (M.I. Construction & Consulting) — not a photo.",
  },
  "client-morya": {
    src: "/images/clients/morya.png",
    alt: "Morya Constructions",
    placeholder: false,
    source: "Supplied by the owner",
    brief: "Client logo (Morya Constructions) — not a photo.",
  },
  "client-p-and-p-construction": {
    src: "/images/clients/p-and-p-construction.png",
    alt: "PP Construction",
    placeholder: false,
    source: "Supplied by the owner; upscaled ×4 (Real-ESRGAN) for sharpness, colours kept",
    brief: "Client logo (PP Construction) — not a photo.",
  },
  "client-poonam-highrise": {
    src: "/images/clients/poonam-highrise.png",
    alt: "Poonam Group",
    placeholder: false,
    source: "Supplied by the owner; upscaled ×4 (Real-ESRGAN) for sharpness, colours kept",
    brief: "Client logo (Poonam Group) — not a photo.",
  },
  "client-rashi-developers": {
    src: "/images/clients/rashi-developers.png",
    alt: "Rashi Developers",
    placeholder: false,
    source: "Supplied by the owner; white background removed",
    brief: "Client logo (Rashi Developers) — not a photo.",
  },
  "client-runwal": {
    src: "/images/clients/runwal.svg",
    alt: "Runwal Realty",
    placeholder: false,
    source: "Supplied by the owner",
    brief: "Client logo (Runwal Realty) — not a photo.",
  },
  // The emblem includes a reading figure: client logos are the one exception to the no-people rule (AGENTS.md).
  "client-svkm": {
    src: "/images/clients/svkm.png",
    alt: "Shri Vile Parle Kelavani Mandal",
    placeholder: false,
    source: "Supplied by the owner",
    brief: "Client logo (SVKM) — not a photo.",
  },
  "client-suvidha-developers": {
    src: "/images/clients/suvidha-developers.png",
    alt: "Suvidha Lifespaces",
    placeholder: false,
    source: "Supplied by the owner",
    brief: "Client logo (Suvidha Lifespaces) — not a photo.",
  },
  "client-tropicana": {
    src: "/images/clients/tropicana.png",
    alt: "Tropicana",
    placeholder: false,
    source: "Supplied by the owner; supplied as white lettering for dark backgrounds, the white set in charcoal",
    brief: "Client logo (Tropicana) — not a photo.",
  },
  "client-yashpal-builders": {
    src: "/images/clients/yashpal-builders.png",
    alt: "Yashpal Group",
    placeholder: false,
    source: "Supplied by the owner",
    brief: "Client logo (Yashpal Group) — not a photo.",
  },

  // Home hero slides: a 16:9 photo for wide screens and a 4:5 crop for phones held upright.
  "home-hero": {
    src: "/images/photos/mumbai-monsoon-skyline.webp",
    alt: "Dark monsoon clouds gathering over Mumbai's skyline of residential and office towers",
    placeholder: false,
    credit: pexels(34634289),
    brief: "A wide photo of a building you have waterproofed in Mumbai — a finished society terrace or a freshly coated facade — ideally with the skyline behind. No people needed.",
  },
  "home-hero-portrait": {
    src: "/images/photos/mumbai-monsoon-skyline-portrait.webp",
    alt: "Dark monsoon clouds gathering over Mumbai's skyline of residential and office towers",
    placeholder: false,
    credit: pexels(34634289),
    brief: "Upright (4:5) version of the home hero photo, for phones.",
  },
  "hero-terrace": {
    src: "/images/photos/terrace-water-tanks-wide.webp",
    alt: "Water tanks on a terrace stair-head with damp-stained walls and parapet, under a grey monsoon sky",
    placeholder: false,
    credit: pexels(27566315),
    brief: "A society terrace you have waterproofed: finished membrane, parapet and water tanks in view. Wide, 16:9.",
  },
  "hero-terrace-portrait": {
    src: "/images/photos/terrace-water-tanks-portrait.webp",
    alt: "Water tanks on a terrace stair-head with damp-stained walls, under a grey monsoon sky",
    placeholder: false,
    credit: pexels(27566315),
    brief: "Upright (4:5) version of the terrace hero photo, for phones.",
  },
  "hero-wall-crack": {
    src: "/images/photos/crack-seepage-stains-wide.webp",
    alt: "Concrete wall with a long horizontal crack and rust-coloured seepage stains running down from it",
    placeholder: false,
    credit: pexels(9998140),
    brief: "An external wall with cracks and seepage stains before repair. Wide, 16:9.",
  },
  "hero-wall-crack-portrait": {
    src: "/images/photos/crack-seepage-stains-portrait.webp",
    alt: "Concrete wall with a horizontal crack and rust-coloured seepage stains running down from it",
    placeholder: false,
    credit: pexels(9998140),
    brief: "Upright (4:5) version of the wall-crack hero photo, for phones.",
  },
  "hero-basement": {
    src: "/images/photos/basement-parking-puddles-wide.webp",
    alt: "Underground car park with damp patches and puddles of water on the concrete floor",
    placeholder: false,
    credit: pexels(21374999),
    brief: "A basement or podium car park you have waterproofed, dry and clean. Wide, 16:9.",
  },
  "hero-basement-portrait": {
    src: "/images/photos/basement-parking-puddles-portrait.webp",
    alt: "Underground car park with damp patches and puddles of water on the concrete floor",
    placeholder: false,
    credit: pexels(21374999),
    brief: "Upright (4:5) version of the basement hero photo, for phones.",
  },
  "hero-coatings": {
    src: "/images/photos/coating-roller-pails-wide.webp",
    alt: "A roller loaded with grey coating resting on open pails of waterproof coating",
    placeholder: false,
    credit: pexels(6764266),
    brief: "The waterproofing system you use on a job — membrane pails, primer and tools — neatly laid out. Wide, 16:9.",
  },
  "hero-coatings-portrait": {
    src: "/images/photos/coating-roller-pails-portrait.webp",
    alt: "A roller loaded with grey coating resting on an open pail of waterproof coating",
    placeholder: false,
    credit: pexels(6764266),
    brief: "Upright (4:5) version of the coatings hero photo, for phones.",
  },
  about: {
    src: "/images/photos/mumbai-society-building.webp",
    alt: "Balconies of a Mumbai housing society building behind a flowering gulmohar tree",
    placeholder: false,
    credit: pexels(38179316),
    brief: "Your office building in Sen Nagar, or a society building you have worked on.",
  },
  "mumbai-society": {
    src: "/images/photos/mumbai-housing-society.webp",
    alt: "Mumbai residential buildings among coconut palms, with an older society building's terrace and external wall in front",
    placeholder: false,
    credit: pexels(14756146),
    brief: "An older Mumbai society building whose terrace or external walls you have treated.",
  },
  "mumbai-towers-crane": {
    src: "/images/photos/mumbai-towers-crane.webp",
    alt: "Two residential towers in Mumbai seen from below, one still under construction with a crane on top",
    placeholder: false,
    credit: pexels(30331589),
    brief: "A new building where you installed the waterproofing during construction.",
  },
  "site-plans": {
    src: "/images/photos/site-plans-level-helmet.webp",
    alt: "Floor plans, a spirit level, a hard hat and a set of keys laid out on a concrete floor in sunlight",
    placeholder: false,
    credit: pexels(7937319),
    brief: "Your inspection kit on site: moisture meter, thermal camera, clipboard or tablet, next to the problem area.",
  },
  "plans-tools": {
    src: "/images/photos/plans-tape-helmet.webp",
    alt: "A hard hat, measuring tape, folding ruler and keys resting on a set of building plans",
    placeholder: false,
    credit: pexels(8470842),
    brief: "A written quotation or inspection report on site, with your measuring tools.",
  },
  "coating-materials": {
    src: "/images/photos/coating-roller-pails.webp",
    alt: "A roller loaded with grey coating resting on open pails of waterproof coating",
    placeholder: false,
    credit: pexels(6764266),
    brief: "The materials you use on a job: membrane pails, primers, reinforcing fabric and tools, neatly laid out.",
  },
  "basement-wall": {
    src: "/images/photos/basement-concrete-wall.webp",
    alt: "Concrete basement wall marked with form-tie holes and damp stains",
    placeholder: false,
    credit: pexels(16001335),
    brief: "A basement or retaining wall before treatment, showing the leak points.",
  },
  "bathroom-corner": {
    src: "/images/photos/bathroom-tiled-corner.webp",
    alt: "Corner of a tiled bathroom where the wall tiles meet the floor tiles",
    placeholder: false,
    credit: pexels(22589689),
    brief: "A bathroom you have re-waterproofed, finished and dry.",
  },

  "service-terrace-roof": {
    src: "/images/photos/terrace-water-tanks.webp",
    alt: "Water tanks on a terrace stair-head with damp-stained walls and parapet, under a grey monsoon sky",
    placeholder: false,
    credit: pexels(27566315),
    brief: "A terrace mid-treatment: membrane going on over a prepared surface, with untreated concrete alongside.",
  },
  "service-bathroom": {
    src: "/images/photos/bathroom-floor-drain.webp",
    alt: "Stainless steel floor drain set into white tiles on a bathroom floor",
    placeholder: false,
    credit: pexels(5768318),
    brief: "A bathroom stripped back to its waterproofing membrane, with reinforcing tape at the corners and around the floor trap.",
  },
  "service-basement": {
    src: "/images/photos/basement-parking-puddles.webp",
    alt: "Underground car park with damp patches and puddles of water on the concrete floor",
    placeholder: false,
    credit: pexels(21374999),
    brief: "A basement or podium car park you have waterproofed, or injection packers along a leaking crack.",
  },
  "service-wall-dampness": {
    src: "/images/photos/damp-peeling-wall.webp",
    alt: "Wall with paint and plaster peeling away in large patches because of damp",
    placeholder: false,
    credit: pexels(10647626),
    brief: "A damp wall before treatment, with a moisture meter showing the reading.",
  },
  "service-crack-repair": {
    src: "/images/photos/crack-seepage-stains.webp",
    alt: "Concrete wall with a long horizontal crack and rust-coloured seepage stains running down from it",
    placeholder: false,
    credit: pexels(9998140),
    brief: "A crack opened into a clean groove and sealed, with the finished section beside it.",
  },
  "service-leak-detection": {
    src: "/images/photos/leaking-pipe-joint.webp",
    alt: "Water spraying from a leaking joint in a white plumbing pipe wrapped in old cloth",
    placeholder: false,
    credit: pexels(15206136),
    brief: "A thermal camera or moisture meter tracing a hidden leak, framed with the ceiling stain behind it.",
  },
  "service-commercial": {
    src: "/images/photos/mumbai-office-towers.webp",
    alt: "Modern office towers in Mumbai seen from street level against a clear blue sky",
    placeholder: false,
    credit: pexels(35469883),
    brief: "A commercial building you have waterproofed, or its roof after treatment.",
  },
  "service-industrial": {
    src: "/images/photos/industrial-roof-aerial.webp",
    alt: "Corrugated metal roof of an industrial building with rusted edges and gutters, seen from above",
    placeholder: false,
    credit: pexels(17732213),
    brief: "An industrial or warehouse roof during coating, with coated and uncoated sheets side by side.",
  },
  "service-new-construction": {
    src: "/images/photos/concrete-frame-construction.webp",
    alt: "Reinforced concrete frame of a building under construction, with steel starter bars on top",
    placeholder: false,
    credit: pexels(2093640),
    brief: "A new building at basement or slab stage with your membrane being installed.",
  },
};

/** Sample before/after illustrations: [id prefix, subject for alt text, brief]. Used only by sample projects. */
const pairs: [string, string, string][] = [
  ["terrace-home", "a bungalow's flat terrace", "Same terrace from the same spot before and after treatment."],
  ["bathroom-apartment", "a flat's shower area", "Same bathroom corner before and after, same angle and lens."],
  ["basement-villa", "a bungalow basement storage room", "Same basement wall before and after, ideally from a fixed position."],
  ["office-roof", "an office building's flat roof", "Same commercial roof before and after, from the plant room or a high point."],
  ["warehouse-roof", "a warehouse's corrugated metal roof", "Same metal roof section before and after coating."],
  ["rising-damp", "a ground-floor living-room wall", "Same interior wall before and after damp treatment."],
  ["podium-deck", "a residential podium parking deck", "Same deck view before and after the traffic coating."],
  ["facade-cracks", "a residential building's external wall", "Same external wall before and after crack repair and coating."],
  ["ceiling-leak", "a bedroom ceiling corner", "Same ceiling corner before and after the leak repair."],
  ["new-build-basement", "a new-build basement retaining wall", "Same retaining wall before and after membrane installation."],
  ["kitchen-floor", "a restaurant kitchen floor", "Same kitchen floor before and after re-waterproofing."],
  ["fire-water-tank", "a concrete fire-water tank", "Same tank wall before and after treatment (drained for work)."],
];

const pairAlt = {
  before: (subject: string) => `Illustration of ${subject} before treatment, with stains, standing water and cracks`,
  after: (subject: string) => `Illustration of ${subject} after waterproofing, clean, sealed and dry`,
};

for (const [id, subject, brief] of pairs) {
  for (const state of ["before", "after"] as const) {
    entries[`${id}-${state}`] = {
      src: `/images/illustrations/${id}-${state}.webp`,
      alt: pairAlt[state](subject),
      placeholder: true,
      brief: `${state === "before" ? "BEFORE" : "AFTER"} photo. ${brief} 4:3 landscape.`,
    };
  }
}

export const images: Record<string, ImageAsset> = Object.fromEntries(
  Object.entries(entries).map(([id, entry]) => {
    const m = meta[entry.src];
    if (!m) throw new Error(`Missing image metadata for ${entry.src}. Run npm run images:meta.`);
    return [id, { id, ...entry, width: m.width, height: m.height, blurDataURL: m.blurDataURL, highlights: m.highlights, ink: m.ink }];
  }),
);

export function getImage(id: string): ImageAsset {
  const image = images[id];
  if (!image) throw new Error(`Unknown image id "${id}"`);
  return image;
}
