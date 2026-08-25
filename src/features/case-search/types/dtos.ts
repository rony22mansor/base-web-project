/**
 * Query for the cases RAG endpoint. `query` is required — the corpus has no
 * browse endpoint, so there is nothing to list without one.
 *
 * Every tuning field is optional; omitted ones fall back to the server's own
 * defaults, which `GET /api/legal/cases/config` reports.
 */
export interface CaseSearchParams {
  /** The facts to match against. Sent as `text`. */
  query: string;
  /** Precedents returned. Server default 5. */
  topK?: number;
  /** Similarity cutoff, 0–1. Server default 0.5. */
  threshold?: number;
  /** Candidates fused before reranking. Server default 15. */
  hybridTopK?: number;
  /** Cross-encoder window. Server default 2048; higher is slower. */
  rerankMaxLength?: number;
}
