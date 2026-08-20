"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Card } from "@/src/shared/components/ui/card";
import { Gavel, Info, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import type { RulingResult } from "../types/interfaces/rulingInterface";
import { ConfidenceScore } from "./ConfidenceScore";
import { LegalBasisCard } from "./LegalBasisCard";
import { PrecedentCard } from "./PrecedentCard";

interface RulingResultViewProps {
  result: RulingResult;
  /** The text the user submitted, shown collapsed for context. */
  description: string;
  onNewQuery: () => void;
}

/**
 * A structured report, deliberately not a chat transcript. Every piece of legal
 * content is rendered exactly as the API returned it — no rewording, no
 * truncation.
 */
export function RulingResultView({
  result,
  description,
  onNewQuery,
}: RulingResultViewProps) {
  const t = useTranslations("rulingGenerator.result");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">{t("rulingTitle")}</h2>
        <Button variant="outline" onClick={onNewQuery} className="gap-2">
          <RotateCcw className="size-4" />
          {t("newQuery")}
        </Button>
      </div>

      {/* 1. Preliminary ruling */}
      <Card className="border-primary/40 gap-4 p-6">
        <div className="flex items-start gap-3">
          <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
            <Gavel className="size-5" />
          </span>
          <p className="text-base leading-relaxed font-medium whitespace-pre-line">
            {result.ruling}
          </p>
        </div>

        {/* 2. Confidence score */}
        <ConfidenceScore confidence={result.confidence} />
      </Card>

      {/* 3. Explanation */}
      <section className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">{t("explanationTitle")}</h3>
        <Card className="p-5">
          <p className="text-sm leading-loose whitespace-pre-line">
            {result.explanation}
          </p>
        </Card>
      </section>

      {/* 4. Legal basis */}
      {result.legalBasis.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold">{t("legalBasisTitle")}</h3>
          <div className="grid gap-3 lg:grid-cols-2">
            {result.legalBasis.map((article) => (
              <LegalBasisCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Precedents */}
      {result.precedents.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold">{t("precedentsTitle")}</h3>
          <div className="grid gap-3 lg:grid-cols-2">
            {result.precedents.map((precedent) => (
              <PrecedentCard key={precedent.id} precedent={precedent} />
            ))}
          </div>
        </section>
      )}

      <details className="text-muted-foreground rounded-xl border p-4 text-sm">
        <summary className="cursor-pointer font-medium">
          {t("yourDescription")}
        </summary>
        <p className="mt-3 leading-relaxed whitespace-pre-line">{description}</p>
      </details>

      <p className="text-muted-foreground flex items-start gap-2 border-t pt-4 text-xs">
        <Info className="mt-0.5 size-4 shrink-0" />
        <span>{t("disclaimer")}</span>
      </p>
    </div>
  );
}
