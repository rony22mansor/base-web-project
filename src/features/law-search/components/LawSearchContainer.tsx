"use client";

import { BrowseScreen } from "@/src/shared/components/browse/BrowseScreen";
import { ResultsGrid } from "@/src/shared/components/browse/ResultsGrid";
import { useTaskCompletionNotification } from "@/src/shared/hooks/useTaskCompletionNotification";
import { useTranslations } from "next-intl";
import { useLawSearchScreen } from "../hooks/useLawSearchScreen";
import type { Law, LawArticle } from "../types/interfaces/lawInterface";
import { LawArticleCard } from "./LawArticleCard";
import { LawCard } from "./LawCard";
import { LawSearchFilters } from "./LawSearchFilters";

/**
 * Laws: the catalog, and semantic retrieval over it.
 *
 * One view, two modes. With no query the grid lists the laws themselves —
 * that is the browse entry point, and each card opens the law's own screen
 * (list or book). Typing a query swaps the grid for retrieved articles, which
 * cut across laws and so cannot be a law list.
 */
export function LawSearchContainer() {
  const t = useTranslations("lawSearch");
  const screen = useLawSearchScreen();
  const { isSearchMode } = screen;

  // Cold retrieval costs ~45s — long enough that a reader who typed a query
  // and switched tabs should find out the moment results are back. Guarded to
  // search mode only: browsing the catalog is instant and not what this is
  // for, even though `screen.isLoading` already covers that on its own.
  useTaskCompletionNotification({
    isLoading: isSearchMode && screen.isLoading,
    isSuccess: isSearchMode && screen.isSuccess,
    isError: isSearchMode && screen.isError,
    tag: "law-search",
    successTitle: t("notification.successTitle"),
    successBody: t("notification.successBody"),
    errorTitle: t("notification.errorTitle"),
    errorBody: t("notification.errorBody"),
  });

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
          isSearchMode={isSearchMode}
          groups={screen.groups}
          group={screen.group}
          nameFilter={screen.nameFilter}
          onGroupChange={screen.setGroup}
          onNameFilterChange={screen.setNameFilter}
          status={screen.status}
          onStatusChange={screen.setStatus}
        />
      }
    >
      {isSearchMode ? (
        <ResultsGrid<LawArticle>
          items={screen.articles}
          getKey={(article) => article.id}
          renderItem={(article) => <LawArticleCard article={article} />}
          isLoading={screen.isLoading}
          isError={screen.isError}
          errorMessage={screen.errorMessage}
          onRetry={screen.retry}
          hasMore={screen.hasMore}
          isLoadingMore={screen.isLoadingMore}
          onLoadMore={screen.loadMore}
          emptyTitle={t("empty.searchTitle")}
          emptyDescription={t("empty.searchDescription")}
        />
      ) : (
        <ResultsGrid<Law>
          items={screen.laws}
          getKey={(law) => law.id}
          renderItem={(law) => <LawCard law={law} />}
          isLoading={screen.isLoading}
          isError={screen.isError}
          errorMessage={screen.errorMessage}
          onRetry={screen.retry}
          hasMore={false}
          isLoadingMore={false}
          onLoadMore={() => {}}
          emptyTitle={t("empty.lawsTitle")}
          emptyDescription={t("empty.lawsDescription")}
        />
      )}
    </BrowseScreen>
  );
}
