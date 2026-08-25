"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiInfiniteQuery } from "@/src/core/network/useApiHooks";
import { DEFAULT_PAGE_SIZE } from "@/src/core/types/pagination";
import type { LawSearchParams } from "../../types/dtos";
import { lawSearchService } from "../lawSearchService";

/** A semantic query plus its filters, minus the page cursor. */
export type LawSemanticFilters = Omit<LawSearchParams, "page" | "pageSize">;

/**
 * Semantic retrieval. Disabled until there is a query — with none, the screen
 * shows the laws catalog instead, and firing a ~45s model load to render an
 * empty grid would be the worst possible default.
 *
 * Still an infinite query even though retrieval returns one ranked set: the
 * grid is shared with the catalog views, and the adapter simply reports
 * `hasMore: false` so "load more" never appears.
 */
export function useLawSemanticSearch(filters: LawSemanticFilters) {
  return useApiInfiniteQuery({
    queryKey: [
      QUERY_KEYS.LAW_SEARCH,
      filters.query ?? "",
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
    enabled: !!filters.query,
    // Retrieval is expensive; don't redo it because a tab regained focus.
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}
