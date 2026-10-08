"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiQuery } from "@/src/core/network/useApiHooks";
import { lawCatalogService } from "../lawCatalogService";

/**
 * Every article of one law, for the citation graph — no body text, since the
 * graph only needs `citedArticleNumbers`/`citedByArticleNumbers`, which the
 * catalog reports whether or not the body is included. Dropping it turns the
 * penal code's response from ~1.9 MB into a few hundred KB.
 *
 * Deliberately unpaginated, the same way `useLawBook` is: the graph needs
 * every article at once to lay itself out, not a page at a time.
 */
export function useLawCitationArticles(lawId: string | null) {
  return useApiQuery({
    queryKey: [QUERY_KEYS.LAW_ARTICLES, "citationGraph", lawId ?? ""],
    queryFn: () =>
      lawCatalogService.articles({
        lawId: lawId as string,
        includeBody: false,
      }),
    enabled: !!lawId,
    staleTime: 30 * 60 * 1000,
    retry: false,
  });
}
