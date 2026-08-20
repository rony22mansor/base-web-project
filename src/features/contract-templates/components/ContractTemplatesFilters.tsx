"use client";

import { FilterChipGroup } from "@/src/shared/components/browse/FilterChipGroup";
import { useTranslations } from "next-intl";
import { useContractTypeOptions } from "../config/contractTemplatesConfig";
import type { ContractTemplateType } from "../enums/contractEnums";

interface ContractTemplatesFiltersProps {
  typeCounts: Partial<Record<ContractTemplateType, number>>;
  type: ContractTemplateType | null;
  onTypeChange: (type: ContractTemplateType | null) => void;
}

/** Filter by template type, per ui-features.md. */
export function ContractTemplatesFilters({
  typeCounts,
  type,
  onTypeChange,
}: ContractTemplatesFiltersProps) {
  const t = useTranslations("contractTemplates.filters");
  const tBrowse = useTranslations("browse.filters");
  const typeOptions = useContractTypeOptions(typeCounts);

  return (
    <FilterChipGroup
      label={t("type")}
      allLabel={tBrowse("all")}
      value={type}
      onChange={onTypeChange}
      options={typeOptions}
    />
  );
}
