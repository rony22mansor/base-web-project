"use client";

import { cn } from "@/src/core/utils/utils";
import { FilterChipGroup } from "@/src/shared/components/browse/FilterChipGroup";
import { useTranslations } from "next-intl";
import {
  toCaseOutcomeOptions,
  useCaseScopeOptions,
} from "../config/caseSearchConfig";
import type { CaseScope } from "../enums/caseEnums";

interface CaseSearchFiltersProps {
  scope: CaseScope;
  onScopeChange: (scope: CaseScope) => void;
  /** Distinct outcomes in the current result set. Empty before the first run. */
  outcomes: string[];
  outcomeCounts: Record<string, number>;
  outcome: string | null;
  onOutcomeChange: (outcome: string | null) => void;
}

/**
 * Two rows that do very different things, which is why they are labelled the
 * way they are: scope is a retrieval parameter and re-runs the search on the
 * server, outcome only narrows the set already on screen.
 */
export function CaseSearchFilters({
  scope,
  onScopeChange,
  outcomes,
  outcomeCounts,
  outcome,
  onOutcomeChange,
}: CaseSearchFiltersProps) {
  const t = useTranslations("caseSearch.filters");
  const tBrowse = useTranslations("browse.filters");
  const scopeOptions = useCaseScopeOptions();

  return (
    <>
      {/* No "all" chip here: there is always a threshold in force, so an
          unset state would be a lie about what the server was asked. */}
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label={t("scope")}
      >
        <span className="notion-label me-1 text-[11px]">{t("scope")}</span>

        {scopeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onScopeChange(option.value)}
            aria-pressed={scope === option.value}
            className={cn(
              "duration-120 ease-gentle rounded-sm px-2 py-1 text-xs font-medium transition-colors",
              scope === option.value
                ? "bg-tag-blue text-tag-blue-fg"
                : "bg-tag-gray text-tag-gray-fg hover:bg-accent hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Only meaningful once something has been retrieved. */}
      {outcomes.length > 1 && (
        <FilterChipGroup<string>
          label={t("outcome")}
          allLabel={tBrowse("all")}
          value={outcome}
          onChange={onOutcomeChange}
          options={toCaseOutcomeOptions(outcomes, outcomeCounts)}
        />
      )}
    </>
  );
}
