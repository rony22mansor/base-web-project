/**
 * Contract templates. Two shapes, because the API is a two-step flow: search
 * returns candidates without their bodies, and only `/contracts/get` carries
 * the text and the placeholder list.
 *
 * Every string is Arabic content from the corpus and is rendered as it arrives.
 */

/**
 * A template without its body — what both listing endpoints return.
 *
 * Browsing and searching produce the same row with one difference: `score`
 * exists only when the row was ranked, so it is optional rather than defaulted
 * to zero. A browsed template has no relevance, and showing it as 0% would be
 * a claim the endpoint never made.
 */
export interface ContractTemplateSummary {
  docId: string;
  /** Free-text category from the corpus, e.g. "عقود بيع متنوعة - بيع العقارات". */
  category: string;
  /** The template's title. */
  subject: string;
  /** Semicolon-separated keywords in the source; split here for display. */
  keywords: string[];
  /** How many blanks the editor will ask the user to fill. */
  placeholderCount: number;
  /** Cosine similarity, 0..1. Absent when browsing. */
  score?: number;
}

/** One page of `GET /api/legal/contracts`. */
export interface ContractBrowseResult {
  templates: ContractTemplateSummary[];
  /** Rows matching the filters, across every page. */
  totalMatched: number;
  /** The whole corpus, regardless of filters. */
  totalContracts: number;
  /** Category → count, for the filter chips. Always the unfiltered counts. */
  categories: { category: string; count: number }[];
  page: number;
  totalPages: number;
  hasMore: boolean;
}

/** The full template from `POST /api/legal/contracts/get`. */
export interface ContractTemplate {
  docId: string;
  category: string;
  subject: string;
  keywords: string[];
  /** The text with `[[N:type]]` tags still in it — parse with `parseContractBody`. */
  body: string;
  /**
   * The same text with every blank rendered as `___`. Useful as a fallback and
   * as the "empty form" export, but it cannot be filled in: the runs of
   * underscores carry no index, so they cannot be matched back to a field.
   */
  rawBody: string;
  placeholders: ContractPlaceholder[];
}

/**
 * One blank. The corpus gives an index and a type and nothing else — no label,
 * no name — which is why the editor derives each field's label from the words
 * surrounding it in the body.
 */
export interface ContractPlaceholder {
  /** 1-based, and the number that appears in the `[[N:type]]` tag. */
  index: number;
  type: ContractFieldType;
}

/** The only three types in the corpus, verified across all 211 templates. */
export type ContractFieldType = "text" | "number" | "datetime";

/**
 * The LLM's pick among the candidates, when `suggest` was on.
 *
 * It never decides: `choice` is a candidate's 1-based position and the user
 * still chooses. `choice: null` with a reason means the model looked and found
 * none of them suitable, which is worth showing.
 */
export interface ContractSuggestion {
  /** 1-based position in the results, or null when nothing fit. */
  choice: number | null;
  docId: string | null;
  subject: string | null;
  /** Why, in Arabic. Null when the model gave none. */
  reason: string | null;
  /** Set when the suggestion layer itself failed (missing key, bad JSON). */
  error: string | null;
}

/** One search run. */
export interface ContractSearchResult {
  query: string;
  found: boolean;
  templates: ContractTemplateSummary[];
  /** Present only when `suggest` was on and there were candidates. */
  suggestion: ContractSuggestion | null;
  /** Arabic "nothing matched" prose. Render as the empty state. */
  message: string | null;
  tookMs: number;
}

/** `GET /api/legal/contracts/config`, once the index is warm. */
export interface ContractsConfig {
  loaded: boolean;
  /** Absent until the index loads. */
  totalContracts: number | null;
  /** Category → template count, ordered by count. Empty until warm. */
  categories: { category: string; count: number }[];
}
