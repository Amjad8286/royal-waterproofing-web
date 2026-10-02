"use client";

import { useEffect, useState } from "react";

/**
 * True once the page's hero CTAs (`#hero-cta`) have scrolled above the
 * viewport. Pages without a hero CTA count as "past" after a short scroll.
 * Persistent CTAs use this so they don't duplicate buttons already on screen.
 */
export function usePastHero(pathname: string) {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-cta");
    if (hero) {
      const observer = new IntersectionObserver(([entry]) =>
        setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      );
      observer.observe(hero);
      return () => observer.disconnect();
    }
    const onScroll = () => setPastHero(window.scrollY > 160);
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return pastHero;
}
