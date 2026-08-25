"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiQuery } from "@/src/core/network/useApiHooks";
import { lawCatalogService } from "../lawCatalogService";

/**
 * One article by its composite id. Lets a citation open on its own without
 * pulling down the law that contains it — the RAG results and the catalog use
 * the same id, so a hit's dependency resolves straight through this.
 */
export function useLawArticle(articleId: string | null) {
  return useApiQuery({
    queryKey: [QUERY_KEYS.LAW_ARTICLE, articleId ?? ""],
    queryFn: () => lawCatalogService.article(articleId as string),
    enabled: !!articleId,
    staleTime: 30 * 60 * 1000,
    retry: false,
  });
}
