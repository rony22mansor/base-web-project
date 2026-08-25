"use client";

import { Card } from "@/src/shared/components/ui/card";
import { ChevronRight, Scale } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { CaseSummary } from "../types/interfaces/caseInterface";
import { CaseDocumentDrawer } from "./CaseDocumentDrawer";
import { CaseOutcomeBadge } from "./CaseOutcomeBadge";

/**
 * One judgment in the browse grid.
 *
 * The same summary the search card shows, minus the relevance meter: browsing
 * has no query to be relevant to, and a score of zero on every tile would read
 * as "no match" rather than "not applicable". The body is not on the row at all
 * — the catalog sends a preview only — so it is fetched when the card opens.
 */
export function CaseCatalogCard({ legalCase }: { legalCase: CaseSummary }) {
  const t = useTranslations("caseSearch.card");
  const [isOpen, setIsOpen] = useState(false);

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
          </span>

          {/* The corpus's own 200-character opening, as a taste of the body. */}
          <span
            dir="rtl"
            className="text-muted-foreground line-clamp-3 text-xs leading-relaxed"
          >
            {legalCase.textPreview}
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

      <CaseDocumentDrawer
        summary={legalCase}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
}
