"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiQuery } from "@/src/core/network/useApiHooks";
import { lawSearchService } from "../lawSearchService";

/**
 * جتهاد-only retrieval via the legacy endpoint. A plain query rather than an
 * infinite one: it feeds a single list, not a paged grid, so there is no
 * "page" shape to fake `hasMore` around.
 *
 * Disabled until there is a query, same reasoning as `useLawSemanticSearch`:
 * firing a ~30s cold FAISS load for an empty result would be the worst
 * default.
 */
export function useLawJurisprudenceSearch(query: string) {
  return useApiQuery({
    queryKey: [QUERY_KEYS.LAW_SEARCH_JURISPRUDENCE, query],
    queryFn: () => lawSearchService.searchJurisprudence(query),
    enabled: !!query,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}
