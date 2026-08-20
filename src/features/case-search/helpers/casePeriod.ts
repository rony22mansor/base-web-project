import { CasePeriod } from "../enums/caseEnums";

/**
 * Boundaries for the date-range presets. Kept here rather than in the UI so the
 * service always sends the backend a plain ISO range, and swapping the presets
 * for real date pickers later touches nothing below this line.
 */
const RECENT_FROM = "2020-01-01";
const PAST_FROM = "2010-01-01";

export interface CaseDateRange {
  dateFrom?: string;
  dateTo?: string;
}

export const periodToDateRange = (
  period: CasePeriod | null,
): CaseDateRange => {
  switch (period) {
    case CasePeriod.Recent:
      return { dateFrom: RECENT_FROM };
    case CasePeriod.Past:
      return { dateFrom: PAST_FROM, dateTo: RECENT_FROM };
    case CasePeriod.Older:
      return { dateTo: PAST_FROM };
    default:
      return {};
  }
};
