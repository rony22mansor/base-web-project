import type { ContractTemplateType } from "../../enums/contractEnums";

/**
 * One contract template. `name` and `description` are content from the Python
 * API — they are never routed through the i18n message files.
 */
export interface ContractTemplate {
  id: string;
  name: string;
  type: ContractTemplateType;
  description: string;
  /** Number of fillable fields the editor will expose. */
  fieldCount: number;
  /** Rough length, shown so the user knows what they are opening. */
  clauseCount: number;
  /** ISO date string of the last revision. */
  updatedAt: string;
  /**
   * 0..1 semantic relevance. Present only on semantic-search results, absent
   * when plain browsing.
   */
  score?: number;
}

/** Type counts, used to label the filter chips. */
export interface ContractTemplateTypeCount {
  type: ContractTemplateType;
  count: number;
}
