"use client";

import type { FilterChipOption } from "@/src/shared/components/browse/FilterChipGroup";
import { useTranslations } from "next-intl";
import { ContractTemplateType } from "../enums/contractEnums";

/**
 * Feature-local config for contract templates. The search-query schema itself
 * is shared with the other two browse screens and lives in
 * `shared/components/browse/semanticSearchConfig` — only the filter definitions
 * are specific to this feature.
 */
export const useContractTypeOptions = (
  counts: Partial<Record<ContractTemplateType, number>>,
): FilterChipOption<ContractTemplateType>[] => {
  const t = useTranslations("contractTemplates.types");

  return Object.values(ContractTemplateType).map((type) => ({
    value: type,
    label: t(type),
    count: counts[type],
  }));
};
