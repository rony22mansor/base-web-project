"use client";

import { useState } from "react";
import { useCaseCatalog } from "../services/queries/useCaseCatalog";

/**
 * Drives the browse half of the precedents screen: the whole corpus, narrowed
 * by crime, outcome and year, loaded a page at a time as the reader scrolls.
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

  const query = useCaseCatalog({ crime, outcome, year });
  const pages = query.data?.pages ?? [];
  // The facets are identical on every page of the same filter set — the
  // server repeats them rather than paginating them — so the first page is
  // enough and there is no "current page" of facets to reconcile.
  const firstPage = pages[0];

  return {
    // filters
    crime,
    setCrime,
    outcome,
    setOutcome,
    year,
    setYear,
    clearFilters: () => {
      setCrime(null);
      setOutcome(null);
      setYear(null);
    },
    hasFilters: !!(crime || outcome || year),

    // facets
    categories: firstPage?.categories ?? [],
    outcomes: firstPage?.availableOutcomes ?? [],
    years: firstPage?.availableYears ?? [],

    // data
    cases: pages.flatMap((page) => page.cases),
    total: query.isPending ? undefined : firstPage?.totalMatched,
    totalCases: firstPage?.totalCases ?? 0,

    // paging — the grid loads the next page itself as the reader scrolls to
    // the end of the current one, rather than a page-number control.
    hasMore: query.hasNextPage,
    isLoadingMore: query.isFetchingNextPage,
    loadMore: query.fetchNextPage,

    // request state
    isLoading: query.isPending,
    isFetching: query.isFetching,
    isError: query.isError,
    errorMessage: query.error?.message,
    retry: query.refetch,
  };
}
