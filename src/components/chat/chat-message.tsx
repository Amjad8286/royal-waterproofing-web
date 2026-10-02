import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { ArrowRight, Phone, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { cta, site } from "@/config/site";
import type { ChatAction, ChatLink } from "@/lib/chat/types";
import { cn } from "@/lib/utils";
import { ChatAvatar } from "./chat-avatar";
import type { ChatMessage, QuestionSource } from "./use-chat";

const timeFormat = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" });
const dayTimeFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

/** "2:41 pm", or "3 Oct, 2:41 pm" for an earlier day. */
function formatTime(iso: string) {
  const date = new Date(iso);
  return date.toDateString() === new Date().toDateString() ? timeFormat.format(date) : dayTimeFormat.format(date);
}

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const contactPattern = new RegExp(`(${escape(site.contact.phone.display)}|${escape(site.contact.email)})`);

/** The company's own phone number and email become links; nothing else does. */
function withContactLinks(text: string) {
  return text.split(contactPattern).map((part, i) => {
    if (part === site.contact.phone.display) {
      return (
        <a key={i} href={site.contact.phone.href} className="font-semibold whitespace-nowrap text-royal-700 underline underline-offset-2">
          {part}
        </a>
      );
    }
    if (part === site.contact.email) {
      return (
        <a key={i} href={`mailto:${part}`} className="font-semibold break-words text-royal-700 underline underline-offset-2">
          {part}
        </a>
      );
    }
    return part;
  });
}

/** "Terrace area: …" → the label before a short colon-separated lead-in is set in bold. */
function ListItem({ text }: { text: string }) {
  const lead = text.match(/^([^:]{2,60}):\s+(.+)$/);
  return (
    <li>
      {lead ? (
        <>
          <strong className="font-semibold text-navy-900">{lead[1]}:</strong> {withContactLinks(lead[2])}
        </>
      ) : (
        withContactLinks(text)
      )}
    </li>
  );
}

/** Plain-text answers: blank lines separate paragraphs; "- " and "1. " lines become lists. */
function RichText({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  text.split(/\n{2,}/).forEach((block, b) => {
    let list: { ordered: boolean; items: string[] } | null = null;
    const flush = (key: string) => {
      if (!list) return;
      const items = list.items.map((item, i) => <ListItem key={i} text={item} />);
      blocks.push(
        list.ordered ? (
          <ol key={key} className="list-decimal space-y-1 pl-5 marker:text-ink-muted">
            {items}
          </ol>
        ) : (
          <ul key={key} className="list-disc space-y-1 pl-5 marker:text-royal-700">
            {items}
          </ul>
        ),
      );
      list = null;
    };
    block.split("\n").forEach((line, l) => {
      const item = line.match(/^\s*(?:(-)|\d+[.)])\s+(.+)$/);
      if (item) {
        const ordered = !item[1];
        if (list && list.ordered !== ordered) flush(`${b}-${l}-list`);
        list ??= { ordered, items: [] };
        list.items.push(item[2]);
        return;
      }
      flush(`${b}-${l}-list`);
      if (line.trim()) blocks.push(<p key={`${b}-${l}`}>{withContactLinks(line)}</p>);
    });
    flush(`${b}-end`);
  });
  return <div className="space-y-2">{blocks}</div>;
}

function SmartLink({ link }: { link: ChatLink }) {
  const className =
    "inline-flex items-center gap-1 text-sm font-semibold text-royal-700 underline-offset-4 hover:underline";
  const content = (
    <>
      {link.label}
      <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
    </>
  );
  return link.href.startsWith("/") ? (
    <Link href={link.href} className={className}>
      {content}
    </Link>
  ) : (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  );
}

function Actions({ actions, contactHref, whatsappHref }: { actions: ChatAction[]; contactHref: string; whatsappHref: string }) {
  if (!actions.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => {
        if (action === "call") {
          return (
            <Button
              key={action}
              href={site.contact.phone.href}
              variant="secondary"
              size="sm"
              icon={<Phone className="size-4" aria-hidden="true" />}
              track={{ event: "call_click", location: "chat" }}
            >
              {cta.call}
            </Button>
          );
        }
        if (action === "whatsapp") {
          return (
            <Button
              key={action}
              href={whatsappHref}
              variant="whatsapp"
              size="sm"
              icon={<WhatsAppIcon className="size-4" />}
              track={{ event: "whatsapp_click", location: "chat" }}
            >
              WhatsApp
            </Button>
          );
        }
        return (
          <Button key={action} href={contactHref} size="sm" track={{ event: "cta_click", location: "chat" }}>
            {cta.primary}
          </Button>
        );
      })}
    </div>
  );
}

export function Suggestions({
  heading,
  questions,
  onAsk,
  disabled,
}: {
  heading: string;
  questions: string[];
  onAsk: (question: string, source: QuestionSource) => void;
  disabled?: boolean;
}) {
  if (!questions.length) return null;
  return (
    <div className="space-y-2 pt-1">
      <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">{heading}</p>
      <ul className="flex flex-wrap gap-2">
        {questions.map((question) => (
          <li key={question} className="max-w-full">
            <button
              type="button"
              disabled={disabled}
              onClick={() => onAsk(question, "suggestion")}
              className="rounded-full border border-royal-200 bg-royal-50 px-3 py-1.5 text-left text-sm font-medium text-royal-800 transition-colors hover:border-royal-600 hover:bg-royal-100 disabled:opacity-60"
            >
              {question}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const suggestionHeading = { answer: "Related questions", fallback: "You could ask", smalltalk: "Popular questions" } as const;

export function ChatBubble({
  message,
  assistantName,
  latest,
  animate,
  pending,
  contactHref,
  whatsappHref,
  onAsk,
  onRetry,
  children,
}: {
  message: Pick<ChatMessage, "id" | "role" | "text" | "reply" | "failed"> & { at?: string };
  assistantName: string;
  /** The newest message: only it offers follow-up questions. */
  latest: boolean;
  /** Arrived while the panel was open (messages restored from earlier don't animate). */
  animate: boolean;
  pending: boolean;
  contactHref: string;
  whatsappHref: string;
  onAsk: (question: string, source: QuestionSource) => void;
  onRetry: (id: string) => void;
  /** Extra content under the message (the welcome message's suggestions). */
  children?: ReactNode;
}) {
  const time = message.at ? (
    <time dateTime={message.at} className="block text-xs text-ink-subtle">
      {formatTime(message.at)}
    </time>
  ) : null;

  if (message.role === "user") {
    return (
      <li data-message className={cn("flex flex-col items-end gap-1 pl-10", animate && "chat-message-new")}>
        <p className="max-w-full rounded-md rounded-br-xs bg-royal-700 px-3.5 py-2.5 break-words whitespace-pre-wrap text-white">
          <span className="sr-only">You: </span>
          {message.text}
        </p>
        {time}
      </li>
    );
  }

  const reply = message.reply;
  const actions = message.failed ? (["call", "whatsapp"] as ChatAction[]) : (reply?.actions ?? []);
  return (
    <li data-message className={cn("flex gap-2.5", animate && "chat-message-new")}>
      <ChatAvatar className="mt-0.5" />
      <div className="min-w-0 flex-1 space-y-2.5">
        <div
          className={cn(
            "rounded-md rounded-tl-xs border px-3.5 py-2.5 break-words",
            message.failed ? "border-danger-700/30 bg-danger-100 text-danger-700" : "border-concrete-300 bg-white text-ink shadow-card",
          )}
        >
          <span className="sr-only">{assistantName}: </span>
          {message.failed ? <p>{message.text}</p> : <RichText text={message.text} />}
        </div>
        {reply?.links.length ? (
          <ul className="flex flex-col items-start gap-1">
            {reply.links.map((link) => (
              <li key={link.href}>
                <SmartLink link={link} />
              </li>
            ))}
          </ul>
        ) : null}
        <Actions actions={actions} contactHref={contactHref} whatsappHref={whatsappHref} />
        {message.failed && latest ? (
          <button
            type="button"
            onClick={() => onRetry(message.id)}
            disabled={pending}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal-700 underline-offset-4 hover:underline disabled:opacity-60"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Try again
          </button>
        ) : null}
        {latest && reply && !pending ? (
          <Suggestions heading={suggestionHeading[reply.kind]} questions={reply.suggestions} onAsk={onAsk} />
        ) : null}
        {children}
        {time}
      </div>
    </li>
  );
}
