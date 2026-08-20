"use client";

import type { DynamicForm } from "@/src/core/types/generalTypes";
import { useTranslations } from "next-intl";
import { z } from "zod";

export const MIN_DESCRIPTION_LENGTH = 40;
export const MAX_DESCRIPTION_LENGTH = 5000;

export const RulingFormSchema = z.object({
  description: z
    .string()
    .trim()
    .min(MIN_DESCRIPTION_LENGTH, "descriptionTooShort")
    .max(MAX_DESCRIPTION_LENGTH, "descriptionTooLong"),
});

export type RulingFormType = z.infer<typeof RulingFormSchema>;

export const GetRulingForm = (): DynamicForm<RulingFormType> => {
  const t = useTranslations("rulingGenerator.form");

  return {
    id: "ruling-form",
    fields: {
      description: {
        type: "textarea",
        name: "description",
        label: t("descriptionLabel"),
        placeholder: t("descriptionPlaceholder"),
        required: true,
        maxLength: MAX_DESCRIPTION_LENGTH,
        classNameInputExtra: "min-h-56 resize-y leading-relaxed",
      },
    },
  };
};
