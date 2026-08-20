"use client";

import type { ArticleStatus } from "@/src/core/enums/legalDomain";
import { useState } from "react";
import { useLawArticles } from "../services/queries/useLawArticles";
import { useLawCategories } from "../services/queries/useLawCategories";

/**
 * Drives the single browse + search view. The query is only applied on submit
 * (semantic retrieval is expensive and the wireframe puts it behind a button),
 * whereas filter chips apply immediately.
 *
 * Paging lives in React Query, so there is no accumulated-items state here to
 * fall out of sync with the filters.
 */
export function useLawSearchScreen() {
  const [query, setQuery] = useState("");
  const [lawId, setLawId] = useState<string | null>(null);
  const [status, setStatus] = useState<ArticleStatus | null>(null);

  const articles = useLawArticles({
    query: query || undefined,
    lawId: lawId ?? undefined,
    status: status ?? undefined,
  });

  const categories = useLawCategories();

  const pages = articles.data?.pages ?? [];
  const items = pages.flatMap((page) => page.items);
  const total = pages[0]?.total;

  return {
    // filters
    query,
    lawId,
    status,
    setLawId,
    setStatus,
    search: setQuery,
    clearSearch: () => setQuery(""),

    // data
    items,
    total: articles.isPending ? undefined : total,
    categories: categories.data?.data ?? [],

    // request state
    isLoading: articles.isPending,
    isSearching: articles.isFetching && !articles.isFetchingNextPage,
    isError: articles.isError,
    errorMessage: articles.error?.message,
    retry: articles.refetch,
    hasMore: articles.hasNextPage,
    isLoadingMore: articles.isFetchingNextPage,
    loadMore: articles.fetchNextPage,
  };
}
