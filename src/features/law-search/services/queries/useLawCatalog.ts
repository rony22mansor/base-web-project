"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiQuery } from "@/src/core/network/useApiHooks";
import type { LawCatalogParams } from "../../types/dtos";
import { lawCatalogService } from "../lawCatalogService";

/**
 * The laws catalog. Cached long: it reads a file that ships with the backend,
 * so it changes on deploys rather than on writes, and a law list that flickers
 * on every visit reads as broken.
 */
export function useLawCatalog(params: LawCatalogParams = {}) {
  return useApiQuery({
    queryKey: [QUERY_KEYS.LAW_CATALOG, params.q ?? "", params.group ?? ""],
    queryFn: () => lawCatalogService.laws(params),
    staleTime: 30 * 60 * 1000,
    retry: false,
  });
}
