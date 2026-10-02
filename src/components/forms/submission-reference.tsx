"use client";

import { useEffect, useState } from "react";

/** Shows the enquiry reference from ?ref= (read on the client so the page can stay static). */
export function SubmissionReference() {
  const [reference, setReference] = useState<string | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const ref = new URLSearchParams(window.location.search).get("ref");
      if (ref && /^RW-[A-Z0-9]{3,12}$/.test(ref)) setReference(ref);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!reference) return null;
  return (
    <p className="mt-6 inline-flex items-center gap-2 rounded-sm bg-concrete-100 px-4 py-2 text-sm text-ink-muted">
      Your reference: <span className="font-mono font-semibold text-navy-900">{reference}</span>
    </p>
  );
}
