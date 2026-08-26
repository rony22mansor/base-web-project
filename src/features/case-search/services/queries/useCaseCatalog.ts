"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiInfiniteQuery } from "@/src/core/network/useApiHooks";
import type { CaseCatalogFilters } from "../../types/interfaces/caseInterface";
import { caseCatalogService } from "../caseCatalogService";

/** Cases per page in the browse grid. */
export const CASE_CATALOG_PAGE_SIZE = 20;

/**
 * The browsed cases, paginated. Reads the corpus rather than the RAG index,
 * so this is instant and safe to re-run on every filter change — unlike
 * `useCaseSemanticSearch`, which loads models on a cold server.
 *
 * Infinite rather than a single page: the grid loads further pages as the
 * reader scrolls, the same pattern `useLawArticles` and `useContractBrowse`
 * use for their own catalogs.
 */
export function useCaseCatalog(filters: CaseCatalogFilters) {
  return useApiInfiniteQuery({
    // Every filter is part of the key, so changing one starts a fresh listing.
    queryKey: [
      QUERY_KEYS.CASE_CATALOG,
      filters.crime ?? "",
      filters.outcome ?? "",
      filters.year ?? "",
      filters.q ?? "",
    ],
    queryFn: async ({ pageParam }) => {
      const response = await caseCatalogService.cases({
        ...filters,
        page: pageParam,
        pageSize: CASE_CATALOG_PAGE_SIZE,
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    // The corpus is a static file on the server; nothing invalidates within a
    // session, so a filter the reader returns to loads from cache instantly.
    staleTime: 30 * 60 * 1000,
    retry: false,
  });
}
