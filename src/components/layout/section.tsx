import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

export type SectionTone = "white" | "concrete" | "navy";

/** `--section-bg` lets children (e.g. ring cut-outs) match whatever background they sit on. */
const tones: Record<SectionTone, string> = {
  white: "bg-white [--section-bg:var(--color-white)]",
  concrete: "bg-concrete-100 [--section-bg:var(--color-concrete-100)]",
  navy: "tone-navy bg-navy-900 text-white [--section-bg:var(--color-navy-900)]",
};

const spacings = {
  default: "py-16 sm:py-20 lg:py-28",
  tight: "py-12 sm:py-14 lg:py-20",
  none: "",
};

export function Section({
  children,
  tone = "white",
  spacing = "default",
  id,
  labelledBy,
  className,
  containerClassName,
}: {
  children: ReactNode;
  tone?: SectionTone;
  spacing?: keyof typeof spacings;
  id?: string;
  labelledBy?: string;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn(tones[tone], spacings[spacing], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
