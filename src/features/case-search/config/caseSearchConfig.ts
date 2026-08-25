"use client";

import type { FilterChipOption } from "@/src/shared/components/browse/FilterChipGroup";
import { useTranslations } from "next-intl";
import { CaseScope } from "../enums/caseEnums";

/**
 * Feature-local config for case search. The search-query schema itself is
 * shared with the other browse screens and lives in
 * `shared/components/browse/semanticSearchConfig` — only the chips are
 * specific to this feature.
 */

export const CASE_SCOPES: CaseScope[] = [
  CaseScope.Strict,
  CaseScope.Balanced,
  CaseScope.Broad,
];

/** How wide the retrieval casts. A real request parameter, see `caseRetrieval`. */
export const useCaseScopeOptions = (): FilterChipOption<CaseScope>[] => {
  const t = useTranslations("caseSearch.scopes");

  return CASE_SCOPES.map((scope) => ({
    value: scope,
    label: t(scope),
  }));
};

/**
 * Outcome chips. Unlike the scope chips these are built from the results
 * themselves — the labels are raw Arabic from the corpus, so they are never
 * translated, and the counts come from the set currently on screen.
 */
export const toCaseOutcomeOptions = (
  outcomes: string[],
  counts: Record<string, number>,
): FilterChipOption<string>[] =>
  outcomes.map((outcome) => ({
    value: outcome,
    label: outcome,
    count: counts[outcome],
  }));
