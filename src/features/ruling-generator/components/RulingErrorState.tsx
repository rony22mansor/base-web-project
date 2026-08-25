"use client";

import { CaseCard } from "@/src/features/case-search/components/CaseCard";
import { LawArticleCard } from "@/src/features/law-search/components/LawArticleCard";
import { Button } from "@/src/shared/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { JudgmentEvidence } from "../types/interfaces/rulingInterface";

/**
 * A failed run, with whatever survived it.
 *
 * The common failure is a 502: retrieval worked, the model's answer did not
 * parse. Throwing away the statutes and precedents in that case would discard
 * the slowest part of a minute-long request and leave the user with nothing to
 * act on — so they are shown, clearly labelled as retrieval only, with no
 * ruling attached to them.
 */
export function RulingErrorState({
  message,
  evidence,
  onRetry,
}: {
  /** Server-supplied detail, when there is one. Arabic, ready to display. */
  message?: string;
  /** Retrieved context salvaged from the failure body, when it carried any. */
  evidence?: JudgmentEvidence | null;
  onRetry: () => void;
}) {
  const t = useTranslations("rulingGenerator.error");
  const tResult = useTranslations("rulingGenerator.result");

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-tag-red flex flex-col items-center gap-3 rounded-md p-10 text-center">
        <span className="text-tag-red-fg flex size-10 items-center justify-center">
          <AlertTriangle className="size-6" />
        </span>
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <p dir="rtl" className="text-muted-foreground max-w-lg text-sm">
          {message || t("description")}
        </p>
        <Button onClick={onRetry} variant="outline">
          {t("retry")}
        </Button>
      </div>

      {evidence && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">{t("salvagedTitle")}</h3>
            <p className="text-text-secondary text-sm">{t("salvagedHint")}</p>
          </div>

          {evidence.statutes.length > 0 && (
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold">
                {tResult("legalBasisTitle")}
              </h4>
              <div className="grid gap-3 lg:grid-cols-2">
                {evidence.statutes.map((article) => (
                  <LawArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}

          {evidence.cases.length > 0 && (
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold">
                {tResult("precedentsTitle")}
              </h4>
              <div className="grid gap-3 lg:grid-cols-2">
                {evidence.cases.map((legalCase) => (
                  <CaseCard key={legalCase.id} legalCase={legalCase} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
