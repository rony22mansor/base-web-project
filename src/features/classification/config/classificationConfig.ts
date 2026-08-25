"use client";

import type { DynamicForm } from "@/src/core/types/generalTypes";
import { useTranslations } from "next-intl";
import { z } from "zod";

/**
 * The endpoint only rejects an empty string, but a bag-of-words classifier
 * given one line has almost nothing to weigh. The floor here is a working
 * minimum, not the API's.
 */
export const MIN_FACTS_LENGTH = 40;
export const MAX_FACTS_LENGTH = 20000;

export const ClassifyFormSchema = z.object({
  facts: z
    .string()
    .trim()
    .min(MIN_FACTS_LENGTH, "descriptionTooShort")
    .max(MAX_FACTS_LENGTH, "descriptionTooLong"),
});

export type ClassifyFormType = z.infer<typeof ClassifyFormSchema>;

export const GetClassifyForm = (): DynamicForm<ClassifyFormType> => {
  const t = useTranslations("classification.form");

  return {
    id: "classify-form",
    fields: {
      facts: {
        type: "textarea",
        name: "facts",
        label: t("factsLabel"),
        placeholder: t("factsPlaceholder"),
        required: true,
        maxLength: MAX_FACTS_LENGTH,
        classNameInputExtra: "min-h-56 resize-y leading-relaxed",
      },
    },
  };
};
