/**
 * One retrieved precedent, as `POST /api/legal/cases/search` returns it.
 *
 * Every field here is legal content straight from the Python API — never
 * routed through the i18n message files. Names were redacted before the corpus
 * was published, so the long bodies carry `<DEFENDANT_1>`-style placeholders;
 * see `core/utils/functions/redaction`.
 */
export interface LegalCase {
  /** Stable grid key. The case number alone repeats across files. */
  id: string;
  /** Court's own case number, e.g. "711". */
  caseNumber: string;
  /** Source document, e.g. "711_verified_pickpocketing.docx". */
  fileName: string;
  /** Year the judgment was issued, as the corpus stores it (a string). */
  decisionYear: string;
  /**
   * 0..1. The endpoint itself reports a percentage; the adapter normalizes it
   * so this matches `LawArticle.score` and both can share `ScoreMeter`.
   */
  similarityScore: number;
  /** Raw outcome string; the API joins several with " | ". */
  outcome: string;
  /** `outcome` split back apart, for the badge row. */
  outcomes: string[];
  /** Charges the judgment dealt with, e.g. ["النشل"]. */
  crimes: string[];
  /** Penal-code article numbers relied on, e.g. ["629"]. */
  penalCodeArticles: string[];
  /** Other statutes cited, when the judgment reached outside the penal code. */
  otherLaws: string[];
  /** الوقائع — what happened. */
  factsText: string;
  /** الادعاء — what was charged, and under which article. */
  claimsText: string;
  /** التعليل — the court's reasoning. */
  reasoningText: string;
  /** منطوق الحكم — the operative ruling. */
  judgmentText: string;
}

/** One retrieval run. Retrieval returns a ranked set, not a page of rows. */
export interface CaseSearchResult {
  /** Echo of the submitted text — used to discard a stale response. */
  query: string;
  /** False when nothing cleared the similarity threshold. Still HTTP 200. */
  found: boolean;
  cases: LegalCase[];
  /** Arabic "nothing found" prose from the server. Render as the empty state. */
  message: string | null;
  /** Every parameter actually applied, defaults included. */
  paramsUsed: Record<string, unknown>;
  /** Server-side duration, for the "found N in Xs" line. */
  tookMs: number;
}

/** `GET /api/legal/cases/config` — the live server defaults. */
export interface CaseSearchConfig {
  defaults: {
    topK?: number;
    hybridTopK?: number;
    threshold?: number;
    rerankMaxLength?: number;
  };
  /** Field names the request body may override. */
  tunableInRequest: string[];
  /**
   * Whether the index and models are already in memory. False means the next
   * search pays the cold-start cost, which is worth warning about up front.
   */
  loaded: boolean;
}
