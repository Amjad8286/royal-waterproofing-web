import type { Sector } from "@/types/content";

/**
 * The kinds of buildings and clients the company works for. These describe
 * capabilities, not completed jobs, so they're safe to show before real case
 * studies exist. Shown on the Projects page and the home page.
 */
export const sectors: Sector[] = [
  {
    id: "housing-societies",
    title: "Housing societies",
    icon: "building",
    image: "mumbai-society",
    summary: "Terraces, external walls, water tanks and common areas.",
    description:
      "Terraces, external walls, water tanks and common areas for co-operative housing societies — inspected, explained to the committee and phased so residents aren't disrupted.",
    scope: [
      "Terrace waterproofing over old brickbat coba",
      "External wall crack repair and coating",
      "Overhead and underground water tanks",
      "Podiums, parking and common areas",
    ],
    services: ["terrace-roof-waterproofing", "wall-dampness-treatment", "crack-repair-sealing"],
  },
  {
    id: "flats-and-bungalows",
    title: "Flats & bungalows",
    icon: "house",
    image: "bathroom-corner",
    summary: "Bathroom leakage, damp walls and terrace leaks.",
    description:
      "Leaks inside individual homes: bathroom leakage into the flat below, damp and peeling walls, and terrace leaks in bungalows and top-floor flats.",
    scope: [
      "Bathroom leakage, without breaking tiles where possible",
      "Damp and peeling walls",
      "Top-floor and bungalow terraces",
      "Hidden leaks traced before anything is broken",
    ],
    services: ["bathroom-waterproofing", "leakage-detection-repair", "wall-dampness-treatment"],
  },
  {
    id: "commercial",
    title: "Offices, shops & hospitality",
    icon: "store",
    image: "service-commercial",
    summary: "Roofs, podiums and wet areas, phased around business hours.",
    description:
      "Roofs, podiums and wet areas in offices, shops, hotels, restaurants and hospitals — planned in phases and out of hours so the business keeps running.",
    scope: [
      "Flat roofs and terraces",
      "Podium decks and expansion joints",
      "Kitchens, toilets and plant rooms",
      "Method statements and inspection records",
    ],
    services: ["commercial-waterproofing", "crack-repair-sealing", "bathroom-waterproofing"],
  },
  {
    id: "industrial",
    title: "Factories & warehouses",
    icon: "factory",
    image: "service-industrial",
    summary: "Metal roofs, tanks and floors, planned around shutdowns.",
    description:
      "Metal roofs, gutters, tanks and floors in factories, warehouses and godowns, scheduled around shifts and shutdowns.",
    scope: [
      "Metal roof restoration coatings",
      "Gutters and skylights",
      "Fire-water tanks and sumps",
      "Trafficked floors and joints",
    ],
    services: ["industrial-waterproofing", "crack-repair-sealing"],
  },
  {
    id: "basements-podiums",
    title: "Basements & podiums",
    icon: "parking",
    image: "basement-wall",
    summary: "Seepage into basements, lift pits and parking.",
    description:
      "Seepage into basements, lift pits and podium car parks, stopped from the inside with systems built to resist water pressure.",
    scope: [
      "Injection grouting of leaking cracks and joints",
      "Crystalline treatment of walls and floors",
      "Lift pits and sumps",
      "Podium joints and drains",
    ],
    services: ["basement-waterproofing", "crack-repair-sealing"],
  },
  {
    id: "new-construction",
    title: "New construction",
    icon: "construction",
    image: "mumbai-towers-crane",
    summary: "Waterproofing built in, stage by stage, for builders.",
    description:
      "Waterproofing built in stage by stage for builders and developers — basements, wet areas, terraces and podiums — and checked before the next trade covers it.",
    scope: [
      "Drawing review and specification",
      "Basements, lift pits and retaining walls",
      "Bathrooms, balconies and terraces",
      "Inspection records for the handover file",
    ],
    services: ["new-construction-waterproofing", "basement-waterproofing"],
  },
];
