import Link from "next/link";
import { LegalPage } from "@/components/sections/legal-page";
import { site } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects the personal details you share when you contact us or book an inspection.`,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy policy" path="/privacy-policy" updated="2 October 2026">
      <p>
        This policy explains what personal information {site.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;), of{" "}
        {site.contact.address.full}, collects when you use this website or contact us, how we use it, and the choices you
        have. We handle personal data in line with India&apos;s Digital Personal Data Protection Act, 2023.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Details you give us</strong> through the enquiry form, WhatsApp, email or phone: your name, phone number,
          email, area, property type, a description of the problem, your preferred inspection time, and any photos or videos
          you send.
        </li>
        <li>
          <strong>Questions you ask the website assistant</strong>, and the page you ask them from. They&apos;re used only to
          find an answer in this site&apos;s content: we don&apos;t store them or send them to an outside AI service. Please
          don&apos;t include personal details; to arrange a visit, call, WhatsApp or use the enquiry form.
        </li>
        <li>
          <strong>How you found us:</strong> if you arrive from an advert or campaign link, we may record the campaign tags in
          the link alongside your enquiry.
        </li>
        <li>
          <strong>Technical information</strong> such as pages visited and device type, only if analytics are enabled on this
          site. We will update this policy, and ask for consent where required, before that happens.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To respond to your enquiry and arrange an inspection.</li>
        <li>To prepare a quotation, carry out the work and support you afterwards.</li>
        <li>To keep the records we&apos;re legally required to keep, such as tax records.</li>
      </ul>
      <p>
        You give us these details so we can respond to your enquiry. We don&apos;t sell your information, and we don&apos;t
        use it for unrelated marketing without your consent.
      </p>

      <h2>Who we share it with</h2>
      <p>
        Only with service providers that help us run the business — for example email, hosting, messaging or
        customer-management tools — and only for that purpose, or when the law requires it.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiry details only as long as we need them to respond and follow up. Records of work we carry out are kept
        for as long as we need them to support that work and to meet legal and tax requirements.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to see a summary of the personal data we hold about you, correct or update it, or have it erased, and you
        can withdraw consent you have given. Email <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> or call{" "}
        <a href={site.contact.phone.href}>{site.contact.phone.display}</a> and we&apos;ll respond as quickly as we can.
      </p>

      <h2>Cookies and similar storage</h2>
      <p>
        This site uses only the storage it needs to work — for example, remembering which advert brought you here during
        your visit, and keeping your conversation with the website assistant until you close the tab or start a new chat.
        Both stay in your browser. The map on the <Link href="/contact">contact page</Link> loads Google Maps only when you
        choose to open it, and links to WhatsApp and Google Maps take you to those services, which have their own privacy
        policies.
      </p>

      <h2>Changes to this policy</h2>
      <p>If we change how we use personal information, we&apos;ll update this page and the date at the top.</p>
    </LegalPage>
  );
}
