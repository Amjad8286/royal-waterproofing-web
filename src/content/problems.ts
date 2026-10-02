import type { Problem } from "@/types/content";

/** Symptom-first entry points: people know what they see, not the service name. */
export const problems: Problem[] = [
  {
    slug: "ceiling-leaks",
    title: "Ceiling leaks in the monsoon",
    description: "Drips, stains or bubbling paint on the top-floor ceiling.",
    icon: "droplets",
    services: ["terrace-roof-waterproofing", "leakage-detection-repair"],
  },
  {
    slug: "damp-walls",
    title: "Damp or peeling walls",
    description: "Patches that grow every monsoon and paint that won't stay on.",
    icon: "brick-wall",
    services: ["wall-dampness-treatment", "crack-repair-sealing"],
  },
  {
    slug: "terrace-ponding",
    title: "Water ponding on the terrace",
    description: "Puddles still there a day after the rain has stopped.",
    icon: "waves",
    services: ["terrace-roof-waterproofing"],
  },
  {
    slug: "bathroom-seepage",
    title: "Bathroom leakage",
    description: "Damp beside the bathroom, or a stain on the ceiling of the flat below.",
    icon: "shower-head",
    services: ["bathroom-waterproofing", "leakage-detection-repair"],
  },
  {
    slug: "basement-water",
    title: "Water in the basement or parking",
    description: "Seepage through walls or the floor, a leaking podium, or a wet lift pit.",
    icon: "layers-down",
    services: ["basement-waterproofing"],
  },
  {
    slug: "cracks",
    title: "Cracks letting water in",
    description: "In external walls, ceilings, terraces or around windows.",
    icon: "crack",
    services: ["crack-repair-sealing", "wall-dampness-treatment"],
  },
  {
    slug: "mould-salts",
    title: "Mould or white salt marks",
    description: "Black spots in corners or powdery white deposits on walls.",
    icon: "sprout",
    services: ["wall-dampness-treatment", "basement-waterproofing"],
  },
  {
    slug: "unknown-leak",
    title: "A leak you can't trace",
    description: "Damp with no obvious cause, or a leak that survived earlier repairs.",
    icon: "scan-search",
    services: ["leakage-detection-repair"],
  },
];
