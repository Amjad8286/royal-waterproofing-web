"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Clamps long quotes to six lines and adds "Read more" only when text actually overflows. */
export function ExpandableQuote({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setOverflowing(el.scrollHeight > el.clientHeight + 1));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={className}>
      <p ref={ref} className={cn(!expanded && "line-clamp-6")}>
        “{children}”
      </p>
      {overflowing || expanded ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-2 text-sm font-semibold text-royal-700 underline-offset-4 hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      ) : null}
    </div>
  );
}
