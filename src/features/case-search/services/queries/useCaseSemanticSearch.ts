"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiQuery } from "@/src/core/network/useApiHooks";
import type { CaseSearchParams } from "../../types/dtos";
import { caseSearchService } from "../caseSearchService";

/**
 * Precedent retrieval.
 *
 * A plain query, not an infinite one: the endpoint returns a single ranked set
 * cut by a similarity threshold, and "page 2" would mean re-running FAISS,
 * BM25, the fusion and the cross-encoder from scratch. Asking for more results
 * is `topK`, not a next page.
 *
 * Disabled until there is a query — the corpus cannot be browsed, and a cold
 * run costs ~45s while the models load.
 */
export function useCaseSemanticSearch(params: CaseSearchParams) {
  return useApiQuery({
    // Every tuning field is part of the key: changing the threshold is a
    // different retrieval run, not a re-render of the same one.
    queryKey: [
      QUERY_KEYS.CASE_SEARCH,
      params.query,
      params.topK ?? "",
      params.threshold ?? "",
    ],
    queryFn: () => caseSearchService.search(params),
    enabled: params.query.length > 0,
    // Retrieval is expensive; don't redo it because a tab regained focus.
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}
