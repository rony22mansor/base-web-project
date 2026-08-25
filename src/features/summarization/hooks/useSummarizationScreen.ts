"use client";

import { useState } from "react";
import { useSummarizeCase } from "../services/mutations/useSummarizeCase";

/**
 * Input -> Result, with the mutation's status as the only state machine. The
 * text is kept here so returning from a summary restores what was submitted —
 * and so the result view can report how far the text was compressed.
 */
export function useSummarizationScreen() {
  const [text, setText] = useState("");
  const mutation = useSummarizeCase();

  return {
    text,
    summarize: (next: string) => {
      setText(next);
      mutation.mutate({ text: next });
    },
    reset: mutation.reset,

    result: mutation.data?.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    errorMessage: mutation.error?.message,
  };
}
