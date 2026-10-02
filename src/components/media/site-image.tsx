import Image, { getImageProps } from "next/image";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { getImage } from "@/content/images";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types/content";

/** Where `portrait` replaces the main image: phones and tablets held upright. */
const PORTRAIT_MEDIA = "(max-width: 1023px) and (orientation: portrait)";

interface SiteImageProps {
  /** Manifest id or a resolved asset. */
  image: string | ImageAsset;
  /** Required: how wide the image renders at each breakpoint. */
  sizes: string;
  className?: string;
  imgClassName?: string;
  /** Fill the parent (which must set the size/aspect ratio). */
  fill?: boolean;
  /** For the LCP image only: load eagerly with high priority. */
  preload?: boolean;
  /** Load immediately (no lazy loading), e.g. the first cards of a grid that start on screen. */
  eager?: boolean;
  /** Overlay a "Sample image" badge when the image is a placeholder. */
  showBadge?: boolean;
  /** Override alt, e.g. "" when the image is decorative next to a heading. */
  alt?: string;
  draggable?: boolean;
  /**
   * Art direction (with `fill`): a portrait crop of the same photo, shown instead
   * on phones and tablets held upright, with its own `portraitSizes`.
   */
  portrait?: string | ImageAsset;
  portraitSizes?: string;
}

/** Every image on the site goes through here so dimensions, alt text and placeholders stay consistent. */
export function SiteImage({
  image,
  sizes,
  className,
  imgClassName,
  fill,
  preload,
  eager,
  showBadge,
  alt,
  draggable,
  portrait,
  portraitSizes,
}: SiteImageProps) {
  const asset = typeof image === "string" ? getImage(image) : image;
  const priority = preload
    ? ({ loading: "eager", fetchPriority: "high" } as const)
    : eager
      ? ({ loading: "eager" } as const)
      : {};
  const blur = asset.blurDataURL ? ({ placeholder: "blur", blurDataURL: asset.blurDataURL } as const) : {};
  const badge =
    showBadge && asset.placeholder ? (
      <PlaceholderBadge label="Sample image" className="absolute left-3 top-3 z-10 shadow-card" />
    ) : null;

  if (fill && portrait) {
    const tall = typeof portrait === "string" ? getImage(portrait) : portrait;
    const shared = { alt: alt ?? asset.alt, fill: true, ...priority } as const;
    const { props: tallProps } = getImageProps({ ...shared, src: tall.src, sizes: portraitSizes ?? sizes });
    const { props } = getImageProps({ ...shared, src: asset.src, sizes, ...blur });
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <picture>
          <source media={PORTRAIT_MEDIA} srcSet={tallProps.srcSet} sizes={tallProps.sizes} />
          {/* Art direction needs <picture>; the props come from getImageProps. */}
          <img {...props} alt={props.alt} draggable={draggable} className={cn("object-cover", imgClassName)} />
        </picture>
        {badge}
      </div>
    );
  }

  if (fill) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={asset.src}
          alt={alt ?? asset.alt}
          fill
          sizes={sizes}
          draggable={draggable}
          className={cn("object-cover", imgClassName)}
          {...priority}
          {...blur}
        />
        {badge}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Image
        src={asset.src}
        alt={alt ?? asset.alt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        draggable={draggable}
        className={cn("h-auto w-full", imgClassName)}
        {...priority}
        {...blur}
      />
      {badge}
    </div>
  );
}
