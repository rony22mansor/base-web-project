import { apiClient } from "@/src/core/network/axios";
import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import { API_ENDPOINTS } from "@/src/core/network/endpoints";
import type { PagedResult } from "@/src/core/types/pagination";
import type { CaseSearchParams } from "../types/dtos";
import type {
  CaseCategoryCount,
  LegalCase,
} from "../types/interfaces/caseInterface";
import {
  mockGetCaseCategories,
  mockSearchCases,
} from "./mocks/caseSearchMocks";

/**
 * The Python backend is not up yet, so every call short-circuits to the mocks.
 * Set NEXT_PUBLIC_USE_MOCKS=false in .env.local to hit the real API — the
 * request code below is already written against it.
 */
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

export const caseSearchService = {
  /**
   * One call serves both modes in the wireframe's single view: with `query`
   * set the backend runs semantic retrieval, without it a filtered browse.
   */
  async search(
    params: CaseSearchParams,
  ): Promise<ApiResponse<PagedResult<LegalCase>>> {
    if (USE_MOCKS) return mockSearchCases(params);

    const { query, ...rest } = params;
    const url = query
      ? API_ENDPOINTS.CASE_SEARCH.SEMANTIC
      : API_ENDPOINTS.CASE_SEARCH.LIST;

    const { data } = await apiClient.get<ApiResponse<PagedResult<LegalCase>>>(
      url,
      { params: { ...rest, q: query } },
    );
    return data;
  },

  /** Category counts, used to build the filter chips. */
  async categories(): Promise<ApiResponse<CaseCategoryCount[]>> {
    if (USE_MOCKS) return mockGetCaseCategories();

    const { data } = await apiClient.get<ApiResponse<CaseCategoryCount[]>>(
      API_ENDPOINTS.CASE_SEARCH.CATEGORIES,
    );
    return data;
  },
};
