import type { ArticleStatus } from "@/src/core/enums/legalDomain";
import type { PageParams } from "@/src/core/types/pagination";

/**
 * Query for the semantic (RAG) endpoint. `query` is required there — browsing
 * is a different endpoint entirely (see `LawArticlesParams`).
 */
export interface LawSearchParams extends PageParams {
  /** Semantic query. Empty/absent while browsing. */
  query?: string;
  /** Restrict to one parent law. */
  lawId?: string;
  status?: ArticleStatus;
}

/** Filters for the laws catalog (`GET /api/legal/laws`). */
export interface LawCatalogParams {
  /** Substring match on law name, short name or id. */
  q?: string;
  /**
   * Top-level group. `null`/absent means "every law"; the backend has no way
   * to ask for *only* the ungrouped ones, so that filter is applied client-side.
   */
  group?: string;
}

/** Filters for one law's articles (`GET /api/legal/laws/<id>/articles`). */
export interface LawArticlesParams extends Partial<PageParams> {
  lawId: string;
  status?: ArticleStatus;
  /** Exact `category_key` from a previous response. */
  categoryKey?: string;
  /** Substring match on article number or body. */
  q?: string;
  /**
   * Drop the three body fields. The penal code goes 1.9 MB → 1.2 MB, which is
   * worth it for a table of contents but never for a reading view.
   */
  includeBody?: boolean;
}
