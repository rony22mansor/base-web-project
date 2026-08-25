"use client";

import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiMutation } from "@/src/core/network/useApiHooks";
import type { PredictJudgmentDto } from "../../types/dtos";
import type { JudgmentPrediction } from "../../types/interfaces/rulingInterface";
import { rulingGeneratorService } from "../rulingGeneratorService";

/**
 * One prediction run. A mutation rather than a query: it is expensive, it is
 * never re-run on its own, and it must fire only when the user asks.
 */
export function usePredictJudgment() {
  return useApiMutation<ApiResponse<JudgmentPrediction>, PredictJudgmentDto>({
    mutationKey: [QUERY_KEYS.RULING_GENERATOR],
    mutationFn: (payload) => rulingGeneratorService.predict(payload),
    // 40-90s of work — a silent automatic retry would double the wait and
    // spend a second LLM budget without the user knowing.
    retry: false,
  });
}
