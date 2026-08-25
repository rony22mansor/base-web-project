"use client";

import type { ArticleStatus } from "@/src/core/enums/legalDomain";
import { FilterChipGroup } from "@/src/shared/components/browse/FilterChipGroup";
import { Input } from "@/src/shared/components/ui/input";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLawStatusOptions } from "../config/lawSearchConfig";
import { UNGROUPED } from "../hooks/useLawSearchScreen";
import type { LawGroup } from "../types/interfaces/lawInterface";

interface LawSearchFiltersProps {
  /** Catalog mode: pick a group of laws and filter by name. */
  groups: LawGroup[];
  group: string | null;
  nameFilter: string;
  onGroupChange: (group: string | null) => void;
  onNameFilterChange: (value: string) => void;
  /** Search mode: the one filter retrieval understands. */
  status: ArticleStatus | null;
  onStatusChange: (status: ArticleStatus | null) => void;
  isSearchMode: boolean;
}

/**
 * The filter row changes with the mode, because the two modes filter different
 * things: browsing filters *laws* (group, name), searching filters the
 * *articles* that came back (status). Showing a law-name box next to semantic
 * results would suggest it narrows them, which it does not.
 */
export function LawSearchFilters({
  groups,
  group,
  nameFilter,
  onGroupChange,
  onNameFilterChange,
  status,
  onStatusChange,
  isSearchMode,
}: LawSearchFiltersProps) {
  const t = useTranslations("lawSearch.filters");
  const tBrowse = useTranslations("browse.filters");
  const statusOptions = useLawStatusOptions();

  if (isSearchMode) {
    return (
      <FilterChipGroup
        label={t("status")}
        allLabel={tBrowse("all")}
        value={status}
        onChange={onStatusChange}
        options={statusOptions}
      />
    );
  }

  return (
    <>
      <FilterChipGroup
        label={t("group")}
        allLabel={tBrowse("all")}
        value={group}
        onChange={onGroupChange}
        options={groups.map((item) => ({
          // `null` is a real group (the ungrouped laws), so it gets a sentinel
          // rather than being treated as "no filter".
          value: item.id ?? UNGROUPED,
          label: item.label,
          count: item.lawCount,
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
