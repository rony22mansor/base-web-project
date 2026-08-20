"use client";

import { ArticleStatus } from "@/src/core/enums/legalDomain";
import { cn } from "@/src/core/utils/utils";
import { ArticleStatusBadge } from "@/src/shared/components/legal/ArticleStatusBadge";
import { Card } from "@/src/shared/components/ui/card";
import { ChevronDown, ScrollText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { LawArticle } from "../types/interfaces/lawInterface";

/**
 * One article in the browse grid. The detail view a card should open into is
 * not designed yet (see ui-features.md), so clicking expands the article text
 * in place rather than navigating to a route that does not exist.
 */
export function LawArticleCard({ article }: { article: LawArticle }) {
  const t = useTranslations("lawSearch.card");
  const [isOpen, setIsOpen] = useState(false);
  const isRepealed = article.status === ArticleStatus.Repealed;

  return (
    <Card className="h-full gap-0 overflow-hidden py-0">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="hover:bg-accent/50 flex w-full flex-1 items-start gap-3 p-4 text-start transition-colors"
      >
        <span className="bg-accent text-text-secondary mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-sm">
          <ScrollText className="size-4" />
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{article.articleNumber}</span>
            <ArticleStatusBadge status={article.status} />
            {article.score !== undefined && (
              <span className="text-muted-foreground text-xs tabular-nums">
                {t("relevance", { percent: Math.round(article.score * 100) })}
              </span>
            )}
          </span>

          {/* Legal content — rendered exactly as the API returned it. */}
          <span className="text-sm leading-relaxed font-medium">
            {article.title}
          </span>

          <span className="text-muted-foreground truncate text-sm">
            {article.lawName}
          </span>

          {article.hierarchy.length > 0 && (
            <span className="text-muted-foreground/80 truncate text-xs">
              {article.hierarchy.join(" ← ")}
            </span>
          )}

          {!isOpen && (
            <span className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
              {article.text}
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
        <div className="flex flex-col gap-2 border-t px-4 py-3">
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {article.text}
          </p>
          {isRepealed && (
            <p className="text-destructive text-xs font-medium">
              {t("repealedNote")}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
