import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import { apiClient } from "@/src/core/network/axios";
import { API_ENDPOINTS } from "@/src/core/network/endpoints";
import { JudgmentMode } from "../enums/rulingEnums";
import type { JudgmentConfigOverrides, PredictJudgmentDto } from "../types/dtos";
import type {
  JudgmentConfig,
  JudgmentPrediction,
  LlmPingResult,
} from "../types/interfaces/rulingInterface";
import {
  toJudgmentConfig,
  toJudgmentPrediction,
  toLlmPingResult,
  type JudgmentConfigDto,
  type JudgmentPredictionDto,
  type LlmPingDto,
} from "./adapters/judgmentAdapter";

/**
 * Judgment prediction — the slowest path in the project. It runs both
 * retrieval pipelines, the statistical classifier and up to five LLM calls, so
 * a request takes 40–90s on CPU. The axios client's 120s timeout is what makes
 * that survivable; nothing here should be given a shorter one.
 */

/**
 * The two stages the mode toggle controls. Thorough sends no overrides at all,
 * so the server's own defaults apply and stay authoritative — hard-coding
 * `true` here would silently pin the UI to today's defaults.
 */
const modeToConfig = (mode: JudgmentMode): JudgmentConfigOverrides =>
  mode === JudgmentMode.Fast
    ? { use_fact_reorganization: false, use_statute_discrimination: false }
    : {};

export const rulingGeneratorService = {
  /**
   * Predict a preliminary ruling from a description of the facts.
   *
   * On 502 the model returned unparseable output; the error body still carries
   * `data.evidence`, so a caller could show the retrieved context — the axios
   * interceptor keeps the whole body on the rejection for that reason.
   */
  async predict(
    payload: PredictJudgmentDto,
  ): Promise<ApiResponse<JudgmentPrediction>> {
    const { data } = await apiClient.post<ApiResponse<JudgmentPredictionDto>>(
      API_ENDPOINTS.RULING_GENERATOR.PREDICT,
      { text: payload.text, config: modeToConfig(payload.mode) },
    );

    return { data: toJudgmentPrediction(data.data), succeeded: true };
  },

  /** Feature availability, read before the screen opens. Instant. */
  async config(): Promise<ApiResponse<JudgmentConfig>> {
    const { data } = await apiClient.get<ApiResponse<JudgmentConfigDto>>(
      API_ENDPOINTS.RULING_GENERATOR.CONFIG,
    );

    return { data: toJudgmentConfig(data.data), succeeded: true };
  },

  /**
   * A few-token round trip to the model. Separates a bad key or an unreachable
   * provider from a retrieval failure, so the screen can say which one broke
   * without spending a minute finding out.
   */
  async pingLlm(): Promise<ApiResponse<LlmPingResult>> {
    const { data } = await apiClient.get<ApiResponse<LlmPingDto>>(
      API_ENDPOINTS.RULING_GENERATOR.LLM_PING,
    );

    return { data: toLlmPingResult(data.data), succeeded: true };
  },
};
