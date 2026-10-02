import { flags } from "@/config/site";

/**
 * Sample (placeholder) content is invented. It is shown only in preview mode
 * (NEXT_PUBLIC_PREVIEW_SAMPLES=true), so the live site never presents it as real.
 */
export function isShown(item: { placeholder?: boolean } | null | undefined): boolean {
  if (!item) return false;
  return !item.placeholder || flags.previewSamples;
}

export function shownOnly<T extends { placeholder?: boolean }>(items: T[]): T[] {
  return items.filter((item) => isShown(item));
}
