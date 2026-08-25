"use client";

import type { DynamicForm } from "@/src/core/types/generalTypes";
import { useTranslations } from "next-intl";
import { z } from "zod";

/**
 * The server's floor is 10 characters, but an extractive summariser has
 * nothing to select from below a few sentences — it would hand back the input
 * verbatim. The form asks for enough text to be worth summarising.
 */
export const MIN_TEXT_LENGTH = 200;
export const MAX_TEXT_LENGTH = 20000;

export const SummarizeFormSchema = z.object({
  text: z
    .string()
    .trim()
    .min(MIN_TEXT_LENGTH, "descriptionTooShort")
    .max(MAX_TEXT_LENGTH, "descriptionTooLong"),
});

export type SummarizeFormType = z.infer<typeof SummarizeFormSchema>;

export const GetSummarizeForm = (): DynamicForm<SummarizeFormType> => {
  const t = useTranslations("summarization.form");

  return {
    id: "summarize-form",
    fields: {
      text: {
        type: "textarea",
        name: "text",
        label: t("textLabel"),
        placeholder: t("textPlaceholder"),
        required: true,
        maxLength: MAX_TEXT_LENGTH,
        classNameInputExtra: "min-h-64 resize-y leading-relaxed",
      },
    },
  };
};
