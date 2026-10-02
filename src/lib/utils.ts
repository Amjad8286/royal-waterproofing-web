import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge needs to know about the custom font-size tokens defined in
 * globals.css, otherwise it treats `text-h2` as a colour and drops it when
 * combined with a `text-<colour>` class.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["h1", "h2", "h3", "h4", "lead", "body", "small", "eyebrow", "stat"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const dateFormat = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" });

/** "2025-09-18" → "Sep 2025" (timezone-safe). */
export function formatMonthYear(isoDate: string) {
  const [year, month] = isoDate.split("-").map(Number);
  return dateFormat.format(new Date(Date.UTC(year, month - 1, 15)));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(value);
}
