import type { ArticleStatus } from "@/src/core/enums/legalDomain";

/**
 * One legal article. `title` and `text` are legal content straight from the
 * Python API — they are never routed through the i18n message files.
 */
export interface LawArticle {
  id: string;
  /** e.g. "المادة 540". */
  articleNumber: string;
  /** Short heading for the article. */
  title: string;
  /** Parent law, e.g. "قانون العقوبات السوري". */
  lawName: string;
  lawId: string;
  /** باب / فصل breadcrumb, ordered outermost first. */
  hierarchy: string[];
  text: string;
  status: ArticleStatus;
  /**
   * 0..1 semantic relevance. Present only on semantic-search results, absent
   * when plain browsing.
   */
  score?: number;
}

/** A law the articles can be filtered by (the top of the باب/فصل hierarchy). */
export interface LawCategory {
  id: string;
  name: string;
  articleCount: number;
}
