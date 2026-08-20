import { apiClient } from "@/src/core/network/axios";
import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import { API_ENDPOINTS } from "@/src/core/network/endpoints";
import type { PagedResult } from "@/src/core/types/pagination";
import type { LawSearchParams } from "../types/dtos";
import type { LawArticle, LawCategory } from "../types/interfaces/lawInterface";
import {
  mockGetLawCategories,
  mockSearchLawArticles,
} from "./mocks/lawSearchMocks";

/**
 * The Python backend is not up yet, so every call short-circuits to the mocks.
 * Set NEXT_PUBLIC_USE_MOCKS=false in .env.local to hit the real API — the
 * request code below is already written against it.
 */
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

export const lawSearchService = {
  /**
   * One call serves both modes in the wireframe's single view: with `query`
   * set the backend runs semantic retrieval, without it a filtered browse.
   */
  async search(
    params: LawSearchParams,
  ): Promise<ApiResponse<PagedResult<LawArticle>>> {
    if (USE_MOCKS) return mockSearchLawArticles(params);

    const { query, ...rest } = params;
    const url = query
      ? API_ENDPOINTS.LAW_SEARCH.SEMANTIC
      : API_ENDPOINTS.LAW_SEARCH.LIST;

    const { data } = await apiClient.get<ApiResponse<PagedResult<LawArticle>>>(
      url,
      { params: { ...rest, q: query } },
    );
    return data;
  },

  /** Parent laws, used to build the filter chips. */
  async categories(): Promise<ApiResponse<LawCategory[]>> {
    if (USE_MOCKS) return mockGetLawCategories();

    const { data } = await apiClient.get<ApiResponse<LawCategory[]>>(
      API_ENDPOINTS.LAW_SEARCH.CATEGORIES,
    );
    return data;
  },
};
