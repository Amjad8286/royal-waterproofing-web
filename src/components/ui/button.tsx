import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { trackAttrs, type AnalyticsEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "outline-light" | "ghost" | "whatsapp" | "link";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-semibold whitespace-nowrap select-none " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-60 aria-disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  // The logo's wave blue is reserved for the primary conversion action — never use a wave-600 fill for anything else.
  primary: "bg-wave-600 text-white shadow-press hover:bg-wave-700 active:bg-royal-700",
  secondary: "bg-navy-900 text-white hover:bg-navy-700 active:bg-navy-950",
  outline: "border border-navy-900/25 bg-white text-navy-900 hover:border-navy-900 hover:bg-concrete-100",
  "outline-light": "border border-white/40 text-white hover:border-white hover:bg-white/10",
  ghost: "text-navy-900 hover:bg-concrete-200",
  whatsapp: "bg-whatsapp text-navy-950 hover:bg-whatsapp-dark",
  link: "h-auto px-0 text-royal-700 underline-offset-4 hover:underline",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-[0.9375rem]",
  lg: "h-14 px-7 text-base",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  /** Fires an analytics event on click (handled by AnalyticsListener). */
  track?: { event: AnalyticsEvent; location: string };
}

type LinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children"> & { href: string };
type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: undefined; loading?: boolean };

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
}: Pick<CommonProps, "variant" | "size" | "fullWidth" | "className">) {
  return cn(base, variants[variant], variant !== "link" && sizes[size], fullWidth && "w-full", className);
}

export function Button(props: LinkProps | NativeButtonProps) {
  const { variant, size, className, children, icon, iconRight, fullWidth, track, ...rest } = props;
  const classes = buttonClasses({ variant, size, fullWidth, className });
  const tracking = track ? trackAttrs(track.event, track.location) : {};

  if (rest.href !== undefined) {
    const { href, ...anchorProps } = rest as LinkProps;
    const content = (
      <>
        {icon}
        {children}
        {iconRight}
      </>
    );
    if (href.startsWith("/") || href.startsWith("#")) {
      return (
        <Link href={href} className={classes} {...tracking} {...anchorProps}>
          {content}
        </Link>
      );
    }
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...tracking}
        {...anchorProps}
      >
        {content}
      </a>
    );
  }

  const { loading, type = "button", disabled, ...buttonProps } = rest as NativeButtonProps;
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...tracking}
      {...buttonProps}
    >
      {loading ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}
