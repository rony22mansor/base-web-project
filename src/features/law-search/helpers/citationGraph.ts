import type { ArticleStatus } from "@/src/core/enums/legalDomain";
import type { LawArticle } from "../types/interfaces/lawInterface";

/** One article as a graph node — the catalog fields the graph actually needs. */
export interface CitationGraphNode {
  /** Bare article number — unique within one law, which is the graph's scope. */
  id: string;
  articleNumber: string;
  status: ArticleStatus;
  /** How many articles this one cites. */
  outDegree: number;
  /** How many articles cite this one. */
  inDegree: number;
}

/** A directed "cites" edge: `source` cites `target`. */
export interface CitationGraphEdge {
  source: string;
  target: string;
}

export interface CitationGraph {
  nodes: CitationGraphNode[];
  edges: CitationGraphEdge[];
}

/**
 * Builds one law's citation graph from its articles: a node per article, and
 * a directed edge for every article-to-article reference the catalog reports
 * via `citedArticleNumbers`.
 *
 * Only two laws in the corpus carry any citations at all — قانون العقوبات
 * العام and أصول المحاكمات الجزائية — everything else builds a graph with no
 * edges. This function does not know that; it just draws what the article
 * list it was given contains.
 *
 * `includeIsolated` controls whether articles with no citation in either
 * direction are kept. Off by default: in the penal code only 191 of 747
 * articles cite or are cited by anything, so including the rest would render
 * mostly as a field of disconnected dots around the actual graph.
 */
export function buildCitationGraph(
  articles: LawArticle[],
  includeIsolated: boolean,
): CitationGraph {
  const byNumber = new Map(articles.map((a) => [a.rawArticleNumber, a]));
  const inDegree = new Map<string, number>();
  const outDegree = new Map<string, number>();
  const edges: CitationGraphEdge[] = [];
  const seenEdges = new Set<string>();

  for (const article of articles) {
    const from = article.rawArticleNumber;

    for (const to of article.citedArticleNumbers ?? []) {
      // The corpus can list the same citation more than once (a phrase-level
      // link and a paragraph-level one pointing at the same article); a
      // repeat would just double-draw the same line.
      const key = `${from}->${to}`;
      if (seenEdges.has(key)) continue;
      seenEdges.add(key);

      // Every target the catalog reports resolves to a real article within
      // the same law in the live corpus — verified, not assumed — but an
      // edge to a number this fetch did not return would draw a line to
      // nothing, so it is dropped rather than trusted blindly.
      if (!byNumber.has(to)) continue;

      edges.push({ source: from, target: to });
      outDegree.set(from, (outDegree.get(from) ?? 0) + 1);
      inDegree.set(to, (inDegree.get(to) ?? 0) + 1);
    }
  }

  const nodes: CitationGraphNode[] = articles
    .map((article) => ({
      id: article.rawArticleNumber,
      articleNumber: article.articleNumber,
      status: article.status,
      outDegree: outDegree.get(article.rawArticleNumber) ?? 0,
      inDegree: inDegree.get(article.rawArticleNumber) ?? 0,
    }))
    // An edge always gives both of its ends a non-zero degree, so filtering
    // out zero-degree nodes here can never orphan one of the edges above.
    .filter(
      (node) => includeIsolated || node.outDegree > 0 || node.inDegree > 0,
    );

  return { nodes, edges };
}
