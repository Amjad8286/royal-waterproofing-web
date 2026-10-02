"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { cta, site } from "@/config/site";
import { cn } from "@/lib/utils";
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp";
import type { NavAvailability, NavGroup } from "./nav-types";

function menuLinks(available: NavAvailability) {
  return [
    { href: "/projects", label: "Projects" },
    ...(available.gallery ? [{ href: "/gallery", label: "Photo gallery" }] : []),
    { href: "/about", label: "About us" },
    { href: "/service-areas", label: "Service areas" },
    ...(available.reviews ? [{ href: "/reviews", label: "Reviews" }] : []),
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];
}

/**
 * Full-screen menu built on a native modal <dialog>: the rest of the page is
 * inert while it's open, Escape closes it, and focus returns to the trigger.
 */
export function MobileNav({ groups, available }: { groups: NavGroup[]; available: NavAvailability }) {
  const pathname = usePathname();
  const links = menuLinks(available);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setOpen(false);
      document.documentElement.classList.remove("overflow-hidden");
      triggerRef.current?.focus();
    };
    dialog.addEventListener("close", onClose);
    // Growing to desktop width while open: close, the desktop nav takes over.
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onResize = (event: MediaQueryListEvent) => {
      if (event.matches && dialog.open) dialog.close();
    };
    desktop.addEventListener("change", onResize);
    return () => {
      dialog.removeEventListener("close", onClose);
      desktop.removeEventListener("change", onResize);
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, []);

  const show = () => {
    dialogRef.current?.showModal();
    document.documentElement.classList.add("overflow-hidden");
    setOpen(true);
  };
  const hide = () => dialogRef.current?.close();

  const linkClasses = (href: string) =>
    cn(
      "flex min-h-14 items-center justify-between text-lg font-semibold text-navy-900",
      pathname === href && "text-royal-700",
    );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex size-11 items-center justify-center rounded-sm border border-concrete-300 text-navy-900 hover:bg-concrete-100 lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
        <span className="sr-only">Open menu</span>
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-menu"
        aria-label="Menu"
        className="mobile-nav fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-white p-0 text-ink backdrop:bg-navy-950/50 open:flex open:flex-col"
      >
        <div className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-concrete-300 px-4 sm:px-6">
          <Link href="/" onClick={hide} aria-label={`${site.name} — home`} className="rounded-sm">
            <Logo className="w-[6.5rem]" />
          </Link>
          <button
            type="button"
            onClick={hide}
            className="flex size-11 items-center justify-center rounded-sm border border-concrete-300 text-navy-900 hover:bg-concrete-100"
          >
            <X className="size-5" aria-hidden="true" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain px-4 py-2 sm:px-6">
          <ul className="divide-y divide-concrete-200">
            <li>
              <details className="group">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between text-lg font-semibold text-navy-900">
                  Services
                  <ChevronDown className="size-5 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="pb-4">
                  {groups.map((group) => (
                    <div key={group.id} className="mt-3 first:mt-0">
                      <p className="eyebrow mb-1 text-royal-700">{group.label}</p>
                      <ul>
                        {group.services.map((service) => (
                          <li key={service.slug}>
                            <Link
                              href={`/services/${service.slug}`}
                              onClick={hide}
                              className="flex min-h-12 items-center gap-3 rounded-sm px-2 text-base text-navy-900 hover:bg-concrete-100"
                            >
                              <Icon name={service.icon} className="size-5 text-royal-700" />
                              {service.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <Link
                    href="/services"
                    onClick={hide}
                    className="mt-2 flex min-h-12 items-center gap-1.5 px-2 font-semibold text-royal-700"
                  >
                    All services <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </details>
            </li>
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={hide}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={linkClasses(link.href)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="my-6 space-y-2.5 rounded-sm bg-concrete-100 p-4 text-sm text-ink-muted">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-royal-700" aria-hidden="true" />
              <a href={site.contact.mapsUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                {site.contact.address.full}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-royal-700" aria-hidden="true" />
              <a href={`mailto:${site.contact.email}`} className="break-all underline-offset-4 hover:underline">
                {site.contact.email}
              </a>
            </p>
          </div>
        </nav>

        <div className="shrink-0 space-y-3 border-t border-concrete-300 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6">
          <Button href="/contact" size="lg" fullWidth onClick={hide} track={{ event: "cta_click", location: "mobile-menu" }}>
            {cta.primary}
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button
              href={site.contact.phone.href}
              variant="outline"
              icon={<Phone className="size-4" aria-hidden="true" />}
              track={{ event: "call_click", location: "mobile-menu" }}
            >
              Call
            </Button>
            <Button
              href={whatsappUrl(whatsappMessage())}
              variant="whatsapp"
              icon={<WhatsAppIcon className="size-4" />}
              track={{ event: "whatsapp_click", location: "mobile-menu" }}
            >
              WhatsApp
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
