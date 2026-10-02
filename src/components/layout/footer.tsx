import Link from "next/link";
import { ArrowRight, Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { site, trustPoints } from "@/config/site";
import { trackAttrs } from "@/lib/analytics";
import { getAreas, getServices } from "@/lib/content";
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp";
import { Container } from "./container";
import type { NavAvailability } from "./nav-types";

const linkClass = "inline-flex min-h-8 items-center hover:text-white hover:underline underline-offset-4";

function ColumnTitle({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-white">
      {children}
    </h2>
  );
}

export async function Footer({ available }: { available: NavAvailability }) {
  const [services, areas] = await Promise.all([getServices(), getAreas()]);
  const year = new Date().getFullYear();
  const companyLinks = [
    { href: "/about", label: "About us" },
    { href: "/projects", label: "Projects" },
    ...(available.gallery ? [{ href: "/gallery", label: "Photo gallery" }] : []),
    ...(available.reviews ? [{ href: "/reviews", label: "Reviews" }] : []),
    { href: "/service-areas", label: "Service areas" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="tone-navy bg-navy-950 text-white/75">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10 lg:py-20">
        <div className="sm:col-span-2 lg:col-span-4">
          <Link href="/" aria-label={`${site.name} — home`} className="inline-block rounded-sm">
            <Logo tone="light" className="w-44" />
          </Link>
          <p className="mt-5 max-w-sm">{site.description}</p>
          <ul className="mt-6 space-y-2.5 text-sm">
            {trustPoints.slice(0, 2).map((point) => (
              <li key={point.text} className="flex items-center gap-2.5">
                <Icon name={point.icon} className="size-4 text-wave-300" />
                {point.text}
              </li>
            ))}
          </ul>
          {site.social.length > 0 ? (
            <ul className="mt-6 flex gap-4 text-sm">
              {site.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className={linkClass} rel="noopener noreferrer" target="_blank">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <nav aria-labelledby="footer-services" className="lg:col-span-3">
          <ColumnTitle id="footer-services">Services</ColumnTitle>
          <ul className="mt-4 space-y-1 text-sm">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`} className={linkClass}>
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-company" className="lg:col-span-2">
          <ColumnTitle id="footer-company">Company</ColumnTitle>
          <ul className="mt-4 space-y-1 text-sm">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sm:col-span-2 lg:col-span-3">
          <ColumnTitle id="footer-contact">Contact</ColumnTitle>
          <address className="mt-4 space-y-3.5 text-sm not-italic">
            <a
              href={site.contact.phone.href}
              className="flex items-center gap-2.5 text-base font-semibold text-white hover:text-wave-300"
              {...trackAttrs("call_click", "footer")}
            >
              <Phone className="size-4 text-wave-300" aria-hidden="true" />
              {site.contact.phone.display}
            </a>
            <a
              href={whatsappUrl(whatsappMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 hover:text-white"
              {...trackAttrs("whatsapp_click", "footer")}
            >
              <WhatsAppIcon className="size-4 text-wave-300" />
              WhatsApp us
            </a>
            <a href={`mailto:${site.contact.email}`} className="flex items-center gap-2.5 break-all hover:text-white">
              <Mail className="size-4 shrink-0 text-wave-300" aria-hidden="true" />
              {site.contact.email}
            </a>
            <p className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-wave-300" aria-hidden="true" />
              <span>
                {site.contact.address.full}
                <a
                  href={site.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 flex items-center gap-1.5 font-semibold text-wave-300 hover:text-white"
                >
                  Get directions <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              </span>
            </p>
            {site.hours ? (
              <p className="flex items-center gap-2.5">
                <Clock className="size-4 text-wave-300" aria-hidden="true" />
                {site.hours.display}
              </p>
            ) : null}
          </address>
        </div>

        <nav aria-labelledby="footer-areas" className="border-t border-white/10 pt-8 sm:col-span-2 lg:col-span-12">
          <ColumnTitle id="footer-areas">Areas we serve</ColumnTitle>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {areas.map((area) => (
              <li key={area.slug}>
                <Link href={`/service-areas/${area.slug}`} className={linkClass}>
                  {area.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/service-areas" className={`${linkClass} gap-1 font-semibold text-wave-300`}>
                All areas <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </nav>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 pt-6 pb-[calc(6rem+env(safe-area-inset-bottom))] text-sm sm:flex-row sm:items-center sm:justify-between lg:pb-6">
          <p>
            © {year} {site.legalName.replace(/\.$/, "")}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            <li>
              <Link href="/privacy-policy" className={linkClass}>
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className={linkClass}>
                Terms of use
              </Link>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}
