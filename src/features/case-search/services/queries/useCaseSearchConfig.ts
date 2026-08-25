"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiQuery } from "@/src/core/network/useApiHooks";
import { caseSearchService } from "../caseSearchService";

/**
 * Server defaults and warm/cold state, fetched once when the screen opens.
 *
 * It is instant even while the RAG models are unloaded, which is the point:
 * `loaded: false` tells the screen to warn that the first search takes about a
 * minute, instead of showing a spinner that looks stuck.
 */
export function useCaseSearchConfig() {
  return useApiQuery({
    queryKey: [QUERY_KEYS.CASE_SEARCH_CONFIG],
    queryFn: () => caseSearchService.config(),
    // Stale as soon as a search runs — that search is what warms the index.
    staleTime: 0,
    retry: false,
  });
}
