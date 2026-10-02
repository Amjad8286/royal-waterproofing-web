import { Check, MapPin, Phone } from "lucide-react";
import { ContactForm, type FormOption } from "@/components/forms/contact-form";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { cta, site } from "@/config/site";
import { whatsappUrl } from "@/lib/whatsapp";

/** Closing call to action used at the end of most pages. */
export function CTASection({
  title = "Get the leak fixed properly",
  intro = "Tell us what you're seeing. We'll inspect, find the cause and give you a written quotation — with no obligation.",
  formOptions,
  defaultService,
  defaultArea,
  whatsappText,
  location,
}: {
  title?: string;
  intro?: string;
  formOptions: { services: FormOption[]; areas: FormOption[] };
  defaultService?: string;
  defaultArea?: string;
  whatsappText: string;
  location: string;
}) {
  const points = [
    cta.callback,
    cta.quoteNote,
    site.inspection.isFree ? "Free site inspection, with no obligation" : "No obligation to go ahead",
  ];
  return (
    <section aria-labelledby="cta-title" className="tone-navy bg-navy-900 text-white">
      <Container className="grid items-start gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16 lg:py-24">
        <div className="lg:pt-6">
          <Eyebrow tone="dark" className="mb-4">
            {cta.contactHeading}
          </Eyebrow>
          <h2 id="cta-title" className="text-h2 text-white">
            {title}
          </h2>
          <p className="mt-4 max-w-xl text-lead text-white/75">{intro}</p>
          <ul className="mt-8 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-white/90">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-wave-300 text-navy-950">
                  <Check className="size-4" aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button
              href={site.contact.phone.href}
              size="lg"
              variant="outline-light"
              icon={<Phone className="size-5" aria-hidden="true" />}
              track={{ event: "call_click", location }}
            >
              {site.contact.phone.display}
            </Button>
            <Button
              href={whatsappUrl(whatsappText)}
              size="lg"
              variant="whatsapp"
              icon={<WhatsAppIcon className="size-5" />}
              track={{ event: "whatsapp_click", location }}
            >
              {cta.whatsapp}
            </Button>
          </div>
          <a
            href={site.contact.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-start gap-2 text-sm text-white/70 hover:text-white"
          >
            <MapPin className="mt-0.5 size-4 shrink-0 text-wave-300" aria-hidden="true" />
            <span>Office: {site.contact.address.full}</span>
          </a>
        </div>
        <div className="rounded-md bg-white p-6 text-ink shadow-float sm:p-7">
          <p className="font-heading text-h3 font-bold text-navy-900">Request a call back</p>
          <p className="mt-1.5 text-sm text-ink-muted">Four quick details and we&apos;ll take it from there.</p>
          <ContactForm
            className="mt-5"
            variant="compact"
            location={location}
            services={formOptions.services}
            areas={formOptions.areas}
            defaultService={defaultService}
            defaultArea={defaultArea}
          />
        </div>
      </Container>
    </section>
  );
}
