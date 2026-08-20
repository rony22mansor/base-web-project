"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiInfiniteQuery } from "@/src/core/network/useApiHooks";
import { DEFAULT_PAGE_SIZE } from "@/src/core/types/pagination";
import type { LawSearchParams } from "../../types/dtos";
import { lawSearchService } from "../lawSearchService";

/** Everything that identifies a listing, minus the page cursor. */
export type LawArticlesFilters = Omit<LawSearchParams, "page" | "pageSize">;

/**
 * Browse + semantic search share this one hook, because they are one view:
 * passing a `query` switches the service to the semantic endpoint, and pages
 * are accumulated by React Query rather than in component state.
 */
export function useLawArticles(filters: LawArticlesFilters) {
  return useApiInfiniteQuery({
    // Every filter is part of the key, so changing one starts a fresh listing.
    queryKey: [
      QUERY_KEYS.LAW_SEARCH,
      filters.query ?? "",
      filters.lawId ?? "",
      filters.status ?? "",
    ],
    queryFn: async ({ pageParam }) => {
      const response = await lawSearchService.search({
        ...filters,
        page: pageParam,
        pageSize: DEFAULT_PAGE_SIZE,
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    retry: false,
  });
}
