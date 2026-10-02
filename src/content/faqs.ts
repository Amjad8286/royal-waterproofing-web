import { site } from "@/config/site";
import type { FAQ, FAQCategory } from "@/types/content";

export const faqCategories: { id: FAQCategory; label: string }[] = [
  { id: "cost", label: "Cost & quotes" },
  { id: "inspection", label: "Inspection & process" },
  { id: "duration", label: "Duration & disruption" },
  { id: "warranty", label: "Warranty" },
  { id: "solutions", label: "Solutions & materials" },
  { id: "maintenance", label: "Maintenance" },
  { id: "booking", label: "Booking" },
];

const areaAnswer = `We work across ${site.market.serviceRegion} — the areas are listed on our Service Areas page. If you're nearby but not listed, ask us.`;

const freeInspectionAnswer = site.inspection.isFree
  ? "Yes. We visit, diagnose the problem and give you a written quotation, with no obligation to go ahead."
  : "There's a small inspection charge, which we tell you when you book. You get a diagnosis and a written quotation, with no obligation to go ahead.";

const urgentAnswer = site.urgentLeak.enabled
  ? "Yes. Call us for urgent leaks. We'll talk you through immediate steps to limit damage and arrange the earliest visit we can."
  : "We don't run an emergency call-out service, but call us and we'll arrange the earliest visit we can and advise on limiting damage in the meantime.";

/** General FAQs. Service- and area-specific FAQs live with their content. */
export const faqs: FAQ[] = [
  {
    id: "cost-how-much",
    category: "cost",
    question: "How much does waterproofing cost?",
    answer:
      "It depends on the area, the condition of the surface, the system and access. We don't price from photos alone because the cause decides the treatment. After the inspection you get a written, itemised quotation, so you can see exactly what you're paying for.",
  },
  {
    id: "cost-free-inspection",
    category: "cost",
    question: site.inspection.isFree ? "Is the inspection really free?" : "Do you charge for inspections?",
    answer: freeInspectionAnswer,
  },
  {
    id: "cost-comparing-quotes",
    category: "cost",
    question: "Why is your quote different from a cheaper one I received?",
    answer:
      "Quotes usually differ in what's included: surface preparation, crack and junction repairs, the system and its thickness, and testing. Ask every contractor to itemise these — ours always are.",
  },
  {
    id: "cost-phone-price",
    category: "cost",
    question: "Can you give me a price over the phone or WhatsApp?",
    answer:
      "For simple jobs we can give a rough range from photos, but a firm price needs an inspection. Leaks often start somewhere other than where they show up.",
  },
  {
    id: "cost-payment",
    category: "cost",
    question: "How do payments work?",
    answer:
      "Payment terms are set out in your quote before work starts. Larger jobs are usually paid in stages as the work is completed.",
  },
  {
    id: "inspection-what-happens",
    category: "inspection",
    question: "What happens during an inspection?",
    answer:
      "We look at the problem area and everything around it: the surface above, junctions, outlets, plumbing and the room below. We take moisture readings and, where needed, run flood or pressure tests. Then we explain the cause in plain language.",
  },
  {
    id: "inspection-how-long",
    category: "inspection",
    question: "How long does an inspection take?",
    answer:
      "Most home inspections take under an hour. Larger or commercial properties take longer and may need a second visit for testing.",
  },
  {
    id: "inspection-be-there",
    category: "inspection",
    question: "Do I need to be there?",
    answer:
      "Yes, or someone who can give us access and tell us when the problem appears — for example, only in heavy rain or only when the shower is used.",
  },
  {
    id: "inspection-prepare",
    category: "inspection",
    question: "What should I prepare before you visit?",
    answer:
      "Clear access to the affected areas, and any photos or videos of the leak when it was active. If the problem is in a flat below or above yours, let the neighbours know we may ask to look.",
  },
  {
    id: "duration-typical",
    category: "duration",
    question: "How long does a typical job take?",
    answer:
      "Small repairs can be done in a day. Most terraces and bathrooms in a flat or bungalow take a few days to a week, including curing and testing. Your quotation includes a schedule.",
  },
  {
    id: "duration-noise-dust",
    category: "duration",
    question: "Will there be noise and dust?",
    answer:
      "Surface preparation can be noisy and dusty for a day or two. We protect floors and furniture, contain dust where we can, and clean up every day.",
  },
  {
    id: "duration-stay-home",
    category: "duration",
    question: "Can I stay at home while you work?",
    answer:
      "Almost always. Terrace and outside work doesn't affect your living space. A bathroom may be out of use for several days, so we'll plan around that with you.",
  },
  {
    id: "duration-rainy-season",
    category: "duration",
    question: `Can you work during ${site.market.rainySeason}?`,
    answer:
      "Some repairs, like injection grouting, work in wet conditions. Most coatings need a dry surface, so in the monsoon we work in dry spells and protect the area if rain arrives. The best time to waterproof a terrace or external wall is between October and May.",
  },
  {
    id: "warranty-do-you",
    category: "warranty",
    question: "Do you give a warranty?",
    answer:
      "Yes. Every job comes with a written warranty that states what's covered, for how long, and the maintenance that keeps it valid. The length depends on the system and the condition of the surface.",
    placeholder: true,
  },
  {
    id: "warranty-not-covered",
    category: "warranty",
    question: "What isn't covered by the warranty?",
    answer:
      "Damage from later work through the treated area, such as drilling or new fixtures; leaks from areas outside the agreed scope; and problems caused by skipping the basic maintenance in your care guide.",
    placeholder: true,
  },
  {
    id: "warranty-leaks-again",
    category: "warranty",
    question: "What if it leaks again during the warranty?",
    answer: "Call us. We'll inspect, and if the leak comes from our work, we repair it at no cost.",
    placeholder: true,
  },
  {
    id: "solutions-best-system",
    category: "solutions",
    question: "Which waterproofing system is best?",
    answer:
      "There isn't one best system. PU membranes suit exposed terraces, crystalline treatments suit basements under water pressure, and epoxy grout suits bathroom joints. We recommend based on the surface, its exposure and how it's used.",
  },
  {
    id: "solutions-materials",
    category: "solutions",
    question: "What materials do you use?",
    answer:
      "Professional-grade systems from established manufacturers. Your quotation names the exact product for each part of the job, and we can share its technical data sheet.",
  },
  {
    id: "solutions-paint",
    category: "solutions",
    question: "Is waterproofing the same as waterproof paint?",
    answer:
      "No. Waterproof paints help on vertical walls, but terraces, bathrooms and basements need membranes or treatments designed for standing water or water pressure.",
  },
  {
    id: "solutions-safety",
    category: "solutions",
    question: "Are the materials safe to use in an occupied home?",
    answer:
      "For indoor work we favour low-odour, water-based systems. Where a solvent-based product is needed, we ventilate the area and tell you how long to keep it clear.",
  },
  {
    id: "maintenance-terrace",
    category: "maintenance",
    question: "How do I look after a waterproofed terrace?",
    answer:
      "Keep the outlets and drains clear, sweep away debris and plant growth, and avoid dragging heavy objects or drilling into the surface. A quick check every May, before the monsoon, catches problems early.",
  },
  {
    id: "maintenance-how-often",
    category: "maintenance",
    question: "How often should waterproofing be inspected?",
    answer:
      "Once a year is sensible, ideally between March and May, before the monsoon. Large commercial roofs benefit from an inspection twice a year.",
  },
  {
    id: "maintenance-fixtures",
    category: "maintenance",
    question: "Can I add solar panels or a water tank on a waterproofed roof?",
    answer:
      "Yes, but talk to us first. Mounts and pipes need to be detailed so they don't puncture the membrane — drilling straight through is one of the most common causes of new terrace leaks.",
  },
  {
    id: "maintenance-cleaning",
    category: "maintenance",
    question: "Which cleaning products should I avoid?",
    answer:
      "Avoid acid-based cleaners on grout and sealants, and wire brushes or pressure washers on coatings. Mild detergent and a soft brush are enough.",
  },
  {
    id: "booking-how",
    category: "booking",
    question: "How do I book an inspection?",
    answer:
      "Call, send a WhatsApp message or fill in the form on this site. Tell us what's happening and where, and we'll arrange a time that suits you.",
  },
  {
    id: "booking-how-soon",
    category: "booking",
    question: "How quickly can you come out?",
    answer: `${site.responseTime ? `${site.responseTime}, and we'll` : "We call you back and"} agree a visit time that suits you. Active leaks get the earliest slot we have.`,
  },
  {
    id: "booking-urgent",
    category: "booking",
    question: "Do you handle urgent leaks?",
    answer: urgentAnswer,
  },
  {
    id: "booking-areas",
    category: "booking",
    question: "Which areas do you cover?",
    answer: areaAnswer,
  },
  {
    id: "booking-best-time",
    category: "booking",
    question: "When is the best time to waterproof in Mumbai?",
    answer:
      "Between October and May, when surfaces are dry and coatings can cure properly. March to May is the busiest time of year for waterproofing in Mumbai, so book your inspection early rather than waiting for the first leak of the monsoon.",
  },
  {
    id: "booking-societies",
    category: "booking",
    question: "Do you work with housing societies?",
    answer:
      "Yes. We inspect the terrace, external walls, tanks or common areas, explain the findings to the committee and give a written proposal, with the work phased so residents aren't disrupted.",
  },
  {
    id: "booking-commercial",
    category: "booking",
    question: "Do you work on commercial and industrial sites?",
    answer:
      "Yes. We handle offices, shops, hotels, hospitals, housing societies, warehouses and factories, with method statements and safety documentation.",
  },
];

/** The questions shown on the home page, in order. */
export const homeFaqIds = [
  "cost-how-much",
  "cost-free-inspection",
  "inspection-what-happens",
  "booking-best-time",
  "duration-typical",
  "booking-societies",
];

/** A short set for the contact page. */
export const contactFaqIds = ["cost-free-inspection", "inspection-how-long", "booking-how-soon", "inspection-prepare"];
