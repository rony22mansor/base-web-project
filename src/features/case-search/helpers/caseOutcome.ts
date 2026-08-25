/**
 * `outcome` is free Arabic text from the corpus, not an enum, so it cannot be
 * translated or exhaustively matched — it is rendered as it arrives. What the
 * UI can do is colour it, which is the difference between scanning a grid of
 * precedents and reading every one.
 */

/** Notion tag colours, matching `ArticleStatusBadge`'s vocabulary. */
export type OutcomeTone = "red" | "green" | "yellow" | "gray";

/**
 * The three values `GET /api/legal/judgment/config` publishes as the allowed
 * `outcome` vocabulary — إدانة, براءة, إسقاط دعوى. The cases corpus writes the
 * same words, sometimes qualified ("إدانة جزئية"), which is why these are
 * matched as substrings rather than compared for equality.
 *
 * Kept to that closed list on purpose: a short Arabic substring like "رد" also
 * sits inside ordinary words such as "طرد", so a looser marker would colour
 * outcomes it never actually recognised.
 */
const TONE_MARKERS: { marker: string; tone: OutcomeTone }[] = [
  { marker: "إدانة", tone: "red" },
  // The corpus is inconsistent about the hamza.
  { marker: "ادانة", tone: "red" },
  { marker: "براءة", tone: "green" },
  { marker: "إسقاط", tone: "yellow" },
  { marker: "اسقاط", tone: "yellow" },
];

/** Unknown wording keeps the neutral chip rather than being colour-guessed. */
export const outcomeTone = (outcome: string): OutcomeTone =>
  TONE_MARKERS.find(({ marker }) => outcome.includes(marker))?.tone ?? "gray";

/**
 * The distinct outcomes across a result set, in first-seen (rank) order — the
 * source for the outcome filter chips. They are derived from the results
 * rather than fetched: the backend has no facet endpoint for this corpus, and
 * filtering the ranked set is exactly what the chips do.
 */
export const collectOutcomes = (
  outcomesPerCase: string[][],
): string[] => {
  const seen = new Set<string>();

  for (const outcomes of outcomesPerCase) {
    for (const outcome of outcomes) seen.add(outcome);
  }

  return [...seen];
};
