"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { selectClasses } from "@/components/forms/fields";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

/**
 * One filter dimension. Chips (with aria-pressed) from 640px up; a native
 * select on phones, where a long row of chips would wrap into a wall.
 */
export function FilterBar({
  label,
  options,
  value,
  onChange,
  allLabel = "All",
  className,
}: {
  label: string;
  options: FilterOption[];
  value: string;
  onChange?: (value: string) => void;
  allLabel?: string;
  className?: string;
}) {
  const selectId = useId();
  const all: FilterOption[] = [{ value: "", label: allLabel }, ...options];

  return (
    <div className={className}>
      <div className="sm:hidden">
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-semibold text-navy-900">
          {label}
        </label>
        <select
          id={selectId}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          className={selectClasses}
        >
          {all.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
              {option.count !== undefined ? ` (${option.count})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div role="group" aria-label={`Filter by ${label.toLowerCase()}`} className="hidden flex-wrap items-center gap-2 sm:flex">
        <span className="mr-1 text-sm font-semibold text-navy-900">{label}</span>
        {all.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange?.(option.value)}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-150",
                active
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-concrete-400 bg-white text-ink hover:border-navy-600 hover:text-navy-900",
              )}
            >
              {option.label}
              {option.count !== undefined ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 text-xs font-semibold tabular-nums",
                    active ? "bg-white/15 text-white" : "bg-concrete-200 text-ink-muted",
                  )}
                >
                  {option.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
