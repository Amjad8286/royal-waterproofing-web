"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { trackAttrs } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";
import type { NavLookups } from "./nav-types";
import { pageContext } from "./page-context";
import { usePastHero } from "./use-past-hero";

/**
 * Floating WhatsApp button for desktop (phones use the action bar instead).
 * Appears once the hero's own WhatsApp button has scrolled away. With the
 * website assistant on, it sits to the left of the chat button.
 */
export function WhatsAppButton({ lookups, besideChat = false }: { lookups: NavLookups; besideChat?: boolean }) {
  const pathname = usePathname();
  const pastHero = usePastHero(pathname);
  if (pathname === "/thank-you") return null;
  const { message } = pageContext(pathname, lookups);

  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      inert={!pastHero}
      className={cn(
        "fixed z-30 hidden items-center gap-2.5 rounded-full bg-whatsapp flex size-14 items-center justify-center font-semibold text-navy-950 shadow-float lg:flex",
        besideChat ? "right-24 bottom-6" : "right-6 bottom-6",
        "transition-[background-color,transform,opacity] duration-300 hover:bg-whatsapp-dark",
        pastHero ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
      {...trackAttrs("whatsapp_click", "floating")}
    >
      <WhatsAppIcon className="size-6" />
    </a>
  );
}
