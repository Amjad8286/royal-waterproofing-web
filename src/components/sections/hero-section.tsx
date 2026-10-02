import type { ReactNode } from "react";
import { Phone } from "lucide-react";
import { Breadcrumbs, type Crumb } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/layout/section-heading";
import { ContactForm, type FormOption } from "@/components/forms/contact-form";
import { SiteImage } from "@/components/media/site-image";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { cta, site } from "@/config/site";
import { getImage } from "@/content/images";
import { trackAttrs } from "@/lib/analytics";
import { isShown } from "@/lib/samples";
import { cn } from "@/lib/utils";
import { whatsappMessage } from "@/lib/whatsapp";
import type { Fact, HeroSlide, ImageAsset } from "@/types/content";
import { HeroCarousel } from "./hero-carousel";
import { HeroCtas } from "./hero-ctas";
import { TrustStrip } from "./trust-strip";

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

/**
 * How much navy to lay over a photo so its light areas end up about as bright
 * as a mid grey: bright photos are toned down, dark ones are left alone. With
 * every photo evened out, one light scrim keeps the hero text readable on all
 * of them, whichever photos are swapped in later.
 */
function shadeFor(...photos: ImageAsset[]) {
  const target = 125; // sRGB level the brightest areas are brought down to
  const navy = 19; // roughly navy-950
  const highlights = Math.max(...photos.map((photo) => photo.highlights ?? 0));
  const level = 255 * (highlights <= 0.0031308 ? 12.92 * highlights : 1.055 * highlights ** (1 / 2.4) - 0.055);
  return Math.min(0.6, Math.max(0, (level - target) / (level - navy)));
}

function HomeHero({
  formOptions,
  slides,
}: {
  formOptions: { services: FormOption[]; areas: FormOption[] };
  slides: HeroSlide[];
}) {
  return (
    <HeroCarousel
      labelledBy="hero-title"
      slides={slides.map((slide, i) => ({
        label: slide.label,
        description: getImage(slide.image).alt,
        shade: shadeFor(getImage(slide.image), getImage(slide.portraitImage)),
        media: (
          <SiteImage
            image={slide.image}
            portrait={slide.portraitImage}
            fill
            preload={i === 0}
            // Height-bound on most laptops, so the photo renders wider than the window.
            sizes="(min-width: 1440px) 100vw, 1440px"
            portraitSizes="(max-width: 639px) 200vw, 100vw"
            className="absolute inset-0"
          />
        ),
      }))}
      content={
        <div className="max-w-2xl">
          {site.urgentLeak.enabled ? (
            <a
              href={site.contact.phone.href}
              className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-navy-950/70 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-white transition-colors hover:border-wave-300/70 hover:bg-navy-950"
              {...trackAttrs("call_click", "hero-urgent")}
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-wave-300 text-navy-950">
                <Phone className="size-3.5" aria-hidden="true" />
              </span>
              {site.urgentLeak.label}
            </a>
          ) : null}
          <Eyebrow tone="dark" className="mb-4">
            Terraces · Bathrooms · External walls · Basements
          </Eyebrow>
          <h1 id="hero-title" className="text-h1 text-white">
            Waterproofing in {site.market.primaryCity} that fixes the cause, not just the stain
          </h1>
          <p className="mt-5 max-w-xl text-lead text-white/85">
            Leaks and damp traced to the source and repaired properly — for flats, bungalows, housing societies and
            businesses across {site.market.serviceRegion}.
          </p>
          <HeroCtas className="mt-8" whatsappText={whatsappMessage()} location="home-hero" />
          <TrustStrip className="mt-9 border-t border-white/15 pt-7" />
        </div>
      }
      form={
        <div className="rounded-md border-t-4 border-wave-500 bg-white p-5 text-ink shadow-float sm:p-6">
          <h2 className="font-heading text-h3 text-navy-900">{cta.contactHeading}</h2>
          <p className="mt-1.5 text-sm text-ink-muted">{cta.quoteNote}</p>
          <ContactForm
            className="mt-5"
            variant="compact"
            location="home-hero"
            services={formOptions.services}
            areas={formOptions.areas}
            // Two columns on tablets; on desktop, name and phone share a row.
            fieldsClassName="sm:grid-cols-2 lg:[&>*:nth-child(n+3)]:col-span-2"
          />
        </div>
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/* Split hero: service, area and project pages                         */
/* ------------------------------------------------------------------ */

export interface HeroFact {
  icon: ReactNode;
  label: string;
  fact: Fact;
}

function SplitHero({
  breadcrumbs,
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  facts,
  contactHref,
  whatsappText,
  location,
  badge,
}: {
  breadcrumbs: Crumb[];
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt?: string;
  facts?: HeroFact[];
  contactHref: string;
  whatsappText: string;
  location: string;
  badge?: ReactNode;
}) {
  // Unconfirmed facts (e.g. sample durations) are hidden on the live site; at most three are shown.
  const visibleFacts = (facts ?? []).filter((item) => isShown(item.fact)).slice(0, 3);
  return (
    <section aria-labelledby="hero-title" className="tone-navy relative overflow-hidden bg-navy-900 text-white">
      <Container className="grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:py-20">
        <div>
          <Breadcrumbs items={breadcrumbs} tone="dark" className="mb-8" />
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Eyebrow tone="dark">{eyebrow}</Eyebrow>
            {badge}
          </div>
          <h1 id="hero-title" className="text-h1 text-white">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lead text-white/80">{intro}</p>
          <HeroCtas className="mt-8" contactHref={contactHref} whatsappText={whatsappText} location={location} />
          {visibleFacts.length > 0 ? (
            <dl className="mt-10 grid gap-x-6 gap-y-4 border-t border-white/15 pt-8 sm:grid-cols-3">
              {visibleFacts.map((item) => (
                <div key={item.label} className="relative pl-8">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-white/60">
                    <span className="absolute left-0 top-0 text-wave-300" aria-hidden="true">
                      {item.icon}
                    </span>
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-white">
                    {item.fact.value} <PlaceholderBadge show={item.fact.placeholder} />
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        <div className="relative">
          <div aria-hidden="true" className="absolute -right-4 -top-4 hidden h-24 w-24 border-r-2 border-t-2 border-wave-500 lg:block" />
          <SiteImage
            image={image}
            alt={imageAlt}
            fill
            preload
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="aspect-[4/3] rounded-sm shadow-float"
          />
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page hero: everything else                                          */
/* ------------------------------------------------------------------ */

function PageHero({
  breadcrumbs,
  eyebrow,
  title,
  intro,
  image,
  children,
  className,
}: {
  breadcrumbs: Crumb[];
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  /** Optional photo beside the text on large screens. */
  image?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby="hero-title" className={cn("border-b border-concrete-300 bg-concrete-100", className)}>
      <Container className={cn("py-10 sm:py-14 lg:py-16", image && "lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-14")}>
        <div>
          <Breadcrumbs items={breadcrumbs} className="mb-8" />
          <div className="max-w-3xl">
            {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
            <h1 id="hero-title" className="text-h1">
              {title}
            </h1>
            {intro ? <div className="mt-5 max-w-2xl text-lead text-ink-muted">{intro}</div> : null}
          </div>
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
        {image ? (
          // Desktop only. Left lazy on purpose: hidden lazy images are never fetched on phones,
          // and on desktop it's on screen, so it loads straight away.
          <SiteImage
            image={image}
            fill
            sizes="(min-width: 1024px) 34vw, 1px"
            className="hidden aspect-[4/3] rounded-sm shadow-float lg:block"
          />
        ) : null}
      </Container>
    </section>
  );
}

type HeroSectionProps =
  | ({ variant: "home" } & Parameters<typeof HomeHero>[0])
  | ({ variant: "split" } & Parameters<typeof SplitHero>[0])
  | ({ variant: "page" } & Parameters<typeof PageHero>[0]);

/** One entry point for every hero layout on the site. */
export function HeroSection(props: HeroSectionProps) {
  if (props.variant === "home") return <HomeHero {...props} />;
  if (props.variant === "split") return <SplitHero {...props} />;
  return <PageHero {...props} />;
}
