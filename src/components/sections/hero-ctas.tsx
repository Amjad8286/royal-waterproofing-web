import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { cta, site } from "@/config/site";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * Primary + secondary CTAs for a hero. `id="hero-cta"` lets the mobile action
 * bar appear only once these have scrolled out of view.
 */
export function HeroCtas({
  contactHref = "/contact",
  whatsappText,
  tone = "dark",
  location,
  className,
}: {
  contactHref?: string;
  whatsappText: string;
  tone?: "dark" | "light";
  location: string;
  className?: string;
}) {
  return (
    <div id="hero-cta" className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap", className)}>
      <Button
        href={contactHref}
        size="lg"
        iconRight={<ArrowRight className="size-5" aria-hidden="true" />}
        track={{ event: "cta_click", location }}
      >
        {cta.primary}
      </Button>
      <div className="grid grid-cols-2 gap-3 sm:flex">
        <Button
          href={site.contact.phone.href}
          size="lg"
          variant={tone === "dark" ? "outline-light" : "outline"}
          // Half-width on phones: less side padding so the labels fit at 320px.
          className="max-sm:px-3"
          icon={<Phone className="size-5" aria-hidden="true" />}
          track={{ event: "call_click", location }}
        >
          {cta.call}
        </Button>
        <Button
          href={whatsappUrl(whatsappText)}
          size="lg"
          variant="whatsapp"
          className="max-sm:px-3"
          icon={<WhatsAppIcon className="size-5" />}
          track={{ event: "whatsapp_click", location }}
        >
          WhatsApp
        </Button>
      </div>
    </div>
  );
}
