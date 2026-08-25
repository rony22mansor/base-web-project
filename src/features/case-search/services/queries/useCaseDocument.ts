"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiQuery } from "@/src/core/network/useApiHooks";
import { caseCatalogService } from "../caseCatalogService";

/**
 * One judgment in full. The catalog list carries only a 200-character preview,
 * so the body is fetched when the reader actually opens a case rather than for
 * every row of the grid.
 */
export function useCaseDocument(caseNumber: string | null) {
  return useApiQuery({
    queryKey: [QUERY_KEYS.CASE_DOCUMENT, caseNumber ?? ""],
    queryFn: () => caseCatalogService.case(caseNumber as string),
    enabled: !!caseNumber,
    staleTime: 30 * 60 * 1000,
    retry: false,
  });
}
