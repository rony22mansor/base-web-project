"use client";

import { useMemo, useState } from "react";
import { useContractBrowse } from "../services/queries/useContractBrowse";
import { useContractSearch } from "../services/queries/useContractSearch";
import { useContractsConfig } from "../services/queries/useContractsConfig";

/**
 * Drives the templates screen, which is two modes of one view:
 *
 * - no query -> browse the corpus (instant; the endpoint never loads the
 *   encoder, and filters by category and substring straight off its records)
 * - a query  -> semantic retrieval over the same corpus
 *
 * That split matters here more than elsewhere: someone who already knows they
 * want a lease should be able to find it by name without paying for an
 * embedding, and someone who only knows what they need the contract to *do*
 * should be able to describe it. The bottom search bar switches between them.
 *
 * The LLM suggestion layer is opt-in. It is not merely an extra cost — it is
 * hard-wired to Groq, so without GROQ_API_KEY the request 503s instead of
 * returning results, and defaulting it on would break search outright on a
 * server that uses a different provider.
 */
export function useContractSearchScreen() {
  const [query, setQuery] = useState("");
  const [suggest, setSuggest] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState("");

  const isSearchMode = query.length > 0;

  const browse = useContractBrowse(
    { q: nameFilter || undefined, category: category ?? undefined },
    !isSearchMode,
  );
  const search = useContractSearch({ query, suggest });
  const config = useContractsConfig();

  const searchResult = search.data?.data;
  const browsePages = useMemo(() => browse.data?.pages ?? [], [browse.data]);
  const browsed = useMemo(
    () => browsePages.flatMap((page) => page.templates),
    [browsePages],
  );

  /**
   * Category chips come from the browse response when it has arrived, and from
   * /config otherwise — the two report the same map, and taking whichever is
   * present keeps the chips from vanishing between listings.
   */
  const categories =
    browsePages[0]?.categories ?? config.data?.data.categories ?? [];

  return {
    // mode
    isSearchMode,

    // filters
    query,
    search: setQuery,
    clearSearch: () => setQuery(""),
    suggest,
    setSuggest,
    category,
    setCategory,
    nameFilter,
    setNameFilter,
    categories,

    // data, from whichever mode is showing
    templates: isSearchMode ? (searchResult?.templates ?? []) : browsed,
    suggestion: searchResult?.suggestion?.error
      ? null
      : (searchResult?.suggestion ?? null),
    serverMessage: isSearchMode ? (searchResult?.message ?? undefined) : undefined,
    tookMs: isSearchMode ? searchResult?.tookMs : undefined,

    total: isSearchMode
      ? search.isPending
        ? undefined
        : (searchResult?.templates.length ?? 0)
      : browse.isPending
        ? undefined
        : browsePages[0]?.totalMatched,

    totalContracts:
      browsePages[0]?.totalContracts ?? config.data?.data.totalContracts ?? null,

    /** False means the first request pays the index's cold-start cost. */
    isIndexWarm: (config.data?.data.loaded ?? true) || browse.isSuccess,

    // request state, taken from whichever query is driving the view
    isLoading: isSearchMode ? search.isPending : browse.isPending,
    isSearching: isSearchMode ? search.isFetching : browse.isFetching,
    isError: isSearchMode ? search.isError : browse.isError,
    errorMessage: isSearchMode ? search.error?.message : browse.error?.message,
    retry: isSearchMode ? search.refetch : browse.refetch,
    hasMore: !isSearchMode && browse.hasNextPage,
    isLoadingMore: browse.isFetchingNextPage,
    loadMore: browse.fetchNextPage,
  };
}
