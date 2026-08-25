import { CaseScope } from "../enums/caseEnums";

/**
 * Retrieval tuning, kept out of the components so the screen never speaks in
 * raw similarity numbers and the backend never sees a UI concept.
 */

/** `threshold` per named scope. 0.50 is the server's own default. */
const SCOPE_THRESHOLDS: Record<CaseScope, number> = {
  [CaseScope.Strict]: 0.65,
  [CaseScope.Balanced]: 0.5,
  [CaseScope.Broad]: 0.3,
};

export const scopeToThreshold = (scope: CaseScope): number =>
  SCOPE_THRESHOLDS[scope];

/**
 * More than the server's default of 5: this grid shows precedents two per row,
 * and a screen that stops after five leaves an odd gap under a query that took
 * ten seconds to run.
 */
export const DEFAULT_TOP_K = 10;

/**
 * Candidates fused before reranking. Kept at three times `DEFAULT_TOP_K`, the
 * same ratio as the server's own 15-for-5 default, so the cross-encoder still
 * has something to choose between.
 */
export const DEFAULT_HYBRID_TOP_K = 30;
