import type { ReactNode } from "react";
import { ChevronDown, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/** Shared input styling: 16px text (no iOS zoom), 48px tall, clear focus and error states. */
export const inputClasses =
  "block h-12 w-full rounded-sm border border-concrete-500 bg-white px-3.5 text-base text-ink shadow-card " +
  "placeholder:text-ink-subtle hover:border-navy-600 focus:border-royal-700 focus-visible:outline-2 focus-visible:outline-offset-0 " +
  "aria-[invalid=true]:border-danger-700 aria-[invalid=true]:bg-danger-100/30 disabled:cursor-not-allowed disabled:bg-concrete-100";

export const selectClasses = cn(inputClasses, "appearance-none invalid:text-ink-subtle [&>option]:text-ink pr-10");

/** Wraps a native select to draw its arrow (hidden by `appearance-none`) as an icon in the brand navy. */
export function SelectWrap({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-navy-900"
      />
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="flex items-start gap-1.5 text-sm font-medium text-danger-700">
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

export function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-navy-900">
        {label}
        {required ? (
          <span className="text-danger-700" aria-hidden="true">
            {" "}
            *
          </span>
        ) : (
          <span className="font-normal text-ink-subtle"> (optional)</span>
        )}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-sm text-ink-subtle">
          {hint}
        </p>
      ) : null}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

/** aria-describedby for a field: its error when present, otherwise its hint. */
export function describedBy(id: string, { error, hint }: { error?: string; hint?: boolean }) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}
