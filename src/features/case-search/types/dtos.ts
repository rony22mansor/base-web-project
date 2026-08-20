import type { CaseCategory } from "@/src/core/enums/legalDomain";
import type { PageParams } from "@/src/core/types/pagination";

/**
 * Query for the case list. One endpoint serves both modes: with `query` set the
 * backend runs semantic retrieval, without it a filtered browse.
 */
export interface CaseSearchParams extends PageParams {
  /** Semantic query. Empty/absent while browsing. */
  query?: string;
  category?: CaseCategory;
  /** Inclusive ISO date lower bound. */
  dateFrom?: string;
  /** Exclusive ISO date upper bound. */
  dateTo?: string;
}
