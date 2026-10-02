"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Container } from "@/components/layout/container";

export interface HeroCarouselSlide {
  label: string;
  /** What the photo shows, for screen readers. */
  description: string;
  /** Navy laid over this photo (0–1) to even out bright and dark photos. */
  shade: number;
  /** The photo, rendered on the server (a SiteImage that fills the slide). */
  media: ReactNode;
}

/** How long each photo stays up while the slideshow plays. */
const INTERVAL = 7000;
/** Horizontal travel (px) that counts as a swipe. */
const SWIPE_DISTANCE = 48;
/** Swipes starting on these are left to the element (tapping, typing, the form). */
const NO_SWIPE = "a, button, input, select, textarea, label, [data-no-swipe]";

const pad = (n: number) => String(n).padStart(2, "0");

const controlClasses =
  "flex size-11 shrink-0 items-center justify-center rounded-sm border border-white/25 text-white " +
  "transition-colors duration-200 hover:border-white/60 hover:bg-white/10";

/** Calls `done` once the slide's photo has loaded (or failed). Returns a cancel function. */
function whenLoaded(slide: HTMLElement | null | undefined, done: () => void) {
  const img = slide?.querySelector("img");
  if (!img || (img.complete && img.naturalWidth > 0)) {
    done();
    return undefined;
  }
  const stop = () => {
    img.removeEventListener("load", finish);
    img.removeEventListener("error", finish);
  };
  const finish = () => {
    stop();
    done();
  };
  img.addEventListener("load", finish);
  img.addEventListener("error", finish);
  return stop;
}

/**
 * Home hero with a photo slideshow behind a fixed headline, CTAs and the
 * inspection form. Only the photos change, so the message and the form never
 * move.
 *
 * - Plays every 7 s; pauses while the pointer is on the controls, while someone
 *   is in the form, and while the hero is off screen or the tab is hidden.
 * - Using the controls or swiping stops it for good (the play button restarts
 *   it). It doesn't start at all for people who prefer reduced motion.
 * - Only the first photo loads with the page; each next one loads while the
 *   current one is showing.
 * - Screen readers get labelled controls and a live description of the current
 *   photo when it changes by hand.
 */
export function HeroCarousel({
  slides,
  content,
  form,
  labelledBy,
  label = "Photo slideshow",
}: {
  slides: HeroCarouselSlide[];
  /** Headline, intro, CTAs and trust points. */
  content: ReactNode;
  /** The inspection form card. */
  form: ReactNode;
  /** Id of the hero heading. */
  labelledBy: string;
  label?: string;
}) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [mounted, setMounted] = useState<ReadonlySet<number>>(() => new Set([0]));
  const [playing, setPlaying] = useState(true);
  const [cycle, setCycle] = useState(0);
  const [ready, setReady] = useState(false);
  const [preloading, setPreloading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const timer = useRef({ key: "", remaining: INTERVAL });

  const running = ready && playing && !hovered && !busy && visible && count > 1;
  const upcoming = (index + 1) % count;

  const show = useCallback(
    (target: number, dir: 1 | -1) => {
      if (target === index) return;
      setPrevious(index);
      setIndex(target);
      setDirection(dir);
      setMounted((set) => (set.has(target) ? set : new Set(set).add(target)));
    },
    [index],
  );

  // Hydrated: start playing, unless the visitor prefers reduced motion.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Fetch further photos only after the page has loaded, and not at all with Data Saver on.
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;
    const start = () => setPreloading(true);
    if (document.readyState === "complete") {
      const frame = requestAnimationFrame(start);
      return () => cancelAnimationFrame(frame);
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  // Load the next photo while this one is showing.
  useEffect(() => {
    if (!preloading) return;
    const frame = requestAnimationFrame(() =>
      setMounted((set) => (set.has(upcoming) ? set : new Set(set).add(upcoming))),
    );
    return () => cancelAnimationFrame(frame);
  }, [preloading, upcoming]);

  // Pause while the hero is scrolled away or the tab is in the background.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let inView = true;
    const update = () => setVisible(inView && document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(section);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  // The timer keeps its remaining time across pauses, so a paused photo resumes where it stopped.
  useEffect(() => {
    if (!running) return;
    const key = `${index}:${cycle}`;
    if (timer.current.key !== key) timer.current = { key, remaining: INTERVAL };
    const startedAt = performance.now();
    let cancelWait: (() => void) | undefined;
    const id = window.setTimeout(() => {
      const next = (index + 1) % count;
      // Never fade to a photo that hasn't arrived yet.
      cancelWait = whenLoaded(slideRefs.current[next], () => show(next, 1));
    }, timer.current.remaining);
    return () => {
      window.clearTimeout(id);
      cancelWait?.();
      if (timer.current.key === key) {
        timer.current.remaining = Math.max(0, timer.current.remaining - (performance.now() - startedAt));
      }
    };
  }, [running, index, cycle, count, show]);

  const go = (target: number, dir: 1 | -1) => {
    setPlaying(false);
    show(target, dir);
  };
  const next = () => go((index + 1) % count, 1);
  const prev = () => go((index - 1 + count) % count, -1);
  const warm = (i: number) => setMounted((set) => (set.has(i) ? set : new Set(set).add(i)));

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
    } else {
      setPlaying(true);
      setCycle((c) => c + 1); // a fresh full interval for the current photo
    }
  };

  // Keyboard focus on the controls stops the slideshow (it's restarted with the play button);
  // someone working in the form or on the CTAs only pauses it until they leave.
  const onFocus = (event: FocusEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (railRef.current?.contains(target)) {
      if (target.matches(":focus-visible")) setPlaying(false);
    } else {
      setBusy(true);
    }
  };
  const onBlur = (event: FocusEvent<HTMLElement>) => {
    const to = event.relatedTarget as Node | null;
    if (!to || !event.currentTarget.contains(to) || railRef.current?.contains(to)) setBusy(false);
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" || count < 2 || (event.target as Element).closest(NO_SWIPE)) return;
    swipeStart.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0) next();
    else prev();
  };

  const onRailKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    // From a photo button, arrows move along the buttons (and focus follows); elsewhere, from the current photo.
    const tab = (event.target as HTMLElement).dataset.slide;
    const from = tab === undefined ? index : Number(tab);
    const dir = event.key === "ArrowRight" ? 1 : -1;
    const target = (from + dir + count) % count;
    go(target, dir);
    if (tab !== undefined) tabRefs.current[target]?.focus();
  };

  const current = slides[index];

  return (
    <section
      ref={sectionRef}
      aria-labelledby={labelledBy}
      onFocus={onFocus}
      onBlur={onBlur}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        swipeStart.current = null;
      }}
      className="tone-navy relative isolate overflow-hidden bg-navy-950 text-white [touch-action:pan-y_pinch-zoom]"
    >
      <Container className="grid grid-cols-1 lg:min-h-[min(calc(100svh-7.5rem),58rem)] lg:grid-cols-[minmax(0,1fr)_25rem] lg:grid-rows-[1fr_auto] lg:gap-x-14 xl:gap-x-20">
        {/* Photos and scrims, bleeding to the screen edges behind the text and the controls (not the form on phones). */}
        <div
          aria-hidden="true"
          className="relative -z-10 col-span-full row-span-2 row-start-1 mx-[calc(50%-50vw)] overflow-hidden"
          style={{ "--hero-dir": direction } as CSSProperties}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.label}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              data-state={i === index ? "active" : i === previous ? "previous" : undefined}
              data-animate={i === index && previous !== null ? "" : undefined}
              className="hero-slide absolute inset-0"
            >
              {mounted.has(i) ? slide.media : null}
              <div className="absolute inset-0 bg-navy-950" style={{ opacity: slide.shade }} />
            </div>
          ))}
          {/* Scrims. Phones: an even wash, a little more behind the small eyebrow text, then
              solid towards the trust points and controls. Wide screens: dark behind the text
              column, fading out towards the form, and under the controls. */}
          <div className="absolute inset-0 z-10 bg-navy-950/50 lg:hidden" />
          <div className="absolute inset-x-0 top-0 z-10 h-1/3 bg-linear-to-b from-navy-950/40 to-navy-950/0 lg:hidden" />
          <div className="absolute inset-0 z-10 bg-linear-to-b from-navy-950/0 from-45% via-navy-950/60 via-70% to-navy-950 lg:hidden" />
          <div className="absolute inset-0 z-10 hidden bg-linear-to-r from-navy-950/90 from-10% via-navy-950/60 via-45% to-navy-950/10 to-80% lg:block" />
          <div className="absolute inset-x-0 bottom-0 z-10 hidden h-56 bg-linear-to-t from-navy-950 via-navy-950/70 via-35% to-navy-950/0 lg:block" />
        </div>

        <div className="col-start-1 row-start-1 self-center pb-9 pt-9 sm:pt-12 lg:pb-8 lg:pt-12">{content}</div>

        <div data-no-swipe className="col-start-1 row-start-3 pb-14 sm:pb-16 lg:col-start-2 lg:row-start-1 lg:self-center lg:py-8">
          {form}
        </div>

        {count > 1 ? (
          <div
            ref={railRef}
            role="group"
            aria-roledescription="carousel"
            aria-label={label}
            onKeyDown={onRailKeyDown}
            onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            className="col-span-full row-start-2 flex flex-wrap items-center gap-x-4 gap-y-1 pb-9 lg:flex-nowrap lg:gap-x-8 lg:pb-5"
          >
            <p aria-hidden="true" className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2.5 text-sm font-semibold lg:hidden">
              <span className="tabular-nums">
                <span className="text-wave-300">{pad(index + 1)}</span>
                <span className="text-white/50"> / {pad(count)}</span>
              </span>
              <span className="text-white">{current.label}</span>
            </p>

            <div className="flex shrink-0 gap-2 lg:order-first">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                className={controlClasses}
              >
                {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
              </button>
              <button type="button" onClick={prev} aria-label="Previous photo" className={controlClasses}>
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button type="button" onClick={next} aria-label="Next photo" className={controlClasses}>
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div role="group" aria-label="Choose a photo" className="flex basis-full gap-2 lg:basis-auto lg:flex-1 lg:gap-5">
              {slides.map((slide, i) => {
                const active = i === index;
                return (
                  <button
                    key={slide.label}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    data-slide={i}
                    aria-current={active ? "true" : undefined}
                    onClick={() => go(i, i > index ? 1 : -1)}
                    onPointerEnter={() => warm(i)}
                    onFocus={() => warm(i)}
                    className="group relative flex min-h-11 flex-1 items-center gap-2.5 text-left lg:min-w-0 lg:items-start lg:pb-1 lg:pt-4"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/25 lg:top-0 lg:h-0.5 lg:translate-y-0"
                    >
                      {active ? (
                        <span
                          className="hero-progress block h-full rounded-full bg-wave-300"
                          data-state={playing ? "playing" : "shown"}
                          style={{ animationDuration: `${INTERVAL}ms`, animationPlayState: running ? "running" : "paused" }}
                        />
                      ) : null}
                    </span>
                    <span
                      aria-hidden="true"
                      className="hidden font-heading text-sm font-bold tabular-nums text-white/50 transition-colors group-hover:text-white/80 group-aria-[current=true]:text-wave-300 xl:inline"
                    >
                      {pad(i + 1)}
                    </span>
                    <span className="sr-only text-sm font-semibold text-white/70 transition-colors group-hover:text-white group-aria-[current=true]:text-white lg:not-sr-only lg:min-w-0">
                      <span className="block truncate">{slide.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="sr-only" aria-live={playing ? "off" : "polite"} aria-atomic="true">
              {`Photo ${index + 1} of ${count}: ${current.label}. ${current.description}`}
            </p>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
