import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The logo's two waves in miniature, used before eyebrows. */
export function WaveMark() {
  return (
    <span className="wave-mark" aria-hidden="true">
      <span />
      <span />
    </span>
  );
}

export function Eyebrow({ children, tone = "light", className }: { children: ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <p className={cn("eyebrow", tone === "dark" ? "text-wave-300" : "text-royal-700", className)}>
      <WaveMark />
      {children}
    </p>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  as: Tag = "h2",
  align = "left",
  tone = "light",
  action,
  className,
}: {
  id?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  tone?: "light" | "dark";
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
        {eyebrow ? (
          <Eyebrow tone={tone} className={cn("mb-4", align === "center" && "justify-center")}>
            {eyebrow}
          </Eyebrow>
        ) : null}
        <Tag id={id} className={cn(Tag === "h1" ? "text-h1" : "text-h2", tone === "dark" && "text-white")}>
          {title}
        </Tag>
        {intro ? <p className={cn("mt-4 text-lead", tone === "dark" ? "text-white/75" : "text-ink-muted")}>{intro}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
