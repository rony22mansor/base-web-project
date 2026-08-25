"use client";

import { BrowseScreen } from "@/src/shared/components/browse/BrowseScreen";
import { ResultsGrid } from "@/src/shared/components/browse/ResultsGrid";
import { Clock, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCaseSearchScreen } from "../hooks/useCaseSearchScreen";
import type { LegalCase } from "../types/interfaces/caseInterface";
import { CaseCard } from "./CaseCard";
import { CaseSearchFilters } from "./CaseSearchFilters";
import { CaseSearchIntro } from "./CaseSearchIntro";

/**
 * Feature 3: precedents, retrieved from past judgments by describing facts.
 *
 * Search-only — the corpus has no browse route on the Python side, so with no
 * query the grid is replaced by an explanation rather than an empty state.
 */
export function CaseSearchContainer() {
  const t = useTranslations("caseSearch");
  const screen = useCaseSearchScreen();

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
          scope={screen.scope}
          onScopeChange={screen.setScope}
          outcomes={screen.outcomes}
          outcomeCounts={screen.outcomeCounts}
          outcome={screen.outcome}
          onOutcomeChange={screen.setOutcome}
        />
      }
    >
      {/* A cold index costs about a minute on the first query. Say so before
          the wait rather than during it. */}
      {!screen.isIndexWarm && !screen.isSearchMode && (
        <p className="bg-tag-yellow text-tag-yellow-fg flex items-start gap-2 rounded-md px-3 py-2 text-xs">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          {t("coldStart")}
        </p>
      )}

      {screen.isSearchMode ? (
        <>
          <ResultsGrid<LegalCase>
            items={screen.cases}
            getKey={(legalCase) => legalCase.id}
            renderItem={(legalCase) => <CaseCard legalCase={legalCase} />}
            isLoading={screen.isLoading}
            isError={screen.isError}
            errorMessage={screen.errorMessage}
            onRetry={screen.retry}
            hasMore={false}
            isLoadingMore={false}
            onLoadMore={() => {}}
            emptyTitle={t("empty.searchTitle")}
            // `found: false` is a success, and the server sends its own Arabic
            // prose for it — prefer that over our generic copy.
            emptyDescription={
              screen.serverMessage ?? t("empty.searchDescription")
            }
          />

          {screen.tookMs !== undefined && !screen.isSearching && (
            <p className="text-text-tertiary flex items-center gap-1.5 text-xs">
              <Clock className="size-3" />
              {t("tookSeconds", {
                seconds: (screen.tookMs / 1000).toFixed(1),
              })}
            </p>
          )}
        </>
      ) : (
        <CaseSearchIntro onExample={screen.search} />
      )}
    </BrowseScreen>
  );
}
