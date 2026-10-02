import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { Container } from "@/components/layout/container";
import { flags } from "@/config/site";
import { HeroSection } from "./hero-section";

/**
 * Shared layout for the legal pages. The text was written without legal advice:
 * have it reviewed before launch (it's on the content checklist). The reminder
 * banner only shows in preview mode.
 */
export function LegalPage({ title, path, updated, children }: { title: string; path: string; updated: string; children: ReactNode }) {
  return (
    <>
      <HeroSection variant="page" breadcrumbs={[{ name: title, href: path }]} title={title} intro={`Last updated ${updated}`} />
      <div className="bg-white py-12 sm:py-16">
        <Container>
          {flags.previewSamples ? (
            <p
              role="note"
              className="mb-10 flex max-w-[70ch] gap-3 rounded-sm border border-warning-700/40 bg-warning-100 p-4 text-sm text-navy-900"
            >
              <TriangleAlert className="mt-0.5 size-5 shrink-0 text-warning-700" aria-hidden="true" />
              <span>
                <strong className="font-semibold">Needs legal review.</strong> This page was written without legal advice. Have
                it reviewed before the site goes live.
              </span>
            </p>
          ) : null}
          <div className="prose-site">{children}</div>
        </Container>
      </div>
    </>
  );
}
