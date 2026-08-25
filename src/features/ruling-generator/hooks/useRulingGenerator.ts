"use client";

import { useMemo, useState } from "react";
import { JudgmentMode } from "../enums/rulingEnums";
import { toFailedEvidence } from "../services/adapters/judgmentAdapter";
import { usePredictJudgment } from "../services/mutations/usePredictJudgment";
import { useJudgmentConfig } from "../services/queries/useJudgmentConfig";

/**
 * Drives Input -> Loading -> Report. The mutation's status *is* the stage, so
 * there is no duplicate state machine; the description is held here only so
 * returning from a report restores what the user typed.
 *
 * Ahead of all that sits the availability gate: `/judgment/config` says whether
 * the LLM key is set at all, and a screen that lets someone wait a minute for a
 * failure that was knowable up front is the thing the API docs ask us not to
 * build.
 */
export function useRulingGenerator() {
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<JudgmentMode>(JudgmentMode.Thorough);

  const config = useJudgmentConfig();
  const prediction = usePredictJudgment();

  const generate = (nextDescription: string) => {
    setDescription(nextDescription);
    prediction.mutate({ text: nextDescription, mode });
  };

  const availability = config.data?.data;

  /**
   * A 502 means the model's answer could not be parsed — but the retrieval it
   * ran first still succeeded, and that is most of the minute the user waited.
   * Salvage it so the failure screen can still show what was found.
   */
  const failedEvidence = useMemo(
    () => (prediction.error ? toFailedEvidence(prediction.error) : null),
    [prediction.error],
  );

  return {
    // input
    description,
    mode,
    setMode,
    generate,
    /** Back to the input screen, keeping the previous description. */
    startNewQuery: prediction.reset,

    // availability
    isCheckingAvailability: config.isPending,
    /** Treated as available while the check is in flight or itself failed. */
    isBlocked: availability ? !availability.ready : false,
    blockingReason: availability?.blockingReason ?? undefined,
    llm: availability?.llm,
    dependsOn: availability?.dependsOn,

    // result
    result: prediction.data?.data,
    isLoading: prediction.isPending,
    isError: prediction.isError,
    error: prediction.error,
    failedEvidence,
  };
}
