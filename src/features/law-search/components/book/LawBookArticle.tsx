"use client";

import { ArticleStatus } from "@/src/core/enums/legalDomain";
import { ArticleStatusBadge } from "@/src/shared/components/legal/ArticleStatusBadge";
import { useTranslations } from "next-intl";
import { toDomId } from "../../helpers/lawBookTree";
import type { LawArticle } from "../../types/interfaces/lawInterface";

/**
 * One article as it reads inside the book: a numbered heading, the body, and
 * its citations as jump links.
 *
 * Nothing collapses here. The list view is where you look an article up; this
 * is where you read the law straight through, so every body is already open.
 */
export function LawBookArticle({
  article,
  onJumpToArticle,
}: {
  article: LawArticle;
  onJumpToArticle?: (articleNumber: string) => void;
}) {
  const t = useTranslations("lawSearch.book");
  const tCard = useTranslations("lawSearch.card");
  const citations = article.citedArticleNumbers ?? [];

  return (
    <article
      id={toDomId("article", `${article.lawId}:${article.rawArticleNumber}`)}
      className="scroll-mt-24 border-t py-4 first:border-t-0"
    >
      <header className="mb-2 flex flex-wrap items-center gap-2">
        <h4 className="text-sm font-semibold">{article.articleNumber}</h4>
        <ArticleStatusBadge status={article.status} />
      </header>

      {/* Legal content — rendered exactly as the API returned it. */}
      <p className="text-sm leading-7 whitespace-pre-line">{article.text}</p>

      {article.status === ArticleStatus.Repealed && (
        <p className="text-destructive mt-2 text-xs font-medium">
          {tCard("repealedNote")}
        </p>
      )}

      {citations.length > 0 && (
        <p className="text-muted-foreground mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          <span>{t("cites")}</span>
          {citations.map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => onJumpToArticle?.(number)}
              className="bg-tag-blue text-tag-blue-fg hover:opacity-80 rounded-sm px-1.5 py-0.5 font-medium tabular-nums transition-opacity"
            >
              {number}
            </button>
          ))}
        </p>
      )}
    </article>
  );
}
