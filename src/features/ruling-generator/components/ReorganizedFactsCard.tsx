"use client";

import { Card } from "@/src/shared/components/ui/card";
import { useTranslations } from "next-intl";
import type { ReorganizedFacts } from "../types/interfaces/rulingInterface";

/**
 * The facts broken into the three elements a charge is actually tested
 * against: the act, the intent behind it, and what followed.
 *
 * Produced only in thorough mode. An empty field is left out rather than shown
 * blank — the model returning no motive means it found none in the facts, and
 * an empty row would read as a rendering fault instead of a finding.
 */
export function ReorganizedFactsCard({ facts }: { facts: ReorganizedFacts }) {
  const t = useTranslations("rulingGenerator.reorganized");

  const rows = (
    [
      { key: "objectiveBehavior", text: facts.objectiveBehavior },
      { key: "subjectiveMotivation", text: facts.subjectiveMotivation },
      {
        key: "exPostFactoCircumstances",
        text: facts.exPostFactoCircumstances,
      },
    ] as const
  ).filter((row) => row.text.length > 0);

  if (rows.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold">{t("title")}</h3>
      <Card className="gap-3 p-5">
        {rows.map((row) => (
          <div key={row.key} className="flex flex-col gap-1">
            <span className="notion-label text-[11px]">{t(row.key)}</span>
            <p dir="rtl" className="text-sm leading-relaxed">
              {row.text}
            </p>
          </div>
        ))}
      </Card>
    </section>
  );
}
