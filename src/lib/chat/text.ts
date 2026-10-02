import { chatPhrases, chatSynonyms } from "@/content/chat";

/**
 * Turns questions and content into comparable search terms: lower case,
 * no punctuation or filler words, a light English stemmer ("leaking",
 * "leaks" → "leak") and the synonyms in src/content/chat.ts ("toilet" →
 * "bathroom"). Content and questions go through the same steps, so they meet
 * in the middle.
 */

const STOPWORDS = new Set(
  `a an the and or but if then so to of in on at by for with from into onto about as is are was were be been being am
  do does did doing done have has had having can could will would shall should may might must i me my mine myself we us
  our ours you your yours u ur he she it its they them their this that these those there here what whats which whom
  whose why how hows when also too very just any some please pls plz kindly hi hello hey sir madam maam ji bhai want
  wanted need needs like know tell let lets okay ok thanks thank much more most other than up out over again still even
  only own same such each both few many really actually something anything thing things one get got go going im ive id
  dont doesnt cant wont isnt arent thats theres not no nor yes help take takes taking took
  hai hain ho hoga hogi honge tha thi ka ki ke ko se me mein mai main mera meri mere apka aapka apki aapki aap ap tum hum ham
  kya kaise kaisa kab kahan kaha raha rahi rahe karna karne karte karo kar kare kijiye bhi toh na nahi haan aur ya par pe
  liye chahiye sakte sakta sakti wala wali wale yeh ye woh wo iska uska kuch koi bahut bohot abhi batao bataiye bataye pata`.split(/\s+/),
);

/** "waterproofing" → "waterproof", "societies" → "society", "dripping" → "drip". Not a dictionary stemmer: consistent is what counts. */
export function stem(word: string): string {
  if (word.length <= 3 || /\d/.test(word)) return word;
  let w = word;
  if (w.endsWith("ies") && w.length > 4) w = `${w.slice(0, -3)}y`;
  else if (/(s|x|z|ch|sh)es$/.test(w) && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith("s") && !/(ss|us|is)$/.test(w)) w = w.slice(0, -1);

  if (w.endsWith("ness") && w.length > 6) w = w.slice(0, -4);
  else if (w.endsWith("ing") && w.length > 5) w = w.slice(0, -3);
  else if (w.endsWith("ed") && w.length > 4) w = w.slice(0, -2);

  if (w.endsWith("e") && w.length > 3) w = w.slice(0, -1);
  // powdery → powder, leaky → leak, salty → salt
  else if (w.endsWith("y") && w.length > 4) w = w.slice(0, -1);
  // dripp → drip, stopp → stop
  return w.replace(/([bdfgmnprt])\1$/, "$1");
}

const synonymOf = new Map<string, string>();
for (const [word, variants] of Object.entries(chatSynonyms)) {
  for (const variant of [word, ...variants]) synonymOf.set(stem(variant), stem(word));
}

function canonical(word: string) {
  const stemmed = stem(word);
  return synonymOf.get(stemmed) ?? stemmed;
}

export function normalize(text: string): string {
  let out = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’`]/g, "");
  for (const [pattern, replacement] of chatPhrases) out = out.replace(pattern, ` ${replacement} `);
  return out;
}

export function tokenize(text: string): string[] {
  return normalize(text)
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 1 && !STOPWORDS.has(word))
    .map(canonical);
}

/** Edit distance with adjacent swaps (Damerau–Levenshtein, optimal string alignment); stops early past `max`. */
export function editDistance(a: string, b: string, max = Infinity): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let previousRow: number[] = [];
  let row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const beforePrevious = previousRow;
    previousRow = row;
    row = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(previousRow[j] + 1, row[j - 1] + 1, previousRow[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) value = Math.min(value, beforePrevious[j - 2] + 1);
      row[j] = value;
      rowMin = Math.min(rowMin, value);
    }
    if (rowMin > max) return max + 1;
  }
  return row[b.length];
}
