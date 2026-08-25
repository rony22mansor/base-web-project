"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiMutation } from "@/src/core/network/useApiHooks";
import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import type { LlmPingResult } from "../../types/interfaces/rulingInterface";
import { rulingGeneratorService } from "../rulingGeneratorService";

/**
 * Test the model connection on demand, from the blocked state. A mutation
 * because it is an action the user takes, not data the screen needs.
 */
export function usePingLlm() {
  return useApiMutation<ApiResponse<LlmPingResult>, void>({
    mutationKey: [QUERY_KEYS.JUDGMENT_CONFIG, "ping"],
    mutationFn: () => rulingGeneratorService.pingLlm(),
    retry: false,
  });
}
