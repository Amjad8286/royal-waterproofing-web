import "server-only";

/**
 * A simple per-visitor request limit, kept in memory. Real visitors never get
 * near it; it stops a script from hammering an endpoint. On serverless hosting
 * each instance counts separately, which is fine for this purpose. Nothing is
 * logged or stored.
 */
export function createRateLimit({ max, windowMs, maxTracked = 10_000 }: { max: number; windowMs: number; maxTracked?: number }) {
  const recent = new Map<string, number[]>();

  return function allow(key: string, now = Date.now()): boolean {
    const since = now - windowMs;
    const times = (recent.get(key) ?? []).filter((time) => time > since);
    const allowed = times.length < max;
    if (allowed) times.push(now);
    recent.set(key, times);

    if (recent.size > maxTracked) {
      for (const [other, list] of recent) if ((list.at(-1) ?? 0) <= since) recent.delete(other);
    }
    return allowed;
  };
}
