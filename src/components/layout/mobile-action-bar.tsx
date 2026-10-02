"use client";

import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { cta, site } from "@/config/site";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";
import type { NavLookups } from "./nav-types";
import { pageContext } from "./page-context";
import { useFieldFocus } from "./use-field-focus";
import { usePastHero } from "./use-past-hero";

/** Pages without the bar: the contact page has the form and contact cards, the thank-you page needs no CTA. */
export const actionBarHiddenOn = new Set(["/contact", "/thank-you"]);
/** Below 360px (small phones) all three labels only fit with tighter padding and 14px text. */
const BUTTON = "px-2 max-[360px]:gap-1.5 max-[360px]:px-1.5 max-[360px]:text-sm";

/**
 * Sticky Call / WhatsApp / Inspection bar for phones. Appears once the hero's
 * CTAs scroll out of view, and gets out of the way while someone is typing.
 */
export function MobileActionBar({ lookups }: { lookups: NavLookups }) {
  const pathname = usePathname();
  const pastHero = usePastHero(pathname);
  const typing = useFieldFocus();

  if (actionBarHiddenOn.has(pathname)) return null;

  const visible = pastHero && !typing;
  const { contactHref, message } = pageContext(pathname, lookups);

  return (
    <div
      inert={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-concrete-300 bg-white px-3 pt-2 max-[360px]:px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]",
        "shadow-dock transition-transform duration-300 ease-out lg:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <nav aria-label="Quick contact" className="mx-auto grid max-w-xl grid-cols-[1fr_1fr_1.4fr] gap-2 max-[360px]:gap-1.5">
        <Button
          href={site.contact.phone.href}
          variant="secondary"
          className={BUTTON}
          icon={<Phone className="size-4" aria-hidden="true" />}
          track={{ event: "call_click", location: "action-bar" }}
        >
          Call
        </Button>
        <Button
          href={whatsappUrl(message)}
          variant="whatsapp"
          className={BUTTON}
          icon={<WhatsAppIcon className="size-4" />}
          track={{ event: "whatsapp_click", location: "action-bar" }}
        >
          WhatsApp
        </Button>
        <Button href={contactHref} className={BUTTON} track={{ event: "cta_click", location: "action-bar" }}>
          {cta.primaryShort}
        </Button>
      </nav>
    </div>
  );
}
