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

/**
 * One case as the catalog lists it (`GET /api/legal/cases`).
 *
 * Deliberately not a `LegalCase`: browsing carries no similarity score and no
 * judgment body, only a preview. Reusing the retrieval type would mean
 * inventing a score of zero and four empty sections for every browsed row, so
 * the two shapes stay distinct and the cards stay honest about what they know.
 */
export interface CaseSummary {
  /** Stable key. `caseUid` is unique per document; the number alone is not. */
  id: string;
  caseNumber: string;
  /** Unique document id, e.g. "711_verified_pickpocketing.docx". */
  caseUid: string;
  fileName: string;
  decisionYear: string;
  outcome: string;
  /** `outcome` split apart, for the badge row. */
  outcomes: string[];
  crimes: string[];
  penalCodeArticles: string[];
  otherLaws: string[];
  /** First ~200 characters of the judgment — the card's preview line. */
  textPreview: string;
  /** Document class, e.g. "Standard Judgment". */
  type: string;
}

/** A crime tag, with how many judgments carry it. */
export interface CaseCategory {
  crime: string;
  caseCount: number;
}

/**
 * One page of browsed cases, with the facets the corpus offers.
 *
 * `categories` are crime tags rather than a partition: a judgment routinely
 * deals with several crimes at once, so the counts across categories sum to
 * well over the number of cases and a case appears under each of its crimes.
 * That is why the UI filters by category instead of grouping under it —
 * grouping would show the same judgment several times.
 */
export interface CaseCatalog {
  cases: CaseSummary[];
  categories: CaseCategory[];
  availableOutcomes: string[];
  availableYears: string[];
  /** Rows matching the current filters, across all pages. */
  totalMatched: number;
  /** Size of the whole corpus, before any filter. */
  totalCases: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

/** Filters `GET /api/legal/cases` accepts. All optional. */
export interface CaseCatalogParams {
  crime?: string | null;
  outcome?: string | null;
  year?: string | null;
  q?: string | null;
  page?: number;
  pageSize?: number;
}

/** One titled part of a judgment, e.g. "في الوقائع". */
export interface CaseDocumentSection {
  /** The corpus's own Arabic heading — never translated. */
  title: string;
  text: string;
}

/**
 * One judgment in full (`GET /api/legal/cases/{caseNumber}`).
 *
 * The API returns the sections as an object, which Flask serializes with its
 * keys sorted alphabetically — putting أقرر, the verdict, before في الوقائع,
 * the facts. `sections` here is the same content restored to reading order;
 * see `CASE_SECTION_ORDER`.
 */
export interface CaseDocument {
  caseNumber: string;
  caseUid: string;
  fileName: string;
  decisionYear: string;
  outcome: string;
  outcomes: string[];
  crimes: string[];
  penalCodeArticles: string[];
  /** Articles of أصول المحاكمات الجزائية the judgment proceeded under. */
  criminalProceedingsArticles: string[];
  otherLaws: string[];
  feesLaw: string[];
  /** "نعم" / "لا" — whether the public prosecution was a party. */
  isPublicProsecution: string;
  type: string;
  /** In reading order, and only the parts that actually carry text. */
  sections: CaseDocumentSection[];
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
