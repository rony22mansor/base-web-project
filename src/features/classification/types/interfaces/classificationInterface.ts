/**
 * `POST /api/legal/classify` — a multi-label SVM over the facts.
 *
 * The labels are Arabic crime names from the training set and are returned as
 * text, so they are displayed as they arrive. There are no scores: the model
 * reports which labels crossed its decision threshold, not how confident it
 * was about each, and inventing a percentage here would misrepresent it.
 */
export interface CrimeClassification {
  /**
   * False when nothing crossed the threshold. That is a successful 200 with an
   * explanatory message, not an error — the facts were simply too thin.
   */
  classified: boolean;
  crimes: string[];
  /** The server's Arabic explanation when `classified` is false. */
  message: string | null;
}
