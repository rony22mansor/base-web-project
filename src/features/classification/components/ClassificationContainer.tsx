"use client";

import { Button } from "@/src/shared/components/ui/button";
import { useRenderField } from "@/src/shared/hooks/useRenderField";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2, Tags } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import {
  ClassifyFormSchema,
  GetClassifyForm,
  MAX_FACTS_LENGTH,
  MIN_FACTS_LENGTH,
  type ClassifyFormType,
} from "../config/classificationConfig";
import { useClassificationScreen } from "../hooks/useClassificationScreen";
import { ClassificationResultView } from "./ClassificationResultView";

/**
 * Feature 2: name the crimes a set of facts describes.
 *
 * Instant, like summarization — a pre-fitted SVM, not an LLM — so the form
 * stays on screen and the result appears beneath it.
 */
export function ClassificationContainer() {
  const t = useTranslations("classification");
  const screen = useClassificationScreen();
  const formData = GetClassifyForm();
  const { renderField } = useRenderField<ClassifyFormType>();

  const form = useForm<ClassifyFormType>({
    resolver: zodResolver(ClassifyFormSchema),
    mode: "onChange",
    defaultValues: { facts: "" },
  });

  const facts = useWatch({ control: form.control, name: "facts" }) ?? "";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-[32px] leading-tight font-bold tracking-tight">
          {t("title")}
        </h1>
        <p className="text-text-secondary max-w-2xl text-sm">
          {t("subtitle")}
        </p>
      </header>

      <form
        onSubmit={form.handleSubmit((values) => screen.classify(values.facts))}
        className="flex flex-col gap-4"
      >
        {renderField({
          field: formData.fields.facts,
          register: form.register,
          control: form.control,
          errors: form.formState.errors,
        })}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-muted-foreground text-xs tabular-nums">
            {t("form.charCount", { count: facts.length, max: MAX_FACTS_LENGTH })}
          </span>

          {facts.length < MIN_FACTS_LENGTH && (
            <span className="text-muted-foreground text-xs">
              {t("form.minLengthHint", { min: MIN_FACTS_LENGTH })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={!form.formState.isValid || screen.isLoading}
            className="gap-2"
          >
            {screen.isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Tags className="size-4" />
            )}
            {t("form.submit")}
          </Button>

          {screen.result && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                form.reset({ facts: "" });
                screen.reset();
              }}
            >
              {t("form.clear")}
            </Button>
          )}
        </div>
      </form>

      {screen.isError && (
        <p className="bg-tag-red text-tag-red-fg flex items-start gap-2 rounded-md px-3 py-2 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span dir="rtl">{screen.errorMessage || t("error")}</span>
        </p>
      )}

      {screen.result && <ClassificationResultView result={screen.result} />}
    </div>
  );
}
