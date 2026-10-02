import { features } from "@/config/site";
import { answerQuestion } from "@/lib/chat/engine";
import { allowChatRequest } from "@/lib/chat/rate-limit";
import { chatRequestSchema } from "@/lib/chat/schema";
import type { ChatResponse } from "@/lib/chat/types";

/**
 * The website assistant's API. POST { question, previous?, page? } →
 * { ok: true, reply } (see src/lib/chat/types.ts). Answers come from the
 * site's content; questions are never stored or logged.
 */

/** Room for the optional self-hosted model to reply (CHAT_MODEL_TIMEOUT_MS, 20 s by default). */
export const maxDuration = 30;

const MAX_BODY_LENGTH = 8_000;

function respond(body: ChatResponse, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

const invalid: ChatResponse = { ok: false, error: "invalid", message: "Please type a question of up to 500 characters." };

export async function POST(request: Request) {
  if (!features.chatAssistant) return new Response(null, { status: 404 });

  // Browsers label requests made from other websites; the assistant is only for this one.
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return respond({ ok: false, error: "forbidden", message: "Not allowed." }, 403);
  }

  const visitor =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (!allowChatRequest(visitor)) {
    return respond(
      { ok: false, error: "rate-limited", message: "You're sending messages very quickly. Please wait a minute and try again." },
      429,
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_LENGTH) return respond(invalid, 413);
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return respond(invalid, 400);
  }
  const parsed = chatRequestSchema.safeParse(json);
  if (!parsed.success) return respond(invalid, 400);

  try {
    return respond({ ok: true, reply: await answerQuestion(parsed.data) });
  } catch (error) {
    console.error("[chat] couldn't answer:", error instanceof Error ? error.message : error);
    return respond({ ok: false, error: "server", message: "Sorry, something went wrong on our side." }, 500);
  }
}
