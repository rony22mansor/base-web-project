"use client";

import { Link } from "@/src/core/i18n/navigation";
import { AppRoutes } from "@/src/core/routing/app_routes";
import { cn } from "@/src/core/utils/utils";
import { Input } from "@/src/shared/components/ui/input";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useCitationGraphScreen } from "../../hooks/useCitationGraphScreen";
import { CitationGraphArticleDrawer } from "./CitationGraphArticleDrawer";
import { CitationGraphCanvas } from "./CitationGraphCanvas";

/**
 * How the two laws' internal citations connect their own articles, drawn as a
 * force-directed graph — قانون العقوبات العام and أصول المحاكمات الجزائية are
 * the only laws in the corpus with any article-to-article references at all,
 * so this is a picker between exactly those two rather than a general "graph
 * any law" tool.
 */
export function CitationGraphContainer() {
  const t = useTranslations("lawSearch.graph");
  const screen = useCitationGraphScreen();

  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // The number a reader typed only counts as "found" once it matches a node
  // actually on screen — a number outside the graph (unfilterable, wrong law)
  // should not draw a highlight ring around nothing.
  const trimmedSearch = search.trim();
  const highlightedId = screen.graph.nodes.some(
    (node) => node.id === trimmedSearch,
  )
    ? trimmedSearch
    : null;

  const openArticle = (articleNumber: string) => {
    setSelectedArticle(articleNumber);
    setIsDrawerOpen(true);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 px-3 pt-8 pb-4 md:px-5 md:pt-12 lg:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Link
            href={AppRoutes.lawSearch}
            className="text-text-secondary hover:text-foreground inline-flex w-fit items-center gap-1.5 text-sm transition-colors"
          >
            <ArrowRight className="size-4 rotate-180 rtl:rotate-0" />
            {t("backToLaws")}
          </Link>

          <h1 className="text-[28px] leading-tight font-bold tracking-tight">
            {t("title")}
          </h1>
          {/* <p className="text-text-secondary max-w-2xl text-sm">
            {t("description")}
          </p> */}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className="bg-tag-gray inline-flex w-fit gap-1 rounded-md p-1"
            role="group"
            aria-label={t("lawSwitch")}
          >
            {screen.laws.map((law) => (
              <button
                key={law.id}
                type="button"
                onClick={() => screen.setLawId(law.id)}
                aria-pressed={screen.lawId === law.id}
                dir="rtl"
                className={cn(
                  "duration-120 ease-gentle rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
                  screen.lawId === law.id
                    ? "bg-background shadow-sm"
                    : "text-text-secondary hover:text-foreground",
                )}
              >
                {law.label}
              </button>
            ))}
          </div>

          <label className="text-text-secondary flex items-center gap-1.5 text-xs font-medium">
            <input
              type="checkbox"
              checked={screen.includeIsolated}
              onChange={(event) =>
                screen.setIncludeIsolated(event.target.checked)
              }
              className="accent-link size-3.5"
            />
            {t("includeIsolated")}
          </label>

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            dir="auto"
            className="h-8 max-w-40 text-xs"
          />

          <span className="text-text-tertiary ms-auto text-xs tabular-nums">
            {t("nodeCount", {
              shown: screen.graph.nodes.length,
              total: screen.totalArticles,
            })}
          </span>
        </div>

        {screen.isLoading ? (
          <Skeleton className="min-h-0 flex-1 rounded-md" />
        ) : screen.isError ? (
          <div className="bg-tag-red flex flex-1 flex-col items-center justify-center gap-3 rounded-md p-10 text-center">
            <AlertTriangle className="text-tag-red-fg size-6" />
            <h2 className="text-base font-semibold">{t("errorTitle")}</h2>
            <p className="text-text-secondary max-w-lg text-sm">
              {screen.errorMessage || t("errorDescription")}
            </p>
          </div>
        ) : (
          <CitationGraphCanvas
            graph={screen.graph}
            highlightedId={highlightedId}
            onSelectArticle={openArticle}
          />
        )}

        <Legend />
      </div>

      <CitationGraphArticleDrawer
        lawId={screen.lawId}
        articleNumber={selectedArticle}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </div>
  );
}

/** Node color = status, matching `ArticleStatusBadge`'s own vocabulary. */
function Legend() {
  const t = useTranslations("legal.articleStatus");
  const tGraph = useTranslations("lawSearch.graph");

  const items: { key: "regular" | "amended" | "repealed"; color: string }[] = [
    { key: "regular", color: "bg-tag-green-fg" },
    { key: "amended", color: "bg-tag-yellow-fg" },
    { key: "repealed", color: "bg-tag-red-fg" },
  ];

  return (
    <div className="text-text-tertiary flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
      {items.map((item) => (
        <span key={item.key} className="flex items-center gap-1.5">
          <span className={cn("size-2.5 rounded-full", item.color)} />
          {t(item.key)}
        </span>
      ))}
      <span>{tGraph("legendHint")}</span>
    </div>
  );
}
