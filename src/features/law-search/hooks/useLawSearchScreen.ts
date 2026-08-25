"use client";

import type { ArticleStatus } from "@/src/core/enums/legalDomain";
import { useMemo, useState } from "react";
import { useLawCatalog } from "../services/queries/useLawCatalog";
import { useLawSemanticSearch } from "../services/queries/useLawSemanticSearch";
import type { Law } from "../types/interfaces/lawInterface";

/**
 * Chip value standing in for the thirteen laws whose group is `null`. `null`
 * is a real corpus value there, not missing data, so it needs a selectable
 * identity of its own — and the backend has no filter for it, which is the
 * other reason grouping is applied here rather than in the request.
 */
export const UNGROUPED = "__ungrouped__";

/**
 * Drives the law screen, which is two modes of one view:
 *
 * - no query → the laws catalog (instant, reads the corpus file)
 * - a query  → semantic retrieval over articles (~45s cold, seconds warm)
 *
 * The query only applies on submit, whereas filter chips apply immediately.
 * Catalog filtering is client-side: it is 25 rows already in memory, so
 * chip-per-request would be slower and would still not express "ungrouped".
 */
export function useLawSearchScreen() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState("");
  const [status, setStatus] = useState<ArticleStatus | null>(null);

  const isSearchMode = query.length > 0;

  const catalog = useLawCatalog();
  const search = useLawSemanticSearch({
    query: query || undefined,
    status: status ?? undefined,
  });

  const allLaws = useMemo(() => catalog.data?.data.laws ?? [], [catalog.data]);

  const laws = useMemo(() => {
    const needle = nameFilter.trim().toLowerCase();

    return allLaws.filter((law) => {
      if (group !== null && groupIdOf(law) !== group) return false;
      if (!needle) return true;
      return matchesName(law, needle);
    });
  }, [allLaws, group, nameFilter]);

  const pages = search.data?.pages ?? [];
  const articles = pages.flatMap((page) => page.items);

  return {
    // mode
    isSearchMode,

    // filters
    query,
    group,
    nameFilter,
    status,
    setGroup,
    setNameFilter,
    setStatus,
    search: setQuery,
    clearSearch: () => setQuery(""),

    // catalog data
    laws,
    groups: catalog.data?.data.groups ?? [],
    totalArticles: catalog.data?.data.totalArticles ?? 0,

    // search data
    articles,

    // the summary line counts whichever mode is showing
    total: isSearchMode
      ? search.isPending
        ? undefined
        : articles.length
      : catalog.isPending
        ? undefined
        : laws.length,

    // request state, taken from whichever query is driving the view
    isLoading: isSearchMode ? search.isPending : catalog.isPending,
    isSearching: isSearchMode
      ? search.isFetching && !search.isFetchingNextPage
      : catalog.isFetching,
    isError: isSearchMode ? search.isError : catalog.isError,
    errorMessage: isSearchMode
      ? search.error?.message
      : catalog.error?.message,
    retry: isSearchMode ? search.refetch : catalog.refetch,
    hasMore: isSearchMode && search.hasNextPage,
    isLoadingMore: search.isFetchingNextPage,
    loadMore: search.fetchNextPage,
  };
}

/** A law's chip value: its group, or the sentinel for the ungrouped ones. */
export const groupIdOf = (law: Law): string => law.group ?? UNGROUPED;

/** Same fields the backend's own `?q=` matches, minus the id we never show. */
const matchesName = (law: Law, needle: string): boolean =>
  law.name.toLowerCase().includes(needle) ||
  (law.shortName?.toLowerCase().includes(needle) ?? false);
