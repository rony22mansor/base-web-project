"use client";

import { BrowseScreen } from "@/src/shared/components/browse/BrowseScreen";
import { ResultsGrid } from "@/src/shared/components/browse/ResultsGrid";
import { useTranslations } from "next-intl";
import { useLawSearchScreen } from "../hooks/useLawSearchScreen";
import type { LawArticle } from "../types/interfaces/lawInterface";
import { LawArticleCard } from "./LawArticleCard";
import { LawSearchFilters } from "./LawSearchFilters";

/** Feature 2: browse legal articles, or retrieve them semantically. */
export function LawSearchContainer() {
  const t = useTranslations("lawSearch");
  const screen = useLawSearchScreen();

  // The empty state says different things when browsing vs. searching.
  const isSearchMode = screen.query.length > 0;

  return (
    <BrowseScreen
      title={t("title")}
      description={t("description")}
      total={screen.total}
      searchPlaceholder={t("searchPlaceholder")}
      activeQuery={screen.query}
      isSearching={screen.isSearching}
      onSearch={screen.search}
      onClearSearch={screen.clearSearch}
      filters={
        <LawSearchFilters
          categories={screen.categories}
          lawId={screen.lawId}
          status={screen.status}
          onLawChange={screen.setLawId}
          onStatusChange={screen.setStatus}
        />
      }
    >
      <ResultsGrid<LawArticle>
        items={screen.items}
        getKey={(article) => article.id}
        renderItem={(article) => <LawArticleCard article={article} />}
        isLoading={screen.isLoading}
        isError={screen.isError}
        errorMessage={screen.errorMessage}
        onRetry={screen.retry}
        hasMore={screen.hasMore}
        isLoadingMore={screen.isLoadingMore}
        onLoadMore={screen.loadMore}
        emptyTitle={isSearchMode ? t("empty.searchTitle") : t("empty.title")}
        emptyDescription={
          isSearchMode ? t("empty.searchDescription") : t("empty.description")
        }
      />
    </BrowseScreen>
  );
}
