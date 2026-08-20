import type { ArticleStatus } from "@/src/core/enums/legalDomain";
import type { PageParams } from "@/src/core/types/pagination";

/**
 * Query for the article list. One endpoint serves both modes: with `query` set
 * the backend runs semantic retrieval, without it a filtered browse.
 */
export interface LawSearchParams extends PageParams {
  /** Semantic query. Empty/absent while browsing. */
  query?: string;
  /** Restrict to one parent law. */
  lawId?: string;
  status?: ArticleStatus;
}
