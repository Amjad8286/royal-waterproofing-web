import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/schema";
import { cn } from "@/lib/utils";

export interface Crumb {
  name: string;
  href: string;
}

/** Visible breadcrumbs plus matching BreadcrumbList structured data. */
export function Breadcrumbs({ items, tone = "light", className }: { items: Crumb[]; tone?: "light" | "dark"; className?: string }) {
  const all: Crumb[] = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
        <ol className={cn("flex flex-wrap items-center gap-x-1.5 gap-y-1", tone === "dark" ? "text-white/70" : "text-ink-muted")}>
          {all.map((item, i) => {
            const last = i === all.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {i > 0 ? <ChevronRight className="size-3.5 opacity-60" aria-hidden="true" /> : null}
                {last ? (
                  <span aria-current="page" className={cn("font-medium", tone === "dark" ? "text-white" : "text-navy-900")}>
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className={cn("underline-offset-4 hover:underline", tone === "dark" ? "hover:text-white" : "hover:text-navy-900")}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all.map((item) => ({ name: item.name, path: item.href })))} />
    </>
  );
}
