import type { Client } from "@/types/content";

/**
 * Clients shown on the home page ("Our clients"), in display order. The best-
 * known come first: phones show the first rows before "Show all clients".
 *
 * The list was supplied by the owner (October 2026). Changes made to it:
 * - "Royal Waterproofing Office" was left out — it's the company's own office,
 *   not a client.
 * - "Ghree Gopal Housing Plantations" is shown as "Shree Gopal" (assumed typo).
 * - Names supplied in capitals are written in normal case (the wall sets every
 *   name in capitals anyway, and screen readers read them as words).
 * Still to confirm before launch (`pendingFacts` → "clients" in src/config/site.ts):
 * the Shree Gopal spelling; whether "Ashraf Shaikh" and "Dipti" are businesses
 * or private individuals (individuals need their consent to be named); whether
 * "Tropicana" and "Delhi Tropicana" are different clients; the exact name for
 * "Pooja Poonam Tata"; and permission to show each name and logo.
 *
 * Logos: only where an official file is available (`logo` → src/content/images.ts).
 * Every other client is shown by name. To add a logo you've been given, see
 * scripts/client-logos.mjs.
 */
export const clients: Client[] = [
  // Best-known first
  { slug: "adani", name: "Adani", logo: "client-adani" },
  { slug: "tata", name: "Tata", logo: "client-tata" },
  { slug: "godrej-boyce", name: "Godrej & Boyce Mfg. Co. Ltd.", logo: "client-godrej-boyce" },
  { slug: "piramal", name: "Piramal" },
  { slug: "runwal", name: "Runwal" },
  { slug: "kolte-patil", name: "Kolte Patil" },
  { slug: "chandigarh-university", name: "Chandigarh University" },
  { slug: "ibc-knowledge-park", name: "IBC Knowledge Park Pvt. Ltd." },
  { slug: "chandak", name: "Chandak" },
  { slug: "duville-estate", name: "Duville Estate" },

  // Then alphabetical
  { slug: "adrika-developers", name: "Adrika Developers" },
  { slug: "ashraf-shaikh", name: "Ashraf Shaikh" },
  { slug: "avanish-realty", name: "Avanish Realty" },
  { slug: "chandiwala", name: "Chandiwala" },
  { slug: "delhi-tropicana", name: "Delhi Tropicana" },
  { slug: "dipti", name: "Dipti" },
  { slug: "goregaon-electric", name: "Goregaon Electric" },
  { slug: "ibc-developers", name: "IBC Developers" },
  { slug: "jiten-agroland-farm", name: "Jiten Agroland & Farm" },
  { slug: "jk-associates", name: "JK Associates" },
  { slug: "kbs-properties", name: "KBS Properties" },
  { slug: "kvd", name: "KVD" },
  { slug: "mi-construction", name: "MI Construction" },
  { slug: "morya", name: "Morya" },
  { slug: "nadkar", name: "Nadkar" },
  { slug: "p-and-p-construction", name: "P & P Construction" },
  { slug: "pooja-poonam-tata", name: "Pooja Poonam Tata" },
  { slug: "shree-gopal-housing-plantations", name: "Shree Gopal Housing Plantations" },
  { slug: "suvidha-developers", name: "Suvidha Developers" },
  { slug: "tropicana", name: "Tropicana" },
];
