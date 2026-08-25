"use client";

import { useState } from "react";
import { useCaseCatalog } from "../services/queries/useCaseCatalog";

/** Cases per page in the browse grid. Two columns, so an even number. */
const PAGE_SIZE = 10;

/**
 * Drives the browse half of the precedents screen: the whole corpus, narrowed
 * by crime, outcome and year.
 *
 * Every filter is a real request parameter, so the counts the server reports
 * always describe the set actually on screen. That is the opposite of the
 * search half (`useCaseSearchScreen`), whose outcome chips can only re-filter
 * the handful of results retrieval already returned.
 */
export function useCaseBrowseScreen() {
  const [crime, setCrime] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const query = useCaseCatalog({
    crime,
    outcome,
    year,
    page,
    pageSize: PAGE_SIZE,
  });
  const catalog = query.data?.data;

  /** Changing a filter invalidates the current page number. */
  const applyFilter = (apply: () => void) => {
    apply();
    setPage(1);
  };

  return {
    // filters
    crime,
    setCrime: (value: string | null) => applyFilter(() => setCrime(value)),
    outcome,
    setOutcome: (value: string | null) => applyFilter(() => setOutcome(value)),
    year,
    setYear: (value: string | null) => applyFilter(() => setYear(value)),
    clearFilters: () =>
      applyFilter(() => {
        setCrime(null);
        setOutcome(null);
        setYear(null);
      }),
    hasFilters: !!(crime || outcome || year),

    // facets
    categories: catalog?.categories ?? [],
    outcomes: catalog?.availableOutcomes ?? [],
    years: catalog?.availableYears ?? [],

    // data
    cases: catalog?.cases ?? [],
    total: query.isPending ? undefined : catalog?.totalMatched,
    totalCases: catalog?.totalCases ?? 0,

    // paging. The corpus is served in pages rather than appended to, so the
    // grid gets explicit page controls instead of "load more".
    page: catalog?.page ?? page,
    totalPages: catalog?.totalPages ?? 1,
    goToPage: setPage,

    // request state
    isLoading: query.isPending,
    isFetching: query.isFetching,
    isError: query.isError,
    errorMessage: query.error?.message,
    retry: query.refetch,
  };
}
