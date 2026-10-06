import type { Area } from "@/types/content";

/**
 * Service areas, one page each, grouped by city. Each page has its own copy
 * about local buildings and the problems they tend to have — never
 * copy-and-paste text between areas. A page covers a cluster of neighbouring
 * localities, named in its intro (the website assistant picks them up from
 * there), rather than one thin page per locality.
 *
 * Confirm this list matches where you actually work (see pendingFacts).
 */

/** Mumbai, Thane and Navi Mumbai — the market in `site.market.serviceRegion`. */
const mumbaiAreas: Area[] = [
  {
    slug: "santacruz",
    name: "Santacruz",
    zone: "Western Suburbs",
    intro: [
      "Santacruz is home ground — our office is in Sen Nagar, Santacruz East. We waterproof flats, housing societies and commercial buildings on both sides of the railway line, from Vakola and Kalina to Santacruz West.",
      "Much of the area's housing stock is older society buildings, many with traditional brickbat coba terraces that are now cracked and holding water. The other common complaint is bathroom leakage into the flat below, where the waterproofing under the floor has broken down.",
      "Being close by makes inspections easy to arrange, and it means we can come back quickly to check a terrace or bathroom after the first heavy rain.",
    ],
    commonProblems: [
      { problem: "Old brickbat coba terraces leaking into top-floor flats", service: "terrace-roof-waterproofing" },
      { problem: "Bathroom leakage into the flat below", service: "bathroom-waterproofing" },
      { problem: "Seepage through cracked external plaster", service: "wall-dampness-treatment" },
    ],
    featuredServices: [
      "terrace-roof-waterproofing",
      "bathroom-waterproofing",
      "wall-dampness-treatment",
      "leakage-detection-repair",
    ],
    nearby: ["vile-parle-juhu", "bandra-khar", "bandra-kurla-complex", "kurla-ghatkopar-chembur"],
    faqs: [
      {
        id: "santacruz-1",
        question: "Where exactly is your office?",
        answer:
          "S-9, Adarsh Apartment, 7th Rd, Sen Nagar, Santacruz East, Mumbai 400055. Call or WhatsApp before visiting so someone is there to meet you.",
      },
      {
        id: "santacruz-2",
        question: "Do you also work on redevelopment and new buildings?",
        answer:
          "Yes. Besides repairs in older buildings, we waterproof basements, lift pits, bathrooms and terraces in buildings under construction.",
      },
    ],
    placeholder: false,
  },
  {
    slug: "bandra-khar",
    name: "Bandra & Khar",
    zone: "Western Suburbs",
    intro: [
      "Bandra and Khar mix old bungalows and low-rise buildings with newer towers, and the sea-facing roads take the full force of the monsoon. We waterproof terraces, external walls, balconies and bathrooms across Bandra West and East, Pali Hill and Khar.",
      "On sea-facing buildings, wind-driven rain is pushed through hairline cracks in the plaster and around window frames, and the salty air breaks down paint and sealants faster than inland. The answer is usually crack repair and a flexible, breathable exterior coating rather than another coat of paint.",
      "In older bungalows and low-rise buildings the problems are more often at the top: flat terraces, parapet junctions and rainwater outlets that have been patched many times without the slope ever being fixed.",
    ],
    commonProblems: [
      { problem: "Wind-driven rain through sea-facing walls", service: "wall-dampness-treatment" },
      { problem: "Leaks around window frames and balconies", service: "crack-repair-sealing" },
      { problem: "Patched terraces that still pond water", service: "terrace-roof-waterproofing" },
    ],
    featuredServices: [
      "wall-dampness-treatment",
      "crack-repair-sealing",
      "terrace-roof-waterproofing",
      "bathroom-waterproofing",
    ],
    nearby: ["santacruz", "bandra-kurla-complex", "dadar-worli", "vile-parle-juhu"],
    faqs: [
      {
        id: "bandra-khar-1",
        question: "Our sea-facing wall leaks every monsoon even after repainting. Why?",
        answer:
          "Paint alone can't bridge cracks or stop rain that's driven sideways by the wind. The cracks need opening and sealing, and the wall needs a flexible waterproof coating designed for exterior use.",
      },
      {
        id: "bandra-khar-2",
        question: "Can you work on a bungalow without scaffolding the whole building?",
        answer:
          "Often, yes. Terraces need only roof access, and short sections of wall can be reached with ladders or a small tower. We'll tell you what access the job needs at the inspection.",
      },
    ],
    placeholder: false,
  },
  {
    slug: "vile-parle-juhu",
    name: "Vile Parle & Juhu",
    zone: "Western Suburbs",
    intro: [
      "From older societies in Vile Parle East to bungalows and beachfront buildings in Juhu, we handle terrace leaks, external wall seepage and bathroom leakage across Vile Parle and Juhu.",
      "Buildings near Juhu beach deal with salt-laden air and strong monsoon winds, which wear out coatings and sealants quickly. In Vile Parle, many society buildings from the 1970s and 80s still have their original terrace waterproofing and concealed plumbing, and both are reaching the end of their life.",
    ],
    commonProblems: [
      { problem: "Top-floor ceiling leaks in older societies", service: "terrace-roof-waterproofing" },
      { problem: "Damp walls next to bathrooms and kitchens", service: "leakage-detection-repair" },
      { problem: "Coatings and sealants worn out by sea air", service: "crack-repair-sealing" },
    ],
    featuredServices: [
      "terrace-roof-waterproofing",
      "leakage-detection-repair",
      "bathroom-waterproofing",
      "crack-repair-sealing",
    ],
    nearby: ["santacruz", "andheri", "bandra-khar"],
    faqs: [
      {
        id: "vile-parle-juhu-1",
        question: "The damp patch is next to my kitchen, not the bathroom. Can you still find the cause?",
        answer:
          "Yes. Kitchen sinks, concealed pipes and the neighbour's wet areas are all possible sources. We test them separately so the right thing gets fixed.",
      },
      {
        id: "vile-parle-juhu-2",
        question: "Do you work on society common areas as well as individual flats?",
        answer:
          "Yes. We work for individual flat owners and for society committees on terraces, external walls, water tanks and common areas.",
      },
    ],
    placeholder: false,
  },
  {
    slug: "andheri",
    name: "Andheri & Jogeshwari",
    zone: "Western Suburbs",
    intro: [
      "Andheri has almost every kind of building in Mumbai: high-rise towers around Lokhandwala and Oshiwara, older societies in Andheri East and Jogeshwari, offices around Chakala and Marol, and industrial units in MIDC. We waterproof all of them.",
      "In high-rises the usual problems are leaking ducts and shafts, bathroom leakage between floors, and external walls that crack at the joints between the concrete frame and the blockwork. In commercial and industrial buildings, it's large flat roofs, podiums over parking and leaking metal sheds.",
    ],
    commonProblems: [
      { problem: "Leaks between floors in high-rise towers", service: "bathroom-waterproofing" },
      { problem: "Office and podium roofs leaking into parking", service: "commercial-waterproofing" },
      { problem: "Leaking metal sheds and factory roofs", service: "industrial-waterproofing" },
    ],
    featuredServices: [
      "bathroom-waterproofing",
      "commercial-waterproofing",
      "industrial-waterproofing",
      "crack-repair-sealing",
    ],
    nearby: ["vile-parle-juhu", "goregaon-to-borivali", "powai"],
    faqs: [
      {
        id: "andheri-1",
        question: "Can you work in an office or factory without stopping our operations?",
        answer:
          "Usually, yes. We phase the work by area and schedule noisy or disruptive tasks out of hours, agreed with your facilities team in advance.",
      },
      {
        id: "andheri-2",
        question: "Water is coming into our flat from a duct or shaft. Who fixes that?",
        answer:
          "Ducts and shafts are usually society property, so we inspect and report to the committee as well as to you. Our written findings make it easier to agree who repairs what.",
      },
    ],
    placeholder: false,
  },
  {
    slug: "goregaon-to-borivali",
    name: "Goregaon to Borivali",
    zone: "Western Suburbs",
    intro: [
      "Goregaon, Malad, Kandivali and Borivali are full of large residential complexes, many with podium parking, deep basements and dozens of floors of bathrooms stacked one above the other. We waterproof terraces, podiums, basements and wet areas across the northern suburbs.",
      "Podium decks over parking are a common source of trouble: water gets through failed expansion joints and drains, and shows up as leaks and stains in the car park below. In older societies, terraces and external walls are the usual culprits.",
    ],
    commonProblems: [
      { problem: "Podium leaks into basement parking", service: "basement-waterproofing" },
      { problem: "Leaking expansion joints and drains", service: "crack-repair-sealing" },
      { problem: "External wall seepage in older societies", service: "wall-dampness-treatment" },
    ],
    featuredServices: [
      "basement-waterproofing",
      "commercial-waterproofing",
      "crack-repair-sealing",
      "terrace-roof-waterproofing",
    ],
    nearby: ["andheri", "dahisar-mira-road", "thane"],
    faqs: [
      {
        id: "goregaon-to-borivali-1",
        question: "Can parking stay open while the podium is waterproofed?",
        answer:
          "Yes. We phase the work in sections so part of the podium, and the parking below it, stays in use throughout.",
      },
      {
        id: "goregaon-to-borivali-2",
        question: "Can you present the proposal to our society committee?",
        answer:
          "Yes. We can walk the committee through the findings and options and give a written proposal for approval at your meeting.",
      },
    ],
    placeholder: false,
  },
  {
    slug: "powai",
    name: "Powai & Vikhroli",
    zone: "Eastern Suburbs",
    intro: [
      "Powai's high-rise towers and offices, and the mix of new projects and older buildings in Vikhroli and Kanjurmarg, each come with their own waterproofing problems. We work on flats, societies and commercial buildings across the area.",
      "Tall buildings take heavy, wind-driven rain on their upper floors, so leaks often start at window frames, balcony junctions and cracks between the frame and the blockwork. Lower down, basements and podium parking are where water collects.",
    ],
    commonProblems: [
      { problem: "Window and balcony leaks on upper floors", service: "crack-repair-sealing" },
      { problem: "Basement and lift-pit seepage", service: "basement-waterproofing" },
      { problem: "Bathroom leakage in high-rise flats", service: "bathroom-waterproofing" },
    ],
    featuredServices: [
      "crack-repair-sealing",
      "basement-waterproofing",
      "bathroom-waterproofing",
      "commercial-waterproofing",
    ],
    nearby: ["andheri", "kurla-ghatkopar-chembur", "mulund-bhandup", "thane"],
    faqs: [
      {
        id: "powai-1",
        question: "Can you repair external wall leaks on a high-rise from inside the flat?",
        answer:
          "Some window and frame leaks can be sealed from inside. Cracks in the outer wall need access from outside, using rope access or a gondola. We'll recommend the safest option after the inspection.",
      },
      {
        id: "powai-2",
        question: "Do you waterproof lift pits?",
        answer: "Yes. Lift pits often collect water. We stop the inflow and treat the pit so the equipment stays dry.",
      },
    ],
    placeholder: false,
  },
  {
    slug: "kurla-ghatkopar-chembur",
    name: "Kurla, Ghatkopar & Chembur",
    zone: "Eastern Suburbs",
    intro: [
      "Across Kurla, Ghatkopar and Chembur we work in older housing societies, newer towers, shops and the industrial units that are still spread through the area.",
      "Many society buildings here are 30 to 40 years old. After that long, terrace waterproofing, external plaster and concealed plumbing tend to fail around the same time. We start by finding which one is actually letting the water in, so the society doesn't pay for all three.",
    ],
    commonProblems: [
      { problem: "Ageing terraces and parapets in older societies", service: "terrace-roof-waterproofing" },
      { problem: "Cracked external plaster letting rain in", service: "wall-dampness-treatment" },
      { problem: "Leaking roofs on industrial units and godowns", service: "industrial-waterproofing" },
    ],
    featuredServices: [
      "terrace-roof-waterproofing",
      "wall-dampness-treatment",
      "industrial-waterproofing",
      "leakage-detection-repair",
    ],
    nearby: ["powai", "sion-wadala", "santacruz", "navi-mumbai"],
    faqs: [
      {
        id: "kurla-ghatkopar-chembur-1",
        question: "Our society wants to waterproof the terrace and repair the external walls. Can it be done in stages?",
        answer:
          "Yes. We can prioritise the areas causing the worst leaks first and phase the rest, with a written scope and price for each stage.",
      },
      {
        id: "kurla-ghatkopar-chembur-2",
        question: "Do you waterproof godowns and warehouses?",
        answer:
          "Yes. We seal and coat metal roofs, gutters and skylights, and treat floors and walls where water is getting in.",
      },
    ],
    placeholder: false,
  },
  {
    slug: "dadar-worli",
    name: "Dadar, Worli & Lower Parel",
    zone: "Central & South Mumbai",
    intro: [
      "From old buildings around Dadar and Matunga to the towers and offices of Worli and Lower Parel, we waterproof residential, commercial and heritage-era buildings in central Mumbai.",
      "Older buildings here often have thick masonry walls and lime plaster that hold moisture for months after the monsoon, plus terraces that have been re-tiled several times over the years. Newer towers bring podium, basement and facade problems instead. We match the treatment to the building rather than using the same system everywhere.",
    ],
    commonProblems: [
      { problem: "Damp, peeling walls in older buildings", service: "wall-dampness-treatment" },
      { problem: "Re-tiled terraces that still leak", service: "terrace-roof-waterproofing" },
      { problem: "Office and retail roof leaks", service: "commercial-waterproofing" },
    ],
    featuredServices: [
      "wall-dampness-treatment",
      "terrace-roof-waterproofing",
      "commercial-waterproofing",
      "crack-repair-sealing",
    ],
    nearby: ["bandra-khar", "parel-sewri", "sion-wadala", "kurla-ghatkopar-chembur"],
    faqs: [
      {
        id: "dadar-worli-1",
        question: "Our building is very old. Can modern waterproofing be used on it?",
        answer:
          "Yes, with care. Old masonry needs breathable materials that let trapped moisture escape. Sealing it in with the wrong coating makes damp worse, so we choose systems that suit the original construction.",
      },
      {
        id: "dadar-worli-2",
        question: "Can you work in a busy office building in Lower Parel?",
        answer:
          "Yes. We plan the work with the building management, keep noisy tasks out of office hours where needed, and protect common areas.",
      },
    ],
    placeholder: false,
  },
  {
    slug: "thane",
    name: "Thane",
    zone: "Thane & Navi Mumbai",
    intro: [
      "Thane has grown fast, with large new housing complexes along Ghodbunder Road alongside older societies in Thane West and East. We waterproof terraces, bathrooms, podiums and basements across the city.",
      "In newer buildings, the problems that appear in the first few monsoons are usually wet areas, podium joints and gaps around pipes that weren't sealed during construction. In older societies, it's terraces and external walls that have reached the end of their life.",
    ],
    commonProblems: [
      { problem: "Leaks in new flats within a few years of possession", service: "bathroom-waterproofing" },
      { problem: "Podium and basement seepage in large complexes", service: "basement-waterproofing" },
      { problem: "Terrace leaks in older societies", service: "terrace-roof-waterproofing" },
    ],
    featuredServices: [
      "bathroom-waterproofing",
      "basement-waterproofing",
      "terrace-roof-waterproofing",
      "new-construction-waterproofing",
    ],
    nearby: ["goregaon-to-borivali", "mulund-bhandup", "powai", "navi-mumbai"],
    faqs: [
      {
        id: "thane-1",
        question: "Our flat is only a few years old and the bathroom already leaks. What's likely wrong?",
        answer:
          "Usually the waterproofing under the tiles was missed or damaged, or the floor trap and pipe joints weren't sealed. We test the plumbing and the floor separately to confirm before recommending a repair.",
      },
      {
        id: "thane-2",
        question: "Do you work with builders on new projects in Thane?",
        answer:
          "Yes. We can review drawings, install waterproofing stage by stage and provide inspection records for the handover file.",
      },
    ],
    placeholder: false,
  },
  {
    slug: "navi-mumbai",
    name: "Navi Mumbai",
    zone: "Thane & Navi Mumbai",
    intro: [
      "From older housing societies in Vashi, Nerul and Belapur to industrial units in the MIDC belt, we waterproof residential and industrial buildings across Navi Mumbai.",
      "Many of the original society buildings are now decades old, and their terraces, external walls and water tanks need attention. Industrial units bring large metal roofs, tanks and floors that have to be fixed with as little downtime as possible.",
    ],
    commonProblems: [
      { problem: "Terrace and external wall leaks in older societies", service: "terrace-roof-waterproofing" },
      { problem: "Leaking metal roofs on industrial units", service: "industrial-waterproofing" },
      { problem: "Cracked, leaking water tanks", service: "crack-repair-sealing" },
    ],
    featuredServices: [
      "terrace-roof-waterproofing",
      "industrial-waterproofing",
      "crack-repair-sealing",
      "wall-dampness-treatment",
    ],
    nearby: ["thane", "kurla-ghatkopar-chembur"],
    faqs: [
      {
        id: "navi-mumbai-1",
        question: "Can you waterproof our society's overhead and underground water tanks?",
        answer:
          "Yes. Tanks are drained and cleaned, cracks and joints repaired, and a suitable lining applied. For drinking-water tanks we use systems certified safe for potable water.",
      },
      {
        id: "navi-mumbai-2",
        question: "Can industrial roof work be done during a shutdown?",
        answer:
          "Yes. We plan the work around your shutdowns and shifts, with method statements and safety documentation for your site.",
      },
    ],
    placeholder: false,
  },

  // Western Suburbs

  {
    slug: "bandra-kurla-complex",
    name: "Bandra Kurla Complex (BKC)",
    zone: "Western Suburbs",
    intro: [
      "Bandra Kurla Complex is one of Mumbai's main business districts, with corporate offices, banks, consulates, hotels and a growing number of residential towers. We waterproof commercial buildings here, from roofs and podiums to basements and wet areas.",
      "Office buildings in BKC typically have deep basements for parking, landscaped podiums, glass facades and large roofs carrying plant and equipment. Leaks tend to start at expansion joints, drains, equipment supports and the junction between glazing and concrete, and even a small one over a server room or lobby causes real disruption.",
      "Most of this work happens in occupied, managed buildings, so we follow the facility manager's permits, safety rules and site timings, and send method statements before we start.",
    ],
    commonProblems: [
      { problem: "Leaks around rooftop plant and equipment supports", service: "commercial-waterproofing" },
      { problem: "Water through basement walls under office towers", service: "basement-waterproofing" },
      { problem: "Water entering at glazing and facade joints", service: "crack-repair-sealing" },
    ],
    featuredServices: [
      "commercial-waterproofing",
      "basement-waterproofing",
      "crack-repair-sealing",
      "leakage-detection-repair",
    ],
    nearby: ["bandra-khar", "santacruz", "kurla-ghatkopar-chembur"],
    faqs: [
      {
        id: "bandra-kurla-complex-1",
        question: "Can you work within our building's permit-to-work system?",
        answer:
          "Yes. We submit method statements, risk assessments and site team details in advance, and follow your permit, access and safety requirements on site.",
      },
      {
        id: "bandra-kurla-complex-2",
        question: "Can a basement leak be stopped from inside while the parking is in use?",
        answer:
          "Often, yes. Active leaks through basement walls and joints can usually be sealed from inside by injection grouting, working bay by bay so most of the parking stays open.",
      },
    ],
    placeholder: false,
  },
  {
    slug: "dahisar-mira-road",
    name: "Dahisar & Mira Road",
    zone: "Western Suburbs",
    intro: [
      "At the northern end of the Western line, Dahisar, Mira Road and Bhayandar are made up largely of housing societies built over the last thirty years, with newer towers still going up. We waterproof flats, society buildings and shops across the area.",
      "Many of those societies are now old enough for their first major repairs, and the terrace, external plaster and plumbing tend to show their age at about the same time. An inspection of the whole building lets the committee plan the work in stages instead of chasing leaks one flat at a time.",
      "Low-lying pockets near the creeks and the Dahisar river also see water standing in compounds and stilt parking during heavy rain, which shows up as damp on the lower walls.",
    ],
    commonProblems: [
      { problem: "Societies due for their first major terrace repair", service: "terrace-roof-waterproofing" },
      { problem: "Hairline cracks in external walls letting in monsoon rain", service: "wall-dampness-treatment" },
      { problem: "Leaks at enclosed balconies and window sills", service: "crack-repair-sealing" },
    ],
    featuredServices: [
      "terrace-roof-waterproofing",
      "wall-dampness-treatment",
      "crack-repair-sealing",
      "bathroom-waterproofing",
    ],
    nearby: ["goregaon-to-borivali", "thane"],
    faqs: [
      {
        id: "dahisar-mira-road-1",
        question: "Our terrace has been coated with tar again and again. Can you just add another layer?",
        answer:
          "Usually not. Old layers of bitumen crack, trap water underneath and stop a new system from bonding. In most cases the loose layers come off and the surface is prepared before the new waterproofing goes down. We check what's there before advising.",
      },
      {
        id: "dahisar-mira-road-2",
        question: "Water collects in our stilt parking every monsoon. Can that be fixed?",
        answer:
          "Partly. Blocked drains, the slope of the paving and gaps where pipes enter the building all play a part. We can seal the plinth and openings so water stays out of the structure, but drainage on the road outside is the municipal corporation's job.",
      },
    ],
    placeholder: false,
  },

  // Eastern Suburbs

  {
    slug: "mulund-bhandup",
    name: "Mulund & Bhandup",
    zone: "Eastern Suburbs",
    intro: [
      "Mulund, Nahur and Bhandup run along the eastern edge of the national park, from long-established societies in Mulund East and West to new high-rise complexes along LBS Marg. We waterproof flats, society buildings and commercial premises across the area.",
      "Buildings on the slopes take water running down from the hills as well as the rain falling on them. Retaining walls, basements and the uphill side of buildings are where seepage usually starts.",
      "In the older societies, terraces at the end of their life and bathroom leaks between flats are the usual complaints, while the newer towers bring podium and basement work.",
    ],
    commonProblems: [
      { problem: "Seepage on the uphill side of buildings and retaining walls", service: "wall-dampness-treatment" },
      { problem: "Basement and podium leaks in new complexes", service: "basement-waterproofing" },
      { problem: "Bathroom leaks between flats in long-established societies", service: "bathroom-waterproofing" },
    ],
    featuredServices: [
      "basement-waterproofing",
      "wall-dampness-treatment",
      "bathroom-waterproofing",
      "terrace-roof-waterproofing",
    ],
    nearby: ["powai", "thane"],
    faqs: [
      {
        id: "mulund-bhandup-1",
        question: "Water seeps through the wall that faces the hill. Can it be stopped from inside?",
        answer:
          "Partly. Injection and an internal waterproof render can hold back seepage through the wall, but where water runs against it all monsoon, the lasting fix also deals with the outside: drainage along the base of the slope and sealing of the external face.",
      },
      {
        id: "mulund-bhandup-2",
        question: "Do you take on single-flat jobs, or only whole buildings?",
        answer:
          "Both. We take on single-flat jobs such as one bathroom, a balcony or a damp wall, as well as full society contracts.",
      },
    ],
    placeholder: false,
  },

  // Central & South Mumbai

  {
    slug: "colaba-cuffe-parade",
    name: "Colaba & Cuffe Parade",
    zone: "Central & South Mumbai",
    intro: [
      "Colaba and Cuffe Parade sit at the southern tip of the city, with the sea close on almost every side. We waterproof old stone and masonry buildings off Colaba Causeway, the high-rise towers of Cuffe Parade and the commercial premises in between.",
      "Salt-laden wind is the constant here. It breaks down paint, sealants and window putty faster than anywhere inland, and when steel inside the concrete starts to rust, it swells and pushes the plaster off — which lets in more rain. Many repairs start with treating that corrosion, not just the leak.",
      "In the older low-rise buildings the trouble is usually at the top: parapets with open joints, terrace outlets that block every monsoon, and rainwater pipes that overflow into the walls.",
    ],
    commonProblems: [
      { problem: "Spalling plaster and rusting steel on sea-facing walls", service: "crack-repair-sealing" },
      { problem: "Salt-damaged walls that stay damp after the monsoon", service: "wall-dampness-treatment" },
      { problem: "Open parapet joints and blocked terrace outlets", service: "terrace-roof-waterproofing" },
    ],
    featuredServices: [
      "crack-repair-sealing",
      "wall-dampness-treatment",
      "terrace-roof-waterproofing",
      "leakage-detection-repair",
    ],
    nearby: ["fort-nariman-point", "malabar-hill-peddar-road"],
    faqs: [
      {
        id: "colaba-cuffe-parade-1",
        question: "Cracks keep coming back on our sea-facing wall even after repair. Why?",
        answer:
          "If the steel inside the concrete is rusting, it keeps swelling and pushing the plaster off. The rust has to be cleaned and treated, the concrete rebuilt with a repair mortar, and the wall finished with a coating that keeps salt and water out. Patching the plaster alone doesn't last.",
      },
      {
        id: "colaba-cuffe-parade-2",
        question: "Can you repair crumbling balcony and chajja edges too?",
        answer:
          "Yes. On sea-facing buildings these edges are often the first to spall. We remove the loose concrete, treat the exposed steel, rebuild the edge and seal it so rainwater runs off instead of soaking in.",
      },
    ],
    placeholder: false,
  },
  {
    slug: "fort-nariman-point",
    name: "Fort & Nariman Point",
    zone: "Central & South Mumbai",
    intro: [
      "Mumbai's old business district runs from the stone buildings of Fort, Ballard Estate and Kala Ghoda to the office towers of Nariman Point and Churchgate. We waterproof offices, banks, shops, institutions and the residential buildings in between.",
      "Many buildings in Fort are well over a century old, built in stone and lime with flat terraces, and several are heritage-listed. Water usually gets in at the top — through terraces, parapets and blocked downpipes — and old masonry needs breathable materials that won't trap moisture inside the walls.",
      "At Nariman Point and Churchgate the problems belong to later construction: large flat roofs crowded with equipment, basements on reclaimed land near the sea, and facades exposed to the wind off the bay.",
    ],
    commonProblems: [
      { problem: "Leaking roofs and parapets on old stone buildings", service: "terrace-roof-waterproofing" },
      { problem: "Roof and plant-room leaks over offices", service: "commercial-waterproofing" },
      { problem: "Seepage into basements on reclaimed land", service: "basement-waterproofing" },
    ],
    featuredServices: [
      "commercial-waterproofing",
      "terrace-roof-waterproofing",
      "basement-waterproofing",
      "wall-dampness-treatment",
    ],
    nearby: ["colaba-cuffe-parade", "girgaon-grant-road", "byculla-mazgaon"],
    faqs: [
      {
        id: "fort-nariman-point-1",
        question: "Our building is heritage-listed. Can you still waterproof it?",
        answer:
          "Yes. We use materials that suit stone and lime, keep the visible fabric as it is wherever possible, and give you a written method statement to share with the building's architect, or with the heritage authorities if approval is needed.",
      },
      {
        id: "fort-nariman-point-2",
        question: "Can the work be planned so our office stays open?",
        answer:
          "Usually, yes. Roof and terrace work can carry on during the week without disturbing the floors below, and noisy or dusty work inside can be moved to weekends or after hours by arrangement.",
      },
    ],
    placeholder: false,
  },
  {
    slug: "malabar-hill-peddar-road",
    name: "Malabar Hill & Peddar Road",
    zone: "Central & South Mumbai",
    intro: [
      "On the ridge above the bay, Malabar Hill, Walkeshwar, Napean Sea Road, Peddar Road and Breach Candy combine premium towers with older buildings and a few bungalows. We waterproof flats, terraces, podiums and external walls here.",
      "Buildings on the hill catch the monsoon wind at full strength, so rain is pushed into window frames, expansion joints and the junctions between the frame and the blockwork. Large flats often have terrace gardens, planters and decks over the rooms below, which need waterproofing that roots can't get through.",
      "Work in occupied homes with fine finishes means careful protection, clean working and agreed hours. We plan it with the residents and the building manager before we start.",
    ],
    commonProblems: [
      { problem: "Terrace gardens and planters leaking into rooms below", service: "terrace-roof-waterproofing" },
      { problem: "Facade joints letting in rain on exposed towers", service: "crack-repair-sealing" },
      { problem: "Hidden plumbing leaks after flat renovations", service: "leakage-detection-repair" },
    ],
    featuredServices: [
      "terrace-roof-waterproofing",
      "crack-repair-sealing",
      "leakage-detection-repair",
      "bathroom-waterproofing",
    ],
    nearby: ["girgaon-grant-road", "colaba-cuffe-parade", "dadar-worli"],
    faqs: [
      {
        id: "malabar-hill-peddar-road-1",
        question: "Can a terrace garden be waterproofed without losing all the plants?",
        answer:
          "The soil and planters have to come off the area being treated, because the membrane goes on the slab underneath. We work in sections, moving plants to one part of the terrace while another is waterproofed, and lay a root-resistant layer before the garden goes back.",
      },
      {
        id: "malabar-hill-peddar-road-2",
        question: "Will you protect the marble and woodwork in our flat?",
        answer:
          "Yes. Floors, fittings and furniture near the work are covered before we start, dust is contained, and the work area is cleaned before we leave each day.",
      },
    ],
    placeholder: false,
  },
  {
    slug: "girgaon-grant-road",
    name: "Girgaon & Grant Road",
    zone: "Central & South Mumbai",
    intro: [
      "Between Marine Lines and Tardeo, Girgaon, Kalbadevi, Charni Road and Grant Road are packed with old cessed buildings, chawls, shops with homes above them, and newer redevelopment towers. We waterproof all of them, from single rooms to whole buildings.",
      "The older buildings here are mostly load-bearing masonry and timber, and many share walls with their neighbours. Water often comes from several places at once: a terrace that has been patched for years, a leaking common toilet block, and an open gap between two buildings. We trace each source before quoting, so you only pay for what's actually leaking.",
      "Lanes are narrow and buildings sit close together, so we plan material deliveries, scaffolding and debris removal around the street before work begins.",
    ],
    commonProblems: [
      { problem: "Years of patching on old cessed-building terraces", service: "terrace-roof-waterproofing" },
      { problem: "Leaking common toilet blocks", service: "bathroom-waterproofing" },
      { problem: "Damp where neighbouring buildings meet", service: "wall-dampness-treatment" },
    ],
    featuredServices: [
      "terrace-roof-waterproofing",
      "bathroom-waterproofing",
      "wall-dampness-treatment",
      "leakage-detection-repair",
    ],
    nearby: ["fort-nariman-point", "malabar-hill-peddar-road", "byculla-mazgaon"],
    faqs: [
      {
        id: "girgaon-grant-road-1",
        question: "Water comes in where our wall meets the next building. Who should fix it?",
        answer:
          "The gap between two buildings usually needs sealing from the top and from both sides, so it's best agreed between the two societies or owners. We inspect, show you where the water is getting in, and give a written scope both sides can approve.",
      },
      {
        id: "girgaon-grant-road-2",
        question: "Our building may go for redevelopment. Is it worth waterproofing now?",
        answer:
          "If redevelopment is years away, a targeted repair of the worst leaks — usually the terrace and wet areas — keeps the building dry without paying for a full overhaul. We'll tell you which repairs are worth doing now and which can wait.",
      },
    ],
    placeholder: false,
  },
  {
    slug: "byculla-mazgaon",
    name: "Byculla & Mazgaon",
    zone: "Central & South Mumbai",
    intro: [
      "Byculla, Mazgaon, Agripada and Mumbai Central have a long mix of old residential buildings, workshops, godowns and markets, and more recently tall residential towers on redeveloped plots. We waterproof flats, societies, commercial premises and warehouses across the area.",
      "Old godowns and workshops often have sloping metal or cement-sheet roofs, with gutters and valleys that overflow in heavy rain. In the new towers, the common complaints in the first few monsoons after possession are leaks from ducts, shafts and podium decks.",
    ],
    commonProblems: [
      { problem: "Overflowing gutters on godown and workshop roofs", service: "industrial-waterproofing" },
      { problem: "Duct and shaft leaks in new towers", service: "leakage-detection-repair" },
      { problem: "Flaking lime plaster in old residential buildings", service: "wall-dampness-treatment" },
    ],
    featuredServices: [
      "industrial-waterproofing",
      "leakage-detection-repair",
      "wall-dampness-treatment",
      "bathroom-waterproofing",
    ],
    nearby: ["girgaon-grant-road", "parel-sewri", "fort-nariman-point"],
    faqs: [
      {
        id: "byculla-mazgaon-1",
        question: "Can you waterproof a godown roof without moving all the stock out?",
        answer:
          "Usually only the area under the work needs clearing. Roof repairs are done from above, and we sheet over the stock below each section being worked on and phase the job so the godown keeps running.",
      },
      {
        id: "byculla-mazgaon-2",
        question: "We've just moved into a new flat and there's already a damp patch. What should we do?",
        answer:
          "Photograph it, note when it gets worse, and tell the builder in writing if they're still responsible for defects. We can inspect and give you a written report of the cause, which helps when you raise it with them.",
      },
    ],
    placeholder: false,
  },
  {
    slug: "parel-sewri",
    name: "Parel & Sewri",
    zone: "Central & South Mumbai",
    intro: [
      "Parel, Lalbaug and Sewri sit on the old mill belt, where chawls and older society buildings stand next to tall residential towers on former mill land. We waterproof both: older buildings that need their terraces and walls renewed, and new high-rises with leaks between floors.",
      "In tall towers, the upper floors take wind-driven rain at window frames and balcony junctions, while bathroom and kitchen leaks show up as damp ceilings in the flat below. Further east towards Sewri, older warehouses and industrial buildings near the port have large roofs that need regular upkeep.",
    ],
    commonProblems: [
      { problem: "Damp ceilings under the bathroom upstairs", service: "bathroom-waterproofing" },
      { problem: "Rain getting in around windows on upper floors", service: "crack-repair-sealing" },
      { problem: "Worn-out terraces on chawls", service: "terrace-roof-waterproofing" },
    ],
    featuredServices: [
      "bathroom-waterproofing",
      "crack-repair-sealing",
      "terrace-roof-waterproofing",
      "industrial-waterproofing",
    ],
    nearby: ["dadar-worli", "byculla-mazgaon", "sion-wadala"],
    faqs: [
      {
        id: "parel-sewri-1",
        question: "The flat above won't let anyone in to check their bathroom. What can we do?",
        answer:
          "We can often narrow down the source from your side first, using moisture readings and the pattern of the damp. If the evidence points to the flat above, our written findings give you and the society something concrete to take to the owner.",
      },
      {
        id: "parel-sewri-2",
        question: "Do you work on chawls?",
        answer:
          "Yes. Chawls usually need terrace repairs, sealing of the common toilet blocks and treatment of damp walls. We can quote room by room or for the whole building.",
      },
    ],
    placeholder: false,
  },
  {
    slug: "sion-wadala",
    name: "Sion & Wadala",
    zone: "Central & South Mumbai",
    intro: [
      "Sion, Wadala, Antop Hill and Chunabhatti have older housing societies, government staff colonies, and fast-growing clusters of new towers on the eastern side of Wadala. We waterproof flats, society buildings and commercial premises across the area.",
      "Parts of the area are low-lying and close to the old salt pans and the creek, so water stands around buildings in heavy rain. That shows up as damp lower walls, seepage into basements and lift pits, and plaster that flakes off a metre or so above the floor.",
    ],
    commonProblems: [
      { problem: "Damp lower walls in low-lying buildings", service: "wall-dampness-treatment" },
      { problem: "Water collecting in basements and lift pits", service: "basement-waterproofing" },
      { problem: "Rainwater running into the plinth from the compound", service: "crack-repair-sealing" },
    ],
    featuredServices: [
      "wall-dampness-treatment",
      "basement-waterproofing",
      "crack-repair-sealing",
      "terrace-roof-waterproofing",
    ],
    nearby: ["parel-sewri", "dadar-worli", "kurla-ghatkopar-chembur"],
    faqs: [
      {
        id: "sion-wadala-1",
        question: "Our ground-floor walls are damp up to about a metre. Is that rising damp?",
        answer:
          "It may be, but here it's just as often rainwater standing against the wall or a leaking pipe in the floor. We check which it is first, because each needs a different fix — a damp-proof course won't help if the water is coming from a pipe.",
      },
      {
        id: "sion-wadala-2",
        question: "Can you seal the gap between the building and the paving outside?",
        answer:
          "Yes. Where the compound slopes towards the building, water runs into the plinth and lower walls. We seal the joint between the paving and the wall and, where possible, correct the slope so water drains away.",
      },
    ],
    placeholder: false,
  },
];

/**
 * Delhi. Not part of the confirmed market yet, so every entry is a placeholder:
 * hidden on the live site, shown with a "Sample" badge in preview mode, and
 * never used by the website assistant. Before switching any of these on,
 * confirm the business really works there (see pendingFacts) — the service
 * area map, `areaServed` structured data and region copy are Mumbai-only.
 */
const delhiAreas: Area[] = [
  // South Delhi

  {
    slug: "greater-kailash-kalkaji",
    name: "Greater Kailash & Kalkaji",
    zone: "South Delhi",
    intro: [
      "Greater Kailash I and II, Chittaranjan Park, East of Kailash and Kalkaji are largely builder floors and kothis, with older DDA blocks in between. We waterproof terraces, bathrooms, basements and external walls across the area.",
      "In a builder floor, each storey often has a different owner. The terrace usually goes with the top floor, while a bathroom stack can leak into every floor beneath it. We inspect from the terrace down and give each owner a written finding, so the repair can be agreed between them.",
      "Flat roofs here bake through summers that regularly pass 40°C, and the daily heating and cooling opens hairline cracks in the slab and in old coatings. By the time the monsoon arrives, those cracks are where the water gets in.",
    ],
    commonProblems: [
      { problem: "Top-floor leaks under builder-floor terraces", service: "terrace-roof-waterproofing" },
      { problem: "Bathroom stacks leaking down through several floors", service: "bathroom-waterproofing" },
      { problem: "Summer heat cracking roof slabs and coatings", service: "crack-repair-sealing" },
    ],
    featuredServices: [
      "terrace-roof-waterproofing",
      "bathroom-waterproofing",
      "crack-repair-sealing",
      "basement-waterproofing",
    ],
    nearby: ["lajpat-nagar-defence-colony", "nehru-place-okhla", "saket-malviya-nagar"],
    faqs: [
      {
        id: "greater-kailash-kalkaji-1",
        question: "The leak in our ceiling is coming from the floor above. How do we sort it out with the other owner?",
        answer:
          "Start with the cause. We find where the water is coming from — a bathroom, a pipe or the terrace — and put it in writing, so all the owners can agree on who repairs what.",
      },
      {
        id: "greater-kailash-kalkaji-2",
        question: "Can a terrace be waterproofed in the summer heat?",
        answer:
          "Yes, with care. Most systems shouldn't go onto a slab that's too hot to touch, so in May and June we work in the early morning and late afternoon. Finishing before the monsoon keeps the rain off fresh work.",
      },
    ],
    placeholder: true,
  },
  {
    slug: "lajpat-nagar-defence-colony",
    name: "Lajpat Nagar & Defence Colony",
    zone: "South Delhi",
    intro: [
      "Lajpat Nagar, Defence Colony, Jangpura and Andrews Ganj mix busy markets with residential colonies of kothis and builder floors. We waterproof homes, shops and showrooms across the area.",
      "Many plots here have been rebuilt as builder floors, often right next to older houses that haven't been. Where a new building meets an old one, the joint between them is a common path for rainwater, and basements dug for parking or storage take in water from the ground around them.",
      "In the markets, many buildings have shops on the ground floor and storage or homes above, so a leak on any floor can end up on the stock or the showroom ceiling below.",
    ],
    commonProblems: [
      { problem: "Leaks where a rebuilt house meets the older one next door", service: "crack-repair-sealing" },
      { problem: "Seepage into basements of houses and builder floors", service: "basement-waterproofing" },
      { problem: "Leaking roofs over market shops", service: "commercial-waterproofing" },
    ],
    featuredServices: [
      "basement-waterproofing",
      "crack-repair-sealing",
      "commercial-waterproofing",
      "terrace-roof-waterproofing",
    ],
    nearby: ["greater-kailash-kalkaji", "hauz-khas-green-park", "nehru-place-okhla"],
    faqs: [
      {
        id: "lajpat-nagar-defence-colony-1",
        question: "Our basement gets damp every monsoon. Does the outside need digging out?",
        answer:
          "Rarely. In an existing basement, most seepage can be treated from inside, by injecting the cracks and joints and applying a coating designed to hold back water pressure. Excavating the outside is only worth it in a few cases, and we'll tell you if yours is one.",
      },
      {
        id: "lajpat-nagar-defence-colony-2",
        question: "Can you work on our shop without closing it during business hours?",
        answer:
          "Usually. Roof and terrace work goes on above the shop without disturbing customers, and anything inside can be scheduled before opening or on the market's weekly closing day.",
      },
    ],
    placeholder: true,
  },
  {
    slug: "hauz-khas-green-park",
    name: "Hauz Khas & Green Park",
    zone: "South Delhi",
    intro: [
      "Hauz Khas, Green Park, Safdarjung Enclave and Gulmohar Park are mostly kothis and builder floors, with restaurants, boutiques and offices in Hauz Khas Village and along Aurobindo Marg. We waterproof homes and commercial premises across the area.",
      "Restaurants and cafés bring their own problems: kitchens and washrooms above other businesses, rooftop seating on terraces never designed for it, and heavy footfall wearing through tiles and the waterproofing below them. In the residential colonies, terraces and bathrooms are the usual sources of leaks.",
    ],
    commonProblems: [
      { problem: "Rooftop seating areas leaking into the floor below", service: "commercial-waterproofing" },
      { problem: "Restaurant kitchens and washrooms leaking downstairs", service: "leakage-detection-repair" },
      { problem: "Terrace tiles cracked by heavy foot traffic", service: "terrace-roof-waterproofing" },
    ],
    featuredServices: [
      "commercial-waterproofing",
      "leakage-detection-repair",
      "terrace-roof-waterproofing",
      "bathroom-waterproofing",
    ],
    nearby: ["saket-malviya-nagar", "lajpat-nagar-defence-colony", "vasant-kunj-vasant-vihar"],
    faqs: [
      {
        id: "hauz-khas-green-park-1",
        question: "We want to use our terrace for seating. What does it need first?",
        answer:
          "A waterproofing system that can take foot traffic, a protective finish over it, and drainage that clears water quickly. Furniture, planters and equipment should stand on pads rather than be fixed through the membrane. It's far easier to do before the terrace is fitted out than after.",
      },
      {
        id: "hauz-khas-green-park-2",
        question: "Can you find a leak without breaking up the restaurant's floor?",
        answer:
          "Usually we can narrow it down first, testing drains, pipes and the floor separately and checking the moisture pattern below, so only the faulty section is opened up rather than the whole kitchen.",
      },
    ],
    placeholder: true,
  },
  {
    slug: "saket-malviya-nagar",
    name: "Saket & Malviya Nagar",
    zone: "South Delhi",
    intro: [
      "Saket, Malviya Nagar, Sheikh Sarai and Pushp Vihar combine DDA flats and housing blocks with builder floors, and the malls and offices of the Saket district centre. We waterproof flats, independent floors and commercial buildings across the area.",
      "Many of the DDA flats here are several decades old. The original terrace treatment and concealed plumbing are long past their life, and the damp in one flat's ceiling is often the bathroom of the flat above. Because blocks share terraces and stairwells, the RWA is often involved in deciding who repairs what.",
      "In Malviya Nagar's denser lanes, buildings stand wall to wall, so damp often comes from a neighbour's wall or roof rather than your own.",
    ],
    commonProblems: [
      { problem: "Shared terraces on ageing housing blocks", service: "terrace-roof-waterproofing" },
      { problem: "Failed waterproofing under older bathroom floors", service: "bathroom-waterproofing" },
      { problem: "Damp walls in tightly packed lanes", service: "wall-dampness-treatment" },
    ],
    featuredServices: [
      "terrace-roof-waterproofing",
      "bathroom-waterproofing",
      "wall-dampness-treatment",
      "commercial-waterproofing",
    ],
    nearby: ["hauz-khas-green-park", "greater-kailash-kalkaji", "vasant-kunj-vasant-vihar"],
    faqs: [
      {
        id: "saket-malviya-nagar-1",
        question: "Can we waterproof only our part of the shared terrace?",
        answer:
          "It can be done, but water doesn't respect boundaries. If the rest of the terrace stays untreated, water can run under the new waterproofing from the next section. We'll show the RWA or the other owners how the edges must be detailed so a partial job still holds.",
      },
      {
        id: "saket-malviya-nagar-2",
        question: "Will the tiles in our bathroom have to be broken?",
        answer:
          "Not always. If the leak is from the pipes or joints, it can often be fixed with little breaking. If the waterproofing under the floor has failed, the tiles have to come up so a new layer can go down. We confirm which it is with tests before anything is broken.",
      },
    ],
    placeholder: true,
  },
  {
    slug: "vasant-kunj-vasant-vihar",
    name: "Vasant Kunj & Vasant Vihar",
    zone: "South Delhi",
    intro: [
      "Vasant Vihar's bungalows and embassy residences, Vasant Kunj's DDA pockets and group housing, and the malls along Nelson Mandela Marg give this corner of the city a wide range of buildings. We waterproof homes, societies and commercial premises across both.",
      "Vasant Kunj lies along the rocky Ridge, where rainwater runs off the ground quickly instead of soaking in. It collects against buildings and finds its way into basements and lift pits. In the older DDA blocks, the usual problems are terraces, water tanks and concealed plumbing that have reached the end of their life.",
    ],
    commonProblems: [
      { problem: "Runoff from rocky ground flooding basements", service: "basement-waterproofing" },
      { problem: "Tired terraces and tanks on older housing blocks", service: "terrace-roof-waterproofing" },
      { problem: "Leaking concealed pipes behind tiled walls", service: "leakage-detection-repair" },
    ],
    featuredServices: [
      "basement-waterproofing",
      "terrace-roof-waterproofing",
      "leakage-detection-repair",
      "wall-dampness-treatment",
    ],
    nearby: ["saket-malviya-nagar", "hauz-khas-green-park", "dwarka"],
    faqs: [
      {
        id: "vasant-kunj-vasant-vihar-1",
        question: "Can you work in a rented house while the tenant is living there?",
        answer:
          "Yes. We agree access times with the owner and the tenant, keep the work to the affected rooms, and clean up each day. Terrace and external work usually needs no access to the house at all.",
      },
      {
        id: "vasant-kunj-vasant-vihar-2",
        question: "Water collects in our society's basement after heavy rain. Is it coming through the walls?",
        answer:
          "Often it's both: runoff entering through ramps and openings, and seepage through walls and joints. We check each route, because a better drain at the ramp can solve what looks like a waterproofing failure.",
      },
    ],
    placeholder: true,
  },
  {
    slug: "nehru-place-okhla",
    name: "Nehru Place & Okhla",
    zone: "South Delhi",
    intro: [
      "Nehru Place's office blocks and computer market, the factories and warehouses of Okhla Industrial Area, and the newer offices of Jasola make this south Delhi's main business and industrial belt. We waterproof offices, showrooms, factories and warehouses here.",
      "Nehru Place's office blocks date from the 1970s and 80s, and their flat roofs, shared toilets and stairwells have been repaired many times. In Okhla, roofs are often metal sheeting with gutters, skylights and fixings that loosen over time, and a leak over machinery or stock means lost work.",
    ],
    commonProblems: [
      { problem: "Ageing roofs and shared toilets in office blocks", service: "commercial-waterproofing" },
      { problem: "Loose fixings and gutters on factory roofs", service: "industrial-waterproofing" },
      { problem: "Cracked warehouse floors and walls letting water in", service: "crack-repair-sealing" },
    ],
    featuredServices: [
      "commercial-waterproofing",
      "industrial-waterproofing",
      "crack-repair-sealing",
      "leakage-detection-repair",
    ],
    nearby: ["greater-kailash-kalkaji", "lajpat-nagar-defence-colony"],
    faqs: [
      {
        id: "nehru-place-okhla-1",
        question: "Should we replace our leaking metal roof or repair it?",
        answer:
          "If the sheets are sound and only the laps, fixings and gutters leak, sealing and coating them costs far less than replacement. If the sheets are rusted through in many places, replacement may be better value. We show you the condition at the inspection and price both where it makes sense.",
      },
      {
        id: "nehru-place-okhla-2",
        question: "Our office is one floor of a shared block. Can we waterproof just our part?",
        answer:
          "Yes, for what's inside your premises: washrooms, pantry and internal walls. If the water is coming from the roof or a shared shaft, the building's association needs to be involved, and our written findings help with that.",
      },
    ],
    placeholder: true,
  },

  // Central Delhi

  {
    slug: "connaught-place",
    name: "Connaught Place",
    zone: "Central Delhi",
    intro: [
      "Connaught Place's colonnaded blocks, the office towers along Barakhamba Road and Kasturba Gandhi Marg, and the hotels and showrooms around Janpath make up central Delhi's busiest commercial district. We waterproof roofs, terraces, basements and wet areas in commercial buildings here.",
      "The original blocks of the circle are close to a century old, and their flat roofs carry decades of added services — tanks, cooling units, signage and cabling — each fixed through the roof and each a possible leak. Repairs need materials that suit old masonry and keep the look of the colonnades.",
      "The newer towers nearby bring basements, podiums and large roofs instead, usually with building management, permits and fixed access times to plan around.",
    ],
    commonProblems: [
      { problem: "Roofs crowded with tanks, cooling units and signage fixings", service: "commercial-waterproofing" },
      { problem: "Damp masonry in the old colonnaded blocks", service: "wall-dampness-treatment" },
      { problem: "Basement seepage in office towers", service: "basement-waterproofing" },
    ],
    featuredServices: [
      "commercial-waterproofing",
      "wall-dampness-treatment",
      "basement-waterproofing",
      "terrace-roof-waterproofing",
    ],
    nearby: ["karol-bagh-rajendra-place", "chandni-chowk-old-delhi"],
    faqs: [
      {
        id: "connaught-place-1",
        question: "Can you work at night so the showroom stays open?",
        answer:
          "Yes. Inside work can be done after closing, and roof work can usually continue during the day without affecting the shop below.",
      },
      {
        id: "connaught-place-2",
        question: "Several tenants share our roof. Who should we talk to first?",
        answer:
          "Usually the landlord or the building's owners' association, since the roof serves everyone. We can inspect, prepare a scope and price for them, and coordinate access with each tenant.",
      },
    ],
    placeholder: true,
  },
  {
    slug: "karol-bagh-rajendra-place",
    name: "Karol Bagh & Rajendra Place",
    zone: "Central Delhi",
    intro: [
      "Karol Bagh's markets and the homes above its shops, the residential blocks of Patel Nagar, and the office buildings of Rajendra Place make this one of central Delhi's busiest areas. We waterproof shops, showrooms, homes and offices across it.",
      "Buildings here are packed tightly, many with floors added over the years on older ground floors, and shops below with homes or storage above. Water travels along shared walls, through flat roofs, and down through the joints between old and new construction.",
    ],
    commonProblems: [
      { problem: "Leaks at joints where floors were added over the years", service: "crack-repair-sealing" },
      { problem: "Showroom ceilings leaking from the floors above", service: "leakage-detection-repair" },
      { problem: "Flat roofs ponding water after monsoon storms", service: "terrace-roof-waterproofing" },
    ],
    featuredServices: [
      "crack-repair-sealing",
      "leakage-detection-repair",
      "terrace-roof-waterproofing",
      "commercial-waterproofing",
    ],
    nearby: ["connaught-place", "rajouri-garden-punjabi-bagh", "naraina-mayapuri"],
    faqs: [
      {
        id: "karol-bagh-rajendra-place-1",
        question: "Our building has had floors added on top. Does the new roof need anything different?",
        answer:
          "The new roof needs its own complete system, and the joint where new work meets the old structure needs special attention, because the two move differently. Where an old roof was simply built over, we also check that water isn't trapped between the layers.",
      },
      {
        id: "karol-bagh-rajendra-place-2",
        question: "Is it better to waterproof before the monsoon or after?",
        answer:
          "Before, if you can. Most exterior work needs dry weather and a dry surface, so the best windows are spring to early summer and again once the rains have passed. Urgent leaks during the monsoon can still be contained with temporary repairs.",
      },
    ],
    placeholder: true,
  },
  {
    slug: "chandni-chowk-old-delhi",
    name: "Chandni Chowk & Old Delhi",
    zone: "Central Delhi",
    intro: [
      "In Chandni Chowk, Chawri Bazar, Daryaganj and the lanes of the walled city, homes, havelis, wholesale markets and godowns share walls and roofs. We waterproof old buildings here, room by room or roof by roof.",
      "Many buildings are old brick and lime, some of them centuries old, and they have been altered, extended and re-plastered many times. Cement plaster and modern paint over lime walls trap moisture, so damp spreads and plaster blows off. The right fix lets the wall breathe while keeping the rain out.",
      "Many lanes are too narrow for vehicles, so we plan material deliveries and debris removal around the market's hours.",
    ],
    commonProblems: [
      { problem: "Damp, blown plaster on old brick-and-lime walls", service: "wall-dampness-treatment" },
      { problem: "Leaking roofs shared between neighbouring buildings", service: "terrace-roof-waterproofing" },
      { problem: "Water reaching stock in market godowns", service: "commercial-waterproofing" },
    ],
    featuredServices: [
      "wall-dampness-treatment",
      "terrace-roof-waterproofing",
      "commercial-waterproofing",
      "leakage-detection-repair",
    ],
    nearby: ["connaught-place", "karol-bagh-rajendra-place"],
    faqs: [
      {
        id: "chandni-chowk-old-delhi-1",
        question: "Our haveli has damp walls everywhere. Will waterproof paint fix it?",
        answer:
          "Usually not, and it can make things worse. Brick and lime walls need to release moisture, and sealing them in with waterproof paint or cement plaster traps it inside. We find where the water is coming from — roof, drains, pipes or the ground — and repair with breathable, lime-compatible materials.",
      },
      {
        id: "chandni-chowk-old-delhi-2",
        question: "Can you work around market hours?",
        answer:
          "Yes. We schedule deliveries and noisy work for early morning or after the market closes, and keep the lane clear during trading hours.",
      },
    ],
    placeholder: true,
  },

  // West Delhi

  {
    slug: "rajouri-garden-punjabi-bagh",
    name: "Rajouri Garden & Punjabi Bagh",
    zone: "West Delhi",
    intro: [
      "Rajouri Garden, Punjabi Bagh, Tagore Garden and Moti Nagar are known for spacious kothis, a growing number of builder floors, and busy markets and malls. We waterproof homes, showrooms and commercial premises across the area.",
      "Large kothis often have basements, wide terraces and stone or tiled facades. As they're rebuilt into builder floors, basements go deeper and bathrooms are stacked floor above floor, so water problems tend to appear in the first few monsoons after construction.",
      "In older kothis that haven't been rebuilt, the ground floor often now sits below the road outside after years of resurfacing, so rainwater runs towards the house instead of away from it.",
    ],
    commonProblems: [
      { problem: "Ground floors left below a raised road level", service: "wall-dampness-treatment" },
      { problem: "Basement leaks in newly built floors", service: "basement-waterproofing" },
      { problem: "Stone and tile facades letting rain in at the joints", service: "crack-repair-sealing" },
    ],
    featuredServices: [
      "basement-waterproofing",
      "wall-dampness-treatment",
      "crack-repair-sealing",
      "new-construction-waterproofing",
    ],
    nearby: ["janakpuri-vikaspuri", "karol-bagh-rajendra-place", "naraina-mayapuri", "shalimar-bagh-ashok-vihar"],
    faqs: [
      {
        id: "rajouri-garden-punjabi-bagh-1",
        question: "The road outside is now higher than our ground floor. Can you keep the water out?",
        answer:
          "We can seal the plinth, raise thresholds and treat the lower walls so water doesn't soak in, and suggest a step or channel at the gate so runoff doesn't flow towards the house. In heavy downpours, drainage outside the property still matters.",
      },
      {
        id: "rajouri-garden-punjabi-bagh-2",
        question: "We're rebuilding our kothi as builder floors. When should waterproofing start?",
        answer:
          "At the foundation stage. The basement walls and floor, the plinth, each bathroom and the terrace are all easier and cheaper to waterproof while they're being built. We can work alongside your contractor stage by stage.",
      },
    ],
    placeholder: true,
  },
  {
    slug: "janakpuri-vikaspuri",
    name: "Janakpuri & Vikaspuri",
    zone: "West Delhi",
    intro: [
      "Janakpuri and Vikaspuri are among West Delhi's largest residential areas, with DDA flats, cooperative group housing, independent houses and builder floors, and the offices and shops of the Janakpuri district centre. We waterproof homes, societies and commercial premises across both.",
      "Much of the housing here is now decades old, and the familiar problems have arrived: terraces, overhead tanks and bathrooms leaking into the flat below. In parts of West Delhi the groundwater is brackish, and moisture rising into ground-floor walls leaves white salt deposits that push the paint and plaster off.",
    ],
    commonProblems: [
      { problem: "White salt deposits and flaking paint on ground-floor walls", service: "wall-dampness-treatment" },
      { problem: "Overhead tanks leaking onto the top floor", service: "crack-repair-sealing" },
      { problem: "Bathroom floors leaking after decades of use", service: "bathroom-waterproofing" },
    ],
    featuredServices: [
      "wall-dampness-treatment",
      "bathroom-waterproofing",
      "crack-repair-sealing",
      "terrace-roof-waterproofing",
    ],
    nearby: ["rajouri-garden-punjabi-bagh", "dwarka", "naraina-mayapuri"],
    faqs: [
      {
        id: "janakpuri-vikaspuri-1",
        question: "White powder keeps appearing on our walls after we repaint. What is it?",
        answer:
          "It's salt, carried into the wall by moisture and left behind as the water dries out. Repainting only hides it until the next season. The source of moisture has to be cut off and the salt-laden plaster replaced with a salt-resistant render before painting.",
      },
      {
        id: "janakpuri-vikaspuri-2",
        question: "Can our overhead tank be repaired without a long break in water supply?",
        answer:
          "It has to be drained for the repair. Where the tank has two compartments we work on one at a time; otherwise we schedule the work so supply is off for as short a time as possible, and clean the tank before it's refilled.",
      },
    ],
    placeholder: true,
  },
  {
    slug: "dwarka",
    name: "Dwarka",
    zone: "West Delhi",
    intro: [
      "Dwarka is a planned sub-city of numbered sectors, made up largely of cooperative group housing societies and DDA flats built from the 1990s onwards, with a growing number of offices, malls and hotels. We waterproof flats, society buildings and commercial premises across its sectors.",
      "Many society buildings are now 20 to 30 years old and facing their first big round of repairs: terraces, external walls, water tanks and the plumbing inside the service shafts. Towers with basement parking and lift pits also see seepage at the construction joints, where the walls meet the floor slab.",
    ],
    commonProblems: [
      { problem: "First major repairs in 20 to 30-year-old societies", service: "terrace-roof-waterproofing" },
      { problem: "Leaking pipes and joints inside service shafts", service: "leakage-detection-repair" },
      { problem: "Seepage at basement construction joints", service: "basement-waterproofing" },
    ],
    featuredServices: [
      "terrace-roof-waterproofing",
      "leakage-detection-repair",
      "basement-waterproofing",
      "wall-dampness-treatment",
    ],
    nearby: ["janakpuri-vikaspuri", "vasant-kunj-vasant-vihar"],
    faqs: [
      {
        id: "dwarka-1",
        question: "Our society tower is about 25 years old. What should we check first?",
        answer:
          "The terrace, the external walls that take the monsoon rain, the overhead and underground tanks, and the pipes in the service shafts. One inspection of all four lets the managing committee see what's urgent and what can be planned for later.",
      },
      {
        id: "dwarka-2",
        question: "Do you also work on DDA flats in Dwarka?",
        answer:
          "Yes. DDA flats need the same care — terraces, bathrooms and external walls — and we coordinate with the RWA wherever common areas are involved.",
      },
    ],
    placeholder: true,
  },
  {
    slug: "naraina-mayapuri",
    name: "Naraina & Mayapuri",
    zone: "West Delhi",
    intro: [
      "The industrial areas of Naraina and Mayapuri, together with the furniture and timber market of Kirti Nagar, are full of factories, workshops, warehouses and showrooms. We waterproof industrial roofs, floors and walls, and the offices and showrooms that sit alongside them.",
      "Many units run in older sheds with metal or cement-sheet roofs, and water gets in at overlaps, fixings, gutters and skylights added later. Furniture, timber and finished goods are easily damaged by a single leak, so repairs are planned to keep stock covered and the unit working.",
    ],
    commonProblems: [
      { problem: "Leaking skylights on workshop roofs", service: "industrial-waterproofing" },
      { problem: "Rainwater reaching timber and furniture stock", service: "commercial-waterproofing" },
      { problem: "Showroom walls damp at the plinth", service: "wall-dampness-treatment" },
    ],
    featuredServices: [
      "industrial-waterproofing",
      "commercial-waterproofing",
      "wall-dampness-treatment",
      "crack-repair-sealing",
    ],
    nearby: ["rajouri-garden-punjabi-bagh", "karol-bagh-rajendra-place", "janakpuri-vikaspuri"],
    faqs: [
      {
        id: "naraina-mayapuri-1",
        question: "Our skylights leak every monsoon. Do they need replacing?",
        answer:
          "Not always. Most skylight leaks are at the joint between the skylight sheet and the roof sheets around it, and resealing and flashing that joint properly often stops them. Cracked or brittle skylight sheets are replaced.",
      },
      {
        id: "naraina-mayapuri-2",
        question: "Can the work be done on our weekly off?",
        answer:
          "Yes. Roof work over machinery or stock is often best done on the unit's weekly off, and larger jobs can be spread over several of them.",
      },
    ],
    placeholder: true,
  },

  // North & North West Delhi

  {
    slug: "rohini-pitampura",
    name: "Rohini & Pitampura",
    zone: "North & North West Delhi",
    intro: [
      "Rohini is one of Delhi's largest planned residential areas, laid out in numbered sectors of DDA flats, cooperative group housing and plotted houses, while Pitampura next door adds the offices and malls around Netaji Subhash Place. We waterproof flats, houses, societies and commercial buildings across both.",
      "Terraces here take the full afternoon sun from April to June, and many top-floor homes suffer from the heat as much as the leaks. When the terrace is due for renewal, a heat-reflective waterproof coating deals with both, lowering the roof's surface temperature as well as keeping the monsoon out.",
      "In the plotted sectors, more houses are being rebuilt as builder floors with stilt parking, and the first monsoons after construction often show where balconies and pipe entries weren't sealed properly.",
    ],
    commonProblems: [
      { problem: "Hot, leaking top floors under sun-baked terraces", service: "terrace-roof-waterproofing" },
      { problem: "Balcony and pipe-entry leaks in rebuilt houses", service: "crack-repair-sealing" },
      { problem: "Leaking roofs over district-centre shops and offices", service: "commercial-waterproofing" },
    ],
    featuredServices: [
      "terrace-roof-waterproofing",
      "crack-repair-sealing",
      "commercial-waterproofing",
      "bathroom-waterproofing",
    ],
    nearby: ["shalimar-bagh-ashok-vihar"],
    faqs: [
      {
        id: "rohini-pitampura-1",
        question: "Will a reflective coating really make our top floor cooler?",
        answer:
          "It lowers the temperature of the roof surface, so less heat passes into the room below. How much difference you feel depends on the slab, any insulation and the room's ventilation, so we don't promise a fixed number of degrees.",
      },
      {
        id: "rohini-pitampura-2",
        question: "Our stilt parking ceiling drips under the ground-floor bathroom. Is that a bathroom leak?",
        answer:
          "Very likely. A stain on the stilt ceiling under a bathroom usually means the floor trap, a pipe joint or the waterproofing under the tiles is failing. We test each separately so only the faulty part is opened up.",
      },
    ],
    placeholder: true,
  },
  {
    slug: "shalimar-bagh-ashok-vihar",
    name: "Shalimar Bagh & Ashok Vihar",
    zone: "North & North West Delhi",
    intro: [
      "Shalimar Bagh, Ashok Vihar and Model Town are established residential colonies of kothis, builder floors and DDA blocks, with the Wazirpur and Lawrence Road industrial areas close by. We waterproof homes, flats and industrial premises across the area.",
      "These are leafy colonies, and every year leaves block terrace outlets and gutters, so water ponds on roofs and finds its way into old cracks. Clearing and enlarging the outlets, and correcting the slope where needed, is often as important as the waterproofing itself.",
      "In the nearby industrial areas, factory roofs and floors take heavy wear and need repairing with as little downtime as possible.",
    ],
    commonProblems: [
      { problem: "Roof outlets blocked by leaves, leaving water ponding", service: "terrace-roof-waterproofing" },
      { problem: "Broken gutters and downpipes soaking the walls", service: "wall-dampness-treatment" },
      { problem: "Leaking roofs on factories in nearby industrial areas", service: "industrial-waterproofing" },
    ],
    featuredServices: [
      "terrace-roof-waterproofing",
      "wall-dampness-treatment",
      "industrial-waterproofing",
      "bathroom-waterproofing",
    ],
    nearby: ["rohini-pitampura", "rajouri-garden-punjabi-bagh"],
    faqs: [
      {
        id: "shalimar-bagh-ashok-vihar-1",
        question: "Water stands on our terrace for days after rain. Is that a problem?",
        answer:
          "Yes. Standing water finds every crack, and constant wetting and drying breaks down most coatings faster. We clear and enlarge the outlets and, where the slope is wrong, correct it with a screed before the new waterproofing goes on.",
      },
      {
        id: "shalimar-bagh-ashok-vihar-2",
        question: "Can you repair the gutters and downpipes as well?",
        answer:
          "Yes. Blocked or broken gutters and downpipes often send water into the walls instead of away from them. We repair or replace damaged sections and seal their joints as part of the job.",
      },
    ],
    placeholder: true,
  },

  // East Delhi

  {
    slug: "mayur-vihar-patparganj",
    name: "Mayur Vihar & Patparganj",
    zone: "East Delhi",
    intro: [
      "Mayur Vihar, Patparganj and IP Extension are made up largely of DDA flats and cooperative group housing societies, many dating from the 1980s and 90s, alongside the Patparganj industrial area. We waterproof flats, society buildings and industrial units across East Delhi.",
      "The area lies close to the Yamuna, and in low-lying pockets the ground stays wet long after the monsoon. Basements, lift pits, underground tanks and ground-floor walls are where that moisture shows, as seepage at construction joints and damp that climbs the lower walls.",
      "Above ground, ageing societies face the usual set of repairs: terraces, overhead tanks, and external walls with hairline cracks that let in the monsoon rain.",
    ],
    commonProblems: [
      { problem: "Underground tanks and lift pits taking in ground water", service: "basement-waterproofing" },
      { problem: "Damp climbing the lower walls in low-lying pockets", service: "wall-dampness-treatment" },
      { problem: "Hairline cracks in society external walls", service: "crack-repair-sealing" },
    ],
    featuredServices: [
      "basement-waterproofing",
      "wall-dampness-treatment",
      "crack-repair-sealing",
      "terrace-roof-waterproofing",
    ],
    nearby: ["preet-vihar-laxmi-nagar"],
    faqs: [
      {
        id: "mayur-vihar-patparganj-1",
        question: "Our underground water tank seems to take in dirty water. Can that be fixed?",
        answer:
          "Yes, and it should be fixed quickly. Cracks and joints that let water out also let ground water in. We drain and clean the tank, repair the cracks and joints, and apply a lining suitable for drinking water.",
      },
      {
        id: "mayur-vihar-patparganj-2",
        question: "Our ground-floor damp gets worse after the monsoon, not during it. Why?",
        answer:
          "In low-lying areas the ground stays wet for weeks after the rains end, so moisture keeps rising into the walls. An injected damp-proof course at the base of the wall, followed by salt-resistant replastering, deals with it from the inside.",
      },
    ],
    placeholder: true,
  },
  {
    slug: "preet-vihar-laxmi-nagar",
    name: "Preet Vihar & Laxmi Nagar",
    zone: "East Delhi",
    intro: [
      "Laxmi Nagar, Preet Vihar, Shakarpur and Nirman Vihar are some of East Delhi's busiest areas, with dense builder floors and houses, coaching institutes, offices and markets along Vikas Marg. We waterproof homes, shops and commercial premises across them.",
      "Buildings stand shoulder to shoulder and many have been built up floor by floor, so water often reaches a room from a neighbour's roof, a shared wall or a pipe running between buildings. Floors used as classrooms or offices also tend to have washrooms added where none were planned, often without waterproofing beneath them.",
    ],
    commonProblems: [
      { problem: "Washrooms added on commercial floors leaking below", service: "bathroom-waterproofing" },
      { problem: "Water reaching rooms from a neighbour's roof or wall", service: "leakage-detection-repair" },
      { problem: "Roofs over shops and offices on busy main roads", service: "commercial-waterproofing" },
    ],
    featuredServices: [
      "bathroom-waterproofing",
      "leakage-detection-repair",
      "commercial-waterproofing",
      "terrace-roof-waterproofing",
    ],
    nearby: ["mayur-vihar-patparganj"],
    faqs: [
      {
        id: "preet-vihar-laxmi-nagar-1",
        question: "We want to add a washroom to our office floor. Can it be waterproofed properly?",
        answer:
          "Yes, and it's much easier while the washroom is being built. The floor, the lower walls and every pipe entry are waterproofed and water-tested before tiling, so leaks don't end up in the floor below.",
      },
      {
        id: "preet-vihar-laxmi-nagar-2",
        question: "The water seems to come from the building next door. Can you prove it?",
        answer:
          "Usually, yes. Testing your own roof, pipes and wet areas rules them out, and moisture readings along the shared wall show where the water is coming in. That evidence makes it easier to ask the neighbour to repair their side.",
      },
    ],
    placeholder: true,
  },
];

export const areas: Area[] = [...mumbaiAreas, ...delhiAreas];
