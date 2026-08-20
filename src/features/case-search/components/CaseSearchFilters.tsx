"use client";

import type { CaseCategory } from "@/src/core/enums/legalDomain";
import { FilterChipGroup } from "@/src/shared/components/browse/FilterChipGroup";
import { useTranslations } from "next-intl";
import {
  useCaseCategoryOptions,
  useCasePeriodOptions,
} from "../config/caseSearchConfig";
import type { CasePeriod } from "../enums/caseEnums";

interface CaseSearchFiltersProps {
  categoryCounts: Partial<Record<CaseCategory, number>>;
  category: CaseCategory | null;
  period: CasePeriod | null;
  onCategoryChange: (category: CaseCategory | null) => void;
  onPeriodChange: (period: CasePeriod | null) => void;
}

/** Filter by court category and by date range, per ui-features.md. */
export function CaseSearchFilters({
  categoryCounts,
  category,
  period,
  onCategoryChange,
  onPeriodChange,
}: CaseSearchFiltersProps) {
  const t = useTranslations("caseSearch.filters");
  const tBrowse = useTranslations("browse.filters");
  const categoryOptions = useCaseCategoryOptions(categoryCounts);
  const periodOptions = useCasePeriodOptions();

  return (
    <>
      <FilterChipGroup
        label={t("category")}
        allLabel={tBrowse("all")}
        value={category}
        onChange={onCategoryChange}
        options={categoryOptions}
      />

      <FilterChipGroup
        label={t("period")}
        allLabel={tBrowse("allTime")}
        value={period}
        onChange={onPeriodChange}
        options={periodOptions}
      />
    </>
  );
}
