import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import { apiClient } from "@/src/core/network/axios";
import { API_ENDPOINTS } from "@/src/core/network/endpoints";
import type { CaseSearchParams } from "../types/dtos";
import type {
  CaseSearchConfig,
  CaseSearchResult,
} from "../types/interfaces/caseInterface";
import {
  toCaseSearchConfig,
  toCaseSearchResult,
  type CasesRagConfigDto,
  type CasesRagRequest,
  type CasesRagResponseDto,
} from "./adapters/casesRagAdapter";

/**
 * Cases RAG — retrieval over past judgments.
 *
 * Search-only by design: the Python side exposes no browse or category route
 * for this corpus, so there is nothing to list until the user has described a
 * set of facts. The screen says so rather than pretending to have a catalog.
 */
export const caseSearchService = {
  /**
   * Find precedents whose facts resemble the submitted ones. Undefined tuning
   * fields are dropped from the JSON body, so the server applies its own
   * defaults — which is what `config()` reports.
   */
  async search(
    params: CaseSearchParams,
  ): Promise<ApiResponse<CaseSearchResult>> {
    const body: CasesRagRequest = {
      text: params.query,
      top_k: params.topK,
      threshold: params.threshold,
      hybrid_top_k: params.hybridTopK,
      rerank_max_length: params.rerankMaxLength,
    };

    const { data } = await apiClient.post<ApiResponse<CasesRagResponseDto>>(
      API_ENDPOINTS.CASE_SEARCH.SEMANTIC,
      body,
    );

    return { data: toCaseSearchResult(data.data), succeeded: true };
  },

  /** Live defaults, the overridable field names, and whether the index is warm. */
  async config(): Promise<ApiResponse<CaseSearchConfig>> {
    const { data } = await apiClient.get<ApiResponse<CasesRagConfigDto>>(
      API_ENDPOINTS.CASE_SEARCH.CONFIG,
    );

    return { data: toCaseSearchConfig(data.data), succeeded: true };
  },
};
