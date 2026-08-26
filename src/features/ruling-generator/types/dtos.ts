/**
 * Request for `POST /api/legal/judgment/predict`.
 *
 * `text` is the only top-level field the endpoint reads — every tuning value
 * goes inside `config`, and anything sent at the root is silently ignored.
 * The server enforces a 20-character minimum on `text`.
 *
 * The screen always runs the full pipeline, so no `config` overrides are sent
 * and the server's own defaults apply — see `rulingGeneratorService.predict`.
 * A fast mode existed here (skipping four of the five LLM calls via
 * `use_fact_reorganization`/`use_statute_discrimination`) and was removed as a
 * user-facing choice; the endpoint still accepts those overrides if it needs
 * to come back.
 */
export interface PredictJudgmentDto {
  text: string;
}
