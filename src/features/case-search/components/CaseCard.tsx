"use client";

import { cn } from "@/src/core/utils/utils";
import { CaseCategoryBadge } from "@/src/shared/components/legal/CaseCategoryBadge";
import { Card } from "@/src/shared/components/ui/card";
import { ChevronDown, Landmark } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import type { LegalCase } from "../types/interfaces/caseInterface";

/**
 * One case in the browse grid. The detail view a card should open into is not
 * designed yet (see ui-features.md), so clicking expands the summary and the
 * ruling in place rather than navigating to a route that does not exist.
 */
export function CaseCard({ legalCase }: { legalCase: LegalCase }) {
  const t = useTranslations("caseSearch.card");
  const format = useFormatter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="h-full gap-0 overflow-hidden py-0">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="hover:bg-accent/50 flex w-full flex-1 items-start gap-3 p-4 text-start transition-colors"
      >
        <span className="bg-primary/10 text-primary mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
          <Landmark className="size-4" />
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-1">
          {/* Legal content — rendered exactly as the API returned it. */}
          <span className="font-semibold">{legalCase.title}</span>

          <span className="text-muted-foreground truncate text-sm">
            {legalCase.caseNumber}
          </span>

          <span className="text-muted-foreground/80 flex flex-wrap items-center gap-2 text-xs">
            <CaseCategoryBadge category={legalCase.category} />
            <time dateTime={legalCase.date}>
              {format.dateTime(new Date(legalCase.date), {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {legalCase.score !== undefined && (
              <span className="tabular-nums">
                {t("relevance", { percent: Math.round(legalCase.score * 100) })}
              </span>
            )}
          </span>

          <span className="text-muted-foreground/80 truncate text-xs">
            {legalCase.court}
          </span>

          {!isOpen && (
            <span className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
              {legalCase.summary}
            </span>
          )}
        </span>

        <ChevronDown
          className={cn(
            "text-muted-foreground mt-1 size-4 shrink-0 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div className="flex flex-col gap-3 border-t px-4 py-3">
          <div className="flex flex-col gap-1">
            <h4 className="text-xs font-semibold">{t("summary")}</h4>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {legalCase.summary}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <h4 className="text-xs font-semibold">{t("ruling")}</h4>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {legalCase.ruling}
            </p>
          </div>

          {legalCase.citedArticles.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-xs font-semibold">{t("citedArticles")}</h4>
              {legalCase.citedArticles.map((article) => (
                <span
                  key={article}
                  className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs"
                >
                  {article}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
