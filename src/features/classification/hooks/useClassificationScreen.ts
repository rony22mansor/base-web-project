"use client";

import { useState } from "react";
import { useClassifyCase } from "../services/mutations/useClassifyCase";

/** Input -> Result, with the mutation's status as the only state machine. */
export function useClassificationScreen() {
  const [facts, setFacts] = useState("");
  const mutation = useClassifyCase();

  return {
    facts,
    classify: (next: string) => {
      setFacts(next);
      mutation.mutate({ facts: next });
    },
    reset: mutation.reset,

    result: mutation.data?.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    errorMessage: mutation.error?.message,
  };
}
