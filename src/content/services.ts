import type { FAQ, Service } from "@/types/content";

const faqs = (slug: string, items: [string, string][]): FAQ[] =>
  items.map(([question, answer], i) => ({ id: `${slug}-${i + 1}`, question, answer }));

/** Shared warranty exclusions; each service adds its own specifics. */
const standardExclusions = [
  "Damage from later building work, drilling or new fixtures through the treated area",
  "Leaks from plumbing or areas outside the agreed scope",
  "Problems caused by skipping the basic maintenance in your care guide",
];

export const services: Service[] = [
  {
    slug: "terrace-roof-waterproofing",
    name: "Terrace & Roof Waterproofing",
    shortName: "Terrace & roof",
    group: "residential",
    icon: "cloud-rain",
    summary: "Stop rain coming through the top-floor ceiling and keep the slab protected.",
    intro:
      "Damp patches on the top-floor ceiling, water ponding after rain, or cracks across the terrace? We find where the water gets in, repair the surface and apply a seamless membrane built for Mumbai's sun, monsoon and foot traffic.",
    image: "service-terrace-roof",
    keyFacts: {
      duration: { value: "2–5 days for most homes", placeholder: true },
      warranty: { value: "Up to 10 years, by system", placeholder: true },
      suitableFor: "Society terraces, bungalows and flat roofs",
    },
    signs: [
      "Damp patches or stains on the top-floor ceiling after rain",
      "Water still ponding on the terrace a day after the rain stops",
      "Cracks in the terrace surface, screed or along the parapet",
      "Paint peeling or bubbling on the ceiling below",
      "Leaks around rainwater outlets, pipes or AC stands",
      "Plants or moss growing in joints and cracks",
    ],
    causes: [
      {
        title: "Poor slope to the outlets",
        description: "If the terrace doesn't fall toward its drains, water sits on the surface and finds every weak point.",
      },
      {
        title: "Heat and movement",
        description: "Daily heating and cooling makes concrete and screed expand and contract until it cracks.",
      },
      {
        title: "Failed brickbat coba or old coatings",
        description:
          "Traditional brickbat coba cracks and absorbs water with age, and coatings break down under sun and foot traffic. Once water gets underneath, it spreads through the slab.",
      },
      {
        title: "Weak junctions and penetrations",
        description:
          "Where the floor meets the parapet, and around pipes and outlets, unsealed joints are the most common way in.",
      },
    ],
    solutionIntro:
      "We start with the cause: correcting slope where needed, opening and filling cracks, and building coving at the wall-floor junction. Then we apply the system that suits your terrace's exposure and use.",
    systems: [
      {
        name: "Liquid-applied polyurethane (PU) membrane",
        description:
          "A seamless, elastic coating that bridges hairline cracks and moves with the slab. UV-stable topcoats keep it working in direct sun.",
        bestFor: "Exposed terraces with light foot traffic",
      },
      {
        name: "Heat-reflective elastomeric acrylic",
        description:
          "A flexible coating in a light, reflective finish that lowers surface temperature as well as keeping water out.",
        bestFor: "Roofs where top-floor heat is also a problem",
      },
      {
        name: "Modified bitumen (APP/SBS) sheet membrane",
        description:
          "Torch-applied or self-adhesive sheets with lapped seams, usually protected by a screed or tiles.",
        bestFor: "Large roofs and terraces that will be tiled over",
      },
      {
        name: "Polymer-modified cementitious coating",
        description: "A breathable, cement-based waterproofing layer applied under new tiles or screed.",
        bestFor: "Terraces being re-tiled",
      },
    ],
    benefits: [
      { title: "Dry rooms below", description: "Water is stopped at the surface, before it soaks into the slab and the ceiling under it." },
      { title: "A protected slab", description: "Keeping water out of the concrete protects the steel reinforcement from rust and spalling." },
      { title: "Cooler top floors", description: "Reflective finishes can noticeably reduce the heat coming through the roof." },
      { title: "A usable terrace", description: "Walkable topcoats, or tiles over the membrane if you use the space heavily." },
    ],
    process: [
      { title: "Inspection and mapping", description: "We check slope, outlets, cracks, junctions and the ceiling below, and take moisture readings." },
      { title: "Surface preparation", description: "Cleaning, removing loose screed or failed coatings, and grinding where adhesion needs it." },
      { title: "Repairs and detailing", description: "Cracks opened and filled, coving built at the parapet, outlets and pipes collared." },
      { title: "Membrane application", description: "Primer, reinforcing fabric at weak points, then the membrane in the specified number of coats." },
      { title: "Topcoat or protection", description: "A UV-stable topcoat, reflective finish, or screed and tiles, depending on the system." },
      { title: "Flood test and handover", description: "Where the terrace allows it, we hold water on it to prove the work, then hand over with care instructions." },
    ],
    applications: [
      "Housing society terraces",
      "Bungalow and row-house terraces",
      "Balconies and sit-outs",
      "Terrace gardens (with root-resistant systems)",
      "Chajjas, canopies and porch roofs",
      "Podium slabs",
    ],
    costFactors: [
      "Terrace area and shape",
      "Condition of the existing surface, and whether old tiles or coatings must come off",
      "Slope correction needed for proper drainage",
      "The system chosen and its thickness",
      "Number of pipes, outlets and other details to seal",
      "Access and material handling to the roof",
    ],
    warranty: {
      summary:
        "Every terrace job comes with a written warranty. Its length depends on the system and the condition of the surface, and is stated in your quote.",
      covered: [
        "Leaks through the treated area caused by failure of the membrane or our workmanship",
        "Inspection and repair of the treated area at no cost during the warranty period",
      ],
      notCovered: [...standardExclusions, "Blocked outlets and drains"],
      placeholder: true,
    },
    faqs: faqs("terrace-roof-waterproofing", [
      [
        "Can you waterproof the terrace without removing the existing tiles?",
        "Sometimes. If the tiles are well bonded and water is getting in through the joints, a compatible coating can go over them. If tiles are hollow or broken, or water is trapped beneath them, they need to come up. We tell you which at the inspection.",
      ],
      [
        "How long will terrace waterproofing last?",
        "It depends on the system, its thickness, how exposed the terrace is and how it's maintained. Your quotation states the expected life of the system we recommend.",
      ],
      [
        "Can the work be done during the monsoon?",
        "Most systems need a dry surface to bond and cure, so in the monsoon we work in dry spells and protect the area if rain threatens. It's best done between October and May, before the next monsoon.",
      ],
      [
        "Will the terrace be usable afterwards?",
        "Yes. Walkable topcoats handle normal foot traffic. If you use the terrace heavily or want furniture and planters, we may recommend tiles or a screed over the membrane.",
      ],
      [
        "Do we need to move out while you work?",
        "No. Terrace work happens outside. The only disruption is noise during surface preparation and people going up and down to the roof.",
      ],
    ]),
    related: ["leakage-detection-repair", "crack-repair-sealing", "wall-dampness-treatment"],
    seo: {
      title: "Terrace Waterproofing",
      description:
        "Terrace waterproofing in Mumbai that stops top-floor ceiling leaks at the source: crack and slope repairs, seamless membranes and a flood test.",
    },
  },
  {
    slug: "bathroom-waterproofing",
    name: "Bathroom Waterproofing",
    shortName: "Bathroom",
    group: "residential",
    icon: "shower-head",
    summary: "Fix seepage into the next room or the flat below, without guesswork.",
    intro:
      "Damp walls beside the bathroom, a stain on the ceiling of the flat below, or dark, crumbling grout? We find out whether it's the grout, the waterproofing or the plumbing, then fix that — without breaking tiles where possible, with full re-waterproofing where it isn't.",
    image: "service-bathroom",
    keyFacts: {
      duration: { value: "1–2 days at tile level; 5–7 days in full", placeholder: true },
      warranty: { value: "Up to 7 years on full re-waterproofing", placeholder: true },
      suitableFor: "Bathrooms, showers, toilets and wet areas",
    },
    signs: [
      "Damp or peeling paint on walls next to the bathroom",
      "Stains or drips on the ceiling of the room or flat below",
      "Dark, crumbling or missing grout lines",
      "Hollow-sounding or loose floor tiles",
      "Swollen door frames or skirting near the bathroom",
      "A musty smell or mould that keeps coming back",
    ],
    causes: [
      { title: "Porous or cracked grout", description: "Cement grout absorbs water. Once it cracks, every shower pushes water under the tiles." },
      {
        title: "Water trapped in the sunk",
        description:
          "Many Mumbai bathrooms sit on a sunken slab filled with debris. When the waterproofing above it fails, water collects in the filling and seeps into the flat below for months.",
      },
      { title: "Floor traps and pipe entries", description: "Gaps around the drain and pipes are the most common leak points in a bathroom floor." },
      {
        title: "Concealed plumbing leaks",
        description: "A leaking joint inside a wall or floor can look exactly like a waterproofing failure, so we test for it.",
      },
    ],
    solutionIntro:
      "Not every bathroom leak means breaking tiles. We confirm the source first, then choose the lightest treatment that will actually last.",
    systems: [
      {
        name: "Epoxy grouting and joint sealing",
        description:
          "Old grout raked out and replaced with non-absorbent epoxy grout; junctions and fixtures sealed with flexible sealant.",
        bestFor: "Leaks through joints, where the tiles and membrane are still sound",
      },
      {
        name: "Full re-waterproofing",
        description:
          "Tiles and screed removed, then a liquid or cementitious membrane across the floor and up the walls, with tape at corners and collars at drains.",
        bestFor: "Failed or missing membranes, and renovations",
      },
      {
        name: "Drain and penetration sealing",
        description: "Floor traps re-set with waterproof collars and pipe entries sealed with compatible sealants.",
        bestFor: "Leaks concentrated around the drain or pipes",
      },
      {
        name: "Plumbing pressure testing",
        description: "Supply lines isolated and pressure-tested, so hidden pipe leaks are found before any waterproofing is redone.",
        bestFor: "Damp that persists even when the shower isn't used",
      },
    ],
    benefits: [
      { title: "Fixes the real source", description: "We confirm whether it's grout, membrane or plumbing, so you don't pay for the wrong repair." },
      { title: "Less demolition", description: "Tile-level treatments avoid breaking up a bathroom that's otherwise sound." },
      { title: "Peace with the neighbours", description: "Stopping seepage into the flat below protects their ceiling and your relationship." },
      { title: "A healthier home", description: "No more damp walls feeding mould in the rooms around the bathroom." },
    ],
    process: [
      { title: "Inspection and testing", description: "Moisture readings around the bathroom, a tap test for hollow tiles, and plumbing checks." },
      { title: "Recommendation", description: "Tile-level treatment or full re-waterproofing, explained with the evidence." },
      { title: "Strip and prepare", description: "For full jobs: tiles and screed removed, the surface repaired and sloped to the drain." },
      { title: "Membrane and detailing", description: "Membrane on the floor and up the walls, reinforcing tape at corners, collars at drains." },
      { title: "Flood test", description: "The floor is flooded and checked before any tiles go back." },
      { title: "Re-tile and seal", description: "Tiles laid, joints filled with epoxy grout and junctions sealed, ready to use." },
    ],
    applications: [
      "Bathrooms and toilets",
      "Shower enclosures",
      "Toilets and powder rooms",
      "Kitchens and utility areas",
      "Balconies with drains",
      "Hotel and hostel bathrooms",
    ],
    costFactors: [
      "Whether tiles must be removed or the fix can be done at joint level",
      "Bathroom size and the wall height to be treated",
      "Plumbing repairs found during testing",
      "Re-tiling scope and the tiles you choose",
      "Debris removal and access in the building",
    ],
    warranty: {
      summary:
        "Full re-waterproofing comes with a written warranty; tile-level treatments carry a shorter one. The terms are in your quote.",
      covered: [
        "Leaks from the treated floor and walls caused by our membrane or workmanship",
        "Opening up and repairing the affected area during the warranty",
      ],
      notCovered: [
        "Leaks in pipes we didn't repair or replace",
        "Damage from later drilling, fixture changes or acid-based cleaners",
        "Grout and sealant worn down by abrasive cleaning",
      ],
      placeholder: true,
    },
    faqs: faqs("bathroom-waterproofing", [
      [
        "Can bathroom leakage be fixed without breaking tiles?",
        "Often, yes. If water is getting in through grout and joints, epoxy grouting and sealing can stop it. If the membrane under the tiles has failed, the tiles have to come up. The inspection tells us which.",
      ],
      [
        "How do you know it's not a plumbing leak?",
        "We test the plumbing separately by isolating and pressure-testing the lines. If a pipe is leaking, re-waterproofing alone won't fix it, so we check before recommending anything.",
      ],
      [
        "How long will the bathroom be out of use?",
        "Tile-level treatments are quick. Full re-waterproofing takes longer because the membrane must cure and be flood-tested before tiling. Your quotation includes a day-by-day schedule.",
      ],
      [
        "Water is leaking into my neighbour's flat. Can you help with both sides?",
        "Yes. We inspect from your bathroom and, with your neighbour's agreement, from their ceiling, then give you written findings you can share with them or your society.",
      ],
      [
        "Can you match my existing tiles?",
        "If you have spare tiles we'll reuse them. Otherwise we can source close matches or quote for retiling. It's agreed in writing before work starts.",
      ],
    ]),
    related: ["leakage-detection-repair", "wall-dampness-treatment", "crack-repair-sealing"],
    seo: {
      title: "Bathroom Leakage Repair",
      description:
        "Bathroom seepage into the next room or the flat below? We test the grout, membrane and plumbing, then fix the real source, often without breaking tiles.",
    },
  },
  {
    slug: "basement-waterproofing",
    name: "Basement Waterproofing",
    shortName: "Basement",
    group: "residential",
    icon: "layers-down",
    summary: "Turn a damp, leaking basement into dry, usable space.",
    intro:
      "Water seeping through the walls or floor after rain, white salt deposits, or a musty smell? We stop active leaks, seal the joints and treat the concrete from the inside, so the space stays dry under water pressure.",
    image: "service-basement",
    keyFacts: {
      duration: { value: "3–10 days depending on size", placeholder: true },
      warranty: { value: "Up to 10 years, by system", placeholder: true },
      suitableFor: "Basements, podium parking, lift pits and plant rooms",
    },
    signs: [
      "Water seeping through walls or the floor after rain",
      "Damp patches and peeling paint low on the walls",
      "White, powdery salt deposits (efflorescence)",
      "Water at the joint between the wall and the floor",
      "A musty smell, mould or condensation",
      "Rust stains or crumbling concrete",
    ],
    causes: [
      {
        title: "Groundwater pressure",
        description: "When the soil around a basement is saturated, water is pushed through any weakness in the concrete.",
      },
      {
        title: "No outside waterproofing",
        description: "Many basements were built without an external membrane, or it has failed and can't be reached.",
      },
      {
        title: "Construction joints and tie holes",
        description: "Joints between concrete pours, form-tie holes and honeycombed concrete give water an easy path in.",
      },
      { title: "Cracks and pipe entries", description: "Shrinkage cracks and unsealed service entries let water through under pressure." },
    ],
    solutionIntro:
      "In an existing building the outside of the basement usually can't be reached, so we treat it from the inside with systems designed to resist water pushing from behind (negative-side waterproofing).",
    systems: [
      {
        name: "Injection grouting",
        description:
          "Polyurethane or resin injected through packers into leaking cracks and joints, filling the path the water was using.",
        bestFor: "Active leaks through cracks and construction joints",
      },
      {
        name: "Crystalline waterproofing",
        description:
          "A cementitious treatment whose chemicals react with moisture to grow crystals inside the concrete's pores and hairline cracks.",
        bestFor: "Damp concrete walls and floors under water pressure",
      },
      {
        name: "Negative-side cementitious coating",
        description: "A polymer-modified cement coating rated for water pressure from behind, applied after repairs.",
        bestFor: "Masonry and concrete walls that need a robust inner barrier",
      },
      {
        name: "Drainage and sump",
        description: "Internal drainage channels leading to a sump pump, for basements under constant high water pressure.",
        bestFor: "Very wet sites where pressure can't be fully held back",
      },
    ],
    benefits: [
      { title: "Dry, usable space", description: "Storage, parking, a gym or a plant room you can actually use." },
      { title: "A protected structure", description: "Keeping water out of the concrete slows corrosion of the reinforcement." },
      { title: "Healthier air", description: "Less damp means less mould and musty smell drifting through the building." },
      { title: "Safer equipment", description: "Pumps, panels and stored goods stay out of standing water." },
    ],
    process: [
      { title: "Leak mapping", description: "We locate active leaks, damp areas, joints and pipe entries, and take readings." },
      { title: "Stop active water", description: "Injection packers and fast-setting plugs stop running water first." },
      { title: "Surface preparation", description: "Paint and weak plaster removed back to sound concrete." },
      { title: "Treatment", description: "Crystalline or cementitious system applied, with joints and pipe entries detailed." },
      { title: "Finish and protect", description: "Coving at the wall-floor joint and a protective finish where needed." },
      { title: "Monitor and hand over", description: "We check the treated areas after heavy rain where possible, then hand over." },
    ],
    applications: [
      "Basements in residential towers",
      "Basement and podium car parks",
      "Lift pits",
      "Plant and pump rooms",
      "Retaining walls",
      "Underground stores and archives",
    ],
    costFactors: [
      "How much water is coming in, and under what pressure",
      "Area of walls and floor to treat",
      "Number and length of cracks and joints to inject",
      "Finishes to remove and restore",
      "Whether drainage or a sump is needed",
    ],
    warranty: {
      summary:
        "Basement treatments come with a written warranty whose length depends on the system and site conditions. The terms are in your quote.",
      covered: [
        "Water entering through treated walls, floors and joints because of system or workmanship failure",
        "Re-injection or re-treatment of the affected area during the warranty",
      ],
      notCovered: [...standardExclusions, "Flooding from above ground level, or drainage and pumps we didn't install"],
      placeholder: true,
    },
    faqs: faqs("basement-waterproofing", [
      [
        "Can a basement be waterproofed from the inside?",
        "Yes. Negative-side systems such as crystalline treatments, pressure-rated coatings and injection grouting are designed to work with water pushing from behind. They're the standard approach for existing buildings.",
      ],
      [
        "Will my basement be completely dry?",
        "In most cases, yes. On very wet sites we may combine treatment with drainage and a sump. We'll tell you what's realistic for your basement before you commit.",
      ],
      [
        "Water is coming in right now. Can you still treat it?",
        "Yes. Injection grouting works on actively leaking cracks, and fast-setting plugs stop running water so the rest of the treatment can go ahead.",
      ],
      [
        "Do you treat lift pits?",
        "Yes. Lift pits are a common source of standing water. We stop the inflow and treat the pit so the equipment stays dry.",
      ],
    ]),
    related: ["crack-repair-sealing", "new-construction-waterproofing", "leakage-detection-repair"],
    seo: {
      title: "Basement Waterproofing",
      description:
        "Basement and lift-pit waterproofing from the inside: injection grouting for active leaks, crystalline treatments and pressure-rated coatings.",
    },
  },
  {
    slug: "wall-dampness-treatment",
    name: "Wall Dampness & Seepage Treatment",
    shortName: "Damp walls",
    group: "residential",
    icon: "brick-wall",
    summary: "Stop damp walls coming back after every repaint.",
    intro:
      "Peeling paint, damp patches, white salt marks or mould that come back every monsoon? Repainting won't hold. We find whether the water is coming through the external wall, rising from the ground or leaking from a pipe, and treat that.",
    image: "service-wall-dampness",
    keyFacts: {
      duration: { value: "2–6 days, plus drying time", placeholder: true },
      warranty: { value: "Up to 5 years, by treatment", placeholder: true },
      suitableFor: "Interior and exterior walls, ground floors",
    },
    signs: [
      "Damp patches that grow during the monsoon",
      "Paint bubbling, flaking or peeling",
      "White, powdery salt marks (efflorescence)",
      "Black mould spots, especially in corners",
      "A tide mark low on ground-floor walls",
      "Plaster that sounds hollow or crumbles",
    ],
    causes: [
      {
        title: "Rain getting through outside walls",
        description: "Cracks in external plaster, porous masonry, worn paint and gaps around windows let rain soak in.",
      },
      {
        title: "Rising damp",
        description: "Without a working damp-proof course, ground moisture wicks up through masonry and carries salts with it.",
      },
      {
        title: "Hidden plumbing leaks",
        description: "Leaking concealed pipes and bathroom seepage often show up as damp on a neighbouring wall.",
      },
      {
        title: "Condensation",
        description: "Poor ventilation lets moisture settle on cold walls. That needs ventilation, not waterproofing — and we'll say so.",
      },
    ],
    solutionIntro:
      "Dampness is a symptom. We diagnose the source from moisture readings and the pattern of the damage, then treat the source and restore the wall.",
    systems: [
      {
        name: "External crack sealing and elastomeric coating",
        description: "Cracks opened and filled, then a flexible, breathable waterproof coating on the outside face.",
        bestFor: "Rain penetrating through external walls",
      },
      {
        name: "Chemical damp-proof course",
        description: "A silane/siloxane cream injected into a mortar course to form a water-repellent barrier against rising moisture.",
        bestFor: "Rising damp in ground-floor walls",
      },
      {
        name: "Salt-resistant replastering",
        description: "Salt-contaminated plaster removed and replaced with a breathable, salt-resistant render.",
        bestFor: "Walls damaged by efflorescence and salts",
      },
      {
        name: "Source repairs",
        description: "Plumbing leaks fixed, window and frame joints resealed, and adjoining bathrooms treated.",
        bestFor: "Damp caused by a leak rather than the wall itself",
      },
    ],
    benefits: [
      { title: "A finish that lasts", description: "Paint stays on walls that are no longer wet." },
      { title: "Healthier rooms", description: "Less mould and musty air." },
      { title: "Protected masonry", description: "Salt and moisture stop breaking down your plaster and brickwork." },
      { title: "No more repaint cycle", description: "Fix it once instead of repainting after every monsoon." },
    ],
    process: [
      { title: "Diagnosis", description: "Moisture readings, the tide-mark pattern, exterior checks and plumbing tests where needed." },
      { title: "Treat the source", description: "External sealing, damp-proof course injection or leak repair." },
      { title: "Remove damaged plaster", description: "Salt-contaminated plaster is taken back to sound masonry." },
      { title: "Replaster and dry", description: "Breathable, salt-resistant plaster, then time for the wall to dry out." },
      { title: "Finish", description: "Breathable primer and paint, so any remaining moisture can escape." },
    ],
    applications: [
      "Living rooms and bedrooms",
      "Walls next to bathrooms and kitchens",
      "Ground-floor and basement walls",
      "External walls of societies and towers",
      "Boundary and compound walls",
      "Stairwells and common areas",
    ],
    costFactors: [
      "Source of the damp: rain, rising damp or plumbing",
      "Wall area to treat and replaster",
      "External access, such as ladders or scaffolding",
      "Finishes to restore: paint, tiles or wallpaper",
      "Drying time before final decoration",
    ],
    warranty: {
      summary: "Damp treatments carry a written warranty matched to the treatment used. The terms are in your quote.",
      covered: [
        "Damp returning in the treated area because the treatment or our workmanship failed",
        "Re-treatment of the affected area during the warranty",
      ],
      notCovered: [...standardExclusions, "Condensation caused by ventilation or how rooms are used"],
      placeholder: true,
    },
    faqs: faqs("wall-dampness-treatment", [
      [
        "Why does the damp come back after I repaint?",
        "Paint doesn't stop water. While the wall stays wet, new paint will bubble and peel again. Fixing the source is what makes the finish last.",
      ],
      [
        "How long before I can repaint?",
        "Walls need to dry out after treatment, and saturated masonry can take several weeks. We take readings and tell you when it's safe to decorate.",
      ],
      [
        "Could my damp be condensation?",
        "Sometimes. Condensation tends to appear on cold outside walls, in corners and behind furniture, often with mould. If that's the cause, we'll recommend ventilation instead of selling you waterproofing.",
      ],
      [
        "Is rising damp treatment messy?",
        "Drilling and replastering create dust, so we protect floors and furniture and clean up every day.",
      ],
    ]),
    related: ["crack-repair-sealing", "bathroom-waterproofing", "leakage-detection-repair"],
    seo: {
      title: "Wall Seepage Treatment",
      description:
        "Damp walls, peeling paint, salt marks or mould? We find whether it's rain, rising damp or a leak, treat the source and restore the wall properly.",
    },
  },
  {
    slug: "crack-repair-sealing",
    name: "Crack Repair & Sealing",
    shortName: "Cracks",
    group: "repairs",
    icon: "crack",
    summary: "Seal cracks before they let water into the structure.",
    intro:
      "Cracks in walls, ceilings, terraces or slabs let water in and get worse every season. We work out what kind of crack it is, then seal it with a material that suits how it moves.",
    image: "service-crack-repair",
    keyFacts: {
      duration: { value: "1–3 days for most homes", placeholder: true },
      warranty: { value: "Up to 3 years on sealed cracks", placeholder: true },
      suitableFor: "Walls, slabs, terraces and joints",
    },
    signs: [
      "Hairline or wide cracks in plaster or concrete",
      "Water seeping through a crack when it rains",
      "Cracks at the corners of windows and doors",
      "Gaps where the concrete frame meets the brickwork",
      "Cracks that reopen after being filled",
      "Rust stains or spalling concrete around a crack",
    ],
    causes: [
      { title: "Shrinkage", description: "Plaster and concrete shrink as they cure, leaving fine cracks." },
      {
        title: "Thermal movement",
        description: "Daily heating and cooling opens and closes cracks, especially on roofs and sun-facing walls.",
      },
      { title: "Different materials meeting", description: "Concrete frames and brick infill move differently, so their joints crack." },
      {
        title: "Corrosion or structural movement",
        description:
          "Rusting reinforcement and settlement can crack concrete. These need an engineer's assessment, and we'll tell you if we think yours does.",
      },
    ],
    solutionIntro:
      "Rigid filler in a moving crack just cracks again. We classify each crack — hairline, moving, leaking or structural — and seal it accordingly.",
    systems: [
      {
        name: "Flexible sealant in a routed groove",
        description:
          "The crack is opened into a clean V-groove and filled with a flexible PU or polysulphide sealant that moves with the building.",
        bestFor: "Active cracks that open and close",
      },
      {
        name: "Injection (PU or epoxy)",
        description:
          "Water-reactive PU stops leaking cracks; epoxy bonds a crack back together where an engineer recommends it.",
        bestFor: "Leaking cracks in concrete, and bonded repairs",
      },
      {
        name: "Fibre mesh and elastomeric coating",
        description: "Mesh bedded over the cracks, then a flexible coating across the surface to bridge future hairlines.",
        bestFor: "Networks of fine cracks on plaster and facades",
      },
      {
        name: "Concrete repair mortar",
        description: "Rust treated on exposed reinforcement, then polymer-modified mortar rebuilds the damaged concrete.",
        bestFor: "Spalled concrete around corroding steel",
      },
    ],
    benefits: [
      { title: "Water kept out", description: "Sealed cracks stop rain soaking into walls and slabs." },
      { title: "Slower deterioration", description: "Less water means less corrosion and salt damage." },
      { title: "Repairs that move", description: "Flexible materials stop the same crack reappearing." },
      { title: "A clean finish", description: "We restore the surface so the repair blends in after painting." },
    ],
    process: [
      { title: "Survey and classify", description: "We record each crack, its width, and whether it's moving or leaking." },
      { title: "Prepare", description: "Loose material removed and cracks opened into clean grooves." },
      { title: "Seal or inject", description: "Sealant, injection or mesh, depending on the crack type." },
      { title: "Coat", description: "A flexible coating where cracks are widespread." },
      { title: "Finish", description: "The surface restored and ready to paint." },
    ],
    applications: [
      "Internal and external walls",
      "Ceilings and slabs",
      "Terraces and balconies",
      "Expansion and movement joints",
      "Concrete columns and beams",
      "Parking decks and ramps",
    ],
    costFactors: [
      "Number and total length of cracks",
      "Crack type: hairline, moving, leaking or structural",
      "Height and access",
      "Injection versus surface sealing",
      "Surface finish to restore",
    ],
    warranty: {
      summary: "Crack repairs carry a written warranty on the sealed cracks, stated in your quote.",
      covered: ["Sealed cracks reopening or leaking because of material or workmanship failure"],
      notCovered: [
        "New cracks elsewhere, or cracks caused by structural movement",
        "Cracks an engineer has advised need structural repair",
        ...standardExclusions.slice(0, 1),
      ],
      placeholder: true,
    },
    faqs: faqs("crack-repair-sealing", [
      [
        "Is my crack structural?",
        "Warning signs include wide or stepped cracks, cracks that keep growing, diagonal cracks from the corners of openings, and doors or windows that start to stick. If we see these, we'll recommend a structural engineer before any cosmetic repair. We don't do structural design.",
      ],
      [
        "Will the crack come back?",
        "Not if it's sealed with the right material. Moving cracks need flexible sealants; rigid fillers in a moving crack will reopen.",
      ],
      [
        "Can you repair cracks without repainting the whole wall?",
        "Yes, though a patched area can look different from old paint. Many customers repaint the wall or facade bay for an even finish.",
      ],
      [
        "Do you fix cracks in water tanks?",
        "We repair cracks in tanks that don't hold drinking water. Drinking-water tanks need certified potable-safe systems, which we'll specify if your job needs them.",
      ],
    ]),
    related: ["wall-dampness-treatment", "terrace-roof-waterproofing", "basement-waterproofing"],
    seo: {
      title: "Crack Repair & Sealing",
      description:
        "Cracks in walls, ceilings, terraces or slabs letting water in? We classify each crack and seal it with the right flexible or injected repair.",
    },
  },
  {
    slug: "leakage-detection-repair",
    name: "Leakage Detection & Repair",
    shortName: "Leak detection",
    group: "repairs",
    icon: "scan-search",
    summary: "Find the exact source of a leak before anything gets broken.",
    intro:
      "A damp patch you can't explain, a leak that survived earlier repairs, or a dispute about whose flat it's coming from? We trace the water with non-invasive tests, show you the evidence, then repair the source.",
    image: "service-leak-detection",
    keyFacts: {
      duration: { value: "Usually diagnosed in one visit", placeholder: true },
      warranty: { value: "Repairs carry a written warranty", placeholder: true },
      suitableFor: "Flats, bungalows and commercial spaces",
    },
    signs: [
      "Damp patches with no obvious cause",
      "Stains spreading on a ceiling below a bathroom or terrace",
      "Leaks that came back after earlier repairs",
      "Higher water bills or the sound of running water",
      "Mould in unusual places",
      "Disagreement with neighbours about where water is coming from",
    ],
    causes: [
      { title: "Concealed plumbing", description: "Joints in pipes buried in walls and floors leak out of sight." },
      {
        title: "Waterproofing failure above",
        description: "Terraces, balconies and bathrooms above often leak somewhere other than where the stain appears.",
      },
      {
        title: "External walls and openings",
        description: "Rain gets in at windows, AC units or cracks and travels inside the wall.",
      },
      { title: "Drains and overflows", description: "AC condensate lines, tank overflows and blocked drains are easy to miss." },
    ],
    solutionIntro:
      "Water travels before it shows up, so the stain is rarely right under the source. We narrow it down with tests that don't damage your home, and confirm the source before recommending a repair.",
    systems: [
      {
        name: "Moisture mapping",
        description: "Pin and pinless moisture meters map how wet each area is, showing which way the water is travelling.",
        bestFor: "Every investigation",
      },
      {
        name: "Thermal imaging",
        description: "A thermal camera shows the temperature difference wet materials create, tracing hidden water paths.",
        bestFor: "Ceilings, walls and floors with concealed leaks",
      },
      {
        name: "Pressure and flood tests",
        description: "Pipes are isolated and pressure-tested; terraces and bathrooms are flooded to see whether they hold water.",
        bestFor: "Telling plumbing leaks apart from waterproofing failures",
      },
      {
        name: "Targeted repair",
        description: "The confirmed source is repaired directly: a pipe joint, a drain seal, a junction or a section of membrane.",
        bestFor: "Avoiding unnecessary demolition",
      },
    ],
    benefits: [
      { title: "Fix the real cause", description: "No more paying for repairs that treat the stain instead of the source." },
      { title: "Less breakage", description: "Non-invasive tests mean we open up only where we need to." },
      {
        title: "Written findings",
        description: "A short report with photos and readings to share with neighbours, your society or insurers.",
      },
      { title: "A faster resolution", description: "Clear evidence ends arguments about where the water is coming from." },
    ],
    process: [
      { title: "History and symptoms", description: "When it leaks, how much, and what's above and around it." },
      { title: "Non-invasive testing", description: "Moisture mapping and thermal imaging to trace the water path." },
      { title: "Isolation tests", description: "Pressure tests on pipes and flood tests on wet areas to confirm the source." },
      { title: "Findings and recommendation", description: "Photos, readings and the repair we recommend, in writing." },
      { title: "Repair and re-test", description: "We fix the source and test again to confirm it's resolved." },
    ],
    applications: [
      "Flats with leaks from the flat above",
      "Homes with unexplained damp",
      "Offices, shops and restaurants",
      "Hotels and serviced apartments",
      "Housing societies and common areas",
      "Neighbour or society disputes over where a leak starts",
    ],
    costFactors: [
      "How many tests it takes to confirm the source",
      "Size and layout of the affected area",
      "Access to the flat or area above",
      "The repair needed once the source is found",
    ],
    warranty: {
      summary: "The repair we carry out after finding the source comes with a written warranty, stated in your quote.",
      covered: ["Leaks from the repaired point caused by our materials or workmanship"],
      notCovered: ["Other leak sources found later in different parts of the building", ...standardExclusions.slice(0, 1)],
      placeholder: true,
    },
    faqs: faqs("leakage-detection-repair", [
      [
        "Can you find a leak without breaking walls or floors?",
        "Usually we can narrow it down with moisture mapping, thermal imaging and pressure tests. Sometimes a small opening is needed to confirm the exact point, and we'll agree that with you first.",
      ],
      [
        "The leak is coming from the flat above. What can you do?",
        "We test from your side and, with your neighbour's permission, from theirs. Our written findings help everyone — including the society — agree on the source and the repair.",
      ],
      [
        "Do you provide a report for insurance or the society?",
        "Yes. You get a short written report with photos, readings and our conclusion.",
      ],
      [
        "Will you fix the leak once you find it?",
        "Yes. We repair most sources ourselves — plumbing joints, drains, junctions and membranes — and re-test afterwards.",
      ],
    ]),
    related: ["bathroom-waterproofing", "terrace-roof-waterproofing", "wall-dampness-treatment"],
    seo: {
      title: "Leak Detection & Repair",
      description:
        "Can't find where a leak is coming from? We trace it with moisture mapping, thermal imaging and pressure tests, then repair the real source.",
    },
  },
  {
    slug: "commercial-waterproofing",
    name: "Commercial Waterproofing",
    shortName: "Commercial",
    group: "commercial",
    icon: "building",
    summary: "Keep tenants, stock and operations dry, with minimal disruption.",
    intro:
      "Roof leaks over offices and stores, seepage into basement parking, or wet areas in a hotel or restaurant? We survey, specify and deliver waterproofing in phases that keep your building open.",
    image: "service-commercial",
    keyFacts: {
      duration: { value: "Phased to suit your operations", placeholder: false },
      warranty: { value: "Up to 10 years, by system", placeholder: true },
      suitableFor: "Offices, shops, hotels, hospitals and housing societies",
    },
    signs: [
      "Roof leaks over offices, shops or stock",
      "Seepage into basement car parks",
      "Water coming through expansion joints on podiums and decks",
      "Facade leaks around windows and cladding",
      "Recurring leaks in hotel or restaurant wet areas",
      "Complaints from tenants or residents",
    ],
    causes: [
      { title: "Large, exposed roofs", description: "Big flat roofs with plant, skylights and many penetrations have more places to fail." },
      { title: "Traffic and movement", description: "Parking decks and podiums flex and wear under vehicles." },
      { title: "Ageing systems", description: "Membranes at the end of their life fail across large areas at once." },
      { title: "Deferred maintenance", description: "Blocked outlets and failed sealants turn small leaks into big ones." },
    ],
    solutionIntro:
      "We start with a condition survey and a written specification, then plan the work in zones and hours that keep your building running.",
    systems: [
      {
        name: "Roof membrane systems",
        description: "PU, PU-hybrid or modified-bitumen systems detailed around plant, skylights and penetrations.",
        bestFor: "Flat roofs on offices, malls and housing societies",
      },
      {
        name: "Deck and podium traffic coatings",
        description: "Hard-wearing, crack-bridging coatings with an anti-slip finish and new line marking.",
        bestFor: "Parking decks, ramps and podiums",
      },
      {
        name: "Expansion joint systems",
        description: "Joints rebuilt with backer rod and flexible sealant, or replaced with preformed joint systems.",
        bestFor: "Leaking movement joints",
      },
      {
        name: "Wet-area waterproofing",
        description: "Kitchens, bathrooms and plant rooms re-waterproofed in short shutdown windows.",
        bestFor: "Hotels, restaurants, hospitals and gyms",
      },
    ],
    benefits: [
      { title: "Your business keeps running", description: "Phased work, out-of-hours shifts and clear site rules." },
      { title: "Assets protected", description: "Stock, equipment, fit-outs and tenants stay dry." },
      {
        title: "Documented quality",
        description: "Method statements, material data sheets and inspection records for your files.",
      },
      { title: "One accountable contractor", description: "Survey, specification and delivery from the same team." },
    ],
    process: [
      { title: "Site survey", description: "A roof, deck and facade condition survey with photos and moisture readings." },
      { title: "Proposal", description: "Specification, method statement, programme and itemised price." },
      { title: "Mobilisation", description: "Safety plan, permits, access equipment and site set-up." },
      { title: "Phased execution", description: "Work in zones and hours agreed with your facilities team, with checks at each stage." },
      { title: "Testing and handover", description: "Flood tests where practical, and inspection records for your files." },
      { title: "Planned maintenance", description: "Optional inspection visits to keep the system working through every monsoon." },
    ],
    applications: [
      "Office buildings",
      "Retail and malls",
      "Hotels and restaurants",
      "Hospitals and clinics",
      "Schools and colleges",
      "Housing society common areas",
    ],
    costFactors: [
      "Area and the system specified",
      "Phasing, and night or weekend work",
      "Access equipment and safety requirements",
      "Condition of the existing surface",
      "Documentation and quality-assurance requirements",
    ],
    warranty: {
      summary:
        "Commercial systems come with a written warranty and documentation pack. The length depends on the system and is set out in the specification.",
      covered: [
        "Leaks through treated areas caused by system or workmanship failure",
        "Repair of affected areas during the warranty",
      ],
      notCovered: [...standardExclusions, "Damage from vehicles, plant installation or other contractors"],
      placeholder: true,
    },
    faqs: faqs("commercial-waterproofing", [
      [
        "Can you work without shutting our business?",
        "Yes. We phase the work by zone and schedule noisy or disruptive tasks out of hours, agreed in advance with your facilities team.",
      ],
      [
        "Do you provide method statements and documentation?",
        "Yes. Commercial jobs come with a method statement, material data sheets and inspection records.",
      ],
      [
        "Do you offer maintenance plans?",
        "We offer planned inspection visits before each monsoon to clear outlets, check sealants and catch problems early.",
      ],
      [
        "Can you work with our main contractor or consultant?",
        "Yes. We can work to your consultant's specification or propose one, and coordinate with other trades on site.",
      ],
    ]),
    related: ["industrial-waterproofing", "terrace-roof-waterproofing", "crack-repair-sealing"],
    seo: {
      title: "Commercial Waterproofing",
      description:
        "Commercial roof, podium and wet-area waterproofing in Mumbai for offices, shops, hotels and hospitals, phased so your building stays open.",
    },
  },
  {
    slug: "industrial-waterproofing",
    name: "Industrial Waterproofing",
    shortName: "Industrial",
    group: "commercial",
    icon: "factory",
    summary: "Protect plant, stock and production from water, with minimal downtime.",
    intro:
      "Leaking metal roofs, wet warehouse floors, or a tank that won't hold water? We plan industrial waterproofing around your production, permits and safety rules, and document every stage.",
    image: "service-industrial",
    keyFacts: {
      duration: { value: "Planned around shutdowns and shifts", placeholder: false },
      warranty: { value: "Up to 10 years, by system", placeholder: true },
      suitableFor: "Factories, warehouses, godowns and cold stores",
    },
    signs: [
      "Leaks at fasteners, overlaps or skylights on metal roofs",
      "Rust spreading across roof sheets",
      "Water on warehouse floors after rain",
      "Tanks or pits losing water",
      "Leaking expansion joints in slabs",
      "Damp affecting stock or electrical equipment",
    ],
    causes: [
      {
        title: "Fastener and overlap failure",
        description: "Metal roofs move with temperature, and the seals around fasteners and laps break down.",
      },
      { title: "Corrosion", description: "Once the coating fails, rust thins the sheets and opens holes." },
      { title: "Heavy use", description: "Forklifts, chemicals and temperature swings wear down floors and joints." },
      {
        title: "Water-retaining structures",
        description: "Tanks, pits and channels crack and leak under constant water pressure.",
      },
    ],
    solutionIntro:
      "We survey, specify and plan the work with your facility team, then deliver it in zones or shutdown windows with full safety documentation.",
    systems: [
      {
        name: "Metal roof restoration coatings",
        description: "Rust treated, fasteners and laps sealed, then an elastomeric or PU coating across the sheets.",
        bestFor: "Structurally sound metal roofs with leaks and corrosion",
      },
      {
        name: "Gutter and skylight treatment",
        description: "Gutters lined, skylight perimeters resealed and damaged panels replaced.",
        bestFor: "Leaks concentrated at gutters and rooflights",
      },
      {
        name: "Tank and pit waterproofing",
        description: "Crystalline and cementitious systems, joint treatment and injection for water-retaining structures.",
        bestFor: "Fire-water tanks, sumps, pits and effluent channels (non-drinking water)",
      },
      {
        name: "Heavy-duty floor and joint systems",
        description: "Resin and cementitious coatings with rebuilt expansion joints for trafficked floors.",
        bestFor: "Warehouse floors, loading bays and plant rooms",
      },
    ],
    benefits: [
      { title: "Minimal downtime", description: "Work planned around shifts, shutdowns and production." },
      {
        title: "Safety compliance",
        description: "Method statements, risk assessments and permits for work at height and hot work.",
      },
      { title: "Longer asset life", description: "Restoring a sound roof costs far less than replacing it." },
      { title: "Protected operations", description: "Stock, machinery and electrical systems stay dry." },
    ],
    process: [
      { title: "Survey and testing", description: "Roof, floor and tank surveys, moisture readings and leak tests." },
      { title: "Specification", description: "System selection, method statement and programme." },
      { title: "Safety planning", description: "Risk assessments, permits, access and edge protection." },
      { title: "Execution", description: "Zone-by-zone work with quality checks such as coating thickness readings." },
      { title: "Handover", description: "Test results and inspection records for your files." },
    ],
    applications: [
      "Factories and processing plants",
      "Warehouses, godowns and logistics centres",
      "Cold storage",
      "Fire-water tanks and sumps",
      "Effluent and treatment structures (non-drinking water)",
      "Loading bays and plant rooms",
    ],
    costFactors: [
      "Area and roof type (metal or concrete)",
      "Height, access and safety equipment",
      "Shutdown and shift constraints",
      "Chemical or temperature exposure",
      "Permits and documentation",
    ],
    warranty: {
      summary:
        "Industrial systems carry a written warranty matched to the system and operating conditions, set out in the specification.",
      covered: [
        "Leaks through treated areas caused by system or workmanship failure",
        "Repair of affected areas during the warranty",
      ],
      notCovered: [...standardExclusions, "Chemical exposure or traffic beyond the agreed specification"],
      placeholder: true,
    },
    faqs: faqs("industrial-waterproofing", [
      [
        "Can you work while the facility is operating?",
        "Usually, yes. We plan zones and shifts with your team and keep work areas segregated and safe.",
      ],
      [
        "Can you coat our metal roof instead of replacing it?",
        "If the sheets and structure are sound, a restoration coating usually costs far less than replacement. We check the condition first and tell you honestly if replacement is the better option.",
      ],
      [
        "Do you waterproof drinking-water tanks?",
        "Drinking-water tanks need certified potable-safe systems. We'll confirm the system and its certification for your job before quoting.",
      ],
      [
        "What safety documentation do you provide?",
        "Method statements, risk assessments, permit applications and crew training records, as your site requires.",
      ],
    ]),
    related: ["commercial-waterproofing", "basement-waterproofing", "crack-repair-sealing"],
    seo: {
      title: "Industrial Waterproofing",
      description:
        "Industrial waterproofing for metal roofs, warehouses, tanks and plant rooms, planned around your production and documented for safety.",
    },
  },
  {
    slug: "new-construction-waterproofing",
    name: "New Construction Waterproofing",
    shortName: "New construction",
    group: "commercial",
    icon: "hard-hat",
    summary: "Build waterproofing in from the foundations, not as a repair later.",
    intro:
      "Waterproofing is cheapest and most reliable when it's built in. We work with owners, builders and developers to specify and install systems stage by stage — basements, wet areas, terraces and facades.",
    image: "service-new-construction",
    keyFacts: {
      duration: { value: "Scheduled with your construction stages", placeholder: false },
      warranty: { value: "Up to 10 years, by element", placeholder: true },
      suitableFor: "Bungalows, residential towers and commercial projects",
    },
    signsTitle: "When to bring us in",
    signs: [
      "You're about to excavate or pour the foundations",
      "The building has a basement, lift pit or underground tank",
      "Wet areas are about to be tiled",
      "Terraces and podiums are being finished",
      "You want fewer post-handover complaints from buyers",
      "Your consultant needs a waterproofing specification",
    ],
    causesTitle: "Why waterproofing fails in new buildings",
    causes: [
      {
        title: "Left too late",
        description: "Membranes added after construction can't reach the outside of basements or the underside of slabs.",
      },
      { title: "Gaps between trades", description: "Pipes, conduits and fixings installed after waterproofing puncture it." },
      {
        title: "Unprotected membranes",
        description: "Membranes damaged by backfill, foot traffic or tiling before they've been protected.",
      },
      {
        title: "Joints and penetrations",
        description: "Construction joints and pipe sleeves left without waterstops or collars.",
      },
    ],
    solutionIntro:
      "We review the drawings, recommend a system for each element, and work to your construction programme, inspecting and testing at every stage.",
    systems: [
      {
        name: "Basement and foundation systems",
        description: "External membranes or tanking, crystalline admixtures, and waterstops at construction joints.",
        bestFor: "Basements, retaining walls and lift pits",
      },
      {
        name: "Wet-area membranes",
        description: "Liquid or cementitious membranes with corner tape and drain collars, flood-tested before tiling.",
        bestFor: "Bathrooms, kitchens and balconies",
      },
      {
        name: "Roof and terrace systems",
        description: "Membranes with slope, outlets and upstands designed in, and protected until handover.",
        bestFor: "Terraces, roofs and podiums",
      },
      {
        name: "Joints and penetrations",
        description: "Swellable strips and waterstops in construction joints; puddle flanges and collars at pipe entries.",
        bestFor: "Every element below ground or exposed to water",
      },
    ],
    benefits: [
      { title: "Lower lifetime cost", description: "Built-in waterproofing costs a fraction of repairing leaks after handover." },
      { title: "Fewer complaints", description: "Buyers and tenants move into dry buildings." },
      { title: "A protected reputation", description: "No leak call-backs on your projects." },
      { title: "Records for handover", description: "Inspection and test records for every waterproofed element." },
    ],
    process: [
      { title: "Drawing review", description: "We review the drawings and recommend a system for each element." },
      { title: "Stage schedule", description: "Waterproofing tied into your construction programme." },
      { title: "Installation", description: "Membranes, waterstops and details installed at each stage." },
      { title: "Inspection and testing", description: "Checks and flood tests before the next trade covers our work." },
      { title: "Handover file", description: "Inspection records and photos for the owner or buyers." },
    ],
    applications: [
      "Bungalows and row houses",
      "Residential towers and societies",
      "Commercial buildings",
      "Basements and podiums",
      "Lift pits and underground tanks",
      "Terraces and roof gardens",
    ],
    costFactors: [
      "Building size and the number of elements",
      "Systems specified for each element",
      "Number of site visits and stages",
      "Access and coordination with other trades",
      "Testing and documentation required",
    ],
    warranty: {
      summary:
        "Each waterproofed element is covered by a written warranty, recorded in the handover file with its inspection and test records.",
      covered: [
        "Leaks through installed systems caused by material or workmanship failure",
        "Repair of affected elements during the warranty",
      ],
      notCovered: ["Damage by other trades after our work was inspected and handed over", ...standardExclusions.slice(0, 1)],
      placeholder: true,
    },
    faqs: faqs("new-construction-waterproofing", [
      [
        "When should we involve you?",
        "As early as possible — ideally at design stage, and certainly before excavation. Basements can't be waterproofed from the outside once they're backfilled.",
      ],
      [
        "Can you work with our builder or contractor?",
        "Yes. We coordinate with your contractor's programme and the other trades so our work isn't damaged after it's installed.",
      ],
      [
        "Do you provide specifications?",
        "Yes. We can write a waterproofing specification for your consultant, or work to theirs.",
      ],
      [
        "Do you provide records for buyers?",
        "Yes. You get inspection and test records for the handover file.",
      ],
    ]),
    related: ["basement-waterproofing", "bathroom-waterproofing", "terrace-roof-waterproofing"],
    seo: {
      title: "New Construction Waterproofing",
      description:
        "Waterproofing designed into new homes and buildings — basements, wet areas, terraces and joints — installed and tested stage by stage.",
    },
  },
];

export const serviceGroups: { id: Service["group"]; label: string; description: string }[] = [
  {
    id: "residential",
    label: "Homes & residential",
    description: "Terraces, bathrooms, basements and walls in flats, bungalows and housing societies.",
  },
  {
    id: "repairs",
    label: "Repairs & diagnostics",
    description: "Tracing hidden leaks and sealing the cracks that let water in.",
  },
  {
    id: "commercial",
    label: "Commercial, industrial & new build",
    description: "Phased work, safety documentation and specifications for larger sites and new buildings.",
  },
];
