import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import { apiClient } from "@/src/core/network/axios";
import { API_ENDPOINTS } from "@/src/core/network/endpoints";
import type {
  CaseCatalog,
  CaseCatalogParams,
  CaseDocument,
} from "../types/interfaces/caseInterface";
import {
  toCaseCatalog,
  toCaseDocument,
  type CaseDocumentDto,
  type CasesCatalogResponseDto,
} from "./adapters/casesCatalogAdapter";

/**
 * Browsing the judgments corpus, as opposed to retrieving from it. These read
 * the corpus server-side — no FAISS, no reranker — so they answer immediately
 * even while the RAG index is still cold, and they are what every navigation
 * path should use. `caseSearchService.search` is reserved for actual questions
 * about facts, which cost ~45s on a cold server.
 */
export const caseCatalogService = {
  /** One page of cases, plus the crime/outcome/year facets. */
  async cases(
    params: CaseCatalogParams = {},
  ): Promise<ApiResponse<CaseCatalog>> {
    const { data } = await apiClient.get<ApiResponse<CasesCatalogResponseDto>>(
      API_ENDPOINTS.CASE_CATALOG.CASES,
      { params: toQuery(params) },
    );

    return { data: toCaseCatalog(data.data), succeeded: true };
  },

  /** One judgment in full, by the court's case number. */
  async case(caseNumber: string): Promise<ApiResponse<CaseDocument>> {
    const { data } = await apiClient.get<ApiResponse<CaseDocumentDto>>(
      API_ENDPOINTS.CASE_CATALOG.CASE(caseNumber),
    );

    return { data: toCaseDocument(data.data), succeeded: true };
  },
};

/**
 * Axios drops `undefined` params, so an unset filter simply falls away and the
 * server applies its own default. `null` is the UI's "all", which means the
 * same thing to the server as sending nothing at all.
 */
const toQuery = (params: CaseCatalogParams): Record<string, unknown> => ({
  crime: params.crime || undefined,
  outcome: params.outcome || undefined,
  year: params.year || undefined,
  q: params.q || undefined,
  page: params.page,
  per_page: params.pageSize,
});
