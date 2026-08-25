"use client";

import { Button } from "@/src/shared/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Page controls for the browse grid.
 *
 * The corpus is served in pages rather than appended to, so this steps through
 * them instead of the "load more" the search grids use. Both arrows flip in
 * RTL, where "next" points left.
 */
export function CasePagination({
  page,
  totalPages,
  isFetching,
  onGoToPage,
}: {
  page: number;
  totalPages: number;
  isFetching: boolean;
  onGoToPage: (page: number) => void;
}) {
  const t = useTranslations("caseSearch.paging");

  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-between gap-3"
      aria-label={t("label")}
    >
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1 || isFetching}
        onClick={() => onGoToPage(page - 1)}
        className="gap-1"
      >
        <ChevronRight className="size-4 ltr:rotate-180" />
        {t("previous")}
      </Button>

      <span
        className="text-text-tertiary text-xs tabular-nums"
        aria-live="polite"
      >
        {t("position", { page, total: totalPages })}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages || isFetching}
        onClick={() => onGoToPage(page + 1)}
        className="gap-1"
      >
        {t("next")}
        <ChevronRight className="size-4 rotate-180 ltr:rotate-0" />
      </Button>
    </nav>
  );
}
