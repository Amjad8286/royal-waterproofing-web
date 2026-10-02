import { LegalPage } from "@/components/sections/legal-page";
import { site } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Use",
  description: `The terms that apply when you use the ${site.name} website.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" path="/terms" updated="2 October 2026">
      <p>
        These terms apply to your use of this website, operated by {site.legalName}, {site.contact.address.full}. By using
        the site you agree to them.
      </p>

      <h2>Information on this site</h2>
      <p>
        The information here is general guidance about waterproofing and leak repair. Every building is different, so it
        isn&apos;t a substitute for an inspection, and it isn&apos;t a recommendation for your specific property. The same
        goes for the answers from the website assistant, which are automated and drawn from this site&apos;s content.
      </p>

      <h2>Quotations and prices</h2>
      <p>
        Nothing on this site is an offer or a fixed price. All work is carried out under a written quotation, and the terms
        in that quotation are the ones that apply to your job.
      </p>

      <h2>Photographs</h2>
      <p>
        Some photographs on this site are licensed stock images used to illustrate the kind of buildings and problems we
        deal with. They are not photographs of our own projects.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The text and design of this site belong to {site.legalName}, and the images are ours or used under licence. Please
        don&apos;t copy them without asking. Client names and logos belong to their owners and are shown only to indicate
        work we have done for them.
      </p>

      <h2>Links to other sites</h2>
      <p>We link to services such as Google Maps and WhatsApp. We&apos;re not responsible for their content or policies.</p>

      <h2>Liability</h2>
      <p>
        We work to keep this site accurate and available but can&apos;t guarantee it will always be either. To the extent
        the law allows, we&apos;re not liable for losses arising from use of the site. Nothing here limits liability that
        cannot legally be limited.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India, and the courts at Mumbai, Maharashtra have jurisdiction.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
      </p>
    </LegalPage>
  );
}
