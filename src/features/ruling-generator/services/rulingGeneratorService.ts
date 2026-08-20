import { API_ENDPOINTS } from "@/src/core/network/endpoints";
import { apiClient } from "@/src/core/network/axios";
import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import type { GenerateRulingDto } from "../types/dtos";
import type {
  ExtractedDocument,
  RulingResult,
} from "../types/interfaces/rulingInterface";
import {
  mockExtractDocumentText,
  mockGenerateRuling,
} from "./mocks/rulingGeneratorMocks";

/**
 * The Python RAG backend is not up yet, so every call short-circuits to the
 * mocks. Set NEXT_PUBLIC_USE_MOCKS=false in .env.local to hit the real API —
 * the request code below is already written against it.
 */
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

export const rulingGeneratorService = {
  async generate(
    payload: GenerateRulingDto,
  ): Promise<ApiResponse<RulingResult>> {
    if (USE_MOCKS) return mockGenerateRuling(payload);

    const { data } = await apiClient.post<ApiResponse<RulingResult>>(
      API_ENDPOINTS.RULING_GENERATOR.GENERATE,
      payload,
    );
    return data;
  },

  /**
   * Pulls the plain text out of an uploaded .docx. Parsing OOXML in the browser
   * would mean shipping a zip/XML parser, so the backend does it — .txt is read
   * locally instead (see helpers/fileTextExtraction).
   */
  async extractDocumentText(
    file: File,
  ): Promise<ApiResponse<ExtractedDocument>> {
    if (USE_MOCKS) return mockExtractDocumentText(file);

    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post<ApiResponse<ExtractedDocument>>(
      API_ENDPOINTS.RULING_GENERATOR.UPLOAD,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },
};
