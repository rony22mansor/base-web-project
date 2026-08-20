"use client";

import { cn } from "@/src/core/utils/utils";
import { useTranslations } from "next-intl";
import { ConfidenceLevel } from "../enums/rulingEnums";
import { toConfidenceLevel, toPercentage } from "../helpers/confidence";

const LEVEL_STYLES: Record<ConfidenceLevel, { bar: string; text: string }> = {
  [ConfidenceLevel.High]: {
    bar: "bg-tag-green-fg",
    text: "text-tag-green-fg",
  },
  [ConfidenceLevel.Medium]: {
    bar: "bg-tag-yellow-fg",
    text: "text-tag-yellow-fg",
  },
  [ConfidenceLevel.Low]: { bar: "bg-tag-red-fg", text: "text-tag-red-fg" },
};

export function ConfidenceScore({ confidence }: { confidence: number }) {
  const t = useTranslations("rulingGenerator.result");
  const level = toConfidenceLevel(confidence);
  const percentage = toPercentage(confidence);
  const styles = LEVEL_STYLES[level];

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold">{t("confidenceTitle")}</h3>
        <span className={cn("text-sm font-medium", styles.text)}>
          {t(`confidenceLevel.${level}`)}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="bg-accent h-1.5 flex-1 overflow-hidden rounded-full"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t("confidenceTitle")}
        >
          {/* Logical inset keeps the fill anchored to the reading side in RTL. */}
          <div
            className={cn("h-full rounded-full transition-all", styles.bar)}
            style={{ inlineSize: `${percentage}%` }}
          />
        </div>
        <span className="text-lg font-bold tabular-nums">{percentage}%</span>
      </div>
    </section>
  );
}
