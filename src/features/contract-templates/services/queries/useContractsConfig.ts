"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiQuery } from "@/src/core/network/useApiHooks";
import { contractTemplatesService } from "../contractTemplatesService";

/**
 * Warm/cold state and the category counts. Instant even while the index is
 * unloaded, which is what makes it usable as the cold-start warning.
 */
export function useContractsConfig() {
  return useApiQuery({
    queryKey: [QUERY_KEYS.CONTRACT_TEMPLATES_CONFIG],
    queryFn: () => contractTemplatesService.config(),
    staleTime: 0,
    retry: false,
  });
}
