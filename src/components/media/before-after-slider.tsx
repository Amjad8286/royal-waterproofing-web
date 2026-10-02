"use client";

import { useId, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types/content";
import { SiteImage } from "./site-image";

interface BeforeAfterSliderProps {
  before: ImageAsset;
  after: ImageAsset;
  /** What is being compared, for the accessible name. */
  label: string;
  sizes: string;
  className?: string;
  showBadge?: boolean;
}

/**
 * Drag (mouse or touch), click, or use the keyboard (arrows, Home/End) to
 * compare. `touch-action: pan-y` keeps vertical page scrolling working on phones.
 */
export function BeforeAfterSlider({ before, after, label, sizes, className, showBadge = true }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const inputId = useId();

  function moveTo(clientX: number) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPosition(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }

  const rounded = Math.round(position);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative aspect-[4/3] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-sm bg-concrete-200",
        className,
      )}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        dragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        moveTo(event.clientX);
      }}
      onPointerMove={(event) => {
        if (dragging.current) moveTo(event.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
    >
      <SiteImage image={after} alt="" fill sizes={sizes} className="absolute inset-0" draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <SiteImage image={before} alt="" fill sizes={sizes} className="absolute inset-0" draggable={false} />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-xs bg-navy-900/85 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-xs bg-white/95 px-2 py-1 text-xs font-bold uppercase tracking-wider text-navy-900">
        After
      </span>

      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${position}%` }} aria-hidden="true">
        <div className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-outline" />
        <div className="absolute top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy-900 shadow-float transition-shadow group-has-[input:focus-visible]:ring-4 group-has-[input:focus-visible]:ring-royal-700">
          <MoveHorizontal className="size-5" />
        </div>
      </div>

      <label htmlFor={inputId} className="sr-only">
        Compare before and after: {label}
      </label>
      <input
        id={inputId}
        type="range"
        min={0}
        max={100}
        step={5}
        value={Math.round(position / 5) * 5}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-valuetext={`${rounded}% before, ${100 - rounded}% after`}
        className="sr-only"
      />
      <p className="sr-only">
        Before: {before.alt}. After: {after.alt}.
      </p>

      {showBadge && (before.placeholder || after.placeholder) ? (
        <PlaceholderBadge label="Sample images" className="absolute bottom-3 left-3 shadow-card" />
      ) : null}
    </div>
  );
}
