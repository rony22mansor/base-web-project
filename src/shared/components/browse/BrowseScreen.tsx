"use client";

import { useTranslations } from "next-intl";
import { SemanticSearchBar } from "./SemanticSearchBar";

interface BrowseScreenProps {
  title: string;
  description: string;
  /** Filter controls, rendered above the grid. */
  filters: React.ReactNode;
  /** The grid itself — normally a `ResultsGrid`. */
  children: React.ReactNode;
  /** Total matching rows, for the summary line. `undefined` while loading. */
  total?: number;
  searchPlaceholder: string;
  activeQuery: string;
  isSearching: boolean;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
}

/**
 * Shell for the browse + semantic search pattern shared by law search, case
 * search and contract templates: header, filters, a scrolling grid, and the
 * search bar anchored to the bottom of the screen.
 *
 * The screen owns its scroll area (rather than sitting inside `BasePage`) so
 * only the grid scrolls and the search bar stays put — which is why the pages
 * render this straight into the (app) layout's flex column.
 *
 * Per ui-features.md this is deliberately one view, not two: searching
 * repopulates the same grid rather than navigating to a results page.
 */
export function BrowseScreen({
  title,
  description,
  filters,
  children,
  total,
  searchPlaceholder,
  activeQuery,
  isSearching,
  onSearch,
  onClearSearch,
}: BrowseScreenProps) {
  const t = useTranslations("browse");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-4 pt-8 md:px-6 md:pt-12 lg:px-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 pb-6">
          <header className="flex flex-col gap-2">
            <h1 className="text-[32px] leading-tight font-bold tracking-tight">
              {title}
            </h1>
            <p className="text-text-secondary max-w-2xl text-sm">
              {description}
            </p>
          </header>

          <div className="flex flex-col gap-3">{filters}</div>

          {/* Absent while loading and on error — the grid says so itself. */}
          {total !== undefined && (
            <p className="text-text-tertiary text-xs" aria-live="polite">
              {activeQuery
                ? t("summary.searchResults", { count: total })
                : t("summary.browsing", { count: total })}
            </p>
          )}

          {children}
        </div>
      </div>

      <SemanticSearchBar
        placeholder={searchPlaceholder}
        activeQuery={activeQuery}
        isSearching={isSearching}
        onSubmit={onSearch}
        onClear={onClearSearch}
      />
    </div>
  );
}
