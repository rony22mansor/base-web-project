"use client";

import { ArticleStatus } from "@/src/core/enums/legalDomain";
import { cn } from "@/src/core/utils/utils";
import { useTranslations } from "next-intl";

/** Notion's named tag colours: green = in force, yellow = amended, red = repealed. */
const STATUS_STYLES: Record<ArticleStatus, string> = {
  [ArticleStatus.Regular]: "bg-tag-green text-tag-green-fg",
  [ArticleStatus.Amended]: "bg-tag-yellow text-tag-yellow-fg",
  [ArticleStatus.Repealed]: "bg-tag-red text-tag-red-fg",
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
        "inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
        className,
      )}
    >
      {t(status)}
    </span>
  );
}
