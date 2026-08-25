"use client";

import { FilterChipGroup } from "@/src/shared/components/browse/FilterChipGroup";
import { useTranslations } from "next-intl";

/**
 * Outcome and year, for the browse grid.
 *
 * Both are real request parameters — unlike the outcome chips on the search
 * side, which can only narrow the handful of hits retrieval already returned.
 * The values come from the server's own facet lists rather than from the page
 * on screen, so a filter never disappears just because this page happens not
 * to contain it.
 */
export function CaseBrowseFilters({
  outcomes,
  outcome,
  onOutcomeChange,
  years,
  year,
  onYearChange,
  hasFilters,
  onClear,
}: {
  outcomes: string[];
  outcome: string | null;
  onOutcomeChange: (outcome: string | null) => void;
  years: string[];
  year: string | null;
  onYearChange: (year: string | null) => void;
  hasFilters: boolean;
  onClear: () => void;
}) {
  const t = useTranslations("caseSearch.filters");
  const tBrowse = useTranslations("browse.filters");

  return (
    <>
      {outcomes.length > 1 && (
        <FilterChipGroup<string>
          label={t("outcome")}
          allLabel={tBrowse("all")}
          value={outcome}
          onChange={onOutcomeChange}
          // Legal content — outcome wording is raw Arabic from the corpus.
          options={outcomes.map((value) => ({ value, label: value }))}
        />
      )}

      {years.length > 1 && (
        <FilterChipGroup<string>
          label={t("year")}
          allLabel={tBrowse("all")}
          value={year}
          onChange={onYearChange}
          options={years.map((value) => ({ value, label: value }))}
        />
      )}

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="text-link w-fit text-xs font-medium"
        >
          {t("clearAll")}
        </button>
      )}
    </>
  );
}
