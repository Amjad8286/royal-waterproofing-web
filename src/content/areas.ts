import type { Area } from "@/types/content";

/**
 * Areas served across Mumbai, Thane and Navi Mumbai. Each page has its own
 * copy about local buildings and the problems they tend to have — never
 * copy-and-paste text between areas.
 *
 * Confirm this list matches where you actually work (see pendingFacts).
 */
export const areas: Area[] = [
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
    nearby: ["vile-parle-juhu", "bandra-khar", "kurla-ghatkopar-chembur"],
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
    nearby: ["santacruz", "dadar-worli", "vile-parle-juhu"],
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
    nearby: ["andheri", "thane"],
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
    nearby: ["andheri", "kurla-ghatkopar-chembur", "thane"],
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
    nearby: ["powai", "santacruz", "navi-mumbai"],
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
    nearby: ["bandra-khar", "kurla-ghatkopar-chembur"],
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
    nearby: ["goregaon-to-borivali", "powai", "navi-mumbai"],
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
];
