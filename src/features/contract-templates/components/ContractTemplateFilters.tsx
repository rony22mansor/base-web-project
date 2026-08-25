"use client";

import { FilterChipGroup } from "@/src/shared/components/browse/FilterChipGroup";
import { Input } from "@/src/shared/components/ui/input";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

interface ContractTemplateFiltersProps {
  /** Browse and search expose different controls; only one set is useful. */
  isSearchMode: boolean;
  categories: { category: string; count: number }[];
  category: string | null;
  onCategoryChange: (category: string | null) => void;
  nameFilter: string;
  onNameFilterChange: (value: string) => void;
  suggest: boolean;
  onSuggestChange: (suggest: boolean) => void;
}

/**
 * Two different filter sets, because the two modes filter differently: browsing
 * narrows an exact category and matches substrings, while searching ranks the
 * whole corpus and the only knob is whether to ask the model for a pick.
 */
export function ContractTemplateFilters({
  isSearchMode,
  categories,
  category,
  onCategoryChange,
  nameFilter,
  onNameFilterChange,
  suggest,
  onSuggestChange,
}: ContractTemplateFiltersProps) {
  const t = useTranslations("contractTemplates.filters");
  const tBrowse = useTranslations("browse.filters");

  // if (isSearchMode) {
  //   return (
  //     <label className="flex w-fit items-center gap-2.5">
  //       {/* <Switch checked={suggest} onCheckedChange={onSuggestChange} />
  //       <span className="flex flex-col">
  //         <span className="text-sm font-medium">{t("suggest")}</span>
  //         <span className="text-text-tertiary text-xs">{t("suggestHint")}</span>
  //       </span> */}
  //     </label>
  //   );
  // }

  return (
    <>
      {/* 44 categories is too many for a chip row, so the list is capped and
          the substring filter below is how you reach the rest. */}
      <FilterChipGroup<string>
        label={t("category")}
        allLabel={tBrowse("all")}
        value={category}
        onChange={onCategoryChange}
        options={categories.slice(0, 12).map((entry) => ({
          value: entry.category,
          label: entry.category,
          count: entry.count,
        }))}
      />

      <div className="relative max-w-sm">
        <Search className="text-muted-foreground pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          value={nameFilter}
          onChange={(event) => onNameFilterChange(event.target.value)}
          placeholder={t("namePlaceholder")}
          aria-label={t("nameLabel")}
          className="h-9 ps-9"
          dir="auto"
        />
      </div>
    </>
  );
}
