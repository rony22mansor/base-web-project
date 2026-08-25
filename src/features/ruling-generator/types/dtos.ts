import type { JudgmentMode } from "../enums/rulingEnums";

/**
 * Request for `POST /api/legal/judgment/predict`.
 *
 * `text` is the only top-level field the endpoint reads — every tuning value
 * goes inside `config`, and anything sent at the root is silently ignored.
 * The server enforces a 20-character minimum on `text`.
 */
export interface PredictJudgmentDto {
  text: string;
  /**
   * How much of the optional pipeline to run. Translated into `config` flags
   * by the service — see `modeToConfig`.
   */
  mode: JudgmentMode;
}

/**
 * The subset of `tunable_in_request` this screen sets. The endpoint accepts
 * twenty-five keys; these two are the ones that change the wait from about a
 * minute to a handful of seconds, by skipping four of the five LLM calls.
 */
export interface JudgmentConfigOverrides {
  use_fact_reorganization?: boolean;
  use_statute_discrimination?: boolean;
}
