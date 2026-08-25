"use client";

import { ArticleStatus } from "@/src/core/enums/legalDomain";
import { ArticleStatusBadge } from "@/src/shared/components/legal/ArticleStatusBadge";
import { ScoreMeter } from "@/src/shared/components/legal/ScoreMeter";
import { Card } from "@/src/shared/components/ui/card";
import { ChevronRight, Link2, ScrollText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { LawArticle } from "../types/interfaces/lawInterface";
import { LawArticleDrawer } from "./LawArticleDrawer";

/**
 * One article in the grid: enough to recognise it, and nothing more.
 *
 * Bodies are long and wildly uneven in length, so the card shows a fixed
 * three-line preview and the full text opens in a side panel — see
 * `LawArticleDrawer`. That keeps every tile the same height and the grid
 * scannable, which expanding in place did not.
 */
export function LawArticleCard({ article }: { article: LawArticle }) {
  const t = useTranslations("lawSearch.card");
  const [isOpen, setIsOpen] = useState(false);
  const isRepealed = article.status === ArticleStatus.Repealed;
  const dependencyCount = article.dependencies?.length ?? 0;

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
              <ScrollText className="size-4" />
            </span>

            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{article.articleNumber}</span>
                <ArticleStatusBadge status={article.status} />
              </span>

              <span className="text-muted-foreground truncate text-sm">
                {article.lawName}
              </span>

              {/* كتاب › باب › فصل. The catalog supplies it; retrieval does not. */}
              {article.hierarchy.length > 0 && (
                <span className="text-muted-foreground/80 truncate text-xs">
                  {article.hierarchy.join(" › ")}
                </span>
              )}
            </span>

            {article.score !== undefined && (
              <ScoreMeter
                value={article.score}
                label={t("relevance", {
                  percent: Math.round(article.score * 100),
                })}
                className="mt-1 shrink-0"
              />
            )}
          </span>

          {/* Legal content — rendered exactly as the API returned it. */}
          <span className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">
            {article.text}
          </span>

          <span className="mt-auto flex flex-wrap items-center gap-2 pt-1 text-xs">
            {isRepealed && (
              <span className="text-destructive font-medium">
                {t("repealedShort")}
              </span>
            )}

            {dependencyCount > 0 && (
              <span className="text-muted-foreground inline-flex items-center gap-1">
                <Link2 className="size-3.5" />
                {t("dependencies", { count: dependencyCount })}
              </span>
            )}

            <span className="text-link ms-auto inline-flex items-center gap-1 font-medium">
              {t("open")}
              <ChevronRight className="size-3.5 rtl:rotate-180" />
            </span>
          </span>
        </button>
      </Card>

      <LawArticleDrawer
        article={article}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
}
