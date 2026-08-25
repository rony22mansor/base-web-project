"use client";

import { CaseCard } from "@/src/features/case-search/components/CaseCard";
import { LawArticleCard } from "@/src/features/law-search/components/LawArticleCard";
import { Button } from "@/src/shared/components/ui/button";
import { Card } from "@/src/shared/components/ui/card";
import { Info, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import type { JudgmentPrediction } from "../types/interfaces/rulingInterface";
import { CandidateChargeCard } from "./CandidateChargeCard";
import { DiscriminationPanel } from "./DiscriminationPanel";
import { ReorganizedFactsCard } from "./ReorganizedFactsCard";
import { RulingVerdictCard } from "./RulingVerdictCard";
import { VerificationPanel } from "./VerificationPanel";

interface RulingResultViewProps {
  prediction: JudgmentPrediction;
  /** The text the user submitted, shown collapsed for context. */
  description: string;
  onNewQuery: () => void;
}

/**
 * A structured report, deliberately not a chat transcript. Every piece of legal
 * content is rendered exactly as the API returned it — no rewording, no
 * truncation, and no number the endpoint did not actually produce.
 *
 * The statutes and precedents sections reuse the browse screens' own cards:
 * both arrive in their RAG endpoints' shapes, so a cited article opens the same
 * drawer here as it does on the laws screen, and a precedent opens the same
 * tabbed judgment.
 */
export function RulingResultView({
  prediction,
  description,
  onNewQuery,
}: RulingResultViewProps) {
  const t = useTranslations("rulingGenerator.result");
  const { reasoning, evidence, meta } = prediction;

  const reasoningSections = (
    [
      { key: "chargesAnalysis", text: reasoning.chargesAnalysis },
      { key: "exclusionNotes", text: reasoning.exclusionNotes },
      { key: "precedentAlignment", text: reasoning.precedentAlignment },
    ] as const
  ).filter((section) => section.text.trim().length > 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">{t("rulingTitle")}</h2>
        <Button variant="outline" onClick={onNewQuery} className="gap-2">
          <RotateCcw className="size-4" />
          {t("newQuery")}
        </Button>
      </div>

      <RulingVerdictCard prediction={prediction} />

      <VerificationPanel verification={prediction.verification} />

      {reasoningSections.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold">{t("reasoningTitle")}</h3>
          <Card className="gap-4 p-5">
            {reasoningSections.map((section) => (
              <div key={section.key} className="flex flex-col gap-1">
                <span className="notion-label text-[11px]">
                  {t(`reasoning.${section.key}`)}
                </span>
                {/* Legal content — as the API returned it. */}
                <p dir="rtl" className="text-sm leading-loose">
                  {section.text}
                </p>
              </div>
            ))}
          </Card>
        </section>
      )}

      {evidence.reorganizedFacts && (
        <ReorganizedFactsCard facts={evidence.reorganizedFacts} />
      )}

      {prediction.candidateCharges.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold">{t("chargesTitle")}</h3>
          <p className="text-text-secondary text-sm">{t("chargesHint")}</p>
          <div className="grid gap-3 lg:grid-cols-2">
            {prediction.candidateCharges.map((charge) => (
              <CandidateChargeCard
                key={`${charge.id}-${charge.charge}`}
                charge={charge}
              />
            ))}
          </div>
        </section>
      )}

      {/* Thorough mode only — the stage that produced it is optional. */}
      {evidence.discrimination.length > 0 && (
        <DiscriminationPanel
          discrimination={evidence.discrimination}
          confusablePairs={evidence.confusablePairs}
        />
      )}

      {evidence.statutes.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold">{t("legalBasisTitle")}</h3>
          <p className="text-text-secondary text-sm">{t("legalBasisHint")}</p>
          <div className="grid gap-3 lg:grid-cols-2">
            {evidence.statutes.map((article) => (
              <LawArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {evidence.cases.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold">{t("precedentsTitle")}</h3>
          <div className="grid gap-3 lg:grid-cols-2">
            {evidence.cases.map((legalCase) => (
              <CaseCard key={legalCase.id} legalCase={legalCase} />
            ))}
          </div>
        </section>
      )}

      {evidence.classifierCandidates.length > 0 && (
        <details className="text-muted-foreground rounded-md border p-4 text-sm">
          <summary className="cursor-pointer font-medium">
            {t("classifierTitle")}
          </summary>
          <p className="mt-2 text-xs">{t("classifierHint")}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {evidence.classifierCandidates.map((candidate) => (
              <li
                key={candidate.label}
                dir="rtl"
                className={
                  candidate.predicted
                    ? "bg-tag-blue text-tag-blue-fg rounded-sm px-2 py-1 text-xs font-medium"
                    : "bg-tag-gray text-tag-gray-fg rounded-sm px-2 py-1 text-xs"
                }
              >
                {candidate.label}
                <span className="ms-1.5 opacity-70 tabular-nums">
                  {candidate.score.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}

      <details className="text-muted-foreground rounded-md border p-4 text-sm">
        <summary className="cursor-pointer font-medium">
          {t("yourDescription")}
        </summary>
        <p dir="rtl" className="mt-3 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </details>

      <p className="text-muted-foreground flex items-start gap-2 border-t pt-4 text-xs">
        <Info className="mt-0.5 size-4 shrink-0" />
        <span>
          {t("disclaimer")}{" "}
          {/* Which model answered, and how long it took — the report is a
              record of one run, and both belong on it. */}
          {t("meta", {
            model: meta.llm.model,
            seconds: (meta.tookMs / 1000).toFixed(0),
          })}
        </span>
      </p>
    </div>
  );
}
