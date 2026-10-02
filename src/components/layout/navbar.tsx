"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FocusEvent, type PointerEvent } from "react";
import { ArrowRight, ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { cta, site } from "@/config/site";
import { trackAttrs } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { MobileNav } from "./mobile-nav";
import type { NavAvailability, NavGroup } from "./nav-types";

type MenuId = "services" | "projects";
type NavLink = { label: string; href: string; menu?: MenuId; matches?: string[] };

/** Top-level links. Optional pages (gallery, reviews) only appear once they have real content. */
function navLinks(available: NavAvailability): NavLink[] {
  return [
    { label: "Services", href: "/services", menu: "services" },
    { label: "Projects", href: "/projects", menu: available.gallery ? "projects" : undefined, matches: ["/projects", "/gallery"] },
    { label: "About", href: "/about" },
    { label: "Service Areas", href: "/service-areas" },
    ...(available.reviews ? [{ label: "Reviews", href: "/reviews" }] : []),
    { label: "Contact", href: "/contact" },
  ];
}

export function Navbar({ groups, available }: { groups: NavGroup[]; available: NavAvailability }) {
  const links = navLinks(available);
  const projectLinks = [
    {
      href: "/projects",
      label: available.caseStudies ? "Projects & case studies" : "Our work",
      description: "The buildings we waterproof and how each kind of job is run.",
    },
    { href: "/gallery", label: "Photo gallery", description: "Before-and-after photos from finished jobs." },
  ];
  const pathname = usePathname();
  const [open, setOpen] = useState<MenuId | null>(null);
  const [condensed, setCondensed] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const triggers = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Condense the header once the page has scrolled (observer, not a scroll listener).
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setCondensed(!entry.isIntersecting));
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Escape closes and returns focus to the trigger; clicks outside the header close.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      clearTimeout(hoverTimer.current);
      triggers.current[open]?.focus();
      setOpen(null);
    };
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const close = () => {
    clearTimeout(hoverTimer.current);
    setOpen(null);
  };
  const isActive = (link: NavLink) =>
    (link.matches ?? [link.href]).some((m) => pathname === m || pathname.startsWith(`${m}/`));

  // Hover intent for mouse users only; touch and keyboard use the button.
  const hoverOpen = (menu: MenuId) => (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(menu), 80);
  };
  const hoverClose = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(null), 180);
  };
  const keepOpen = (event: PointerEvent) => {
    if (event.pointerType === "mouse") clearTimeout(hoverTimer.current);
  };
  const onMenuBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(null);
  };

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-6 w-px" />
      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-40 border-b bg-white transition-shadow duration-200",
          condensed ? "border-concrete-300 shadow-header" : "border-concrete-200",
        )}
      >
        <Container
          className={cn(
            "flex items-center justify-between gap-4 transition-[height] duration-200",
            condensed ? "h-16" : "h-[4.5rem] lg:h-20",
          )}
        >
          <Link href="/" aria-label={`${site.name} — home`} className="shrink-0 rounded-sm" onClick={close}>
            <Logo
              eager
              className={cn("transition-[width] duration-200", condensed ? "w-[6.5rem]" : "w-[6.5rem] lg:w-[8.5rem]")}
            />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5 xl:gap-1">
              {links.map((link) => {
                const active = isActive(link);
                const itemClasses = cn(
                  "relative flex h-11 items-center gap-1 rounded-sm px-3 text-[0.9375rem] font-semibold text-navy-900 transition-colors hover:bg-concrete-100",
                  "after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-wave-500 after:transition-opacity",
                  active ? "after:opacity-100" : "after:opacity-0",
                );
                if (!link.menu) {
                  return (
                    <li key={link.href}>
                      <Link href={link.href} aria-current={pathname === link.href ? "page" : undefined} className={itemClasses}>
                        {link.label}
                      </Link>
                    </li>
                  );
                }
                const menu = link.menu;
                const expanded = open === menu;
                return (
                  <li
                    key={link.href}
                    className={menu === "projects" ? "relative" : undefined}
                    onPointerEnter={hoverOpen(menu)}
                    onPointerLeave={hoverClose}
                    onBlur={onMenuBlur}
                  >
                    <button
                      ref={(el) => {
                        triggers.current[menu] = el;
                      }}
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`menu-${menu}`}
                      onClick={() => {
                        // A click decides; cancel any pending hover-intent timer.
                        clearTimeout(hoverTimer.current);
                        setOpen(expanded ? null : menu);
                      }}
                      className={itemClasses}
                    >
                      {link.label}
                      <ChevronDown
                        aria-hidden="true"
                        className={cn("size-4 transition-transform duration-200", expanded && "rotate-180")}
                      />
                    </button>

                    {menu === "services" ? (
                      <div
                        id="menu-services"
                        hidden={!expanded}
                        onPointerEnter={keepOpen}
                        className="absolute inset-x-0 top-full border-y border-concrete-300 bg-white shadow-float"
                      >
                        <Container className="grid grid-cols-[1fr_1fr_1fr_17rem] gap-8 py-8">
                          {groups.map((group) => (
                            <div key={group.id}>
                              <p className="eyebrow text-royal-700">{group.label}</p>
                              <ul className="mt-3 space-y-0.5">
                                {group.services.map((service) => (
                                  <li key={service.slug}>
                                    <Link
                                      href={`/services/${service.slug}`}
                                      onClick={close}
                                      aria-current={pathname === `/services/${service.slug}` ? "page" : undefined}
                                      className="flex gap-3 rounded-sm p-2.5 transition-colors hover:bg-concrete-100"
                                    >
                                      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-sm bg-royal-50 text-royal-700">
                                        <Icon name={service.icon} className="size-5" />
                                      </span>
                                      <span>
                                        <span className="block font-semibold leading-snug text-navy-900">{service.name}</span>
                                        <span className="mt-0.5 block text-sm leading-snug text-ink-muted">{service.summary}</span>
                                      </span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                          <div className="tone-navy flex flex-col rounded-sm bg-navy-900 p-6 text-white">
                            <p className="font-heading text-h4 text-white">Not sure what you need?</p>
                            <p className="mt-2 text-sm text-white/75">
                              Tell us what you&apos;re seeing. We diagnose first, then recommend.
                            </p>
                            <Button href="/contact" className="mt-5" fullWidth onClick={close} track={{ event: "cta_click", location: "mega-menu" }}>
                              {cta.primaryShort}
                            </Button>
                            <a
                              href={site.contact.phone.href}
                              className="mt-4 flex items-center gap-2 text-sm font-semibold text-white hover:text-wave-300"
                              {...trackAttrs("call_click", "mega-menu")}
                            >
                              <Phone className="size-4" aria-hidden="true" />
                              {site.contact.phone.display}
                            </a>
                            <Link
                              href="/services"
                              onClick={close}
                              className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-semibold text-wave-300 hover:text-white"
                            >
                              All services <ArrowRight className="size-4" aria-hidden="true" />
                            </Link>
                          </div>
                        </Container>
                      </div>
                    ) : (
                      <div
                        id="menu-projects"
                        hidden={!expanded}
                        onPointerEnter={keepOpen}
                        className="absolute left-0 top-full mt-1 w-80 rounded-sm border border-concrete-300 bg-white p-2 shadow-float"
                      >
                        <ul>
                          {projectLinks.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={close}
                                aria-current={pathname === item.href ? "page" : undefined}
                                className="block rounded-sm p-3 transition-colors hover:bg-concrete-100"
                              >
                                <span className="block font-semibold text-navy-900">{item.label}</span>
                                <span className="mt-0.5 block text-sm text-ink-muted">{item.description}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={site.contact.phone.href}
              className="hidden items-center gap-2.5 rounded-sm min-[1180px]:flex"
              {...trackAttrs("call_click", "header")}
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-royal-50 text-royal-700">
                <Phone className="size-[1.125rem]" aria-hidden="true" />
              </span>
              <span className="leading-tight">
                <span className="block text-xs text-ink-muted">Call us</span>
                <span className="block text-[0.9375rem] font-bold text-navy-900">{site.contact.phone.display}</span>
              </span>
            </a>
            <a
              href={site.contact.phone.href}
              aria-label={`Call us on ${site.contact.phone.display}`}
              className="flex size-11 items-center justify-center rounded-sm border border-concrete-300 text-navy-900 hover:bg-concrete-100 min-[1180px]:hidden"
              {...trackAttrs("call_click", "header")}
            >
              <Phone className="size-5" aria-hidden="true" />
            </a>
            <Button
              href="/contact"
              size="md"
              className="hidden md:inline-flex"
              track={{ event: "cta_click", location: "header" }}
            >
              <span className="xl:hidden">{cta.primaryShort}</span>
              <span className="hidden xl:inline">{cta.primary}</span>
            </Button>
            <MobileNav groups={groups} available={available} />
          </div>
        </Container>
      </header>
    </>
  );
}
