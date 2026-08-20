"use client";

import { cn } from "@/src/core/utils/utils";

export interface FilterChipOption<TValue extends string> {
  value: TValue;
  label: string;
  /** Optional trailing count, e.g. how many articles carry this status. */
  count?: number;
}

interface FilterChipGroupProps<TValue extends string> {
  label: string;
  options: FilterChipOption<TValue>[];
  /** `null` means "all" — the reset chip is rendered by this component. */
  value: TValue | null;
  onChange: (value: TValue | null) => void;
  allLabel: string;
}

/**
 * Filter controls weren't specified in the wireframe (see ui-features.md's open
 * questions). Chips were chosen over dropdowns because every filter here has a
 * handful of known values, they stay visible while browsing, and they need no
 * direction-specific positioning in RTL.
 */
export function FilterChipGroup<TValue extends string>({
  label,
  options,
  value,
  onChange,
  allLabel,
}: FilterChipGroupProps<TValue>) {
  const chip = (isActive: boolean) =>
    cn(
      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
      isActive
        ? "border-primary bg-primary text-primary-foreground"
        : "hover:bg-accent text-muted-foreground border-transparent bg-muted",
    );

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="group"
      aria-label={label}
    >
      <span className="text-muted-foreground me-1 text-xs font-semibold">
        {label}
      </span>

      <button
        type="button"
        onClick={() => onChange(null)}
        aria-pressed={value === null}
        className={chip(value === null)}
      >
        {allLabel}
      </button>

      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value === value ? null : option.value)}
          aria-pressed={option.value === value}
          className={chip(option.value === value)}
        >
          {option.label}
          {option.count !== undefined && (
            <span className="ms-1.5 opacity-70 tabular-nums">
              {option.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
