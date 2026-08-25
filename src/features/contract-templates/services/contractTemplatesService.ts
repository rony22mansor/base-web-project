import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import { apiClient } from "@/src/core/network/axios";
import { API_ENDPOINTS } from "@/src/core/network/endpoints";
import type {
  ContractBrowseParams,
  ContractSearchParams,
} from "../types/dtos";
import type {
  ContractBrowseResult,
  ContractSearchResult,
  ContractTemplate,
  ContractsConfig,
} from "../types/interfaces/contractTemplateInterface";
import {
  toContractBrowseResult,
  toContractSearchResult,
  toContractTemplate,
  toContractsConfig,
  type ContractBrowseResponseDto,
  type ContractDocumentDto,
  type ContractSearchRequest,
  type ContractSearchResponseDto,
  type ContractsConfigDto,
} from "./adapters/contractsRagAdapter";

/**
 * Contract templates — a two-step flow.
 *
 * `search` returns candidates carrying a `doc_id` but no body, because the
 * bodies are long and the user only ever opens one. `document` then fetches the
 * chosen template's text and its placeholder list, which is what the editor
 * fills in.
 */
export const contractTemplatesService = {
  /**
   * Browse the corpus. Substring and category filters only — no embedding, no
   * ranking — which is why this is what the grid calls until the user actually
   * describes what they want.
   *
   * Axios drops `undefined` params, so absent filters simply fall away and the
   * server applies its own defaults.
   */
  async browse(
    params: ContractBrowseParams = {},
  ): Promise<ApiResponse<ContractBrowseResult>> {
    const { data } = await apiClient.get<ApiResponse<ContractBrowseResponseDto>>(
      API_ENDPOINTS.CONTRACT_TEMPLATES.LIST,
      {
        params: {
          q: params.q || undefined,
          category: params.category || undefined,
          page: params.page,
          per_page: params.perPage,
        },
      },
    );

    return { data: toContractBrowseResult(data.data), succeeded: true };
  },

  async search(
    params: ContractSearchParams,
  ): Promise<ApiResponse<ContractSearchResult>> {
    const body: ContractSearchRequest = {
      text: params.query,
      top_k: params.topK,
      min_score: params.minScore,
      suggest: params.suggest,
    };

    const { data } = await apiClient.post<
      ApiResponse<ContractSearchResponseDto>
    >(API_ENDPOINTS.CONTRACT_TEMPLATES.SEMANTIC, body);

    return { data: toContractSearchResult(data.data), succeeded: true };
  },

  /**
   * One full template.
   *
   * Sent as a POST body rather than in the path: doc ids contain a `#`
   * ("390277833119024#2"), and the GET form additionally cannot address a
   * template whose id collides with the `config` route.
   */
  async document(docId: string): Promise<ApiResponse<ContractTemplate>> {
    const { data } = await apiClient.post<ApiResponse<ContractDocumentDto>>(
      API_ENDPOINTS.CONTRACT_TEMPLATES.DOCUMENT,
      { doc_id: docId },
    );

    return { data: toContractTemplate(data.data), succeeded: true };
  },

  /** Warm/cold state and, once warm, the category → count map. */
  async config(): Promise<ApiResponse<ContractsConfig>> {
    const { data } = await apiClient.get<ApiResponse<ContractsConfigDto>>(
      API_ENDPOINTS.CONTRACT_TEMPLATES.CONFIG,
    );

    return { data: toContractsConfig(data.data), succeeded: true };
  },
};
