"use client";

import { cn } from "@/src/core/utils/utils";
import { ChevronDown, Tags } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { CaseCategory } from "../types/interfaces/caseInterface";

/** Categories shown before the reader asks for the rest. */
const COLLAPSED_COUNT = 12;

/**
 * The crimes the corpus is organised by, as the way into it.
 *
 * These are tags, not a hierarchy: a judgment normally deals with several
 * crimes at once, so the counts add up to far more than the number of cases and
 * every case appears under each of its crimes. That is why picking one filters
 * the list rather than navigating into a section — grouping the corpus under
 * these headings would print the same judgment several times over.
 *
 * The corpus has 57 of them and a long tail of one-case crimes, so only the
 * busiest are shown until the reader expands the rest.
 */
export function CaseCategoryPanel({
  categories,
  value,
  onChange,
}: {
  categories: CaseCategory[];
  /** `null` = no crime filter, i.e. the whole corpus. */
  value: string | null;
  onChange: (crime: string | null) => void;
}) {
  const t = useTranslations("caseSearch.categories");
  const [isExpanded, setIsExpanded] = useState(false);

  if (categories.length === 0) return null;

  // A selection from the long tail has to stay visible while collapsed,
  // otherwise the active filter has no control the reader can switch off.
  const head = categories.slice(0, COLLAPSED_COUNT);
  const isSelectionHidden =
    !!value && !head.some((category) => category.crime === value);

  const shown = isExpanded
    ? categories
    : isSelectionHidden
      ? [...head, ...categories.filter((category) => category.crime === value)]
      : head;

  const hiddenCount = categories.length - shown.length;

  return (
    <section className="flex flex-col gap-2" aria-labelledby="case-categories">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="case-categories"
          className="text-text-secondary flex items-center gap-1.5 text-xs font-medium"
        >
          <Tags className="size-3.5" />
          {t("title", { count: categories.length })}
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-pressed={value === null}
          className={chipClass(value === null)}
        >
          {t("all")}
        </button>

        {shown.map((category) => (
          <button
            key={category.crime}
            type="button"
            onClick={() =>
              onChange(category.crime === value ? null : category.crime)
            }
            aria-pressed={category.crime === value}
            className={chipClass(category.crime === value)}
          >
            {/* Legal content — the crime names are raw Arabic from the corpus
                and are never translated. */}
            <span dir="rtl">{category.crime}</span>
            <span className="ms-1.5 opacity-70 tabular-nums">
              {category.caseCount}
            </span>
          </button>
        ))}

        {(hiddenCount > 0 || isExpanded) && (
          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            aria-expanded={isExpanded}
            className="text-link inline-flex items-center gap-1 px-2 py-1 text-xs font-medium"
          >
            {isExpanded ? t("showLess") : t("showAll", { count: hiddenCount })}
            <ChevronDown
              className={cn(
                "duration-120 ease-gentle size-3.5 transition-transform",
                isExpanded && "rotate-180",
              )}
            />
          </button>
        )}
      </div>
    </section>
  );
}

const chipClass = (isActive: boolean) =>
  cn(
    "duration-120 ease-gentle rounded-sm px-2 py-1 text-xs font-medium transition-colors",
    isActive
      ? "bg-tag-orange text-tag-orange-fg"
      : "bg-tag-gray text-tag-gray-fg hover:bg-accent hover:text-foreground",
  );
