"use client";

import { ArticleStatus } from "@/src/core/enums/legalDomain";
import { cn } from "@/src/core/utils/utils";
import { useTranslations } from "next-intl";

const STATUS_STYLES: Record<ArticleStatus, string> = {
  [ArticleStatus.Regular]:
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  [ArticleStatus.Amended]: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  [ArticleStatus.Repealed]: "bg-destructive/10 text-destructive",
};

/**
 * CLAUDE_monsif.md requires a repealed (ملغاة) article to be flagged wherever
 * it appears, since it stays searchable but is no longer authoritative. Shared
 * so the ruling generator's citations and law search's cards can never label
 * the same status differently.
 */
export function ArticleStatusBadge({
  status,
  className,
}: {
  status: ArticleStatus;
  className?: string;
}) {
  const t = useTranslations("legal.articleStatus");

  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
        className,
      )}
    >
      {t(status)}
    </span>
  );
}
