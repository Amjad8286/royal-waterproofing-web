"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { chatLimits, type ChatReply, type ChatResponse } from "@/lib/chat/types";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  /** When it was sent or received (ISO). */
  at: string;
  /** Links, actions and follow-up questions, for answers. */
  reply?: Omit<ChatReply, "text">;
  /** The question couldn't be answered (offline, server error); the message offers a retry. */
  failed?: { question: string };
}

export type QuestionSource = "typed" | "suggestion" | "retry";

/** The conversation lasts as long as the browser tab: session storage, never sent anywhere else. */
const STORAGE_KEY = "rwc:chat";
const MAX_STORED = 40;
/** Answers from the content come back almost at once; a short pause lets the typing indicator register. */
const MIN_TYPING_MS = 450;
const TIMEOUT_MS = 30_000;

const OFFLINE = "You seem to be offline. Check your connection and try again.";
const UNAVAILABLE = "Sorry, I couldn't answer just now. Please try again, or call or WhatsApp us.";

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function isMessage(value: unknown): value is ChatMessage {
  const message = value as ChatMessage | null;
  return (
    typeof message === "object" &&
    message !== null &&
    (message.role === "user" || message.role === "assistant") &&
    typeof message.id === "string" &&
    typeof message.text === "string" &&
    typeof message.at === "string"
  );
}

function loadHistory(): ChatMessage[] {
  try {
    const data: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(data) ? data.filter(isMessage).filter((message) => !message.failed) : [];
  } catch {
    return [];
  }
}

function saveHistory(messages: ChatMessage[]) {
  try {
    if (messages.length) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_STORED)));
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked (private mode, strict settings): the chat still works, it just won't survive a reload.
  }
}

const now = () => new Date().toISOString();

const failedMessage = (text: string, question: string): ChatMessage => ({
  id: newId(),
  role: "assistant",
  text,
  at: now(),
  failed: { question },
});

/** The conversation with the website assistant (POST /api/chat). */
export function useChat(page: string) {
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [pending, setPending] = useState(false);
  /** The request in flight; replaced or cleared to cancel it. */
  const request = useRef<AbortController | null>(null);

  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  useEffect(() => () => request.current?.abort(), []);

  const ask = useCallback(
    async (input: string, source: QuestionSource, retryOf?: string) => {
      const question = input.trim().slice(0, chatLimits.questionLength);
      if (!question || pending) return;

      const asked = messages.filter((message) => message.role === "user" && message.text).map((message) => message.text);
      // A retried question is already in the conversation.
      const previous = (retryOf ? asked.slice(0, -1) : asked).slice(-chatLimits.previousQuestions);

      setMessages((list) => [
        ...list.filter((message) => message.id !== retryOf),
        ...(retryOf ? [] : [{ id: newId(), role: "user" as const, text: question, at: now() }]),
      ]);
      setPending(true);

      const controller = new AbortController();
      request.current?.abort();
      request.current = controller;
      const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
      const started = performance.now();

      let reply: ChatMessage;
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, previous, page }),
          signal: controller.signal,
        });
        const data = (await response.json().catch(() => null)) as ChatResponse | null;
        if (data?.ok) {
          const { text, ...rest } = data.reply;
          reply = { id: newId(), role: "assistant", text, at: now(), reply: rest };
          track("chat_question", { source, kind: rest.kind });
        } else {
          reply = failedMessage(data?.message ?? UNAVAILABLE, question);
        }
      } catch {
        reply = failedMessage(navigator.onLine === false ? OFFLINE : UNAVAILABLE, question);
      } finally {
        window.clearTimeout(timer);
      }

      const wait = MIN_TYPING_MS - (performance.now() - started);
      if (wait > 0) await new Promise((resolve) => window.setTimeout(resolve, wait));
      // Started a new chat meanwhile: drop the reply.
      if (request.current !== controller) return;
      request.current = null;
      setMessages((list) => [...list, reply]);
      setPending(false);
    },
    [messages, page, pending],
  );

  const retry = useCallback(
    (id: string) => {
      const failed = messages.find((message) => message.id === id)?.failed;
      if (failed) void ask(failed.question, "retry", id);
    },
    [ask, messages],
  );

  const reset = useCallback(() => {
    request.current?.abort();
    request.current = null;
    setMessages([]);
    setPending(false);
  }, []);

  return { messages, pending, ask, retry, reset };
}
