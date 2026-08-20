/**
 * `CaseCategory` is shared with the ruling generator, so it lives in
 * `core/enums/legalDomain`. Re-exported here so this feature's imports stay in
 * one place.
 */
export { CaseCategory } from "@/src/core/enums/legalDomain";

/**
 * Date-range presets for the filter row. ui-features.md asks for a date-range
 * filter but does not specify the control; presets keep it to one chip row
 * instead of two date pickers, and the service still sends real ISO bounds so
 * the backend contract is a plain range.
 */
export enum CasePeriod {
  Recent = "recent",
  Past = "past",
  Older = "older",
}
