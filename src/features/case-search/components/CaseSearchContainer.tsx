"use client";

import { BrowseScreen } from "@/src/shared/components/browse/BrowseScreen";
import { ResultsGrid } from "@/src/shared/components/browse/ResultsGrid";
import { useTranslations } from "next-intl";
import { useCaseSearchScreen } from "../hooks/useCaseSearchScreen";
import type { LegalCase } from "../types/interfaces/caseInterface";
import { CaseCard } from "./CaseCard";
import { CaseSearchFilters } from "./CaseSearchFilters";

/** Feature 3: browse case law, or retrieve similar cases semantically. */
export function CaseSearchContainer() {
  const t = useTranslations("caseSearch");
  const screen = useCaseSearchScreen();

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
        <CaseSearchFilters
          categoryCounts={screen.categoryCounts}
          category={screen.category}
          period={screen.period}
          onCategoryChange={screen.setCategory}
          onPeriodChange={screen.setPeriod}
        />
      }
    >
      <ResultsGrid<LegalCase>
        items={screen.items}
        getKey={(legalCase) => legalCase.id}
        renderItem={(legalCase) => <CaseCard legalCase={legalCase} />}
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
