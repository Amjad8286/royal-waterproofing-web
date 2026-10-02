import type { CSSProperties } from "react";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { SiteImage } from "@/components/media/site-image";
import { getImage } from "@/content/images";
import type { Client } from "@/types/content";
import { ClientWall } from "./client-wall";

/**
 * Logos are sized by optical weight rather than by box: wider logos get less
 * height, so a square emblem and a long wordmark look equally prominent — but
 * only a little less, or a long lockup's lettering becomes unreadable. (A
 * height of 3rem × ratio^-0.25 gives Tata ~46px tall, Adani ~37px and
 * Godrej & Boyce ~32px.) Returns the width in rem.
 */
function logoWidth(width: number, height: number) {
  const ratio = width / height;
  const rem = 3 * ratio ** -0.25 * ratio;
  return Math.round(rem * 100) / 100;
}

/** A client's logo, in greyscale until hovered (so mixed brand colours sit calmly beside the names), or its name set as a wordmark. */
function ClientMark({ client }: { client: Client }) {
  if (client.logo) {
    const logo = getImage(client.logo);
    return (
      <div
        className="w-[calc(var(--logo-w)*0.85)] max-w-full sm:w-(--logo-w)"
        style={{ "--logo-w": `${logoWidth(logo.width, logo.height)}rem` } as CSSProperties}
      >
        <SiteImage
          image={logo}
          alt={client.name}
          sizes="8rem"
          draggable={false}
          imgClassName="grayscale transition-[filter] duration-300 group-hover:grayscale-0"
        />
      </div>
    );
  }
  return (
    <span className="text-balance text-center font-heading text-sm font-semibold uppercase leading-tight tracking-[0.06em] text-ink-muted transition-colors duration-300 group-hover:text-navy-900 sm:text-[0.9375rem]">
      {client.name}
    </span>
  );
}

/** Home page: the organisations the company has worked for. Renders nothing until there are clients to show. */
export function ClientsSection({ clients }: { clients: Client[] }) {
  if (clients.length === 0) return null;
  return (
    <Section labelledBy="clients-title">
      <SectionHeading
        id="clients-title"
        eyebrow="Our clients"
        title="Trusted by leading organisations"
        intro="Building lasting relationships through quality, reliability and professional execution."
      />
      <div data-reveal className="mt-10 lg:mt-12">
        <ClientWall tiles={clients.map((client) => <ClientMark key={client.slug} client={client} />)} />
      </div>
    </Section>
  );
}
