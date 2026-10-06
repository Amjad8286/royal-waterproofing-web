import "server-only";
import { createRateLimit } from "@/lib/rate-limit";

/** Questions to the website assistant (and the optional model behind it), per visitor. */
export const MAX_REQUESTS_PER_WINDOW = 30;

export const allowChatRequest = createRateLimit({ max: MAX_REQUESTS_PER_WINDOW, windowMs: 60_000 });
