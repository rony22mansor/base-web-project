import { apiClient } from "@/src/core/network/axios";
import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import { API_ENDPOINTS } from "@/src/core/network/endpoints";
import type { PagedResult } from "@/src/core/types/pagination";
import type { ContractTemplateSearchParams } from "../types/dtos";
import type {
  ContractTemplate,
  ContractTemplateTypeCount,
} from "../types/interfaces/contractTemplateInterface";
import {
  mockGetContractTemplateTypes,
  mockSearchContractTemplates,
} from "./mocks/contractTemplatesMocks";

/**
 * The Python backend is not up yet, so every call short-circuits to the mocks.
 * Set NEXT_PUBLIC_USE_MOCKS=false in .env.local to hit the real API — the
 * request code below is already written against it.
 */
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

export const contractTemplatesService = {
  /**
   * One call serves both modes in the wireframe's single view: with `query`
   * set the backend runs semantic retrieval, without it a filtered browse.
   */
  async search(
    params: ContractTemplateSearchParams,
  ): Promise<ApiResponse<PagedResult<ContractTemplate>>> {
    if (USE_MOCKS) return mockSearchContractTemplates(params);

    const { query, ...rest } = params;
    const url = query
      ? API_ENDPOINTS.CONTRACT_TEMPLATES.SEMANTIC
      : API_ENDPOINTS.CONTRACT_TEMPLATES.LIST;

    const { data } = await apiClient.get<
      ApiResponse<PagedResult<ContractTemplate>>
    >(url, { params: { ...rest, q: query } });
    return data;
  },

  /** Template-type counts, used to build the filter chips. */
  async categories(): Promise<ApiResponse<ContractTemplateTypeCount[]>> {
    if (USE_MOCKS) return mockGetContractTemplateTypes();

    const { data } = await apiClient.get<
      ApiResponse<ContractTemplateTypeCount[]>
    >(API_ENDPOINTS.CONTRACT_TEMPLATES.CATEGORIES);
    return data;
  },
};
