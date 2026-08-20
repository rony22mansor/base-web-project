"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import { AlertTriangle, Loader2, SearchX } from "lucide-react";
import { useTranslations } from "next-intl";

interface ResultsGridProps<T> {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  isLoading: boolean;
  isError: boolean;
  /** Server-supplied detail, when there is one. */
  errorMessage?: string;
  onRetry: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  /** Empty-state copy — differs per feature and per browse/search mode. */
  emptyTitle: string;
  emptyDescription: string;
}

const SKELETON_COUNT = 4;

/**
 * The two-column card grid from the wireframe, plus the states the sketch
 * doesn't show: first load, request failure, no results, and loading more.
 */
export function ResultsGrid<T>({
  items,
  getKey,
  renderItem,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  hasMore,
  isLoadingMore,
  onLoadMore,
  emptyTitle,
  emptyDescription,
}: ResultsGridProps<T>) {
  const t = useTranslations("browse");

  if (isLoading) {
    return (
      <div
        className="grid gap-4 lg:grid-cols-2"
        role="status"
        aria-busy="true"
        aria-label={t("states.loading")}
      >
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <Skeleton key={index} className="h-36 rounded-md" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-tag-red flex flex-col items-center gap-3 rounded-md p-10 text-center">
        <span className="text-tag-red-fg flex size-10 items-center justify-center">
          <AlertTriangle className="size-6" />
        </span>
        <h2 className="text-base font-semibold">{t("states.errorTitle")}</h2>
        <p className="text-text-secondary max-w-lg text-sm">
          {errorMessage || t("states.errorDescription")}
        </p>
        <Button variant="outline" onClick={() => onRetry()}>
          {t("states.retry")}
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border border-dashed p-10 text-center">
        <span className="bg-accent text-text-secondary flex size-10 items-center justify-center rounded-full">
          <SearchX className="size-6" />
        </span>
        <h2 className="text-base font-semibold">{emptyTitle}</h2>
        <p className="text-text-secondary max-w-lg text-sm">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <div key={getKey(item)}>{renderItem(item)}</div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={() => onLoadMore()}
            disabled={isLoadingMore}
            className="gap-2"
          >
            {isLoadingMore && <Loader2 className="size-4 animate-spin" />}
            {t("states.loadMore")}
          </Button>
        </div>
      )}
    </div>
  );
}
