import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cta, site } from "@/config/site";
import { getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page not found",
};

export default async function NotFound() {
  const services = await getServices();
  return (
    <section aria-labelledby="nf-title" className="bg-concrete-100 py-16 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <p aria-hidden="true" className="font-heading text-[5rem] font-bold leading-none text-navy-900/15">
              404
            </p>
            <h1 id="nf-title" className="mt-2 text-h1">
              We couldn&apos;t find that page
            </h1>
            <p className="mt-4 text-lead text-ink-muted">
              The link may be old or mistyped. If you were looking for help with a leak, these will get you there.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" size="lg">
                {cta.primary}
              </Button>
              <Button href={site.contact.phone.href} size="lg" variant="outline" icon={<Phone className="size-5" aria-hidden="true" />}>
                {site.contact.phone.display}
              </Button>
            </div>
            <Link href="/" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-royal-700 underline-offset-4 hover:underline">
              Go to the home page <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <nav aria-labelledby="nf-services" className="rounded-md border border-concrete-300 bg-white p-6">
            <h2 id="nf-services" className="font-heading text-h4 text-navy-900">
              Our services
            </h2>
            <ul className="mt-4 grid gap-1 sm:grid-cols-2">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="flex min-h-11 items-center gap-3 rounded-sm px-2 text-[0.9375rem] font-medium text-navy-900 hover:bg-concrete-100"
                  >
                    <Icon name={service.icon} className="size-5 text-royal-700" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </section>
  );
}
