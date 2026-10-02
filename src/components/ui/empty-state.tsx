import type { ReactNode } from "react";
import { SearchX } from "lucide-react";

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-sm border border-dashed border-concrete-400 bg-concrete-50 px-6 py-14 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-concrete-200 text-ink-muted">
        <SearchX className="size-6" aria-hidden="true" />
      </span>
      <p className="mt-4 font-heading text-h4 text-navy-900">{title}</p>
      {children ? <div className="mt-2 max-w-md text-ink-muted">{children}</div> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
