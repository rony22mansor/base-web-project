"use client";

import type { CaseCategory } from "@/src/core/enums/legalDomain";
import { useState } from "react";
import type { CasePeriod } from "../enums/caseEnums";
import { periodToDateRange } from "../helpers/casePeriod";
import { useCaseCategories } from "../services/queries/useCaseCategories";
import { useCases } from "../services/queries/useCases";

/**
 * Drives the single browse + search view. The query is only applied on submit
 * (semantic retrieval is expensive and the wireframe puts it behind a button),
 * whereas filter chips apply immediately.
 *
 * Paging lives in React Query, so there is no accumulated-items state here to
 * fall out of sync with the filters.
 */
export function useCaseSearchScreen() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CaseCategory | null>(null);
  const [period, setPeriod] = useState<CasePeriod | null>(null);

  const cases = useCases({
    query: query || undefined,
    category: category ?? undefined,
    ...periodToDateRange(period),
  });

  const categories = useCaseCategories();

  const pages = cases.data?.pages ?? [];
  const items = pages.flatMap((page) => page.items);
  const total = pages[0]?.total;

  // Shaped for the chip options, which want a lookup rather than a list.
  const categoryCounts = Object.fromEntries(
    (categories.data?.data ?? []).map((entry) => [entry.category, entry.count]),
  ) as Partial<Record<CaseCategory, number>>;

  return {
    // filters
    query,
    category,
    period,
    setCategory,
    setPeriod,
    search: setQuery,
    clearSearch: () => setQuery(""),
    categoryCounts,

    // data
    items,
    total: cases.isPending ? undefined : total,

    // request state
    isLoading: cases.isPending,
    isSearching: cases.isFetching && !cases.isFetchingNextPage,
    isError: cases.isError,
    errorMessage: cases.error?.message,
    retry: cases.refetch,
    hasMore: cases.hasNextPage,
    isLoadingMore: cases.isFetchingNextPage,
    loadMore: cases.fetchNextPage,
  };
}
