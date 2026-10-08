"use client";

import { useMemo, useState } from "react";
import { buildCitationGraph } from "../helpers/citationGraph";
import { useLawCatalog } from "../services/queries/useLawCatalog";
import { useLawCitationArticles } from "../services/queries/useLawCitationArticles";

/**
 * The only two laws in the corpus that carry any article-to-article citation
 * at all — verified against the live catalog, not assumed. Every other law's
 * graph would have nodes and no edges, so the screen offers just these two
 * rather than a picker over all 25.
 */
export const CITATION_GRAPH_LAW_IDS = [
  "مرسوم تشريعي رقم 148 لعام 1949 - قانون العقوبات العام",
  "مرسوم تشريعي رقم 112 لعام 1950 - قانون أصول المحاكمات الجزائية",
] as const;

/**
 * Drives the citation graph screen: which of the two laws is showing, whether
 * uncited articles are included, and the built (but not yet laid out) graph.
 *
 * Layout is deliberately not computed here — `d3-force` needs the canvas's
 * actual pixel dimensions, which only the rendering component knows, so
 * `CitationGraphCanvas` runs `layoutCitationGraph` itself once it has both
 * this graph and a measured size.
 */
export function useCitationGraphScreen() {
  const [lawId, setLawId] = useState<string>(CITATION_GRAPH_LAW_IDS[0]);
  const [includeIsolated, setIncludeIsolated] = useState(false);

  // Cheap and already cached from the laws browse screen — used only for the
  // two laws' display names, never for anything that decides the graph.
  const catalog = useLawCatalog();
  const laws = useMemo(
    () =>
      CITATION_GRAPH_LAW_IDS.map((id) => {
        const law = catalog.data?.data.laws.find((item) => item.id === id);
        return { id, label: law?.shortName ?? law?.name ?? id };
      }),
    [catalog.data],
  );

  const articles = useLawCitationArticles(lawId);
  const items = useMemo(
    () => articles.data?.data.items ?? [],
    [articles.data],
  );

  const graph = useMemo(
    () => buildCitationGraph(items, includeIsolated),
    [items, includeIsolated],
  );

  return {
    laws,
    lawId,
    setLawId,
    includeIsolated,
    setIncludeIsolated,

    graph,
    /** Every article in the law, regardless of the isolated-articles toggle. */
    totalArticles: items.length,

    isLoading: articles.isPending,
    isError: articles.isError,
    errorMessage: articles.error?.message,
    retry: articles.refetch,
  };
}
