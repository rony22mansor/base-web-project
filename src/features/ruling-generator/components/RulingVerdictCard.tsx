"use client";

import { CaseOutcomeBadge } from "@/src/features/case-search/components/CaseOutcomeBadge";
import { Card } from "@/src/shared/components/ui/card";
import { AlertTriangle, Gavel, Scale } from "lucide-react";
import { useTranslations } from "next-intl";
import type { JudgmentPrediction } from "../types/interfaces/rulingInterface";

/**
 * The answer itself: the outcome, the charge it rests on, the penalty the
 * cited article prescribes, and the facts as the model restated them.
 *
 * The outcome badge is the same component the precedents screen uses, and
 * deliberately so — إدانة means the same thing and should look the same
 * whether it was decided by a court in 2022 or predicted here.
 */
export function RulingVerdictCard({
  prediction,
}: {
  prediction: JudgmentPrediction;
}) {
  const t = useTranslations("rulingGenerator.result");

  return (
    <Card className="border-primary/40 gap-4 p-6">
      <div className="flex items-start gap-3">
        <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
          <Gavel className="size-5" />
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <CaseOutcomeBadge outcome={prediction.outcome} />
            {/* The three-value vocabulary is published by /judgment/config;
                anything else means the model answered off-script. */}
            {!prediction.outcomeIsStandard && (
              <span className="text-tag-yellow-fg inline-flex items-center gap-1 text-xs font-medium">
                <AlertTriangle className="size-3.5" />
                {t("nonStandardOutcome")}
              </span>
            )}
          </div>

          {/* Legal content — rendered exactly as the API returned it. */}
          <h2 dir="rtl" className="text-xl leading-snug font-bold">
            {prediction.finalCharge}
          </h2>
        </div>
      </div>

      {prediction.suggestedPenaltyRange && (
        <div className="bg-accent/50 flex items-start gap-2.5 rounded-md p-3">
          <Scale className="text-text-secondary mt-0.5 size-4 shrink-0" />
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="notion-label text-[11px]">
              {t("penaltyTitle")}
            </span>
            <p dir="rtl" className="text-sm leading-relaxed">
              {prediction.suggestedPenaltyRange}
            </p>
          </div>
        </div>
      )}

      {prediction.factsSummary && (
        <div className="flex flex-col gap-1">
          <span className="notion-label text-[11px]">{t("factsTitle")}</span>
          <p dir="rtl" className="text-sm leading-relaxed">
            {prediction.factsSummary}
          </p>
        </div>
      )}

      {/* Prose, not a score — the endpoint reports no confidence number. */}
      {prediction.confidenceNote && (
        <p dir="rtl" className="text-text-tertiary text-xs leading-relaxed">
          {prediction.confidenceNote}
        </p>
      )}
    </Card>
  );
}
