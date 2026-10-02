import { ArrowRight, Phone } from "lucide-react";
import { ProjectCard } from "@/components/cards/project-card";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { CTASection } from "@/components/sections/cta-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProcessSteps } from "@/components/sections/process-steps";
import { ProjectsExplorer } from "@/components/sections/projects-explorer";
import { SectorCards } from "@/components/sections/sectors";
import { Button } from "@/components/ui/button";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { cta, processSteps, site } from "@/config/site";
import { propertyTypes } from "@/content/projects";
import { getFormOptions, getGallery, getProjects, getSectors, getServices } from "@/lib/content";
import { buildMetadata, withCity, withCta } from "@/lib/seo";
import { whatsappMessage } from "@/lib/whatsapp";

export const metadata = buildMetadata({
  title: withCity("Waterproofing Projects"),
  description: withCta(
    "Housing societies, flats, bungalows, offices, factories and new buildings — the waterproofing work we take on across Mumbai and how each job is run.",
  ),
  path: "/projects",
});

export default async function ProjectsPage() {
  const [projects, sectors, gallery, services, formOptions] = await Promise.all([
    getProjects(),
    getSectors(),
    getGallery(),
    getServices(),
    getFormOptions(),
  ]);

  const items = projects.map((project, i) => ({
    key: project.slug,
    services: project.services,
    propertyType: project.propertyType,
    node: <ProjectCard project={project} eager={i < 3} />,
  }));
  const serviceOptions = services
    .map((service) => ({
      value: service.slug,
      label: service.shortName.charAt(0).toUpperCase() + service.shortName.slice(1),
      count: projects.filter((p) => p.services.includes(service.slug)).length,
    }))
    .filter((option) => option.count > 0);
  const typeOptions = propertyTypes.map((type) => ({
    value: type.id,
    label: type.label,
    count: projects.filter((p) => p.propertyType === type.id).length,
  }));

  return (
    <>
      <HeroSection
        variant="page"
        breadcrumbs={[{ name: "Projects", href: "/projects" }]}
        eyebrow="Projects"
        title="Waterproofing for every kind of building"
        image="coating-materials"
        intro={`From a single leaking bathroom to society terraces, offices and factories — this is the work we take on across ${site.market.serviceRegion}, and what each kind of job involves.`}
      >
        <div id="hero-cta" className="flex flex-wrap gap-3">
          <Button href="/contact" size="lg" track={{ event: "cta_click", location: "projects-hero" }}>
            {cta.primary}
          </Button>
          <Button
            href={site.contact.phone.href}
            size="lg"
            variant="outline"
            icon={<Phone className="size-5" aria-hidden="true" />}
            track={{ event: "call_click", location: "projects-hero" }}
          >
            {site.contact.phone.display}
          </Button>
        </div>
      </HeroSection>

      {projects.length > 0 ? (
        <Section spacing="tight" labelledBy="projects-list-title">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <h2 id="projects-list-title" className="text-h2">
              Recent projects
            </h2>
            <PlaceholderBadge show={projects.some((p) => p.placeholder)} label="Sample projects — replace with your own jobs" />
          </div>
          <ProjectsExplorer items={items} serviceOptions={serviceOptions} typeOptions={typeOptions} />
          {gallery.length > 0 ? (
            <Button href="/gallery" variant="link" className="mt-8" iconRight={<ArrowRight className="size-4" aria-hidden="true" />}>
              Browse the photo gallery
            </Button>
          ) : null}
        </Section>
      ) : null}

      <Section tone={projects.length > 0 ? "concrete" : "white"} labelledBy="sectors-title">
        <SectionHeading
          id="sectors-title"
          eyebrow="Who we work for"
          title="The buildings we waterproof"
          intro="Each kind of building has its own problems and its own way of working. Here's what a typical job involves."
        />
        <SectorCards sectors={sectors} className="mt-12" />
      </Section>

      <Section tone={projects.length > 0 ? "white" : "concrete"} labelledBy="process-title">
        <SectionHeading
          id="process-title"
          eyebrow="How every project runs"
          title="Inspection first, then a written quotation"
          intro="Whether it's one bathroom or a whole building, the steps are the same."
        />
        <ProcessSteps steps={processSteps} className="mt-14" />
      </Section>

      <CTASection
        title="Planning work on your building?"
        intro="Tell us about the building and the problem. We'll inspect, explain the cause and give you a written quotation — for one flat or a whole society."
        formOptions={formOptions}
        whatsappText={whatsappMessage()}
        location="projects-cta"
      />
    </>
  );
}
