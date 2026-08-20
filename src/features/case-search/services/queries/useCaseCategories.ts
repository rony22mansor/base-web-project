"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiQuery } from "@/src/core/network/useApiHooks";
import { caseSearchService } from "../caseSearchService";

/**
 * Category counts for the filter chips. Cached long — the corpus changes
 * rarely, and a filter row that flickers on every visit reads as broken.
 */
export function useCaseCategories() {
  return useApiQuery({
    queryKey: [QUERY_KEYS.CASE_CATEGORIES],
    queryFn: () => caseSearchService.categories(),
    staleTime: 30 * 60 * 1000,
    retry: false,
  });
}
