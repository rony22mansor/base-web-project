/**
 * The cases corpus ships with names already stripped: every person in a
 * judgment appears as a token such as `<DEFENDANT_1>` or `<PLAINTIFF_2>`.
 *
 * The API docs are explicit that these are not a template to fill in — the
 * name is gone, not withheld. So the UI either prints the token verbatim or
 * swaps in a neutral label; this splits the text so the renderer can do the
 * latter without touching the surrounding legal prose.
 */

/** `<ROLE_N>`, the only shape the backend emits. */
const PLACEHOLDER = /<([A-Z]+(?:_[A-Z]+)*)_(\d+)>/g;

export interface RedactionSegment {
  /** Plain prose, or a redacted party. */
  kind: "text" | "party";
  /** The literal text, or the raw `<ROLE_N>` token when `kind` is "party". */
  value: string;
  /** Lower-cased role ("defendant"), for the label lookup. Parties only. */
  role?: string;
  /** 1-based party number within its role. Parties only. */
  index?: number;
}

/**
 * Split a judgment body into prose and redacted parties, in order. Text with
 * no placeholders comes back as a single "text" segment, so callers never need
 * to special-case it.
 */
export const splitRedactions = (text: string): RedactionSegment[] => {
  const segments: RedactionSegment[] = [];
  let cursor = 0;

  // `matchAll` needs the global flag, which carries `lastIndex` state — build
  // a fresh regex per call so concurrent renders cannot interleave.
  for (const match of text.matchAll(new RegExp(PLACEHOLDER))) {
    const start = match.index ?? 0;
    if (start > cursor) {
      segments.push({ kind: "text", value: text.slice(cursor, start) });
    }

    segments.push({
      kind: "party",
      value: match[0],
      role: match[1].toLowerCase(),
      index: Number(match[2]),
    });

    cursor = start + match[0].length;
  }

  if (cursor < text.length) {
    segments.push({ kind: "text", value: text.slice(cursor) });
  }

  return segments;
};
