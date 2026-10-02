import "server-only";
import { site } from "@/config/site";
import { chatCompanyFacts } from "@/content/chat";
import { buildModelMessages, cleanModelText, NO_ANSWER, ungroundedReason, type GroundingDoc } from "./grounding";

/**
 * Optional: a self-hosted, open-weights language model that words answers
 * more naturally. Off unless CHAT_MODEL_URL and CHAT_MODEL are set; the
 * assistant works fully without it.
 *
 * Talks to any OpenAI-compatible chat endpoint you run yourself — Ollama,
 * llama.cpp's llama-server, LM Studio, vLLM. Server-only: the URL and key
 * never reach the browser.
 */

export interface ModelConfig {
  /** Base URL of the OpenAI-compatible API, e.g. http://localhost:11434/v1 */
  url: string;
  model: string;
  /** Sent as a bearer token, for a model server behind an authenticating proxy. */
  apiKey?: string;
  timeoutMs: number;
}

export function modelConfig(env: Record<string, string | undefined> = process.env): ModelConfig | null {
  const url = env.CHAT_MODEL_URL?.trim().replace(/\/+$/, "");
  const model = env.CHAT_MODEL?.trim();
  if (!url || !model) return null;
  const timeoutMs = Number(env.CHAT_MODEL_TIMEOUT_MS);
  return {
    url,
    model,
    apiKey: env.CHAT_MODEL_API_KEY?.trim() || undefined,
    timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 20_000,
  };
}

export type ModelResult =
  | { status: "answered"; text: string }
  /** The model says the documents don't answer the question. */
  | { status: "unknown" }
  /** Unreachable, too slow, or a reply that failed the fact check. */
  | { status: "failed"; reason: string };

const company = `${site.name}, a waterproofing and leak-repair company in ${site.contact.address.locality}, ${site.contact.address.city}`;

export async function askModel(
  config: ModelConfig,
  { question, previous, docs }: { question: string; previous?: string; docs: GroundingDoc[] },
): Promise<ModelResult> {
  const messages = buildModelMessages({ company, facts: chatCompanyFacts, docs, question, previous });

  let raw: unknown;
  try {
    const response = await fetch(`${config.url}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
      },
      body: JSON.stringify({ model: config.model, messages, temperature: 0.1, max_tokens: 400, stream: false }),
      signal: AbortSignal.timeout(config.timeoutMs),
      cache: "no-store",
    });
    if (!response.ok) return { status: "failed", reason: `HTTP ${response.status}` };
    raw = await response.json();
  } catch (error) {
    return { status: "failed", reason: error instanceof Error ? error.name : "network" };
  }

  const content = (raw as { choices?: { message?: { content?: unknown } }[] })?.choices?.[0]?.message?.content;
  const text = typeof content === "string" ? cleanModelText(content) : null;
  if (!text) return { status: "failed", reason: "empty reply" };
  if (text === NO_ANSWER) return { status: "unknown" };

  // The visitor's own words don't count: "Is it ₹500?" or "Do you work in Pune?" must not come back as fact.
  const sources = [chatCompanyFacts, ...docs.map((doc) => `${doc.title}\n${doc.answer}`)].join("\n");
  const reason = ungroundedReason(text, sources);
  // Only the kind of problem ("number", "name"…) is reported: the value could be something the visitor typed.
  return reason ? { status: "failed", reason: `not in the content (${reason.split(" ")[0]})` } : { status: "answered", text };
}
