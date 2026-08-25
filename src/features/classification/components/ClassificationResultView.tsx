"use client";

import { Card } from "@/src/shared/components/ui/card";
import { SearchX, Tag } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CrimeClassification } from "../types/interfaces/classificationInterface";

/**
 * The labels the classifier assigned.
 *
 * `classified: false` is a real answer, not a failure — the model looked and
 * nothing crossed its threshold — so it gets the server's own Arabic
 * explanation and a hint, on a neutral background rather than a red one.
 */
export function ClassificationResultView({
  result,
}: {
  result: CrimeClassification;
}) {
  const t = useTranslations("classification.result");

  if (!result.classified) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border border-dashed p-10 text-center">
        <span className="bg-accent text-text-secondary flex size-10 items-center justify-center rounded-full">
          <SearchX className="size-5" />
        </span>
        <h2 className="text-base font-semibold">{t("emptyTitle")}</h2>
        {/* The server's own wording for why nothing matched. */}
        <p dir="rtl" className="text-text-secondary max-w-lg text-sm">
          {result.message || t("emptyDescription")}
        </p>
        <p className="text-text-tertiary max-w-lg text-xs">{t("emptyHint")}</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold">{t("title")}</h2>
        <span className="text-text-tertiary text-xs tabular-nums">
          {t("count", { count: result.crimes.length })}
        </span>
      </div>

      <Card className="gap-3 p-5">
        <ul className="flex flex-wrap gap-2">
          {/* Labels from the training set, shown exactly as returned. */}
          {result.crimes.map((crime) => (
            <li
              key={crime}
              dir="rtl"
              className="bg-tag-orange text-tag-orange-fg inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-sm font-medium"
            >
              <Tag className="size-3.5" />
              {crime}
            </li>
          ))}
        </ul>

        {/* <p className="text-text-tertiary flex items-start gap-2 border-t pt-3 text-xs">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          <span>{t("disclaimer")}</span>
        </p> */}
      </Card>
    </section>
  );
}
