import { SiteImage } from "@/components/media/site-image";
import { cn } from "@/lib/utils";

/**
 * The Royal Waterproofing Co. logo: "Royal" in script over two waves, with the
 * WATERPROOFING CO. wordmark. `tone="light"` is the reversed version for navy
 * backgrounds. The files live in public/images/brand/; the app icon is
 * src/app/icon.svg (run `npm run brand:icons` after changing it).
 *
 * Size it by width (the logo is about 2.1:1). It's decorative inside links that
 * already carry the company name; pass `alt` when it stands alone.
 */
export function Logo({
  tone = "dark",
  eager,
  alt = "",
  className,
}: {
  tone?: "dark" | "light";
  /** Load straight away — for the header, which is always on screen. */
  eager?: boolean;
  alt?: string;
  className?: string;
}) {
  return (
    <SiteImage
      image={tone === "dark" ? "brand-logo" : "brand-logo-reversed"}
      alt={alt}
      sizes="12rem"
      eager={eager}
      draggable={false}
      className={cn("w-28 shrink-0", className)}
    />
  );
}
