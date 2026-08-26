"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiInfiniteQuery } from "@/src/core/network/useApiHooks";
import type { LawArticlesParams } from "../../types/dtos";
import { lawCatalogService } from "../lawCatalogService";

/** Everything that identifies a law's listing, minus the page cursor. */
export type LawArticlesFilters = Omit<LawArticlesParams, "page" | "pageSize">;

/** Articles per page in the law's list view. */
export const LAW_ARTICLES_PAGE_SIZE = 40;

/**
 * One law's articles, paginated. This is the list view only — the book reader
 * deliberately has no paging and uses `useLawBook` instead.
 */
export function useLawArticles(filters: LawArticlesFilters, enabled = true) {
  return useApiInfiniteQuery({
    // Every filter is part of the key, so changing one starts a fresh listing.
    queryKey: [
      QUERY_KEYS.LAW_ARTICLES,
      filters.lawId,
      filters.status ?? "",
      filters.categoryKey ?? "",
      filters.q ?? "",
    ],
    queryFn: async ({ pageParam }) => {
      const response = await lawCatalogService.articles({
        ...filters,
        page: pageParam,
        pageSize: LAW_ARTICLES_PAGE_SIZE,
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled: enabled && filters.lawId.length > 0,
    retry: false,
  });
}
