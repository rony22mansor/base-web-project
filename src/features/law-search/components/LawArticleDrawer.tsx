"use client";

import { ArticleStatus } from "@/src/core/enums/legalDomain";
import { DetailDrawer } from "@/src/shared/components/browse/DetailDrawer";
import { ArticleStatusBadge } from "@/src/shared/components/legal/ArticleStatusBadge";
import { ScoreMeter } from "@/src/shared/components/legal/ScoreMeter";
import { useTranslations } from "next-intl";
import type { LawArticle } from "../types/interfaces/lawInterface";

/**
 * One article, in full.
 *
 * Article bodies run from one line to several screens — the penal code's
 * longest are well past a thousand words, and retrieval attaches every article
 * they cite on top of that. Expanding all of it inside a grid cell pushed the
 * neighbouring results off-screen and lost the reader's place, so the grid now
 * keeps its shape and the body opens here instead.
 */
export function LawArticleDrawer({
  article,
  open,
  onOpenChange,
}: {
  article: LawArticle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("lawSearch.card");
  const isRepealed = article.status === ArticleStatus.Repealed;

  return (
    <DetailDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={article.articleNumber}
      subtitle={article.lawName}
      meta={
        <>
          <ArticleStatusBadge status={article.status} />
          {article.score !== undefined && (
            <ScoreMeter
              value={article.score}
              label={t("relevance", {
                percent: Math.round(article.score * 100),
              })}
            />
          )}
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {/* كتاب › باب › فصل. The catalog supplies it; retrieval does not. */}
        {article.hierarchy.length > 0 && (
          <p dir="rtl" className="text-text-tertiary text-xs">
            {article.hierarchy.join(" › ")}
          </p>
        )}

        {isRepealed && (
          <p className="bg-tag-red text-tag-red-fg rounded-md px-3 py-2 text-xs font-medium">
            {t("repealedNote")}
          </p>
        )}

        {/* Legal content — rendered exactly as the API returned it, and always
            right-to-left: the corpus is Arabic whatever the interface language,
            so an LTR paragraph would strand its punctuation and its article
            numbers at the wrong end of each line. */}
        <p dir="rtl" className="text-sm leading-7 whitespace-pre-line">
          {article.text}
        </p>

        {/* Citations as the catalog reports them: article numbers within the
            same law, so they read as a "see also" line rather than as the full
            articles retrieval attaches below. */}
        {!!article.citedArticleNumbers?.length && (
          <p className="text-muted-foreground flex flex-wrap items-center gap-1.5 border-t pt-4 text-xs">
            <span>{t("cites")}</span>
            {article.citedArticleNumbers.map((number) => (
              <span
                key={number}
                className="bg-tag-blue text-tag-blue-fg rounded-sm px-1.5 py-0.5 font-medium tabular-nums"
              >
                {number}
              </span>
            ))}
          </p>
        )}

        {/* المواد المرتبطة — articles the RAG pipeline pulled in because this
            one cites them. Semantic results only. */}
        {!!article.dependencies?.length && (
          <section className="flex flex-col gap-3 border-t pt-4">
            <h3 className="text-xs font-semibold">
              {t("dependencies", { count: article.dependencies.length })}
            </h3>

            {article.dependencies.map((dependency) => (
              <div
                key={dependency.id}
                className="border-border/60 flex flex-col gap-1 border-s-2 ps-3"
              >
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold">
                    {dependency.articleNumber}
                  </span>
                  <ArticleStatusBadge status={dependency.status} />
                  <span className="text-muted-foreground/80 text-xs">
                    {t("via", { article: dependency.via })}
                  </span>
                </span>
                <p
                  dir="rtl"
                  className="text-muted-foreground text-xs leading-6 whitespace-pre-line"
                >
                  {dependency.text}
                </p>
              </div>
            ))}
          </section>
        )}
      </div>
    </DetailDrawer>
  );
}
