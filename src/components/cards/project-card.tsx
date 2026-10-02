import Link from "next/link";
import { ArrowRight, Building, MapPin } from "lucide-react";
import { SiteImage } from "@/components/media/site-image";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { areaName, serviceShortName } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/content";

export function ProjectCard({
  project,
  className,
  headingLevel = "h3",
  eager = false,
}: {
  project: Project;
  className?: string;
  headingLevel?: "h2" | "h3";
  /** Load the cover immediately when the card starts on screen. */
  eager?: boolean;
}) {
  const Heading = headingLevel;
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-sm border border-concrete-300 bg-white transition-colors duration-200 hover:border-navy-900/40",
        "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-royal-700",
        className,
      )}
    >
      <div className="relative">
        <SiteImage
          image={project.cover}
          alt=""
          fill
          eager={eager}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="aspect-[4/3] bg-concrete-200"
          imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <span className="absolute bottom-3 left-3 rounded-xs bg-navy-900/90 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">
          Before &amp; after
        </span>
        <PlaceholderBadge show={project.placeholder} label="Sample project" className="absolute right-3 top-3 shadow-card" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm font-semibold text-royal-700">{project.services.map(serviceShortName).join(" · ")}</p>
        <Heading className="mt-2 font-heading text-h4 text-navy-900">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {project.title}
          </Link>
        </Heading>
        <p className="mt-2 text-[0.9375rem] text-ink-muted">{project.outcome}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-5 text-sm text-ink-subtle">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" aria-hidden="true" />
            {areaName(project.area)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Building className="size-4" aria-hidden="true" />
            {project.propertyLabel}
          </span>
          <ArrowRight className="ml-auto size-4 text-royal-700 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}
