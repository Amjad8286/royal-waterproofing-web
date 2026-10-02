import * as z from "zod/mini";
import { chatLimits } from "./types";

const question = z.string().check(z.trim(), z.minLength(1), z.maxLength(chatLimits.questionLength));

/** Validates every request to /api/chat. The widget only sends questions — never earlier answers — so a request can't put words in the assistant's mouth. */
export const chatRequestSchema = z.object({
  question,
  previous: z.optional(z.array(question).check(z.maxLength(chatLimits.previousQuestions))),
  page: z.optional(z.string().check(z.maxLength(200))),
});
