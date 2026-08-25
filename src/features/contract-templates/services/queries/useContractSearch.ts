"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiQuery } from "@/src/core/network/useApiHooks";
import type { ContractSearchParams } from "../../types/dtos";
import { contractTemplatesService } from "../contractTemplatesService";

/**
 * Template candidates. Disabled until there is a query — the corpus has no
 * browse route, so there is nothing to show without one.
 */
export function useContractSearch(params: ContractSearchParams) {
  return useApiQuery({
    queryKey: [
      QUERY_KEYS.CONTRACT_TEMPLATES,
      params.query,
      params.suggest ?? true,
    ],
    queryFn: () => contractTemplatesService.search(params),
    enabled: params.query.length > 0,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}
