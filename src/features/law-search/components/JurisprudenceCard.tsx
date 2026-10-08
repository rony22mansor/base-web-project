"use client";

import { DetailDrawer } from "@/src/shared/components/browse/DetailDrawer";
import { ArticleStatusBadge } from "@/src/shared/components/legal/ArticleStatusBadge";
import { ScoreMeter } from "@/src/shared/components/legal/ScoreMeter";
import { Card } from "@/src/shared/components/ui/card";
import { ChevronRight, Gavel } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { JurisprudenceResult } from "../types/interfaces/jurisprudenceInterface";

/**
 * One جتهاد hit: a judicial interpretation of an article, distinct from the
 * article itself. Mirrors `LawArticleCard`'s card+drawer shape, but this
 * result has no id to fetch by — the drawer just shows the same object in
 * full, no navigation.
 */
export function JurisprudenceCard({
  jurisprudence,
}: {
  jurisprudence: JurisprudenceResult;
}) {
  const t = useTranslations("lawSearch.jurisprudence");
  const tCard = useTranslations("lawSearch.card");
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
              <Gavel className="size-4" />
            </span>

            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">
                  {jurisprudence.articleNumber}
                </span>
                <ArticleStatusBadge status={jurisprudence.status} />
              </span>

              <span className="text-muted-foreground truncate text-sm">
                {jurisprudence.lawName}
              </span>

              {jurisprudence.lawCategory && (
                <span className="text-muted-foreground/80 truncate text-xs">
                  {jurisprudence.lawCategory}
                </span>
              )}
            </span>

            <ScoreMeter
              value={jurisprudence.score}
              label={tCard("relevance", {
                percent: Math.round(jurisprudence.score * 100),
              })}
              className="mt-1 shrink-0"
            />
          </span>

          <span className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">
            {jurisprudence.jtihadText}
          </span>

          <span className="mt-auto flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-link ms-auto inline-flex items-center gap-1 font-medium">
              {t("open")}
              <ChevronRight className="size-3.5 rtl:rotate-180" />
            </span>
          </span>
        </button>
      </Card>

      <DetailDrawer
        open={isOpen}
        onOpenChange={setIsOpen}
        title={jurisprudence.articleNumber}
        subtitle={jurisprudence.lawName}
        meta={
          <>
            <ArticleStatusBadge status={jurisprudence.status} />
            <ScoreMeter
              value={jurisprudence.score}
              label={tCard("relevance", {
                percent: Math.round(jurisprudence.score * 100),
              })}
            />
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <section className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold">{t("jtihadLabel")}</h3>
            <p
              dir="rtl"
              className="text-foreground text-sm leading-7 whitespace-pre-line"
            >
              {jurisprudence.jtihadText}
            </p>
          </section>

          <section className="flex flex-col gap-2 border-t pt-4">
            <h3 className="text-xs font-semibold">{t("articleLabel")}</h3>
            <p
              dir="rtl"
              className="text-muted-foreground text-sm leading-7 whitespace-pre-line"
            >
              {jurisprudence.articleBody}
            </p>
          </section>
        </div>
      </DetailDrawer>
    </>
  );
}
