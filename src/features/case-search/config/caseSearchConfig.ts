"use client";

import type { FilterChipOption } from "@/src/shared/components/browse/FilterChipGroup";

/**
 * Feature-local config for case search. The search-query schema itself is
 * shared with the other browse screens and lives in
 * `shared/components/browse/semanticSearchConfig` — only the chips are
 * specific to this feature.
 */

/**
 * Outcome chips, built from the results themselves — the labels are raw
 * Arabic from the corpus, so they are never translated, and the counts come
 * from the set currently on screen.
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
