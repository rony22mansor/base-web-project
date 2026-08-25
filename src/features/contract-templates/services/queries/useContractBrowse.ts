"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiInfiniteQuery } from "@/src/core/network/useApiHooks";
import type { ContractBrowseParams } from "../../types/dtos";
import { contractTemplatesService } from "../contractTemplatesService";

/** Everything that identifies a listing, minus the page cursor. */
export type ContractBrowseFilters = Omit<ContractBrowseParams, "page">;

/** Rows per page. The corpus is 211 templates, so this is four pages of grid. */
const PAGE_SIZE = 24;

/**
 * The browse listing.
 *
 * Infinite rather than paged: this endpoint really does paginate, unlike the
 * semantic one, so "load more" is a genuine next page rather than a re-run of
 * the whole pipeline.
 */
export function useContractBrowse(
  filters: ContractBrowseFilters,
  enabled: boolean,
) {
  return useApiInfiniteQuery({
    // Every filter is part of the key, so changing one starts a fresh listing.
    queryKey: [
      QUERY_KEYS.CONTRACT_TEMPLATES,
      "browse",
      filters.q ?? "",
      filters.category ?? "",
    ],
    queryFn: async ({ pageParam }) => {
      const response = await contractTemplatesService.browse({
        ...filters,
        page: pageParam,
        perPage: PAGE_SIZE,
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled,
    retry: false,
  });
}
