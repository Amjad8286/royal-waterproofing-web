import { editDistance, tokenize } from "./text";

/**
 * A small full-text index over the assistant's knowledge (BM25, with title
 * and keyword matches counting more than body text). Built once per server
 * process from a few hundred short documents, so it needs no database,
 * service or dependency.
 */

export interface Searchable {
  title: string;
  /** Other ways of asking the same question; they count as titles. */
  alsoAsked?: string[];
  keywords: string[];
  body: string;
  answer: string;
}

export interface SearchHit<T> {
  doc: T;
  /** Relevance, for ranking. */
  score: number;
  /**
   * How much of the question the document covers, from 0 to 1: each term
   * counts by how rare (informative) it is, fully when it's in the title or
   * keywords, half when it's only in the body. Words the content never uses
   * ("laptop", "pizza") count against it, which is what lets the assistant
   * say it doesn't know.
   */
  coverage: number;
  /**
   * The other way round: how much of the document's title the question
   * covers. "Do you work in Thane?" covers most of "Waterproofing in Thane"
   * but little of "Do you work with builders on new projects in Thane?", so
   * the general answer ranks above the specific one.
   */
  titleCoverage: number;
}

/**
 * BM25F: each field is length-normalised on its own, so a match in a short
 * title counts the same whether or not the document has a long body.
 */
const FIELDS = [
  { name: "title", weight: 3, b: 0.3, strong: true },
  { name: "keywords", weight: 2, b: 0.3, strong: true },
  { name: "body", weight: 1, b: 0.75, strong: false },
] as const;
const K1 = 1.2;
/** Share of the score kept when none of the document's title is in the question (see titleCoverage). */
const TITLE_BASE = 0.3;

function fieldTexts(doc: Searchable): string[] {
  return [doc.title, [...(doc.alsoAsked ?? []), ...doc.keywords].join(" "), `${doc.body}\n${doc.answer}`];
}

export function createSearchIndex<T extends Searchable>(docs: T[]) {
  /** Per document and field: term → count. */
  const counts: Map<string, number>[][] = [];
  /** Per document and field: number of terms. */
  const lengths: number[][] = [];
  const titles: Set<string>[][] = [];
  const documentFrequency = new Map<string, number>();

  for (const doc of docs) {
    titles.push([doc.title, ...(doc.alsoAsked ?? [])].map((title) => new Set(tokenize(title))));
    const fields = fieldTexts(doc).map((text) => {
      const terms = new Map<string, number>();
      const tokens = tokenize(text);
      for (const term of tokens) terms.set(term, (terms.get(term) ?? 0) + 1);
      return { terms, length: tokens.length };
    });
    counts.push(fields.map((field) => field.terms));
    lengths.push(fields.map((field) => field.length));
    const unique = new Set(fields.flatMap((field) => [...field.terms.keys()]));
    for (const term of unique) documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
  }

  const averageLengths = FIELDS.map((_, f) => lengths.reduce((sum, doc) => sum + doc[f], 0) / Math.max(docs.length, 1) || 1);

  const count = docs.length;
  const idf = (term: string) => {
    const df = documentFrequency.get(term) ?? 0;
    return Math.log(1 + (count - df + 0.5) / (df + 0.5));
  };

  /** "basment" → "basement": unknown words of five letters or more snap to the closest word in the content. */
  function correct(term: string) {
    if (documentFrequency.has(term) || term.length < 5 || /\d/.test(term)) return term;
    const max = term.length >= 8 ? 2 : 1;
    let best = term;
    let bestDistance = max + 1;
    let bestFrequency = 0;
    for (const [candidate, frequency] of documentFrequency) {
      if (candidate.length < 4 || Math.abs(candidate.length - term.length) > max) continue;
      const distance = editDistance(term, candidate, max);
      if (distance < bestDistance || (distance === bestDistance && frequency > bestFrequency)) {
        best = candidate;
        bestDistance = distance;
        bestFrequency = frequency;
      }
    }
    return bestDistance <= max ? best : term;
  }

  function search(query: string, { boost }: { boost?: (doc: T) => number } = {}): SearchHit<T>[] {
    const terms = [...new Set(tokenize(query).map(correct))];
    if (terms.length === 0) return [];
    const weights = terms.map(idf);
    const total = weights.reduce((sum, weight) => sum + weight, 0);

    const hits: SearchHit<T>[] = [];
    docs.forEach((doc, i) => {
      let score = 0;
      let covered = 0;
      terms.forEach((term, t) => {
        let tf = 0;
        let strong = false;
        let found = false;
        FIELDS.forEach((field, f) => {
          const occurrences = counts[i][f].get(term);
          if (!occurrences) return;
          found = true;
          strong ||= field.strong;
          tf += (field.weight * occurrences) / (1 - field.b + (field.b * lengths[i][f]) / averageLengths[f]);
        });
        if (!found) return;
        score += weights[t] * ((tf * (K1 + 1)) / (tf + K1));
        covered += weights[t] * (strong ? 1 : 0.5);
      });
      if (score === 0) return;

      let titleCoverage = 0;
      for (const title of titles[i]) {
        let titleWeight = 0;
        let titleCovered = 0;
        for (const term of title) {
          titleWeight += idf(term);
          if (terms.includes(term)) titleCovered += idf(term);
        }
        if (titleWeight) titleCoverage = Math.max(titleCoverage, titleCovered / titleWeight);
      }
      hits.push({
        doc,
        score: score * (TITLE_BASE + (1 - TITLE_BASE) * titleCoverage) * (boost?.(doc) ?? 1),
        coverage: covered / total,
        titleCoverage,
      });
    });
    return hits.sort((a, b) => b.score - a.score);
  }

  return { search, size: count };
}

export type SearchIndex<T extends Searchable> = ReturnType<typeof createSearchIndex<T>>;
