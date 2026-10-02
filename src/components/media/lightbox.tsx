"use client";

import Link from "next/link";
import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types/content";
import { BeforeAfterSlider } from "./before-after-slider";
import { SiteImage } from "./site-image";

export interface LightboxItem {
  id: string;
  kind: "photo" | "pair";
  image?: ImageAsset;
  before?: ImageAsset;
  after?: ImageAsset;
  caption: string;
  href?: string;
  tag?: string;
}

/**
 * Modal image viewer on a native <dialog>: Escape closes, arrow keys and
 * swipes move between items, and the page behind is inert while it's open.
 * The parent restores focus to the thumbnail that opened it.
 */
export function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipeStart = useRef<number | null>(null);
  const open = index !== null && items.length > 0;
  const current = open ? items[index] : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add("overflow-hidden");
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      document.documentElement.classList.remove("overflow-hidden");
      onClose();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const go = (delta: number) => {
    if (index === null) return;
    onNavigate((index + delta + items.length) % items.length);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    // Arrow keys belong to the before/after slider while it has focus.
    if ((event.target as HTMLElement).matches("input[type='range']")) return;
    if (event.key === "ArrowRight") go(1);
    else if (event.key === "ArrowLeft") go(-1);
    else if (event.key === "Home") onNavigate(0);
    else if (event.key === "End") onNavigate(items.length - 1);
    else return;
    event.preventDefault();
  };

  const onPointerDown = (event: PointerEvent) => {
    if (current?.kind === "photo") swipeStart.current = event.clientX;
  };
  const onPointerUp = (event: PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  const neighbours = open && items.length > 1 ? [items[(index + 1) % items.length], items[(index - 1 + items.length) % items.length]] : [];

  return (
    <dialog
      ref={dialogRef}
      aria-label="Image viewer"
      onKeyDown={onKeyDown}
      className="tone-navy fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-navy-950/97 p-0 text-white backdrop:bg-navy-950/80 open:flex open:flex-col"
    >
      {current ? (
        <>
          <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="text-sm font-semibold tabular-nums text-white/80" aria-live="polite">
              {index! + 1} / {items.length}
            </p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="flex size-11 items-center justify-center rounded-sm border border-white/25 hover:bg-white/10"
            >
              <X className="size-5" aria-hidden="true" />
              <span className="sr-only">Close viewer</span>
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <figure className="flex max-h-full w-full max-w-5xl flex-col">
              <div className={cn("relative w-full", current.kind === "photo" && "aspect-[4/3] max-h-[72dvh]")}>
                {current.kind === "pair" && current.before && current.after ? (
                  <BeforeAfterSlider
                    key={current.id}
                    before={current.before}
                    after={current.after}
                    label={current.caption}
                    sizes="(min-width: 1024px) 64rem, 100vw"
                    className="max-h-[72dvh]"
                  />
                ) : current.image ? (
                  <SiteImage
                    key={current.id}
                    image={current.image}
                    fill
                    showBadge
                    sizes="(min-width: 1024px) 64rem, 100vw"
                    className="absolute inset-0"
                    imgClassName="object-contain"
                  />
                ) : null}
              </div>
              <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-white">{current.caption}</span>
                {current.href ? (
                  <Link href={current.href} className="inline-flex items-center gap-1.5 font-semibold text-wave-300 hover:text-white">
                    View the project <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                ) : null}
              </figcaption>
            </figure>

            {items.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:left-4"
                >
                  <ChevronLeft className="size-6" aria-hidden="true" />
                  <span className="sr-only">Previous image</span>
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:right-4"
                >
                  <ChevronRight className="size-6" aria-hidden="true" />
                  <span className="sr-only">Next image</span>
                </button>
              </>
            ) : null}
          </div>

          {/* Warm the cache for the neighbouring images. */}
          <div className="hidden" aria-hidden="true">
            {neighbours.flatMap((item) =>
              [item.image, item.before, item.after]
                .filter((img): img is ImageAsset => Boolean(img))
                .map((img) => <SiteImage key={`${item.id}-${img.id}`} image={img} alt="" sizes="(min-width: 1024px) 64rem, 100vw" />),
            )}
          </div>
          <p className="shrink-0 px-6 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 text-center text-xs text-white/50">
            Use the arrow keys or swipe to browse. Press Esc to close.
          </p>
        </>
      ) : null}
    </dialog>
  );
}
