import type { PageParams } from "@/src/core/types/pagination";
import type { ContractTemplateType } from "../enums/contractEnums";

/**
 * Query for the template list. One endpoint serves both modes: with `query` set
 * the backend runs semantic retrieval, without it a filtered browse.
 */
export interface ContractTemplateSearchParams extends PageParams {
  /** Semantic query. Empty/absent while browsing. */
  query?: string;
  type?: ContractTemplateType;
}
