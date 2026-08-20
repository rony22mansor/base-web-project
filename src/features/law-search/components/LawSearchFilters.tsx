"use client";

import type { ArticleStatus } from "@/src/core/enums/legalDomain";
import { FilterChipGroup } from "@/src/shared/components/browse/FilterChipGroup";
import { useTranslations } from "next-intl";
import { useLawStatusOptions } from "../config/lawSearchConfig";
import type { LawCategory } from "../types/interfaces/lawInterface";

interface LawSearchFiltersProps {
  categories: LawCategory[];
  lawId: string | null;
  status: ArticleStatus | null;
  onLawChange: (lawId: string | null) => void;
  onStatusChange: (status: ArticleStatus | null) => void;
}

/** Filter by parent law and by lifecycle status, per ui-features.md. */
export function LawSearchFilters({
  categories,
  lawId,
  status,
  onLawChange,
  onStatusChange,
}: LawSearchFiltersProps) {
  const t = useTranslations("lawSearch.filters");
  const tBrowse = useTranslations("browse.filters");
  const statusOptions = useLawStatusOptions();

  return (
    <>
      <FilterChipGroup
        label={t("law")}
        allLabel={tBrowse("all")}
        value={lawId}
        onChange={onLawChange}
        options={categories.map((category) => ({
          value: category.id,
          label: category.name,
          count: category.articleCount,
        }))}
      />

      <FilterChipGroup
        label={t("status")}
        allLabel={tBrowse("all")}
        value={status}
        onChange={onStatusChange}
        options={statusOptions}
      />
    </>
  );
}
