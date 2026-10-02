import type { ReactNode } from "react";
import { Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Eyebrow, SectionHeading } from "@/components/layout/section-heading";
import { MapFacade } from "@/components/media/map-facade";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { cta, site } from "@/config/site";
import { contactFaqIds } from "@/content/faqs";
import { trackAttrs } from "@/lib/analytics";
import { getFaqsByIds, getFormOptions } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp";

export const metadata = buildMetadata({
  title: cta.contactHeading.replace(/^./, (c) => c.toUpperCase()),
  description: `Call ${site.contact.phone.display}, WhatsApp or send the form. We call you back, inspect, find the cause and give you a written quotation, with no obligation.`,
  path: "/contact",
});

const nextSteps = [
  { title: "We call you back", text: `${cta.callback}.` },
  {
    title: site.inspection.isFree ? "Free inspection and diagnosis" : "Inspection and diagnosis",
    text: "We trace where the water is getting in and explain the cause on site.",
  },
  { title: "You get a written quotation", text: "Itemised, with the recommended system and schedule. No obligation to go ahead." },
];

function ContactCard({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex gap-4 border-b border-concrete-300 py-4 last:border-b-0">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-royal-50 text-royal-700">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">{label}</p>
        <div className="mt-0.5 text-[0.9375rem] text-navy-900">{children}</div>
      </div>
    </li>
  );
}

export default async function ContactPage() {
  const [formOptions, faqs] = await Promise.all([getFormOptions(), getFaqsByIds(contactFaqIds)]);
  const { address } = site.contact;

  return (
    <>
      <section aria-labelledby="hero-title" className="border-b border-concrete-300 bg-concrete-100">
        <Container className="py-10 sm:py-12">
          <Breadcrumbs items={[{ name: "Contact", href: "/contact" }]} className="mb-8" />
          <Eyebrow className="mb-4">Contact</Eyebrow>
          <h1 id="hero-title" className="text-h1">
            {cta.contactHeading.replace(/^./, (c) => c.toUpperCase())}
          </h1>
          <p className="mt-4 max-w-2xl text-lead text-ink-muted">
            Tell us what&apos;s happening — or {cta.quote.toLowerCase()}. We call you back, inspect, find the cause and give
            you a written quotation.
          </p>
        </Container>
      </section>

      <div className="bg-concrete-100 pb-16 lg:pb-24">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <section aria-labelledby="form-title" className="-mt-px rounded-md border border-concrete-300 bg-white p-5 shadow-card sm:p-8">
            <h2 id="form-title" className="font-heading text-h3 text-navy-900">
              Your details
            </h2>
            <p className="mt-1 text-sm text-ink-muted">Takes about a minute. Only the first four fields are required.</p>
            <ContactForm className="mt-6" variant="full" location="contact-page" prefillFromQuery services={formOptions.services} areas={formOptions.areas} />
          </section>

          <aside className="space-y-6 lg:pt-0" aria-label="Other ways to reach us">
            <div className="rounded-md border border-concrete-300 bg-white px-5 py-2 shadow-card">
              <ul>
                <ContactCard icon={<Phone className="size-5" aria-hidden="true" />} label="Call">
                  <a href={site.contact.phone.href} className="font-semibold hover:underline" {...trackAttrs("call_click", "contact-page")}>
                    {site.contact.phone.display}
                  </a>
                </ContactCard>
                <ContactCard icon={<WhatsAppIcon className="size-5" />} label="WhatsApp">
                  <a
                    href={whatsappUrl(whatsappMessage())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:underline"
                    {...trackAttrs("whatsapp_click", "contact-page")}
                  >
                    Message us — photos welcome
                  </a>
                </ContactCard>
                <ContactCard icon={<Mail className="size-5" aria-hidden="true" />} label="Email">
                  <a href={`mailto:${site.contact.email}`} className="break-all font-semibold hover:underline">
                    {site.contact.email}
                  </a>
                </ContactCard>
                <ContactCard icon={<MapPin className="size-5" aria-hidden="true" />} label="Office">
                  <address className="not-italic">{address.full}</address>
                  <a
                    href={site.contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-royal-700 hover:underline"
                  >
                    Get directions <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                </ContactCard>
                {site.hours ? (
                  <ContactCard icon={<Clock className="size-5" aria-hidden="true" />} label="Hours">
                    {site.hours.display}
                  </ContactCard>
                ) : null}
              </ul>
            </div>

            <div className="tone-navy rounded-md bg-navy-900 p-6 text-white">
              <h2 className="font-heading text-h4 text-white">What happens next</h2>
              <ol className="mt-5 space-y-5">
                {nextSteps.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-wave-300 font-heading font-bold text-navy-950">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{step.title}</p>
                      <p className="mt-0.5 text-sm text-white/75">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </Container>
      </div>

      <Section labelledBy="map-title">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
          <div>
            <SectionHeading id="map-title" eyebrow="Find us" title={`Our office in ${address.locality}`} />
            <p className="mt-4 text-ink-muted">
              {address.full}. Call or WhatsApp before visiting so someone is there to meet you.
            </p>
            <div className="mt-8">
              <MapFacade query={site.contact.mapEmbedQuery} mapsUrl={site.contact.mapsUrl} addressLabel={address.full} />
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Before you book" title="Quick answers" />
            <FAQAccordion faqs={faqs} className="mt-8" />
          </div>
        </div>
      </Section>
    </>
  );
}
