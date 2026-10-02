import Link from "next/link";
import { ArrowRight, CircleCheck, Phone } from "lucide-react";
import { SubmissionReference } from "@/components/forms/submission-reference";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { cta, site } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata = buildMetadata({
  title: "Thanks — we've got your request",
  description: "Your inspection request has been received. Here's what happens next.",
  path: "/thank-you",
  noindex: true,
});

const steps = [
  { title: "We call you back", text: `${cta.callback}.` },
  {
    title: site.inspection.isFree ? "Free inspection and diagnosis" : "Inspection and diagnosis",
    text: "On site we trace where the water is getting in and explain the cause.",
  },
  { title: "You get a written quotation", text: "Itemised, with the recommended system and schedule. No obligation to go ahead." },
];

export default function ThankYouPage() {
  const photoMessage = `Hi ${site.shortName}, I've just booked an inspection. Here are some photos of the problem:`;
  return (
    <section aria-labelledby="hero-title" className="bg-concrete-100 py-14 sm:py-20">
      <Container className="max-w-3xl">
        <div className="rounded-md border border-concrete-300 bg-white p-6 shadow-card sm:p-10">
          <span className="flex size-14 items-center justify-center rounded-full bg-success-100 text-success-700">
            <CircleCheck className="size-8" aria-hidden="true" />
          </span>
          <h1 id="hero-title" className="mt-6 text-h2">
            Thanks — we&apos;ve got your request
          </h1>
          <p className="mt-3 text-lead text-ink-muted">
            {site.responseTime ? `${site.responseTime}. ` : "We'll be in touch soon. "}If it&apos;s urgent, call us now on{" "}
            <a href={site.contact.phone.href} className="font-semibold text-navy-900 underline underline-offset-4">
              {site.contact.phone.display}
            </a>
            .
          </p>
          <SubmissionReference />

          <h2 className="mt-10 font-heading text-h4 text-navy-900">What happens next</h2>
          <ol className="mt-5 space-y-5">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy-900 font-heading font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-navy-900">{step.title}</p>
                  <p className="mt-0.5 text-ink-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-sm bg-concrete-100 p-5">
            <p className="font-semibold text-navy-900">Speed things up: send us photos</p>
            <p className="mt-1 text-sm text-ink-muted">Photos of the damp patch, the area above it and any cracks help us prepare for the visit.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                href={whatsappUrl(photoMessage)}
                variant="whatsapp"
                icon={<WhatsAppIcon className="size-4" />}
                track={{ event: "whatsapp_click", location: "thank-you" }}
              >
                Send photos on WhatsApp
              </Button>
              <Button
                href={site.contact.phone.href}
                variant="outline"
                icon={<Phone className="size-4" aria-hidden="true" />}
                track={{ event: "call_click", location: "thank-you" }}
              >
                Call us
              </Button>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-concrete-300 pt-6 text-sm font-semibold">
            <Link href="/projects" className="inline-flex items-center gap-1.5 text-royal-700 underline-offset-4 hover:underline">
              See the work we do <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/faq" className="inline-flex items-center gap-1.5 text-royal-700 underline-offset-4 hover:underline">
              Read the FAQs <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/" className="inline-flex items-center gap-1.5 text-royal-700 underline-offset-4 hover:underline">
              Back to the home page <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
