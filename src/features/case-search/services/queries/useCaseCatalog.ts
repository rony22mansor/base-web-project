"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiQuery } from "@/src/core/network/useApiHooks";
import { caseCatalogService } from "../caseCatalogService";
import type { CaseCatalogParams } from "../../types/interfaces/caseInterface";

/**
 * One page of browsed cases. Reads the corpus rather than the RAG index, so
 * this is instant and safe to re-run on every filter change — unlike
 * `useCaseSemanticSearch`, which loads models on a cold server.
 */
export function useCaseCatalog(params: CaseCatalogParams) {
  return useApiQuery({
    queryKey: [
      QUERY_KEYS.CASE_CATALOG,
      params.crime ?? "",
      params.outcome ?? "",
      params.year ?? "",
      params.q ?? "",
      params.page ?? 1,
      params.pageSize ?? 0,
    ],
    queryFn: () => caseCatalogService.cases(params),
    // The corpus is a static file on the server; nothing invalidates within a
    // session, and keeping pages warm makes the filter chips feel instant.
    staleTime: 30 * 60 * 1000,
    // Facet lists would otherwise blank out between pages, collapsing the
    // filter row every time the reader steps through the corpus.
    placeholderData: (previous) => previous,
    retry: false,
  });
}
