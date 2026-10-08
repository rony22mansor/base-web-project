import type { ArticleStatus } from "@/src/core/enums/legalDomain";

/**
 * One جتهاد (jurisprudence/judicial interpretation) hit from the legacy
 * combined-search endpoint. Distinct from `LawArticle`: it has no
 * `article_id`, dependencies, or hierarchy — just the article it interprets
 * plus the interpretation text itself.
 */
export interface JurisprudenceResult {
  /** Synthesized client-side: no stable id comes from the API. */
  id: string;
  /** The interpretive text — the actual جتهاد. */
  jtihadText: string;
  /** e.g. "المادة 540". */
  articleNumber: string;
  lawName: string;
  /** Internal كتاب/باب/فصل category, when the corpus has one for this hit. */
  lawCategory: string | null;
  status: ArticleStatus;
  /** The interpreted article's own body, for context alongside the جتهاد. */
  articleBody: string;
  /** 0..1 semantic relevance. */
  score: number;
}
