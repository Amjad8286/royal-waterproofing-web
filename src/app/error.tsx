"use client";

import { Phone, RotateCcw } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { site } from "@/config/site";
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp";

/**
 * Route-level error boundary. Whatever broke, the visitor can still reach us,
 * so the phone and WhatsApp options are always shown.
 */
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <section aria-labelledby="error-title" className="bg-concrete-100 py-16 sm:py-24">
      <Container className="max-w-2xl">
        <div className="rounded-md border border-concrete-300 bg-white p-6 sm:p-10">
          <h1 id="error-title" className="text-h2">
            Something went wrong on our side
          </h1>
          <p className="mt-3 text-lead text-ink-muted">
            Sorry about that. Try again, or contact us directly — we&apos;ll still get back to you quickly.
          </p>
          {error.digest ? <p className="mt-3 font-mono text-xs text-ink-subtle">Reference: {error.digest}</p> : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button onClick={() => retry()} icon={<RotateCcw className="size-4" aria-hidden="true" />}>
              Try again
            </Button>
            <Button href={site.contact.phone.href} variant="outline" icon={<Phone className="size-4" aria-hidden="true" />}>
              Call {site.contact.phone.display}
            </Button>
            <Button href={whatsappUrl(whatsappMessage())} variant="whatsapp" icon={<WhatsAppIcon className="size-4" />}>
              WhatsApp us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
