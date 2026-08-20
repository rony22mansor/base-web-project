"use client";

import { BrowseScreen } from "@/src/shared/components/browse/BrowseScreen";
import { ResultsGrid } from "@/src/shared/components/browse/ResultsGrid";
import { useTranslations } from "next-intl";
import { useContractTemplatesScreen } from "../hooks/useContractTemplatesScreen";
import type { ContractTemplate } from "../types/interfaces/contractTemplateInterface";
import { ContractTemplateCard } from "./ContractTemplateCard";
import { ContractTemplatesFilters } from "./ContractTemplatesFilters";

/** Feature 4: browse contract templates, or retrieve them semantically. */
export function ContractTemplatesContainer() {
  const t = useTranslations("contractTemplates");
  const screen = useContractTemplatesScreen();

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
        <ContractTemplatesFilters
          typeCounts={screen.typeCounts}
          type={screen.type}
          onTypeChange={screen.setType}
        />
      }
    >
      <ResultsGrid<ContractTemplate>
        items={screen.items}
        getKey={(template) => template.id}
        renderItem={(template) => <ContractTemplateCard template={template} />}
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
