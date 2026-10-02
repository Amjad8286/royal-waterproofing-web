"use client";

import { useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Tiles shown before "Show all" — five full rows at two columns (phones) and three (tablets). */
const COLLAPSED = { phone: 10, tablet: 15 };

const subscribe = () => () => {};

/**
 * The client grid: equal tiles divided by hairlines. Every tile is in the HTML
 * and visible without JavaScript. Once hydrated, phones and tablets show the
 * first five rows with a button for the rest, so the section doesn't run to
 * fifteen rows on a phone; desktops always show everything.
 */
export function ClientWall({ tiles, className }: { tiles: ReactNode[]; className?: string }) {
  const listId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [expanded, setExpanded] = useState(false);
  const collapsible = hydrated && tiles.length > COLLAPSED.phone;
  const collapsed = collapsible && !expanded;

  const toggle = () => {
    setExpanded(!expanded);
    // Collapsing removes rows above the button; bring it back into view.
    if (expanded) requestAnimationFrame(() => buttonRef.current?.scrollIntoView({ block: "nearest" }));
  };

  return (
    <div className={className}>
      <ul
        id={listId}
        className="grid grid-cols-2 overflow-hidden rounded-sm border-l border-t border-concrete-300 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6"
      >
        {tiles.map((tile, i) => (
          <li
            key={i}
            className={cn(
              "group flex h-20 items-center justify-center border-b border-r border-concrete-300 bg-white px-3 sm:h-24 sm:px-4",
              collapsed && i >= COLLAPSED.tablet && "max-lg:hidden",
              collapsed && i >= COLLAPSED.phone && i < COLLAPSED.tablet && "max-sm:hidden",
            )}
          >
            {tile}
          </li>
        ))}
      </ul>
      {collapsible ? (
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={toggle}
          className={cn(
            buttonClasses({ variant: "outline" }),
            "mt-6 w-full sm:w-auto",
            tiles.length > COLLAPSED.tablet ? "lg:hidden" : "sm:hidden",
          )}
        >
          {expanded ? "Show fewer clients" : `Show all ${tiles.length} clients`}
          <ChevronDown
            className={cn("size-4 transition-transform duration-200", expanded && "rotate-180")}
            aria-hidden="true"
          />
        </button>
      ) : null}
    </div>
  );
}
