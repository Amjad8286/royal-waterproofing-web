"use client";

import { Logo } from "@/components/ui/logo";
import { site } from "@/config/site";
import "./globals.css";

/** Last-resort boundary for errors in the root layout itself. Keeps contact details visible. */
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh items-center justify-center bg-concrete-100 p-6">
        <main className="max-w-lg rounded-md border border-concrete-300 bg-white p-8 text-center">
          <Logo eager alt={site.name} className="mx-auto mb-6 w-36" />
          <h1 className="font-sans text-2xl font-bold text-navy-900">Something went wrong</h1>
          <p className="mt-3 text-ink-muted">Please try again. If it keeps happening, contact us directly:</p>
          <p className="mt-4 font-semibold text-navy-900">
            <a href={site.contact.phone.href} className="underline underline-offset-4">
              {site.contact.phone.display}
            </a>{" "}
            ·{" "}
            <a href={`mailto:${site.contact.email}`} className="underline underline-offset-4">
              {site.contact.email}
            </a>
          </p>
          <button
            type="button"
            onClick={() => retry()}
            className="mt-6 h-12 rounded-sm bg-wave-600 px-6 font-semibold text-white hover:bg-wave-700"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
