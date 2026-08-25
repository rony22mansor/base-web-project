import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import { apiClient } from "@/src/core/network/axios";
import { API_ENDPOINTS } from "@/src/core/network/endpoints";
import type { SummarizeCaseDto } from "../types/dtos";
import type { CaseSummary } from "../types/interfaces/summaryInterface";
import {
  toCaseSummary,
  type SummarizeResponseDto,
} from "./adapters/summarizationAdapter";

/**
 * Case summarization. Regex and sentence selection only — no neural models, no
 * API key, no warm-up — so unlike every RAG feature this answers immediately
 * and needs no cold-start handling.
 */
export const summarizationService = {
  async summarize(
    payload: SummarizeCaseDto,
  ): Promise<ApiResponse<CaseSummary>> {
    const { data } = await apiClient.post<ApiResponse<SummarizeResponseDto>>(
      API_ENDPOINTS.LEGAL_TOOLS.SUMMARIZE,
      { text: payload.text },
    );

    return { data: toCaseSummary(data.data), succeeded: true };
  },
};
