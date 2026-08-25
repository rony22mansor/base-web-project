import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import { apiClient } from "@/src/core/network/axios";
import { API_ENDPOINTS } from "@/src/core/network/endpoints";
import type { PagedResult } from "@/src/core/types/pagination";
import type { LawSearchParams } from "../types/dtos";
import type { LawArticle } from "../types/interfaces/lawInterface";
import {
  toPagedResult,
  type LawsRagRequest,
  type LawsRagResponseDto,
} from "./adapters/lawsRagAdapter";

/**
 * Retrieval params sent with every semantic search. The server has its own
 * defaults in .env (LAWS_*); anything set here overrides them per request.
 */
const RAG_PARAMS: Omit<LawsRagRequest, "text"> = {
  with_dependencies: true,
  dep_depth: 2,
  dep_max: 12,
  // The drawer lists linked articles under the hit that cites them, so an
  // article that is itself a hit would otherwise be printed twice on screen.
  dep_dedupe_vs_hits: true,
};

export const lawSearchService = {
  /**
   * Semantic retrieval over the articles of every law. Browsing the corpus is
   * a different thing entirely — see `lawCatalogService`, which reads the
   * JSONL file server-side and costs nothing.
   */
  async search(
    params: LawSearchParams,
  ): Promise<ApiResponse<PagedResult<LawArticle>>> {
    const { query, pageSize, status } = params;

    const body: LawsRagRequest = {
      text: query ?? "",
      top_n: pageSize,
      // The status chip is the only filter the RAG endpoint understands.
      exclude_repealed: status === "repealed" ? false : undefined,
      ...RAG_PARAMS,
    };

    const { data } = await apiClient.post<ApiResponse<LawsRagResponseDto>>(
      API_ENDPOINTS.LAW_SEARCH.SEMANTIC,
      body,
    );

    return { data: toPagedResult(data.data, pageSize), succeeded: true };
  },
};
