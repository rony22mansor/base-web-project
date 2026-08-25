"use client";

import { BrowseScreen } from "@/src/shared/components/browse/BrowseScreen";
import { ResultsGrid } from "@/src/shared/components/browse/ResultsGrid";
import { Clock, Info, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContractSearchScreen } from "../hooks/useContractSearchScreen";
import type { ContractTemplateSummary } from "../types/interfaces/contractTemplateInterface";
import { ContractTemplateCard } from "./ContractTemplateCard";
import { ContractTemplateFilters } from "./ContractTemplateFilters";

/**
 * Feature 4: find a contract template, then fill it in.
 *
 * One view, two modes. With no query the grid browses the corpus by category —
 * instant, since that endpoint never loads the encoder. Describing what the
 * contract is for switches to semantic retrieval over the same templates.
 */
export function ContractSearchContainer() {
  const t = useTranslations("contractTemplates");
  const screen = useContractSearchScreen();

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
        <ContractTemplateFilters
          isSearchMode={screen.isSearchMode}
          categories={screen.categories}
          category={screen.category}
          onCategoryChange={screen.setCategory}
          nameFilter={screen.nameFilter}
          onNameFilterChange={screen.setNameFilter}
          suggest={screen.suggest}
          onSuggestChange={screen.setSuggest}
        />
      }
    >
      {!screen.isIndexWarm && (
        <p className="bg-tag-yellow text-tag-yellow-fg flex items-start gap-2 rounded-md px-3 py-2 text-xs">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          {t("coldStart")}
        </p>
      )}

      {/* The model picks a favourite and says why; the user still chooses. */}
      {screen.isSearchMode && screen.suggestion?.reason && (
        <div className="bg-tag-blue text-tag-blue-fg flex items-start gap-2.5 rounded-md p-3">
          <Sparkles className="mt-0.5 size-4 shrink-0" />
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-xs font-semibold">
              {screen.suggestion.subject
                ? t("suggestion.title", { subject: screen.suggestion.subject })
                : t("suggestion.noneTitle")}
            </span>
            <span dir="rtl" className="text-xs leading-relaxed">
              {screen.suggestion.reason}
            </span>
          </div>
        </div>
      )}

      <ResultsGrid<ContractTemplateSummary>
        items={screen.templates}
        getKey={(template) => template.docId}
        renderItem={(template) => (
          <ContractTemplateCard
            template={template}
            isSuggested={screen.suggestion?.docId === template.docId}
          />
        )}
        isLoading={screen.isLoading}
        isError={screen.isError}
        errorMessage={screen.errorMessage}
        onRetry={screen.retry}
        hasMore={screen.hasMore}
        isLoadingMore={screen.isLoadingMore}
        onLoadMore={screen.loadMore}
        emptyTitle={
          screen.isSearchMode ? t("empty.searchTitle") : t("empty.browseTitle")
        }
        emptyDescription={
          screen.isSearchMode
            ? (screen.serverMessage ?? t("empty.searchDescription"))
            : t("empty.browseDescription")
        }
      />

      {screen.tookMs !== undefined && !screen.isSearching && (
        <p className="text-text-tertiary flex items-center gap-1.5 text-xs">
          <Clock className="size-3" />
          {t("tookSeconds", { seconds: (screen.tookMs / 1000).toFixed(1) })}
        </p>
      )}
    </BrowseScreen>
  );
}
