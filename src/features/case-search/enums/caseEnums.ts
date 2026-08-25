/**
 * How wide a net the retrieval should cast.
 *
 * The backend exposes `threshold` (0–1) as a raw similarity cutoff, and its
 * own docs say to drop it toward 0.3 when short queries come back empty. That
 * is a real control, not a detail to hide — but "0.42" means nothing to a
 * lawyer, so the UI offers three named settings and the helper maps them.
 */
export enum CaseScope {
  /** Close matches only. */
  Strict = "strict",
  /** The server's own default. */
  Balanced = "balanced",
  /** Anything loosely related — the answer to an empty result set. */
  Broad = "broad",
}
