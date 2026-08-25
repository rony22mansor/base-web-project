"use client";

import { ArrowLeftRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type {
  ConfusablePair,
  StatuteDiscrimination,
} from "../types/interfaces/rulingInterface";

/**
 * How two nearly identical articles were told apart.
 *
 * This is the ADAPT stage, and it is the most reviewable thing in the report:
 * rather than silently pick between Article 657 and 656, the pipeline wrote
 * down the questions that separate them and answered each from the submitted
 * facts. A reader who disagrees with the ruling can point at the exact answer
 * they disagree with — which a verdict alone never allows.
 *
 * Only produced in thorough mode; the section is absent otherwise.
 */
export function DiscriminationPanel({
  discrimination,
  confusablePairs,
}: {
  discrimination: StatuteDiscrimination[];
  confusablePairs: ConfusablePair[];
}) {
  const t = useTranslations("rulingGenerator.discrimination");

  /** Overlap is reported per pair, alongside but separate from the questions. */
  const overlapOf = (a: string, b: string): number | undefined =>
    confusablePairs.find(
      (pair) => pair.articleA.id === a && pair.articleB.id === b,
    )?.overlap;

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold">{t("title")}</h3>
      <p className="text-text-secondary text-sm">{t("hint")}</p>

      <div className="flex flex-col gap-3">
        {discrimination.map((entry) => {
          const overlap = overlapOf(entry.articleA.id, entry.articleB.id);

          return (
            <div
              key={`${entry.articleA.id}-${entry.articleB.id}`}
              className="flex flex-col gap-3 rounded-md border p-4"
            >
              <header className="flex flex-wrap items-center gap-2">
                <span className="bg-tag-blue text-tag-blue-fg rounded-sm px-1.5 py-0.5 text-xs font-medium tabular-nums">
                  {t("article", { number: entry.articleA.articleNumber })}
                </span>
                <ArrowLeftRight className="text-text-tertiary size-3.5" />
                <span className="bg-tag-blue text-tag-blue-fg rounded-sm px-1.5 py-0.5 text-xs font-medium tabular-nums">
                  {t("article", { number: entry.articleB.articleNumber })}
                </span>

                {overlap !== undefined && (
                  <span className="text-text-tertiary text-xs tabular-nums">
                    {t("overlap", { percent: Math.round(overlap * 100) })}
                  </span>
                )}
              </header>

              {/* Law name once per pair — both articles are from the same law. */}
              {entry.articleA.lawName && (
                <p dir="rtl" className="text-text-tertiary truncate text-xs">
                  {entry.articleA.lawName}
                </p>
              )}

              <ol className="flex flex-col gap-3">
                {entry.questions.map((question) => (
                  <li key={question.question} className="flex flex-col gap-1">
                    {/* Legal content — as the model wrote it. */}
                    <p dir="rtl" className="text-sm font-medium">
                      {question.question}
                    </p>
                    <p
                      dir="rtl"
                      className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm"
                    >
                      <span>{question.answerFromFacts}</span>
                      {question.pointsToArticle && (
                        <span className="bg-tag-gray text-tag-gray-fg rounded-sm px-1.5 py-0.5 text-xs font-medium">
                          {t("pointsTo", { article: question.pointsToArticle })}
                        </span>
                      )}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>
    </section>
  );
}
