/**
 * `ArticleStatus` and `CaseCategory` are shared with law search / case search,
 * so they live in `core/enums/legalDomain`. Re-exported here so this feature's
 * imports stay in one place.
 */
export { ArticleStatus, CaseCategory } from "@/src/core/enums/legalDomain";

/**
 * How much of the prediction pipeline to run.
 *
 * The endpoint makes up to five LLM calls: one to reorganize the facts, up to
 * three to tell confusable statutes apart, and one for the judgment itself.
 * The first two stages are optional, and turning them off is the difference
 * between roughly a minute and roughly ten seconds — a trade the user should
 * be making knowingly rather than one buried in a config file.
 */
export enum JudgmentMode {
  /** Server defaults: every stage runs. */
  Thorough = "thorough",
  /** One LLM call. Same retrieval, less deliberation. */
  Fast = "fast",
}
