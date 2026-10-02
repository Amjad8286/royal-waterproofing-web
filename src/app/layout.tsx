import type { Metadata, Viewport } from "next";
import { Barlow_Semi_Condensed, Public_Sans } from "next/font/google";
import { ChatLauncher } from "@/components/chat/chat-launcher";
import { Footer } from "@/components/layout/footer";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { Navbar } from "@/components/layout/navbar";
import type { NavGroup, NavLookups } from "@/components/layout/nav-types";
import { SiteBehaviour } from "@/components/layout/site-behaviour";
import { TopBar } from "@/components/layout/top-bar";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { JsonLd } from "@/components/seo/json-ld";
import { brandColors } from "@/config/brand";
import { features, site } from "@/config/site";
import { chatWidget } from "@/content/chat";
import { getAreas, getAvailability, getServices, getServicesByGroup } from "@/lib/content";
import { businessJsonLd } from "@/lib/schema";
import { robotsFor } from "@/lib/seo";
import "./globals.css";

const heading = Barlow_Semi_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const body = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Waterproofing Services in ${site.market.primaryCity} | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  robots: robotsFor(),
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: brandColors.navy900,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [groups, services, areas, available] = await Promise.all([
    getServicesByGroup(),
    getServices(),
    getAreas(),
    getAvailability(),
  ]);

  const navGroups: NavGroup[] = groups.map((group) => ({
    id: group.id,
    label: group.label,
    description: group.description,
    services: group.services.map(({ slug, name, summary, icon }) => ({ slug, name, summary, icon })),
  }));
  const lookups: NavLookups = {
    services: Object.fromEntries(services.map((s) => [s.slug, s.name])),
    areas: Object.fromEntries(areas.map((a) => [a.slug, a.name])),
  };
  return (
    <html lang={site.language} data-scroll-behavior="smooth" className={`${heading.variable} ${body.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only rounded-sm bg-navy-900 px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
        >
          Skip to main content
        </a>
        <TopBar />
        <Navbar groups={navGroups} available={available} />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer available={available} />
        <MobileActionBar lookups={lookups} />
        <WhatsAppButton lookups={lookups} besideChat={features.chatAssistant} />
        {features.chatAssistant ? <ChatLauncher config={chatWidget} lookups={lookups} /> : null}
        <SiteBehaviour />
        <JsonLd data={businessJsonLd(areas, services)} />
      </body>
    </html>
  );
}
