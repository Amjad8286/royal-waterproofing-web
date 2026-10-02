import type { ChatAction, ChatLink } from "@/types/content";

/**
 * Types shared by the chat API (src/app/api/chat/route.ts) and the widget
 * (src/components/chat). Client-safe: no server imports here.
 */

export type { ChatAction, ChatLink };

export const chatLimits = {
  /** Longest question the API accepts, in characters. */
  questionLength: 500,
  /** Earlier questions sent along for follow-ups ("how much does it cost?"). */
  previousQuestions: 3,
} as const;

export interface ChatRequest {
  question: string;
  /** The visitor's earlier questions in this conversation, oldest first. */
  previous?: string[];
  /** The page the visitor is on, e.g. /services/bathroom-waterproofing. */
  page?: string;
}

export interface ChatReply {
  /**
   * answer    — found in the site's content
   * fallback  — not covered: an honest "I don't know" with ways to reach the team
   * smalltalk — greetings, thanks and questions about the assistant itself
   */
  kind: "answer" | "fallback" | "smalltalk";
  /** Plain text. A blank line starts a new paragraph; lines starting "- " or "1. " become lists. */
  text: string;
  /** Pages with more detail. */
  links: ChatLink[];
  actions: ChatAction[];
  /** Follow-up questions to offer as chips. */
  suggestions: string[];
}

export type ChatResponse =
  | { ok: true; reply: ChatReply }
  | { ok: false; error: "invalid" | "forbidden" | "rate-limited" | "server"; message: string };

/** What the widget shows before the first answer. Passed from the server layout as props. */
export interface ChatWidgetConfig {
  /** Header title. */
  name: string;
  /** Under the title. */
  tagline: string;
  /** Accessible name of the floating button. */
  launcherLabel: string;
  welcome: string;
  placeholder: string;
  /** Small print under the input. */
  notice: string;
  suggestions: string[];
}
