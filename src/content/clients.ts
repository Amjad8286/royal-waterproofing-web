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
 * the Shree Gopal spelling; whether "Tropicana" and "Delhi Tropicana" are
 * different clients; and permission to show each name and logo.
 *
 * Logos (`logo` → src/content/images.ts): official files downloaded by
 * scripts/client-logos.mjs, and the files the owner supplied (October 2026),
 * cleaned up as noted in each one's `source`. Every other client is shown by
 * name. The supplied "Tropicana" file is the Tropicana juice brand's wordmark,
 * used at the owner's request; that the client is that brand is still to confirm.
 */
export const clients: Client[] = [
  // Best-known first
  { slug: "adani", name: "Adani", logo: "client-adani" },
  { slug: "tata", name: "Tata", logo: "client-tata" },
  { slug: "godrej-boyce", name: "Godrej & Boyce Mfg. Co. Ltd.", logo: "client-godrej-boyce" },
  { slug: "mahindra", name: "Mahindra", logo: "client-mahindra" },
  { slug: "navneet-publications", name: "Navneet Publications", logo: "client-navneet" },
  { slug: "arcons", name: "ARCONS", logo: "client-arcons" },
  { slug: "abrol", name: "ABROL", logo: "client-abrol" },
  { slug: "alpine-vistara", name: "Alpine Vistara", logo: "client-alpine-vistara" },
  { slug: "banka-infracon", name: "Banka Infracon", logo: "client-banka-infracon" },
  { slug: "spjimr", name: "SPJIMR", logo: "client-spjimr" },
  { slug: "capacite", name: "Capacite", logo: "client-capacite" },
  { slug: "parsvnath-developers", name: "Parsvnath Developers", logo: "client-parsvnath" },
  { slug: "poonam-highrise", name: "Poonam Highrise Pvt. Ltd.", logo: "client-poonam-highrise" },
  { slug: "svkm", name: "SVKM", logo: "client-svkm" },
  { slug: "hinduja-hospital", name: "Hinduja Hospital", logo: "client-hinduja-hospital" },
  { slug: "miles-infra-llp", name: "Miles Infra LLP" },
  { slug: "mj-shah", name: "MJ Shah", logo: "client-mj-shah" },
  { slug: "narvane-school", name: "Narvane School" },
  { slug: "rashi-developers", name: "Rashi Developers", logo: "client-rashi-developers" },
  { slug: "rustomjee", name: "Rustomjee", logo: "client-rustomjee" },
  { slug: "dosti-group", name: "Dosti Group", logo: "client-dosti" },
  { slug: "nakta-investments", name: "Nakta Investment Pvt. Ltd." },
  { slug: "jatin-agro-land-and-farm", name: "Jatin Agro Land and Farm Pvt. Ltd." },
  { slug: "yashpal-builders", name: "Yashpal Builder's", logo: "client-yashpal-builders" },
  { slug: "balaji-constructions", name: "Balaji Constructions", logo: "client-balaji-constructions" },
  { slug: "piramal", name: "Piramal", logo: "client-piramal" },
  { slug: "runwal", name: "Runwal", logo: "client-runwal" },
  { slug: "kolte-patil", name: "Kolte Patil", logo: "client-kolte-patil" },
  { slug: "chandigarh-university", name: "Chandigarh University", logo: "client-chandigarh-university" },
  { slug: "ibc-knowledge-park", name: "IBC Knowledge Park Pvt. Ltd." },
  { slug: "chandak", name: "Chandak", logo: "client-chandak" },
  { slug: "duville-estate", name: "Duville Estate Pvt. Ltd.", logo: "client-duville-estate" },

  // Then alphabetical
  { slug: "adrika-developers", name: "Adrika Developers" },
  { slug: "goregaon-electricals", name: "Goregaon Electrical" },
  { slug: "avanish-realty", name: "Avanish Realty", logo: "client-avanish-realty" },
  { slug: "chandiwala", name: "Chandiwala", logo: "client-chandiwala" },
  { slug: "delhi-tropicana", name: "Delhi Tropicana" },
  { slug: "dipti", name: "Dipti", logo: "client-dipti" },
  { slug: "ibc-developers", name: "IBC Developers", logo: "client-ibc-developers" },
  { slug: "jk-associates", name: "JK Associates", logo: "client-jk-associates" },
  { slug: "kbs-properties", name: "KBS Properties" },
  { slug: "kvd", name: "KVD" },
  { slug: "mi-construction", name: "MI Construction", logo: "client-mi-construction" },
  { slug: "morya", name: "Morya", logo: "client-morya" },
  { slug: "nadkar", name: "Nadkar" },
  { slug: "p-and-p-construction", name: "P & P Construction", logo: "client-p-and-p-construction" },
  { slug: "puja-poonam-builders", name: "Puja Poonam Builders" },
  { slug: "shree-gopal-housing-plantations", name: "Shree Gopal Housing Plantations" },
  { slug: "suvidha-developers", name: "Suvidha Developers", logo: "client-suvidha-developers" },
  { slug: "tropicana", name: "Tropicana", logo: "client-tropicana" },
];
