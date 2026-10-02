"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { captureAttribution, track, type AnalyticsEvent } from "@/lib/analytics";

/**
 * Site-wide behaviour with no UI:
 * - delegated click tracking for elements with data-track (so links can stay server-rendered)
 * - first-touch UTM attribution capture
 * - scroll reveals for elements with data-reveal that start below the fold
 */
export function SiteBehaviour() {
  const pathname = usePathname();

  useEffect(() => {
    captureAttribution();
    const onClick = (event: MouseEvent) => {
      const el = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      track(el.dataset.track as AnalyticsEvent, {
        location: el.dataset.trackLocation,
        page: window.location.pathname,
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const candidates = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal='shown'])"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = "shown";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const fold = window.innerHeight;
    for (const el of candidates) {
      if (el.getBoundingClientRect().top > fold) {
        el.dataset.reveal = "hidden";
        observer.observe(el);
      }
    }
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
