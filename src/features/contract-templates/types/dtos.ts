/**
 * Query for `POST /api/legal/contracts/search`.
 *
 * There is no browse endpoint for this corpus either — a template is reached by
 * describing the contract you want.
 */
export interface ContractSearchParams {
  /** What the user wants, in their own words. Sent as `text`. */
  query: string;
  /** Candidates returned. Server default 5. */
  topK?: number;
  /** Cosine cut-off, 0..1. Server default 0. */
  minScore?: number;
  /**
   * Ask the LLM which candidate fits best. Costs one model call and needs a
   * provider key; false gives pure semantic search.
   */
  suggest?: boolean;
}

/**
 * Filters for `GET /api/legal/contracts`.
 *
 * `q` is a plain substring match over the subject, category, keywords and id —
 * not semantic. That is the point of this endpoint: it never loads the encoder,
 * so it answers instantly and is what a browse UI should call.
 */
export interface ContractBrowseParams {
  /** Substring filter. Absent shows everything. */
  q?: string;
  /** Exact category, as it appears in the category map. */
  category?: string;
  /** 1-based. */
  page?: number;
  perPage?: number;
}
