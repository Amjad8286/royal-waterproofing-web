import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { BeforeAfterSlider } from "@/components/media/before-after-slider";
import { getImage } from "@/content/images";
import { areaName, serviceShortName } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/content";

/** A row of before/after sliders, each linking to its case study. */
export function BeforeAfterGallery({
  projects,
  tone = "dark",
  className,
}: {
  projects: Project[];
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-8 md:grid-cols-2 lg:grid-cols-3", className)}>
      {projects.map((project, i) => (
        <li key={project.slug} className={cn(i === 2 && "hidden lg:block")}>
          <figure>
            <BeforeAfterSlider
              before={getImage(project.before)}
              after={getImage(project.after)}
              label={project.title}
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
            />
            <figcaption className="mt-4">
              <p className={cn("text-sm font-semibold", tone === "dark" ? "text-wave-300" : "text-royal-700")}>
                {project.services.map(serviceShortName).join(" · ")}
              </p>
              <Link
                href={`/projects/${project.slug}`}
                className={cn(
                  "group mt-1 inline-flex items-start gap-2 font-heading text-h4 underline-offset-4 hover:underline",
                  tone === "dark" ? "text-white" : "text-navy-900",
                )}
              >
                {project.title}
                <ArrowRight className="mt-1 size-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <p className={cn("mt-1 flex items-center gap-1.5 text-sm", tone === "dark" ? "text-white/65" : "text-ink-subtle")}>
                <MapPin className="size-4" aria-hidden="true" />
                {areaName(project.area)} · {project.propertyLabel}
              </p>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
