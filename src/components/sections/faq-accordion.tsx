import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FAQ } from "@/types/content";

/**
 * Native <details>/<summary>: keyboard and screen-reader support built in,
 * works without JavaScript, and answers stay in the HTML for search engines.
 */
export function FAQAccordion({
  faqs,
  tone = "light",
  openAll = false,
  className,
}: {
  faqs: FAQ[];
  tone?: "light" | "dark";
  /** Expand every item, e.g. when showing search results. */
  openAll?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("divide-y border-y", tone === "dark" ? "divide-white/15 border-white/15" : "divide-concrete-300 border-concrete-300", className)}>
      {faqs.map((faq) => (
        <details key={faq.id} id={`faq-${faq.id}`} open={openAll || undefined} className="group">
          <summary
            className={cn(
              "flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left text-[1.0625rem] font-semibold leading-snug",
              tone === "dark" ? "text-white" : "text-navy-900 hover:text-royal-700",
            )}
          >
            {faq.question}
            <span
              aria-hidden="true"
              className={cn(
                "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border transition-transform duration-200 group-open:rotate-45",
                tone === "dark" ? "border-white/30" : "border-concrete-400 text-navy-900",
              )}
            >
              <Plus className="size-4" />
            </span>
          </summary>
          <p className={cn("max-w-3xl pb-6 pr-12", tone === "dark" ? "text-white/75" : "text-ink-muted")}>{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
