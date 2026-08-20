"use client";

import { useState } from "react";
import { useGenerateRuling } from "../services/mutations/useGenerateRuling";

/**
 * Drives the Input -> Loading -> Result flow. The mutation status *is* the
 * stage, so there is no duplicate state machine; the description is held here
 * only so returning from a result restores what the user typed.
 */
export function useRulingGenerator() {
  const [description, setDescription] = useState("");
  const mutation = useGenerateRuling();

  const generate = (nextDescription: string) => {
    setDescription(nextDescription);
    mutation.mutate({ description: nextDescription });
  };

  return {
    description,
    generate,
    /** Back to the input screen, keeping the previous description. */
    startNewQuery: mutation.reset,
    result: mutation.data?.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
