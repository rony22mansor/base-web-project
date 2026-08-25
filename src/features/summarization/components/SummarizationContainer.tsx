"use client";

import { Button } from "@/src/shared/components/ui/button";
import { useRenderField } from "@/src/shared/hooks/useRenderField";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, FileText, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import {
  GetSummarizeForm,
  MAX_TEXT_LENGTH,
  MIN_TEXT_LENGTH,
  SummarizeFormSchema,
  type SummarizeFormType,
} from "../config/summarizationConfig";
import { useSummarizationScreen } from "../hooks/useSummarizationScreen";
import { SummaryResultView } from "./SummaryResultView";

/**
 * Feature 1: summarize a case and pull the recurring fields out of it.
 *
 * Unlike every other screen in the app this one is instant — regex and
 * sentence selection, no models — so there is no loading stage worth designing
 * and the form stays on screen beneath the result.
 */
export function SummarizationContainer() {
  const t = useTranslations("summarization");
  const screen = useSummarizationScreen();
  const formData = GetSummarizeForm();
  const { renderField } = useRenderField<SummarizeFormType>();

  const form = useForm<SummarizeFormType>({
    resolver: zodResolver(SummarizeFormSchema),
    mode: "onChange",
    defaultValues: { text: "" },
  });

  // `useWatch` rather than `form.watch()`: the latter returns a fresh function
  // each render, which the React Compiler cannot memoize safely.
  const text = useWatch({ control: form.control, name: "text" }) ?? "";

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
        onSubmit={form.handleSubmit((values) => screen.summarize(values.text))}
        className="flex flex-col gap-4"
      >
        {renderField({
          field: formData.fields.text,
          register: form.register,
          control: form.control,
          errors: form.formState.errors,
        })}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-muted-foreground text-xs tabular-nums">
            {t("form.charCount", {
              count: text.length,
              max: MAX_TEXT_LENGTH,
            })}
          </span>

          {text.length < MIN_TEXT_LENGTH && (
            <span className="text-muted-foreground text-xs">
              {t("form.minLengthHint", { min: MIN_TEXT_LENGTH })}
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
              <FileText className="size-4" />
            )}
            {t("form.submit")}
          </Button>

          {screen.result && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                form.reset({ text: "" });
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

      {screen.result && (
        <SummaryResultView summary={screen.result} sourceText={screen.text} />
      )}
    </div>
  );
}
