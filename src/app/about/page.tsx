import Link from "next/link";
import { ArrowRight, Building2, ClipboardCheck, HardHat, Mail, MapPin, Phone, Target } from "lucide-react";
import { TeamCard } from "@/components/cards/team-card";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { MapFacade } from "@/components/media/map-facade";
import { SiteImage } from "@/components/media/site-image";
import { CTASection } from "@/components/sections/cta-section";
import { HeroSection } from "@/components/sections/hero-section";
import { StatsSection } from "@/components/sections/stats-section";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { site } from "@/config/site";
import { trackAttrs } from "@/lib/analytics";
import { getAreas, getCertifications, getFormOptions, getStats, getTeam } from "@/lib/content";
import { buildMetadata, withCta } from "@/lib/seo";
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp";

export const metadata = buildMetadata({
  title: "About Us",
  description: withCta(
    `${site.name} is a waterproofing company in ${site.contact.address.locality}, ${site.market.primaryCity}. We find the cause of a leak before quoting, then fix it properly.`,
  ),
  path: "/about",
});

const approach = [
  {
    icon: Target,
    title: "Diagnosis first",
    text: "Moisture readings, flood tests and pressure tests show where water is getting in before we recommend anything.",
  },
  {
    icon: ClipboardCheck,
    title: "Workmanship you can check",
    text: "The specified system, the right number of coats and a water test before handover where the area allows it.",
  },
  {
    icon: HardHat,
    title: "Safe, clean sites",
    text: "Proper safety gear, floors and furniture protected, and debris cleared every day.",
  },
];

const values = [
  { title: "Honest diagnosis", text: "We tell you what's actually wrong, even when the fix is small." },
  { title: "Done properly", text: "Surface preparation, the right thickness and proper curing. No shortcuts that show up next monsoon." },
  { title: "Clear communication", text: "Written quotations, agreed schedules and updates at every stage." },
  { title: "Respect for your home", text: "Protected floors, tidy sites and a team that cleans up after itself." },
  { title: "Straight answers", text: "If the problem is something we don't fix — or doesn't need fixing yet — we'll say so." },
];

const credentialLabels = {
  certification: "Training & certification",
  licence: "Registration",
  insurance: "Insurance",
  membership: "Safety & memberships",
};

export default async function AboutPage() {
  const [team, stats, certifications, areas, formOptions] = await Promise.all([
    getTeam(),
    getStats(),
    getCertifications(),
    getAreas(),
    getFormOptions(),
  ]);
  const { address } = site.contact;
  const zones = Array.from(new Set(areas.map((area) => area.zone)));

  return (
    <>
      <HeroSection
        variant="split"
        breadcrumbs={[{ name: "About us", href: "/about" }]}
        eyebrow="About us"
        title={`A ${site.market.primaryCity} waterproofing company that diagnoses first`}
        intro={`We're based in ${address.locality} and work across ${site.market.serviceRegion}. We fix leaks by finding the cause — not by painting over the stain.`}
        image="about"
        facts={[
          { icon: <MapPin className="size-5" />, label: "Office", fact: { value: `${address.locality}, ${address.city}`, placeholder: false } },
          {
            icon: <ClipboardCheck className="size-5" />,
            label: "Inspection",
            fact: { value: site.inspection.isFree ? "Free site visit" : "Site visit before quoting", placeholder: false },
          },
          { icon: <Building2 className="size-5" />, label: "We work for", fact: { value: "Homes, societies & businesses", placeholder: false } },
        ]}
        contactHref="/contact"
        whatsappText={whatsappMessage()}
        location="about-hero"
      />

      <Section labelledBy="story-title">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <SectionHeading id="story-title" eyebrow="Who we are" title="Why we work this way" />
            <div className="prose-site mt-8 text-lead text-ink-muted">
              <p>
                {site.name} waterproofs and repairs leaks in flats, bungalows, housing societies, commercial buildings and
                industrial sites across {site.market.serviceRegion}.
              </p>
              <p>
                Most leaks that keep coming back were &ldquo;repaired&rdquo; at the stain, not where the water was getting in. So
                every job starts the same way: we trace the water with moisture readings, flood and pressure tests and a careful
                look at everything around the problem. Only then do we recommend a system and put a price on it, in writing.
              </p>
              <p>
                {site.market.primaryCity} makes that diagnosis matter. Four months of heavy rain, wind-driven rain on tall and
                sea-facing walls, salt air near the coast and a large number of older society buildings mean a leak rarely has
                one simple cause.
              </p>
            </div>
          </div>
          <figure className="tone-navy self-start rounded-sm bg-navy-900 p-8 text-white lg:mt-16">
            <blockquote className="font-heading text-h3 font-semibold leading-snug text-white">
              &ldquo;If we can&apos;t show you where the water is getting in, we shouldn&apos;t be quoting to fix it.&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-sm text-white/70">The principle behind every inspection</figcaption>
          </figure>
        </div>
      </Section>

      <Section tone="concrete" labelledBy="approach-title">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
          <div>
            <SectionHeading id="approach-title" eyebrow="How we work" title="Our approach" intro="Three habits that separate a lasting repair from a temporary one." />
            <ul className="mt-10 grid gap-4">
              {approach.map(({ icon: IconComponent, title, text }) => (
                <li key={title} className="flex gap-5 rounded-sm border border-concrete-300 bg-white p-5 sm:p-6">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-navy-900 text-wave-300">
                    <IconComponent className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-heading text-h4 text-navy-900">{title}</h3>
                    <p className="mt-1.5 text-[0.9375rem] text-ink-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <SiteImage image="plans-tools" fill sizes="(min-width: 1024px) 38vw, 100vw" className="aspect-[4/3] rounded-sm" />
        </div>
      </Section>

      <Section tone="navy" labelledBy="values-title">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <SectionHeading id="values-title" tone="dark" eyebrow="What we stand for" title="Our values" />
            <p className="mt-6 text-lead text-white/80">
              Keep homes and buildings dry by fixing the cause of water damage properly, the first time — and be the
              contractor people recommend to their neighbours and their society.
            </p>
          </div>
          <ol className="grid gap-6 sm:grid-cols-2">
            {values.map((value, i) => (
              <li key={value.title} className="border-t border-white/15 pt-5">
                <span className="font-heading text-xl font-bold text-wave-300">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-heading text-h4 text-white">{value.title}</h3>
                <p className="mt-1.5 text-[0.9375rem] text-white/75">{value.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section labelledBy="office-title">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <SectionHeading
              id="office-title"
              eyebrow="Where to find us"
              title={`Our office in ${address.locality}`}
              intro={`We cover ${zones.length} zones and ${areas.length} areas from here.`}
            />
            <address className="mt-8 space-y-4 not-italic">
              <p className="flex gap-3">
                <MapPin className="mt-1 size-5 shrink-0 text-royal-700" aria-hidden="true" />
                <span className="text-navy-900">{address.full}</span>
              </p>
              <a
                href={site.contact.phone.href}
                className="flex items-center gap-3 font-semibold text-navy-900 hover:underline"
                {...trackAttrs("call_click", "about-office")}
              >
                <Phone className="size-5 text-royal-700" aria-hidden="true" />
                {site.contact.phone.display}
              </a>
              <a href={`mailto:${site.contact.email}`} className="flex items-center gap-3 break-all text-navy-900 hover:underline">
                <Mail className="size-5 shrink-0 text-royal-700" aria-hidden="true" />
                {site.contact.email}
              </a>
            </address>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href={whatsappUrl(whatsappMessage())}
                variant="whatsapp"
                icon={<WhatsAppIcon className="size-4" />}
                track={{ event: "whatsapp_click", location: "about-office" }}
              >
                WhatsApp us
              </Button>
              <Button href="/service-areas" variant="outline" iconRight={<ArrowRight className="size-4" aria-hidden="true" />}>
                Areas we cover
              </Button>
            </div>
          </div>
          <MapFacade query={site.contact.mapEmbedQuery} mapsUrl={site.contact.mapsUrl} addressLabel={address.full} />
        </div>
        <StatsSection stats={stats} className="mt-14 border border-concrete-300" />
      </Section>

      {team.length > 0 ? (
        <Section tone="concrete" labelledBy="team-title">
          <SectionHeading id="team-title" eyebrow="The team" title="The people you'll deal with" intro="One accountable team from the first call to handover." />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <li key={member.id}>
                <TeamCard member={member} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {certifications.length > 0 ? (
        <Section labelledBy="credentials-title">
          <SectionHeading id="credentials-title" eyebrow="Credentials" title="Registration, insurance and training" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((item) => (
              <li key={item.id} className="rounded-sm border border-concrete-300 p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-royal-700">{credentialLabels[item.kind]}</p>
                  <PlaceholderBadge show={item.placeholder} />
                </div>
                <p className="mt-3 font-heading text-h4 text-navy-900">{item.title}</p>
                <p className="mt-1 text-sm text-ink-muted">{item.detail}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section tone="concrete" spacing="tight" labelledBy="next-title">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-navy-900 text-wave-300">
              <Icon name="building" className="size-5" />
            </span>
            <div>
              <h2 id="next-title" className="font-heading text-h3 text-navy-900">
                See the kind of work we do
              </h2>
              <p className="mt-1 text-ink-muted">Housing societies, flats, offices, factories and new buildings.</p>
            </div>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 font-semibold text-royal-700 underline-offset-4 hover:underline"
          >
            Our work <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </Section>

      <CTASection
        title="Let's find out what's causing your leak"
        formOptions={formOptions}
        whatsappText={whatsappMessage()}
        location="about-cta"
      />
    </>
  );
}
