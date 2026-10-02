import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleCheck, Clock, MapPin, TriangleAlert, Wrench } from "lucide-react";
import { ProjectCard } from "@/components/cards/project-card";
import { TestimonialCard } from "@/components/cards/testimonial-card";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { BeforeAfterSlider } from "@/components/media/before-after-slider";
import { GalleryGrid, type GalleryEntry } from "@/components/media/gallery-grid";
import { CTASection } from "@/components/sections/cta-section";
import { HeroSection } from "@/components/sections/hero-section";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { getImage } from "@/content/images";
import { areaName, getFormOptions, getProject, getProjects, getReview, serviceName } from "@/lib/content";
import { relatedProjects } from "@/lib/relations";
import { buildMetadata } from "@/lib/seo";
import { whatsappMessage } from "@/lib/whatsapp";

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.title,
    description: `${project.summary} ${project.outcome} See how we fixed it.`,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const [projects, review, formOptions] = await Promise.all([
    getProjects(),
    project.review ? getReview(project.review) : Promise.resolve(null),
    getFormOptions(),
  ]);
  const related = relatedProjects(projects, project, 3);
  const primaryService = project.services[0];
  const waText = whatsappMessage({ service: serviceName(primaryService), area: areaName(project.area) });

  const facts = [
    { label: "Location", value: areaName(project.area) },
    { label: "Property", value: project.propertyLabel },
    { label: "Services", value: project.services.map(serviceName).join(", ") },
    { label: "Area treated", value: project.areaTreated },
    { label: "Duration", value: project.duration },
    { label: "Completed", value: project.year },
  ];

  const gallery: GalleryEntry[] = project.gallery.map((id) => {
    const image = getImage(id);
    const tag = id.endsWith("-before") ? "Before" : id.endsWith("-after") ? "After" : "In progress";
    const caption = image.alt.replace(/^Illustration of /, "").replace(/^./, (c) => c.toUpperCase());
    return { id, kind: "photo", image, caption, tag, service: primaryService };
  });

  return (
    <>
      <HeroSection
        variant="split"
        breadcrumbs={[
          { name: "Projects", href: "/projects" },
          { name: project.title, href: `/projects/${project.slug}` },
        ]}
        eyebrow={project.services.map(serviceName).join(" · ")}
        title={project.title}
        intro={project.summary}
        image={project.cover}
        facts={[
          { icon: <MapPin className="size-5" />, label: "Location", fact: { value: areaName(project.area), placeholder: false } },
          { icon: <Clock className="size-5" />, label: "Duration", fact: { value: project.duration, placeholder: project.placeholder } },
          { icon: <CircleCheck className="size-5" />, label: "Outcome", fact: { value: project.outcome, placeholder: false } },
        ]}
        badge={<PlaceholderBadge show={project.placeholder} label="Sample project" />}
        contactHref={`/contact?service=${primaryService}&area=${project.area}`}
        whatsappText={waText}
        location={`project-${project.slug}`}
      />

      <Section labelledBy="story-title">
        <h2 id="story-title" className="sr-only">
          The project
        </h2>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-concrete-300 bg-concrete-300 md:grid-cols-3 lg:grid-cols-6">
          {facts.map((fact) => (
            <div key={fact.label} className="bg-white p-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">{fact.label}</dt>
              <dd className="mt-1 text-[0.9375rem] font-semibold text-navy-900">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 grid gap-10 lg:grid-cols-3 lg:gap-12">
          <section aria-labelledby="challenge-title">
            <h3 id="challenge-title" className="flex items-center gap-3 font-heading text-h3 text-navy-900">
              <span className="flex size-10 items-center justify-center rounded-sm bg-royal-50 text-royal-700">
                <TriangleAlert className="size-5" aria-hidden="true" />
              </span>
              The challenge
            </h3>
            <p className="mt-4 text-ink-muted">{project.challenge}</p>
          </section>
          <section aria-labelledby="solution-title">
            <h3 id="solution-title" className="flex items-center gap-3 font-heading text-h3 text-navy-900">
              <span className="flex size-10 items-center justify-center rounded-sm bg-royal-100 text-royal-700">
                <Wrench className="size-5" aria-hidden="true" />
              </span>
              What we did
            </h3>
            <ol className="mt-4 space-y-3">
              {project.solution.map((step, i) => (
                <li key={step} className="flex gap-3 text-ink-muted">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </section>
          <section aria-labelledby="result-title">
            <h3 id="result-title" className="flex items-center gap-3 font-heading text-h3 text-navy-900">
              <span className="flex size-10 items-center justify-center rounded-sm bg-success-100 text-success-700">
                <CircleCheck className="size-5" aria-hidden="true" />
              </span>
              The result
            </h3>
            <p className="mt-4 text-ink-muted">{project.result}</p>
          </section>
        </div>
      </Section>

      <Section tone="navy" labelledBy="compare-title">
        <SectionHeading id="compare-title" tone="dark" eyebrow="Before & after" title="See the difference" intro="Drag the slider, or use the arrow keys, to compare." />
        <div className="mt-10 max-w-4xl">
          <BeforeAfterSlider
            before={getImage(project.before)}
            after={getImage(project.after)}
            label={project.title}
            sizes="(min-width: 1024px) 56rem, 100vw"
          />
        </div>
      </Section>

      <Section labelledBy="photos-title">
        <SectionHeading id="photos-title" eyebrow="Photos" title="On site" intro="Select a photo to view it larger." />
        <div className="mt-10">
          <GalleryGrid items={gallery} filters={[]} />
        </div>
      </Section>

      {review ? (
        <Section tone="concrete" labelledBy="review-title">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
            <SectionHeading id="review-title" eyebrow="The customer's view" title="What they said" />
            <TestimonialCard review={review} className="text-lead" />
          </div>
        </Section>
      ) : null}

      {related.length > 0 ? (
        <Section tone={review ? "white" : "concrete"} labelledBy="related-title">
          <SectionHeading
            id="related-title"
            eyebrow="More projects"
            title="Similar jobs"
            action={
              <Link href="/projects" className="font-semibold text-royal-700 underline-offset-4 hover:underline">
                All projects
              </Link>
            }
          />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <ProjectCard project={item} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <CTASection
        title="Facing something similar?"
        intro="Tell us what's happening at your property. We'll inspect, find the cause and give you a written quotation."
        formOptions={formOptions}
        defaultService={primaryService}
        defaultArea={project.area}
        whatsappText={waText}
        location={`project-${project.slug}-cta`}
      />
    </>
  );
}
