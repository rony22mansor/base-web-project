import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import { apiClient } from "@/src/core/network/axios";
import { API_ENDPOINTS } from "@/src/core/network/endpoints";
import type { ClassifyCaseDto } from "../types/dtos";
import type { CrimeClassification } from "../types/interfaces/classificationInterface";
import {
  toCrimeClassification,
  type ClassifyResponseDto,
} from "./adapters/classificationAdapter";

/**
 * Crime classification. A pre-fitted SVM over TF-IDF features — instant, and
 * independent of every model the RAG features load.
 */
export const classificationService = {
  async classify(
    payload: ClassifyCaseDto,
  ): Promise<ApiResponse<CrimeClassification>> {
    const { data } = await apiClient.post<ApiResponse<ClassifyResponseDto>>(
      API_ENDPOINTS.LEGAL_TOOLS.CLASSIFY,
      // The endpoint reads `facts`; `text` would be rejected.
      { facts: payload.facts },
    );

    return { data: toCrimeClassification(data.data), succeeded: true };
  },
};
