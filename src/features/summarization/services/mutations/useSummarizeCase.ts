"use client";

import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiMutation } from "@/src/core/network/useApiHooks";
import type { SummarizeCaseDto } from "../../types/dtos";
import type { CaseSummary } from "../../types/interfaces/summaryInterface";
import { summarizationService } from "../summarizationService";

/** One summarization run. A mutation: it fires only when the user submits. */
export function useSummarizeCase() {
  return useApiMutation<ApiResponse<CaseSummary>, SummarizeCaseDto>({
    mutationKey: [QUERY_KEYS.SUMMARIZE],
    mutationFn: (payload) => summarizationService.summarize(payload),
    retry: false,
  });
}
