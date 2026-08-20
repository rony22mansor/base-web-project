import type { CaseCategory } from "@/src/core/enums/legalDomain";

/**
 * One historical case. `title`, `summary` and `ruling` are legal content
 * straight from the Python API — never routed through the i18n message files.
 */
export interface LegalCase {
  id: string;
  title: string;
  /** e.g. "أساس 441 / قرار 318 لعام 2019". */
  caseNumber: string;
  category: CaseCategory;
  /** Issuing court. */
  court: string;
  /** ISO date string. */
  date: string;
  summary: string;
  /** What the court decided. */
  ruling: string;
  /** Article numbers the judgment relied on, as displayed strings. */
  citedArticles: string[];
  /**
   * 0..1 semantic relevance. Present only on semantic-search results, absent
   * when plain browsing.
   */
  score?: number;
}

/** Category counts, used to label the filter chips. */
export interface CaseCategoryCount {
  category: CaseCategory;
  count: number;
}
