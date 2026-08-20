"use client";

import { cn } from "@/src/core/utils/utils";
import { ArticleStatusBadge } from "@/src/shared/components/legal/ArticleStatusBadge";
import { Card } from "@/src/shared/components/ui/card";
import { ChevronDown, ScrollText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ArticleStatus } from "../enums/rulingEnums";
import type { LegalBasisArticle } from "../types/interfaces/rulingInterface";

/**
 * A cited article, as a clickable card rather than an inline link so it can
 * later deep-link into the law-search detail view (Feature 2). Until that view
 * exists, clicking expands the article text in place.
 */
export function LegalBasisCard({ article }: { article: LegalBasisArticle }) {
  const t = useTranslations("rulingGenerator.article");
  const [isOpen, setIsOpen] = useState(false);
  const isRepealed = article.status === ArticleStatus.Repealed;

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="hover:bg-accent/50 flex w-full items-start gap-3 p-4 text-start transition-colors"
      >
        <span className="bg-primary/10 text-primary mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
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

          {article.hierarchy.length > 0 && (
            <span className="text-muted-foreground/80 truncate text-xs">
              {article.hierarchy.join(" ← ")}
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
          {/* Legal content, rendered exactly as the API returned it. */}
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
