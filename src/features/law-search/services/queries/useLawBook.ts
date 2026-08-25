"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiQuery } from "@/src/core/network/useApiHooks";
import { lawCatalogService } from "../lawCatalogService";

/**
 * A whole law for the book reader — every article, every body, one request,
 * no pages. Held in cache far longer than a list would be: re-fetching the
 * penal code costs ~1.9 MB, and losing the reader's place to a background
 * refetch is worse than showing text that is a few minutes stale.
 */
export function useLawBook(lawId: string, enabled = true) {
  return useApiQuery({
    queryKey: [QUERY_KEYS.LAW_BOOK, lawId],
    queryFn: () => lawCatalogService.book(lawId),
    enabled: enabled && lawId.length > 0,
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
