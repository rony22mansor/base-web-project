/**
 * `ArticleStatus` and `CaseCategory` are shared with law search / case search,
 * so they live in `core/enums/legalDomain`. Re-exported here so this feature's
 * imports stay in one place.
 */
export { ArticleStatus, CaseCategory } from "@/src/core/enums/legalDomain";

/** Buckets used only to colour/label the confidence meter. */
export enum ConfidenceLevel {
  Low = "low",
  Medium = "medium",
  High = "high",
}
