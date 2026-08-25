"use client";

import { ArticleStatus } from "@/src/core/enums/legalDomain";
import { DetailDrawer } from "@/src/shared/components/browse/DetailDrawer";
import { ArticleStatusBadge } from "@/src/shared/components/legal/ArticleStatusBadge";
import { ScoreMeter } from "@/src/shared/components/legal/ScoreMeter";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toArticleLabel } from "../services/adapters/lawsCatalogAdapter";
import { useLawArticle } from "../services/queries/useLawArticle";
import type {
  LawArticle,
  LawArticleLinkTarget,
} from "../types/interfaces/lawInterface";
import { ArticleBodyText } from "./ArticleBodyText";

/** One step of the path the reader has followed through the corpus. */
interface TrailEntry {
  id: string;
  label: string;
}

/**
 * One article, in full — and whatever it led the reader to.
 *
 * Article bodies run from one line to several screens, which is why the grid
 * opens them here instead of expanding in place. Citations inside those bodies
 * are followable, and following one keeps the reader inside this panel: the
 * cited article replaces the body and the header grows a trail back to where
 * they started.
 *
 * The alternative — a second panel over the first — was rejected. Stacked
 * sheets fight over the focus trap, and on a phone the second one simply hides
 * the first, which loses exactly the relationship the trail is there to show.
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
  const tLinks = useTranslations("lawSearch.links");

  /** Articles opened from a citation, deepest last. Empty = the root article. */
  const [trail, setTrail] = useState<TrailEntry[]>([]);
  const [wasOpen, setWasOpen] = useState(open);

  // A fresh visit starts at the article the card opened. This is adjusted
  // during render rather than in an effect: an effect would cascade a second
  // render, and clearing on close instead would swap the body back to the root
  // article while the panel was still animating out.
  const isNewVisit = open && !wasOpen;
  if (open !== wasOpen) setWasOpen(open);
  if (isNewVisit && trail.length > 0) setTrail([]);

  // The reset above lands in the next render pass, so this pass reads through
  // it rather than briefly resolving the previous visit's article.
  const openTrail = isNewVisit ? [] : trail;
  const active = openTrail.at(-1) ?? null;

  const query = useLawArticle(active?.id ?? null);
  const shown = active ? query.data?.data : article;

  const followLink = (target: LawArticleLinkTarget) =>
    setTrail((current) =>
      // Re-following the article already on screen would stack a duplicate.
      current.at(-1)?.id === target.articleId
        ? current
        : [
            ...current,
            {
              id: target.articleId,
              label: toArticleLabel(target.articleNumber),
            },
          ],
    );

  const goToDepth = (depth: number) => setTrail((c) => c.slice(0, depth));

  return (
    <DetailDrawer
      open={open}
      onOpenChange={onOpenChange}
      // While a cited article loads, its number is already known from the link
      // that was followed — so the header names it instead of going blank.
      title={shown?.articleNumber ?? active?.label ?? article.articleNumber}
      subtitle={shown?.lawName ?? article.lawName}
      meta={
        <>
          {openTrail.length > 0 && (
            <ArticleTrail
              rootLabel={article.articleNumber}
              trail={openTrail}
              onGoToDepth={goToDepth}
            />
          )}

          {shown && <ArticleStatusBadge status={shown.status} />}

          {/* Relevance belongs to the search hit, so it is dropped once the
              reader has followed a citation away from it. */}
          {!active && article.score !== undefined && (
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
      {active && query.isLoading ? (
        <div className="flex flex-col gap-3" role="status" aria-busy="true">
          <span className="sr-only">
            {tLinks("loading", { article: active.label })}
          </span>
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : active && (query.isError || !shown) ? (
        <p className="bg-tag-red text-tag-red-fg flex items-start gap-2 rounded-md px-3 py-2 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>
            {query.error?.message || tLinks("error", { article: active.label })}
          </span>
        </p>
      ) : shown ? (
        <ArticleContent article={shown} onOpenArticle={followLink} />
      ) : null}
    </DetailDrawer>
  );
}

/**
 * The path from the article the reader opened to the one they are reading.
 *
 * This is the panel's answer to "how did these two articles end up related" —
 * without it, a cited article that replaced the body would look like a
 * navigation the reader could not account for.
 */
function ArticleTrail({
  rootLabel,
  trail,
  onGoToDepth,
}: {
  rootLabel: string;
  trail: TrailEntry[];
  onGoToDepth: (depth: number) => void;
}) {
  const t = useTranslations("lawSearch.links");
  const previousLabel = trail.at(-2)?.label ?? rootLabel;

  return (
    <nav
      aria-label={t("trailLabel")}
      className="flex w-full flex-wrap items-center gap-x-1.5 gap-y-1 text-xs"
    >
      <button
        type="button"
        onClick={() => onGoToDepth(trail.length - 1)}
        className="text-text-secondary hover:text-foreground inline-flex items-center gap-1 font-medium transition-colors"
      >
        <ArrowRight className="size-3.5 rotate-180 rtl:rotate-0" />
        {t("back", { article: previousLabel })}
      </button>

      <span className="text-text-tertiary flex flex-wrap items-center gap-x-1.5">
        <span aria-hidden>·</span>

        {/* Depth 0 is the article the card opened. */}
        <button
          type="button"
          onClick={() => onGoToDepth(0)}
          className="hover:text-foreground transition-colors"
        >
          {rootLabel}
        </button>

        {/* A path may revisit an article (5 → 11 → 5), so depth, not id, is
            what identifies a step. */}
        {trail.map((entry, index) => (
          <span
            key={`${index}-${entry.id}`}
            className="flex items-center gap-x-1.5"
          >
            <span aria-hidden>›</span>
            {index === trail.length - 1 ? (
              <span className="text-foreground font-medium">{entry.label}</span>
            ) : (
              <button
                type="button"
                onClick={() => onGoToDepth(index + 1)}
                className="hover:text-foreground transition-colors"
              >
                {entry.label}
              </button>
            )}
          </span>
        ))}
      </span>
    </nav>
  );
}

/** The article itself: breadcrumb, body, and the citations around it. */
function ArticleContent({
  article,
  onOpenArticle,
}: {
  article: LawArticle;
  onOpenArticle: (target: LawArticleLinkTarget) => void;
}) {
  const t = useTranslations("lawSearch.card");
  const isRepealed = article.status === ArticleStatus.Repealed;

  return (
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

      <ArticleBodyText
        text={article.text}
        links={article.bodyLinks}
        onOpenArticle={onOpenArticle}
        className="text-sm leading-7"
      />

      {/* Citations as the catalog reports them: article numbers within the
          same law. They stay even though the body links to them too — a
          citation the extractor could not place in the text appears only
          here, and this is also the whole list at a glance. */}
      {!!article.citedArticleNumbers?.length && (
        <p className="text-foreground flex flex-wrap items-center gap-1.5 border-t pt-4 text-[15px]">
          <span>{t("cites")}</span>
          {article.citedArticleNumbers.map((number) => (
            <button
              key={number}
              type="button"
              onClick={() =>
                onOpenArticle({
                  // The catalog reports in-law citations as bare numbers, and
                  // an article id is "{law_id}:{number}".
                  articleId: `${article.lawId}:${number}`,
                  articleNumber: number,
                  lawId: article.lawId,
                  confidence: "high",
                })
              }
              className="bg-tag-blue text-tag-blue-fg rounded-sm px-1.5 py-0.5 font-medium tabular-nums transition-opacity hover:opacity-80"
            >
              {number}
            </button>
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
  );
}
