"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiQuery } from "@/src/core/network/useApiHooks";
import { contractTemplatesService } from "../contractTemplatesService";

/**
 * Type counts for the filter chips. Cached long — the template library changes
 * rarely, and a filter row that flickers on every visit reads as broken.
 */
export function useContractTemplateTypes() {
  return useApiQuery({
    queryKey: [QUERY_KEYS.CONTRACT_TEMPLATE_CATEGORIES],
    queryFn: () => contractTemplatesService.categories(),
    staleTime: 30 * 60 * 1000,
    retry: false,
  });
}
