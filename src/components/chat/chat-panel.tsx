"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type MouseEvent } from "react";
import { RotateCcw, SendHorizontal, X } from "lucide-react";
import type { NavLookups } from "@/components/layout/nav-types";
import { pageContext } from "@/components/layout/page-context";
import { chatLimits, type ChatWidgetConfig } from "@/lib/chat/types";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";
import { ChatAvatar } from "./chat-avatar";
import { ChatBubble, Suggestions } from "./chat-message";
import { useChat } from "./use-chat";

/** From here up the chat is a panel beside the page; below, a modal sheet. Matches the `lg` breakpoint. */
const DESKTOP = "(min-width: 64rem)";
/** Below this the sheet fills the screen (Tailwind's `sm`). */
const PHONE = "(max-width: 39.99rem)";

const headerButton =
  "flex size-10 shrink-0 items-center justify-center rounded-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white";

export interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
  onReady: () => void;
  config: ChatWidgetConfig;
  lookups: NavLookups;
}

/**
 * The website assistant's window, on a native <dialog>:
 * - desktop: a panel above the chat button; the page stays usable, Escape closes it;
 * - tablets: a card over a dimmed page (modal: focus stays inside, Escape closes);
 * - phones: a full-screen sheet that shrinks with the on-screen keyboard.
 * Loaded on first open (see ChatLauncher), so it costs nothing until it's used.
 */
export function ChatPanel({ open, onClose, onReady, config, lookups }: ChatPanelProps) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { messages, pending, ask, retry, reset } = useChat(pathname);
  const [draft, setDraft] = useState("");
  /** Messages already shown when the panel loaded (restored from earlier in the visit) don't animate in. */
  const [restored] = useState(() => new Set(messages.map((message) => message.id)));
  const shownCount = useRef(messages.length);

  const { contactHref, message: whatsappText } = pageContext(pathname, lookups);
  const whatsappHref = whatsappUrl(whatsappText);

  useEffect(() => {
    onReady();
  }, [onReady]);

  // Open and close the native dialog.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      if (window.matchMedia(DESKTOP).matches) {
        dialog.show();
        inputRef.current?.focus();
      } else {
        // Modal: the page behind is inert. Focus goes to the first button rather than the input,
        // so the on-screen keyboard doesn't cover the suggestions straight away.
        dialog.showModal();
        document.documentElement.classList.add("overflow-hidden");
      }
      const scroller = scrollRef.current;
      if (scroller) scroller.scrollTop = scroller.scrollHeight;
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onDialogClose = () => {
      document.documentElement.classList.remove("overflow-hidden");
      onClose();
    };
    dialog.addEventListener("close", onDialogClose);
    // Crossing the desktop breakpoint switches between panel and sheet: close, and the next open picks the right one.
    const desktop = window.matchMedia(DESKTOP);
    const onBreakpoint = () => {
      if (dialog.open) dialog.close();
    };
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      dialog.removeEventListener("close", onDialogClose);
      desktop.removeEventListener("change", onBreakpoint);
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [onClose]);

  // Phones: keep the sheet inside the visible area when the on-screen keyboard opens.
  useEffect(() => {
    const dialog = dialogRef.current;
    const viewport = window.visualViewport;
    if (!open || !dialog || !viewport) return;
    const fit = () => {
      if (dialog.matches(":modal") && window.matchMedia(PHONE).matches) {
        dialog.style.height = `${viewport.height}px`;
        dialog.style.top = `${viewport.offsetTop}px`;
      } else {
        dialog.style.removeProperty("height");
        dialog.style.removeProperty("top");
      }
    };
    fit();
    viewport.addEventListener("resize", fit);
    viewport.addEventListener("scroll", fit);
    return () => {
      viewport.removeEventListener("resize", fit);
      viewport.removeEventListener("scroll", fit);
      dialog.style.removeProperty("height");
      dialog.style.removeProperty("top");
    };
  }, [open]);

  // Keep the newest message in view: the start of an answer (long ones are read from the top), otherwise the bottom.
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    const answered = messages.length > shownCount.current && messages.at(-1)?.role === "assistant";
    shownCount.current = messages.length;
    const last = scroller.querySelector<HTMLElement>("li[data-message]:last-child");
    if (answered && last) scroller.scrollTo({ top: last.offsetTop - 16, behavior });
    else scroller.scrollTo({ top: scroller.scrollHeight, behavior });
  }, [messages, pending]);

  const resizeInput = () => {
    const input = inputRef.current;
    if (!input) return;
    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
  };

  const send = (event?: FormEvent) => {
    event?.preventDefault();
    if (!draft.trim() || pending) return;
    void ask(draft, "typed");
    setDraft("");
    inputRef.current?.style.removeProperty("height");
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send();
    }
  };

  const onDialogKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    // Modal dialogs close on Escape by themselves; the desktop panel needs telling.
    if (event.key === "Escape" && !event.currentTarget.matches(":modal")) {
      event.preventDefault();
      event.currentTarget.close();
    }
  };

  const onDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    const dialog = event.currentTarget;
    if (!dialog.matches(":modal")) return;
    const target = event.target as Element;
    // A click on the dimmed backdrop lands on the dialog itself; a followed link leaves the chat.
    if (target === dialog || target.closest("a")) dialog.close();
  };

  const startOver = () => {
    reset();
    setDraft("");
    inputRef.current?.focus();
  };

  const latest = messages.at(-1);

  return (
    <dialog
      ref={dialogRef}
      id="chat-panel"
      aria-labelledby="chat-title"
      onKeyDown={onDialogKeyDown}
      onClick={onDialogClick}
      className={cn(
        "chat-panel fixed m-0 max-h-none max-w-none overflow-hidden border-0 bg-concrete-50 p-0 text-ink backdrop:bg-navy-950/50 open:flex open:flex-col",
        "inset-0 h-dvh w-full",
        "sm:inset-auto sm:right-4 sm:bottom-4 sm:h-[min(40rem,calc(100dvh-2rem))] sm:w-[25rem] sm:rounded-md sm:shadow-float",
        "lg:right-6 lg:bottom-24 lg:z-50 lg:h-[min(40rem,calc(100dvh-8rem))] lg:border lg:border-concrete-300",
      )}
    >
      <header className="tone-navy flex shrink-0 items-center gap-3 bg-navy-900 px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 text-white sm:pt-3">
        <ChatAvatar className="size-10 ring-1 ring-white/25" />
        <div className="min-w-0 flex-1">
          <h2 id="chat-title" className="truncate text-lg leading-tight text-white">
            {config.name}
          </h2>
          <p className="truncate text-sm text-white/70">{config.tagline}</p>
        </div>
        {messages.length > 0 ? (
          <button type="button" onClick={startOver} className={headerButton} title="New chat">
            <RotateCcw className="size-5" aria-hidden="true" />
            <span className="sr-only">Start a new chat</span>
          </button>
        ) : null}
        <button type="button" onClick={() => dialogRef.current?.close()} className={headerButton} title="Close">
          <X className="size-5" aria-hidden="true" />
          <span className="sr-only">Close chat</span>
        </button>
      </header>

      <div
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto overscroll-contain px-4 py-5 text-base leading-relaxed sm:text-[0.9375rem]"
      >
        <div role="log" aria-label="Conversation" aria-busy={pending}>
          <ol className="space-y-5">
            <ChatBubble
              message={{ id: "welcome", role: "assistant", text: config.welcome }}
              assistantName={config.name}
              latest={false}
              animate={false}
              pending={pending}
              contactHref={contactHref}
              whatsappHref={whatsappHref}
              onAsk={ask}
              onRetry={retry}
            >
              {messages.length === 0 ? (
                <Suggestions heading="Popular questions" questions={config.suggestions} onAsk={ask} disabled={pending} />
              ) : null}
            </ChatBubble>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                assistantName={config.name}
                latest={message === latest}
                animate={!restored.has(message.id)}
                pending={pending}
                contactHref={contactHref}
                whatsappHref={whatsappHref}
                onAsk={ask}
                onRetry={retry}
              />
            ))}
          </ol>
        </div>
        {pending ? (
          <div className="chat-message-new mt-5 flex items-center gap-2.5" aria-hidden="true">
            <ChatAvatar />
            <div className="chat-typing flex items-center gap-1 rounded-md rounded-tl-xs border border-concrete-300 bg-white px-3.5 py-3.5">
              <span />
              <span />
              <span />
            </div>
          </div>
        ) : null}
        <p role="status" className="sr-only">
          {pending ? `${config.name} is typing…` : ""}
        </p>
      </div>

      <form
        onSubmit={send}
        className="shrink-0 border-t border-concrete-300 bg-white px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-3"
      >
        <div className="flex items-end gap-2">
          <label htmlFor="chat-input" className="sr-only">
            Your question
          </label>
          <textarea
            ref={inputRef}
            id="chat-input"
            rows={1}
            value={draft}
            maxLength={chatLimits.questionLength}
            placeholder={config.placeholder}
            enterKeyHint="send"
            autoComplete="off"
            aria-describedby="chat-notice"
            onChange={(event) => {
              setDraft(event.target.value);
              resizeInput();
            }}
            onKeyDown={onInputKeyDown}
            className="block max-h-32 min-h-12 flex-1 resize-none rounded-sm border border-concrete-500 bg-white px-3.5 py-3 text-base leading-6 text-ink placeholder:text-ink-subtle hover:border-navy-600 focus:border-royal-700 focus-visible:outline-2 focus-visible:outline-offset-0"
          />
          <button
            type="submit"
            disabled={!draft.trim() || pending}
            className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-navy-900 text-white transition-colors hover:bg-navy-700 disabled:opacity-50"
          >
            <SendHorizontal className="size-5" aria-hidden="true" />
            <span className="sr-only">Send</span>
          </button>
        </div>
        <p id="chat-notice" className="mt-2 flex justify-between gap-3 text-xs text-ink-subtle">
          <span>{config.notice}</span>
          {draft.length > chatLimits.questionLength - 100 ? (
            <span className="shrink-0 tabular-nums">
              {draft.length}/{chatLimits.questionLength}
            </span>
          ) : null}
        </p>
      </form>
    </dialog>
  );
}
