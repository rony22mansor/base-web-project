/**
 * `POST /api/legal/summarize` — an extractive summary plus the fields a set of
 * regexes could pull out of the text.
 *
 * Nothing here is generated: the summary is sentences selected from the
 * original, and every field is a literal span the extractor matched. That is
 * why the UI presents it as "what was found in your text" rather than as an
 * analysis, and why an empty field means "not stated", not "unknown".
 */
export interface CaseSummary {
  /** Sentences selected from the source, in their original order. */
  summary: string;
  /** Character count of the submitted text, for the compression line. */
  originalLength: number;
  fields: ExtractedFields;
}

/**
 * All seven keys are always present — the extractor initialises them before it
 * matches anything — so absence is `null` or `[]`, never a missing key.
 */
export interface ExtractedFields {
  /** First date-looking token in the text, e.g. "12/05/2023". */
  date: string | null;
  /** Party labels found ("المتهم الأول"), not names — the corpus is redacted. */
  accused: string[];
  /** "المجني عليه" or "المدعي", whichever the text uses. */
  victim: string | null;
  /** The sentence describing what was done. */
  action: string | null;
  /** Evidence nouns matched in the text (أداة، بصمات، كاميرا…). */
  evidence: string[];
  /** Pairs like "المتهم: اعترف". */
  confessionStatus: string[];
  /** The sentence in which the court ruled. */
  ruling: string | null;
}
