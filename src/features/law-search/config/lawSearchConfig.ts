"use client";

import { ArticleStatus } from "@/src/core/enums/legalDomain";
import type { FilterChipOption } from "@/src/shared/components/browse/FilterChipGroup";
import { useTranslations } from "next-intl";

/**
 * Feature-local config for law search. The search-query schema itself is shared
 * with the other two browse screens and lives in
 * `shared/components/browse/semanticSearchConfig` — only the filter definitions
 * are specific to this feature.
 */

/** Filter values are the enum itself, so the chip group stays typed. */
export const LAW_STATUS_FILTERS: ArticleStatus[] = [
  ArticleStatus.Regular,
  ArticleStatus.Amended,
  ArticleStatus.Repealed,
];

/** Status chips, labelled from the shared legal namespace. */
export const useLawStatusOptions = (): FilterChipOption<ArticleStatus>[] => {
  const t = useTranslations("legal.articleStatus");

  return LAW_STATUS_FILTERS.map((status) => ({
    value: status,
    label: t(status),
  }));
};
