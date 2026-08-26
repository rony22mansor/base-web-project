"use client";

import { BrowseScreen } from "@/src/shared/components/browse/BrowseScreen";
import { ResultsGrid } from "@/src/shared/components/browse/ResultsGrid";
import { useTaskCompletionNotification } from "@/src/shared/hooks/useTaskCompletionNotification";
import { Clock, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCaseBrowseScreen } from "../hooks/useCaseBrowseScreen";
import { useCaseSearchScreen } from "../hooks/useCaseSearchScreen";
import type {
  CaseSummary,
  LegalCase,
} from "../types/interfaces/caseInterface";
import { CaseBrowseFilters } from "./CaseBrowseFilters";
import { CaseCard } from "./CaseCard";
import { CaseCatalogCard } from "./CaseCatalogCard";
import { CaseCategoryPanel } from "./CaseCategoryPanel";
import { CaseSearchFilters } from "./CaseSearchFilters";

/**
 * Feature 3: precedents — the judgments corpus browsed, and retrieved.
 *
 * One view, two modes, matching laws. With no query the grid lists the whole
 * corpus, organised by the crimes it is tagged with; typing a query swaps it
 * for the cases retrieval ranked against the described facts.
 *
 * The two halves cannot share a hook: browsing filters server-side over every
 * case and pages through the result, while retrieval returns one ranked set
 * whose chips can only re-filter what came back. They also cost very different
 * things — the catalog is instant, retrieval loads models.
 */
export function CaseSearchContainer() {
  const t = useTranslations("caseSearch");
  const search = useCaseSearchScreen();
  const browse = useCaseBrowseScreen();
  const { isSearchMode } = search;

  // Cold retrieval costs ~45s — long enough that a reader who described their
  // facts and switched tabs should find out the moment results are back.
  useTaskCompletionNotification({
    isLoading: search.isLoading,
    isSuccess: search.isSuccess,
    isError: search.isError,
    tag: "case-search",
    successTitle: t("notification.successTitle"),
    successBody: t("notification.successBody"),
    errorTitle: t("notification.errorTitle"),
    errorBody: t("notification.errorBody"),
  });

  return (
    <BrowseScreen
      title={t("title")}
      description={t("description")}
      total={isSearchMode ? search.total : browse.total}
      searchPlaceholder={t("searchPlaceholder")}
      activeQuery={search.query}
      isSearching={search.isSearching}
      onSearch={search.search}
      onClearSearch={search.clearSearch}
      filters={
        isSearchMode ? (
          <CaseSearchFilters
            outcomes={search.outcomes}
            outcomeCounts={search.outcomeCounts}
            outcome={search.outcome}
            onOutcomeChange={search.setOutcome}
          />
        ) : (
          <>
            <CaseCategoryPanel
              categories={browse.categories}
              value={browse.crime}
              onChange={browse.setCrime}
            />
            <CaseBrowseFilters
              outcomes={browse.outcomes}
              outcome={browse.outcome}
              onOutcomeChange={browse.setOutcome}
              years={browse.years}
              year={browse.year}
              onYearChange={browse.setYear}
              hasFilters={browse.hasFilters}
              onClear={browse.clearFilters}
            />
          </>
        )
      }
    >
      {/* A cold index costs about a minute on the first query. Say so before
          the wait rather than during it — browsing never pays that cost, so
          this is a note about searching, shown next to the search bar. */}
      {!search.isIndexWarm && !isSearchMode && (
        <p className="bg-tag-yellow text-tag-yellow-fg flex items-start gap-2 rounded-md px-3 py-2 text-xs">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          {t("coldStart")}
        </p>
      )}

      {isSearchMode ? (
        <>
          <ResultsGrid<LegalCase>
            items={search.cases}
            getKey={(legalCase) => legalCase.id}
            renderItem={(legalCase) => <CaseCard legalCase={legalCase} />}
            isLoading={search.isLoading}
            isError={search.isError}
            errorMessage={search.errorMessage}
            onRetry={search.retry}
            hasMore={false}
            isLoadingMore={false}
            onLoadMore={() => {}}
            emptyTitle={t("empty.searchTitle")}
            // `found: false` is a success, and the server sends its own Arabic
            // prose for it — prefer that over our generic copy.
            emptyDescription={
              search.serverMessage ?? t("empty.searchDescription")
            }
          />

          {search.tookMs !== undefined && !search.isSearching && (
            <p className="text-text-tertiary flex items-center gap-1.5 text-xs">
              <Clock className="size-3" />
              {t("tookSeconds", {
                seconds: (search.tookMs / 1000).toFixed(1),
              })}
            </p>
          )}
        </>
      ) : (
        <ResultsGrid<CaseSummary>
          items={browse.cases}
          getKey={(legalCase) => legalCase.id}
          renderItem={(legalCase) => (
            <CaseCatalogCard legalCase={legalCase} />
          )}
          isLoading={browse.isLoading}
          isError={browse.isError}
          errorMessage={browse.errorMessage}
          onRetry={browse.retry}
          hasMore={browse.hasMore}
          isLoadingMore={browse.isLoadingMore}
          onLoadMore={browse.loadMore}
          emptyTitle={t("empty.browseTitle")}
          emptyDescription={t("empty.browseDescription")}
        />
      )}
    </BrowseScreen>
  );
}
