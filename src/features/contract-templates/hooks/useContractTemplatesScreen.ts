"use client";

import { useState } from "react";
import type { ContractTemplateType } from "../enums/contractEnums";
import { useContractTemplates } from "../services/queries/useContractTemplates";
import { useContractTemplateTypes } from "../services/queries/useContractTemplateTypes";

/**
 * Drives the single browse + search view. The query is only applied on submit
 * (semantic retrieval is expensive and the wireframe puts it behind a button),
 * whereas filter chips apply immediately.
 *
 * Paging lives in React Query, so there is no accumulated-items state here to
 * fall out of sync with the filters.
 */
export function useContractTemplatesScreen() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<ContractTemplateType | null>(null);

  const templates = useContractTemplates({
    query: query || undefined,
    type: type ?? undefined,
  });

  const types = useContractTemplateTypes();

  const pages = templates.data?.pages ?? [];
  const items = pages.flatMap((page) => page.items);
  const total = pages[0]?.total;

  // Shaped for the chip options, which want a lookup rather than a list.
  const typeCounts = Object.fromEntries(
    (types.data?.data ?? []).map((entry) => [entry.type, entry.count]),
  ) as Partial<Record<ContractTemplateType, number>>;

  return {
    // filters
    query,
    type,
    setType,
    search: setQuery,
    clearSearch: () => setQuery(""),
    typeCounts,

    // data
    items,
    total: templates.isPending ? undefined : total,

    // request state
    isLoading: templates.isPending,
    isSearching: templates.isFetching && !templates.isFetchingNextPage,
    isError: templates.isError,
    errorMessage: templates.error?.message,
    retry: templates.refetch,
    hasMore: templates.hasNextPage,
    isLoadingMore: templates.isFetchingNextPage,
    loadMore: templates.fetchNextPage,
  };
}
