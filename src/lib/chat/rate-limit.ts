import "server-only";

/**
 * A simple per-visitor limit on chat requests, kept in memory. Real visitors
 * never get near it; it stops a script from hammering the assistant (and the
 * optional model behind it). On serverless hosting each instance counts
 * separately, which is fine for this purpose. Nothing is logged or stored.
 */

const WINDOW_MS = 60_000;
export const MAX_REQUESTS_PER_WINDOW = 30;
const MAX_TRACKED = 10_000;

const recent = new Map<string, number[]>();

export function allowChatRequest(key: string, now = Date.now()): boolean {
  const since = now - WINDOW_MS;
  const times = (recent.get(key) ?? []).filter((time) => time > since);
  const allowed = times.length < MAX_REQUESTS_PER_WINDOW;
  if (allowed) times.push(now);
  recent.set(key, times);

  if (recent.size > MAX_TRACKED) {
    for (const [other, list] of recent) if ((list.at(-1) ?? 0) <= since) recent.delete(other);
  }
  return allowed;
}
