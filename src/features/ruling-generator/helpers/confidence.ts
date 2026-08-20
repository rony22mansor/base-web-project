import { ConfidenceLevel } from "../enums/rulingEnums";
import type { RulingResult } from "../types/interfaces/rulingInterface";

/**
 * Below this the result is treated as no-match: monsif.md requires the engine
 * to be strict rather than improvise, so we refuse to render a weak report.
 */
export const CONFIDENCE_THRESHOLD = 0.4;

const HIGH_CONFIDENCE = 0.75;
const MEDIUM_CONFIDENCE = 0.55;

export const toConfidenceLevel = (confidence: number): ConfidenceLevel => {
  if (confidence >= HIGH_CONFIDENCE) return ConfidenceLevel.High;
  if (confidence >= MEDIUM_CONFIDENCE) return ConfidenceLevel.Medium;
  return ConfidenceLevel.Low;
};

export const toPercentage = (confidence: number): number =>
  Math.round(confidence * 100);

/** A result is only shown as a report when the engine actually matched. */
export const isReliableResult = (result: RulingResult): boolean =>
  result.matched && result.confidence >= CONFIDENCE_THRESHOLD;
