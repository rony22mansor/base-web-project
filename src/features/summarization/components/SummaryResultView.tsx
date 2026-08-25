"use client";

import { Card } from "@/src/shared/components/ui/card";
import { useTranslations } from "next-intl";
import type { CaseSummary } from "../types/interfaces/summaryInterface";
import { ExtractedFieldsCard } from "./ExtractedFieldsCard";

/**
 * The summary, with how much of the original it kept.
 *
 * The compression figure is worth showing plainly: this is extractive, so the
 * summary is literally a subset of the submitted sentences, and knowing it cut
 * the text by two thirds tells the reader exactly what they are looking at.
 */
export function SummaryResultView({
  summary,
  sourceText,
}: {
  summary: CaseSummary;
  /** The submitted text, for the compression ratio. */
  sourceText: string;
}) {
  const t = useTranslations("summarization.result");

  const originalLength = summary.originalLength || sourceText.length;
  const kept = originalLength
    ? Math.round((summary.summary.length / originalLength) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <ExtractedFieldsCard fields={summary.fields} />

        <div className="flex flex-wrap items-baseline justify-between mt-6">
          <h2 className="text-xl font-bold">{t("title")}</h2>
          <span className="text-text-tertiary text-xs tabular-nums">
            {t("compression", {
              original: originalLength,
              summary: summary.summary.length,
              percent: kept,
            })}
          </span>
        </div>

        <Card className="p-5">
          {/* Sentences selected from the submitted text, unchanged. */}
          <p dir="rtl" className="text-sm leading-loose whitespace-pre-line">
            {summary.summary}
          </p>
        </Card>
      </section>
    </div>
  );
}
