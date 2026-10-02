"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { LoaderCircle, MessageCircleMore, X } from "lucide-react";
import { actionBarHiddenOn } from "@/components/layout/mobile-action-bar";
import type { NavLookups } from "@/components/layout/nav-types";
import { useFieldFocus } from "@/components/layout/use-field-focus";
import { usePastHero } from "@/components/layout/use-past-hero";
import { track } from "@/lib/analytics";
import type { ChatWidgetConfig } from "@/lib/chat/types";
import { cn } from "@/lib/utils";

const loadPanel = () => import("./chat-panel");
const ChatPanel = dynamic(() => loadPanel().then((module) => module.ChatPanel), { ssr: false });

const DESKTOP = "(min-width: 64rem)";

function subscribeDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * The floating "Ask us a question" button, bottom right. Like the other
 * persistent CTAs it appears once the hero's buttons have scrolled away; on
 * phones it sits above the quick-contact bar and steps aside while a form
 * field has focus. The chat window itself is loaded on first use.
 */
export function ChatLauncher({ config, lookups }: { config: ChatWidgetConfig; lookups: NavLookups }) {
  const pathname = usePathname();
  const pastHero = usePastHero(pathname);
  const typing = useFieldFocus("#chat-panel");
  const desktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP).matches,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);
  const [ready, setReady] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const visible = open || (pastHero && (desktop || !typing));
  // Phones and tablets: clear of the quick-contact bar (src/components/layout/mobile-action-bar.tsx) while it shows.
  const raised = !desktop && pastHero && !typing && !actionBarHiddenOn.has(pathname);

  const prefetch = () => {
    void loadPanel();
  };

  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    setRequested(true);
    setOpen(true);
    track("chat_open", { location: "launcher" });
  };

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);
  const markReady = useCallback(() => setReady(true), []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        onTouchStart={prefetch}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={ready ? "chat-panel" : undefined}
        inert={!visible}
        className={cn(
          "fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 flex size-14 items-center justify-center rounded-full bg-navy-900 text-white shadow-float lg:right-6 lg:bottom-6",
          "transition-[background-color,transform,opacity] duration-300 ease-out hover:bg-navy-700",
          // A white ring inside the focus outline, so focus also shows over navy sections and the footer.
          "focus-visible:ring-2 focus-visible:ring-white",
          visible ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0",
          raised && "-translate-y-[4.25rem]",
        )}
      >
        {open && !ready ? (
          <LoaderCircle className="size-6 animate-spin" aria-hidden="true" />
        ) : open ? (
          <X className="size-6" aria-hidden="true" />
        ) : (
          <MessageCircleMore className="size-6" aria-hidden="true" />
        )}
        <span className="sr-only">{open ? "Close chat" : config.launcherLabel}</span>
      </button>
      {requested ? <ChatPanel open={open} onClose={close} onReady={markReady} config={config} lookups={lookups} /> : null}
    </>
  );
}
