import { Mail, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { site } from "@/config/site";
import { trackAttrs } from "@/lib/analytics";
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp";
import { Container } from "./container";

/** Desktop-only utility bar above the header; scrolls away with the page. */
export function TopBar() {
  const { address } = site.contact;
  return (
    <div className="hidden bg-navy-950 text-[0.8125rem] text-white/80 lg:block">
      <Container className="flex h-10 items-center justify-between gap-6">
        <ul className="flex min-w-0 items-center gap-6">
          <li className="min-w-0">
            <a
              href={site.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white"
            >
              <MapPin className="size-4 shrink-0 text-wave-300" aria-hidden="true" />
              <span className="truncate">
                {address.locality}, {address.city}
              </span>
            </a>
          </li>
          <li className="hidden xl:block">Serving {site.market.serviceRegion}</li>
          {site.hours ? <li className="hidden xl:block">{site.hours.short}</li> : null}
        </ul>
        <ul className="flex shrink-0 items-center gap-6">
          {site.urgentLeak.enabled ? (
            <li>
              <a
                href={site.contact.phone.href}
                className="flex items-center gap-2 font-semibold text-wave-300 hover:text-white"
                {...trackAttrs("call_click", "topbar-urgent")}
              >
                <Phone className="size-4" aria-hidden="true" />
                {site.urgentLeak.label}
              </a>
            </li>
          ) : null}
          <li>
            <a href={`mailto:${site.contact.email}`} className="flex items-center gap-2 hover:text-white">
              <Mail className="size-4" aria-hidden="true" />
              {site.contact.email}
            </a>
          </li>
          <li>
            <a
              href={whatsappUrl(whatsappMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white"
              {...trackAttrs("whatsapp_click", "topbar")}
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp
            </a>
          </li>
        </ul>
      </Container>
    </div>
  );
}
