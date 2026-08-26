"use client";

import { FilterChipGroup } from "@/src/shared/components/browse/FilterChipGroup";
import { useTranslations } from "next-intl";
import { toCaseOutcomeOptions } from "../config/caseSearchConfig";

interface CaseSearchFiltersProps {
  /** Distinct outcomes in the current result set. Empty before the first run. */
  outcomes: string[];
  outcomeCounts: Record<string, number>;
  outcome: string | null;
  onOutcomeChange: (outcome: string | null) => void;
}

/**
 * Only re-filters the ranked set already on screen — retrieval itself always
 * runs at the server's default (Balanced) similarity threshold; that used to
 * be a scope chip here and is no longer exposed as a choice.
 */
export function CaseSearchFilters({
  outcomes,
  outcomeCounts,
  outcome,
  onOutcomeChange,
}: CaseSearchFiltersProps) {
  const t = useTranslations("caseSearch.filters");
  const tBrowse = useTranslations("browse.filters");

  // Only meaningful once something has been retrieved.
  if (outcomes.length <= 1) return null;

  return (
    <FilterChipGroup<string>
      label={t("outcome")}
      allLabel={tBrowse("all")}
      value={outcome}
      onChange={onOutcomeChange}
      options={toCaseOutcomeOptions(outcomes, outcomeCounts)}
    />
  );
}
