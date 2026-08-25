"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiQuery } from "@/src/core/network/useApiHooks";
import { rulingGeneratorService } from "../rulingGeneratorService";

/**
 * Feature availability, fetched when the screen opens.
 *
 * `ready: false` means no LLM key is set and every prediction would fail after
 * a long wait, so the screen blocks up front and shows the server's own Arabic
 * `blocking_reason` instead.
 */
export function useJudgmentConfig() {
  return useApiQuery({
    queryKey: [QUERY_KEYS.JUDGMENT_CONFIG],
    queryFn: () => rulingGeneratorService.config(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
