"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { inputClasses } from "@/components/forms/fields";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { FAQ } from "@/types/content";
import { FAQAccordion } from "./faq-accordion";

export interface FAQGroup {
  id: string;
  label: string;
  faqs: FAQ[];
}

/** Categorised FAQs with jump links and an instant text search. */
export function FAQExplorer({ groups }: { groups: FAQGroup[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const visible = groups
    .map((group) => ({
      ...group,
      faqs: q ? group.faqs.filter((faq) => `${faq.question} ${faq.answer}`.toLowerCase().includes(q)) : group.faqs,
    }))
    .filter((group) => group.faqs.length > 0);
  const total = visible.reduce((sum, group) => sum + group.faqs.length, 0);

  return (
    <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
      {/* min-w-0: on phones the chip row scrolls inside the column instead of widening the page. */}
      <nav aria-label="FAQ categories" className="min-w-0 lg:sticky lg:top-28 lg:self-start">
        <p className="eyebrow text-royal-700">Categories</p>
        <ul className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0">
          {groups.map((group) => (
            <li key={group.id} className="shrink-0">
              <a
                href={`#${group.id}`}
                className="flex min-h-10 items-center whitespace-nowrap rounded-full border border-concrete-300 px-4 text-sm font-medium text-navy-900 hover:border-navy-600 lg:rounded-sm lg:border-0 lg:px-3 lg:hover:bg-concrete-100"
              >
                {group.label}
                <span className="ml-2 text-xs text-ink-subtle">{group.faqs.length}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0">
        <label htmlFor="faq-search" className="sr-only">
          Search the FAQs
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-ink-subtle" aria-hidden="true" />
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search, e.g. warranty, cost, bathroom"
            className={cn(inputClasses, "pl-11")}
          />
        </div>
        <p role="status" className="mt-3 min-h-5 text-sm text-ink-muted">
          {q ? `${total} matching ${total === 1 ? "answer" : "answers"}` : ""}
        </p>

        {visible.map((group) => (
          <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`} className="mt-8 first-of-type:mt-4">
            <h2 id={`${group.id}-title`} className="text-h3">
              {group.label}
            </h2>
            <FAQAccordion faqs={group.faqs} openAll={Boolean(q)} className="mt-4" />
          </section>
        ))}

        {total === 0 ? (
          <div className="mt-6">
            <EmptyState title="No answers match that search">Try a different word, or ask us directly — we reply quickly.</EmptyState>
          </div>
        ) : null}
      </div>
    </div>
  );
}
