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
  { slug: "mahindra", name: "Mahindra" },
  { slug: "navneet-publications", name: "Navneet Publications" },
  { slug: "arcons", name: "ARCONS" },
  { slug: "abrol", name: "ABROL" },
  { slug: "alpine-vistara", name: "Alpine Vistara" },
  { slug: "banka-infracon", name: "Banka Infracon" },
  { slug: "spjmir", name: "SPJMIR" },
  { slug: "capacite", name: "Capacite" },
  { slug: "parsvnath-developers", name: "Parsvnath Developers" },
  { slug: "poonam-highrise", name: "Poonam Highrise Pvt. Ltd." },
  { slug: "svkm", name: "SVKM" },
  { slug: "hinduja-hospital", name: "Hinduja Hospital" },
  { slug: "miles-infra-llp", name: "Miles Infra LLP" },
  { slug: "mj-shah", name: "MJ Shah" },
  { slug: "narvane-school", name: "Narvane School" },
  { slug: "rashi-developers", name: "Rashi Developers" },
  { slug: "rutomjee", name: "Rutomjee" },
  { slug: "dosti-group", name: "Dosti Group" },
  { slug: "nakta-investments", name: "Nakta Investments Pvt. Ltd." },
  { slug: "jatin-agro-land-and-farm", name: "Jatin Agro Land and Farm Pvt. Ltd." },
  { slug: "yashpal-builders", name: "Yashpal Builder's" },
  { slug: "balaji-constructions", name: "Balaji Constructions" },
  { slug: "piramal", name: "Piramal" },
  { slug: "runwal", name: "Runwal" },
  { slug: "runwal", name: "Runwal" },
  { slug: "kolte-patil", name: "Kolte Patil" },
  { slug: "chandigarh-university", name: "Chandigarh University" },
  { slug: "ibc-knowledge-park", name: "IBC Knowledge Park Pvt. Ltd." },
  { slug: "chandak", name: "Chandak" },
  { slug: "duville-estate", name: "Duville Estate" },

  // Then alphabetical
  { slug: "adrika-developers", name: "Adrika Developers" },
  { slug: "goregaon-electicals", name: "Goregaon Electrical" },
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
  { slug: "puja-poonam-builders", name: "Puja Poonam Builders" },
  { slug: "shree-gopal-housing-plantations", name: "Shree Gopal Housing Plantations" },
  { slug: "suvidha-developers", name: "Suvidha Developers" },
  { slug: "tropicana", name: "Tropicana" },
];
