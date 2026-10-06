"use server";

import { headers } from "next/headers";
import { clientIpFrom, submitLead } from "@/lib/leads";
import { leadSchema, type LeadInput, type LeadResult } from "@/lib/validation";

function fieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

/** Server Action behind every enquiry form. Validates again on the server. */
export async function submitLeadAction(input: LeadInput): Promise<LeadResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "validation",
      message: "Please check the highlighted fields.",
      fieldErrors: fieldErrors(parsed.error.issues),
    };
  }
  try {
    return await submitLead(parsed.data, { clientIp: clientIpFrom(await headers()) });
  } catch (error) {
    console.error("[leads] couldn't submit:", error instanceof Error ? error.message : error);
    return { ok: false, error: "server", message: "We couldn't send your request just now." };
  }
}
