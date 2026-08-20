"use client";

import { CaseCategory } from "@/src/core/enums/legalDomain";
import type { FilterChipOption } from "@/src/shared/components/browse/FilterChipGroup";
import { useTranslations } from "next-intl";
import { CasePeriod } from "../enums/caseEnums";

/**
 * Feature-local config for case search. The search-query schema itself is
 * shared with the other two browse screens and lives in
 * `shared/components/browse/semanticSearchConfig` — only the filter definitions
 * are specific to this feature.
 */

export const CASE_PERIOD_FILTERS: CasePeriod[] = [
  CasePeriod.Recent,
  CasePeriod.Past,
  CasePeriod.Older,
];

/** Category chips, labelled from the shared legal namespace. */
export const useCaseCategoryOptions = (
  counts: Partial<Record<CaseCategory, number>>,
): FilterChipOption<CaseCategory>[] => {
  const t = useTranslations("legal.caseCategory");

  return Object.values(CaseCategory).map((category) => ({
    value: category,
    label: t(category),
    count: counts[category],
  }));
};

/** Date-range preset chips. */
export const useCasePeriodOptions = (): FilterChipOption<CasePeriod>[] => {
  const t = useTranslations("caseSearch.periods");

  return CASE_PERIOD_FILTERS.map((period) => ({
    value: period,
    label: t(period),
  }));
};
