"use client";

import { ArticleStatus } from "@/src/core/enums/legalDomain";
import { Link } from "@/src/core/i18n/navigation";
import { AppRoutes } from "@/src/core/routing/app_routes";
import { Card } from "@/src/shared/components/ui/card";
import { BookOpen, ChevronRight, Layers, ScrollText } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Law } from "../types/interfaces/lawInterface";

/** The lifecycle counts worth surfacing on a card, in reading order. */
const STATUS_ORDER: ArticleStatus[] = [
  ArticleStatus.Amended,
  ArticleStatus.Repealed,
];

/**
 * One law in the catalog grid.
 *
 * Shows `shortName` as the heading where there is one — the twelve amnesty
 * decrees have opaque ids and very long names, so the short label is the only
 * readable title — with the full name beneath it. The id is never displayed.
 */
export function LawCard({ law }: { law: Law }) {
  const t = useTranslations("lawSearch.law");
  const tStatus = useTranslations("legal.articleStatus");
  const title = law.shortName ?? law.name;
  const subtitle = law.shortName ? law.name : null;

  return (
    <Card className="h-full gap-0 overflow-hidden py-0">
      <Link
        href={AppRoutes.law(law.id)}
        className="hover:bg-accent/50 flex h-full items-start gap-3 p-4 transition-colors"
      >
        <span className="bg-accent text-text-secondary mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-sm">
          <BookOpen className="size-4" />
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="text-sm leading-relaxed font-semibold">{title}</span>

          {subtitle && (
            <span className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
              {subtitle}
            </span>
          )}

          <span className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1 tabular-nums">
              <ScrollText className="size-3.5" />
              {t("articleCount", { count: law.articleCount })}
            </span>

            {/* Only structured laws can be read as a book; the amnesty decrees
                are a flat run of articles and say so instead. */}
            {law.hasSections ? (
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Layers className="size-3.5" />
                {t("sectionCount", { count: law.sectionCount })}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <Layers className="size-3.5" />
                {t("flat")}
              </span>
            )}
          </span>

          <span className="flex flex-wrap items-center gap-1.5">
            {STATUS_ORDER.map((status) => {
              const count = law.statusCounts[status];
              if (!count) return null;
              return (
                <span
                  key={status}
                  className={
                    status === ArticleStatus.Repealed
                      ? "bg-tag-red text-tag-red-fg rounded-sm px-1.5 py-0.5 text-[11px] font-medium"
                      : "bg-tag-yellow text-tag-yellow-fg rounded-sm px-1.5 py-0.5 text-[11px] font-medium"
                  }
                >
                  {tStatus(status)} {count}
                </span>
              );
            })}
          </span>
        </span>

        {/* Points "forward": the layout sets dir, the variant flips the icon. */}
        <ChevronRight className="text-muted-foreground mt-1 size-4 shrink-0 rtl:rotate-180" />
      </Link>
    </Card>
  );
}
