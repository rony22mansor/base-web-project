"use client";

import { Link } from "@/src/core/i18n/navigation";
import { AppRoutes } from "@/src/core/routing/app_routes";
import { cn } from "@/src/core/utils/utils";
import { FilterChipGroup } from "@/src/shared/components/browse/FilterChipGroup";
import { ResultsGrid } from "@/src/shared/components/browse/ResultsGrid";
import { ScrollToTopButton } from "@/src/shared/components/scroll-to-top-button";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  List,
  Search,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { useLawStatusOptions } from "../config/lawSearchConfig";
import { useLawScreen, type LawView } from "../hooks/useLawScreen";
import type { LawArticle } from "../types/interfaces/lawInterface";
import { LawArticleCard } from "./LawArticleCard";
import { LawBookReader } from "./book/LawBookReader";

/**
 * One law: its articles as a filterable list, or the whole thing read as a
 * book. The two are the same corpus fetched two different ways — see
 * `useLawScreen` for why they are separate queries.
 */
export function LawDetailContainer({ lawId }: { lawId: string }) {
  const t = useTranslations("lawSearch.law");
  const tBrowse = useTranslations("browse");
  const screen = useLawScreen(lawId);
  const statusOptions = useLawStatusOptions();
  const { law } = screen;
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pt-8 md:px-5 md:pt-12 lg:px-6"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-16">
        <Link
          href={AppRoutes.lawSearch}
          className="text-text-secondary hover:text-foreground inline-flex w-fit items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowRight className="size-4 rotate-180 rtl:rotate-0" />
          {t("backToLaws")}
        </Link>

        <header className="flex flex-col gap-2">
          {screen.isLawLoading && !law ? (
            <Skeleton className="h-9 w-2/3" />
          ) : (
            <>
              <h1 className="text-[28px] leading-tight font-bold tracking-tight">
                {law?.shortName ?? law?.name ?? lawId}
              </h1>
              {/* The full name, when the heading showed the short one. */}
              {law?.shortName && (
                <p className="text-text-secondary text-sm">{law.name}</p>
              )}
              <p className="text-text-tertiary flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                {law && (
                  <span className="tabular-nums">
                    {t("articleCount", { count: law.articleCount })}
                  </span>
                )}
                {law?.hasSections && (
                  <span className="tabular-nums">
                    {t("sectionCount", { count: law.sectionCount })}
                  </span>
                )}
                {law?.group && (
                  <span className="bg-tag-gray text-tag-gray-fg rounded-sm px-1.5 py-0.5">
                    {law.group}
                  </span>
                )}
              </p>
            </>
          )}
        </header>

        <ViewToggle view={screen.view} onChange={screen.setView} />

        {screen.view === "list" ? (
          <>
            <div className="flex flex-col gap-3">
              <FilterChipGroup
                label={t("status")}
                allLabel={tBrowse("filters.all")}
                value={screen.status}
                onChange={screen.setStatus}
                options={statusOptions}
              />

              <div className="relative max-w-sm">
                <Search className="text-muted-foreground pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  value={screen.articleQuery}
                  onChange={(event) => screen.setArticleQuery(event.target.value)}
                  placeholder={t("articleSearchPlaceholder")}
                  aria-label={t("articleSearchLabel")}
                  className="h-9 ps-9"
                  dir="auto"
                />
              </div>
            </div>

            {screen.total !== undefined && (
              <p className="text-text-tertiary text-xs" aria-live="polite">
                {tBrowse("summary.browsing", { count: screen.total })}
              </p>
            )}

            <ResultsGrid<LawArticle>
              items={screen.articles}
              getKey={(article) => article.id}
              renderItem={(article) => <LawArticleCard article={article} />}
              isLoading={screen.isListLoading}
              isError={screen.isListError}
              errorMessage={screen.listErrorMessage}
              onRetry={screen.retryList}
              hasMore={screen.hasMore}
              isLoadingMore={screen.isLoadingMore}
              onLoadMore={screen.loadMore}
              emptyTitle={t("empty.title")}
              emptyDescription={t("empty.description")}
            />
          </>
        ) : (
          <BookPane screen={screen} />
        )}
      </div>

      <ScrollToTopButton containerRef={scrollRef} />
    </div>
  );
}

/** List vs. book. Segmented rather than a dropdown — there are exactly two. */
function ViewToggle({
  view,
  onChange,
}: {
  view: LawView;
  onChange: (view: LawView) => void;
}) {
  const t = useTranslations("lawSearch.law");

  const options: { value: LawView; label: string; icon: typeof List }[] = [
    { value: "list", label: t("viewList"), icon: List },
    { value: "book", label: t("viewBook"), icon: BookOpen },
  ];

  return (
    <div
      className="bg-tag-gray inline-flex w-fit gap-1 rounded-md p-1"
      role="group"
      aria-label={t("viewLabel")}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={view === option.value}
          className={cn(
            "duration-120 ease-gentle inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
            view === option.value
              ? "bg-background shadow-sm"
              : "text-text-secondary hover:text-foreground",
          )}
        >
          <option.icon className="size-4" />
          {option.label}
        </button>
      ))}
    </div>
  );
}

/**
 * The book's own states. It can't reuse `ResultsGrid`, which is built around a
 * paged list of cards — the reader is one document, and its loading state is a
 * page of text rather than a grid of tiles.
 */
function BookPane({ screen }: { screen: ReturnType<typeof useLawScreen> }) {
  const t = useTranslations("lawSearch.book");
  const tBrowse = useTranslations("browse.states");

  if (screen.isBookLoading) {
    return (
      <div
        className="flex flex-col gap-4"
        role="status"
        aria-busy="true"
        aria-label={t("loading")}
      >
        {/* The whole law arrives in one response, so this can be a long wait
            on the larger laws — say what is happening rather than spinning. */}
        <p className="text-text-secondary text-sm">{t("loading")}</p>
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-20 rounded-md" />
        ))}
      </div>
    );
  }

  if (screen.isBookError) {
    return (
      <div className="bg-tag-red flex flex-col items-center gap-3 rounded-md p-10 text-center">
        <AlertTriangle className="text-tag-red-fg size-6" />
        <h2 className="text-base font-semibold">{tBrowse("errorTitle")}</h2>
        <p className="text-text-secondary max-w-lg text-sm">
          {screen.bookErrorMessage || tBrowse("errorDescription")}
        </p>
        <Button variant="outline" onClick={() => screen.retryBook()}>
          {tBrowse("retry")}
        </Button>
      </div>
    );
  }

  if (!screen.book) return null;

  return <LawBookReader book={screen.book} />;
}
