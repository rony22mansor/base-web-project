"use client";

import { ScoreMeter } from "@/src/shared/components/legal/ScoreMeter";
import { Card } from "@/src/shared/components/ui/card";
import { ChevronRight, Scale } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { LegalCase } from "../types/interfaces/caseInterface";
import { CaseDetailDrawer } from "./CaseDetailDrawer";
import { CaseOutcomeBadge } from "./CaseOutcomeBadge";

/**
 * One precedent in the results grid.
 *
 * The card is deliberately a summary and nothing more — number, year, outcome,
 * charges, the statutes relied on and how close the match is. The judgment
 * itself runs to thousands of words across four sections, so it opens in the
 * side panel rather than expanding here and burying every other result.
 */
export function CaseCard({ legalCase }: { legalCase: LegalCase }) {
  const t = useTranslations("caseSearch.card");
  const [isOpen, setIsOpen] = useState(false);
  const percent = Math.round(legalCase.similarityScore * 100);

  return (
    <>
      <Card className="h-full gap-0 overflow-hidden py-0">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          className="hover:bg-accent/50 duration-120 ease-gentle flex h-full w-full flex-col items-stretch gap-2 p-4 text-start transition-colors"
        >
          <span className="flex items-start gap-3">
            <span className="bg-accent text-text-secondary mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-sm">
              <Scale className="size-4" />
            </span>

            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">
                  {t("caseNumber", { number: legalCase.caseNumber })}
                </span>
                {legalCase.decisionYear && (
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {legalCase.decisionYear}
                  </span>
                )}
              </span>

              <span className="flex flex-wrap items-center gap-1.5">
                {/* Legal content — rendered exactly as the API returned it. */}
                {legalCase.outcomes.map((outcome) => (
                  <CaseOutcomeBadge key={outcome} outcome={outcome} />
                ))}
                {legalCase.crimes.map((crime) => (
                  <span
                    key={crime}
                    className="bg-tag-orange text-tag-orange-fg rounded-sm px-1.5 py-0.5 text-xs font-medium"
                  >
                    {crime}
                  </span>
                ))}
              </span>
            </span>

            <ScoreMeter
              value={legalCase.similarityScore}
              label={t("relevance", { percent })}
              className="mt-1 shrink-0"
            />
          </span>

          {/* The opening of الوقائع, as a taste of what the panel holds. */}
          <span className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">
            {legalCase.factsText}
          </span>

          <span className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
            {legalCase.penalCodeArticles.slice(0, 4).map((article) => (
              <span
                key={article}
                className="bg-tag-blue text-tag-blue-fg rounded-sm px-1.5 py-0.5 text-xs font-medium tabular-nums"
              >
                {t("article", { number: article })}
              </span>
            ))}

            <span className="text-link ms-auto inline-flex items-center gap-1 text-xs font-medium">
              {t("open")}
              <ChevronRight className="size-3.5 rtl:rotate-180" />
            </span>
          </span>
        </button>
      </Card>

      <CaseDetailDrawer
        legalCase={legalCase}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
}
