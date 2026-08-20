"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiQuery } from "@/src/core/network/useApiHooks";
import { lawSearchService } from "../lawSearchService";

/**
 * Parent laws for the filter chips. Cached long — the corpus changes rarely,
 * and a filter row that flickers on every visit reads as broken.
 */
export function useLawCategories() {
  return useApiQuery({
    queryKey: [QUERY_KEYS.LAW_CATEGORIES],
    queryFn: () => lawSearchService.categories(),
    staleTime: 30 * 60 * 1000,
    retry: false,
  });
}
