import type {
  ContractFieldType,
  ContractTemplate,
} from "../types/interfaces/contractTemplateInterface";

/**
 * Turning a template body into a fillable document.
 *
 * The corpus marks every blank as `[[N:type]]` — verified across all 211
 * templates, with no other tag form and only three types. The index is what
 * ties a blank to its answer, which is why `raw_body` (where each blank is a
 * run of underscores) can be printed but never filled: the underscores carry
 * no index.
 */

/** `[[12:datetime]]` — the only tag shape the corpus uses. */
const TAG = /\[\[(\d+):([a-zA-Z]+)\]\]/g;

export type ContractSegment =
  | { kind: "text"; value: string }
  | { kind: "field"; index: number; type: ContractFieldType };

const toFieldType = (raw: string): ContractFieldType =>
  raw === "number" || raw === "datetime" ? raw : "text";

/**
 * Split a body into prose and blanks, in order. A body with no tags comes back
 * as a single text segment, so callers never special-case it.
 */
export const parseContractBody = (body: string): ContractSegment[] => {
  const segments: ContractSegment[] = [];
  let cursor = 0;

  // A fresh regex per call: the global flag carries `lastIndex` state, which
  // concurrent renders would otherwise interleave.
  for (const match of body.matchAll(new RegExp(TAG))) {
    const start = match.index ?? 0;
    if (start > cursor) {
      segments.push({ kind: "text", value: body.slice(cursor, start) });
    }

    segments.push({
      kind: "field",
      index: Number(match[1]),
      type: toFieldType(match[2]),
    });

    cursor = start + match[0].length;
  }

  if (cursor < body.length) {
    segments.push({ kind: "text", value: body.slice(cursor) });
  }

  return segments;
};

/** How much surrounding prose to quote as a field's label. */
const LEAD_CHARS = 45;
const TRAIL_CHARS = 20;

export interface ContractField {
  index: number;
  type: ContractFieldType;
  /** The words immediately before the blank. */
  before: string;
  /** The words immediately after it. */
  after: string;
}

/**
 * Build the form's fields from the parsed body.
 *
 * The corpus gives a blank an index and a type and nothing else — no label, no
 * name. "Field 12 (text)" is unanswerable; "…و مساحته ___ متراً مربعاً" is
 * obvious. So each field is labelled with the sentence it sits in, which is the
 * only description that exists.
 *
 * Fields come from the body rather than from `placeholders`, so a tag the
 * placeholder list forgot still gets an input — the body is what has to end up
 * complete.
 */
export const toContractFields = (
  segments: ContractSegment[],
): ContractField[] => {
  const fields: ContractField[] = [];

  segments.forEach((segment, position) => {
    if (segment.kind !== "field") return;

    fields.push({
      index: segment.index,
      type: segment.type,
      before: tail(nearestText(segments, position, -1), LEAD_CHARS),
      after: head(nearestText(segments, position, 1), TRAIL_CHARS),
    });
  });

  return fields;
};

/**
 * The nearest prose in one direction, stepping over any blanks in between.
 *
 * Templates often run two or three blanks together — "[[20]] [[21]] [[22]]"
 * for a name split across fields, or a signature line — and looking only at the
 * immediate neighbour leaves those middle fields with no label at all. Across
 * the corpus that is 46 inputs the user would have been asked to fill with
 * nothing to go on. Reaching past the adjacent blanks gives them the sentence
 * they belong to; the index chip beside each input tells the run apart.
 */
const nearestText = (
  segments: ContractSegment[],
  from: number,
  step: 1 | -1,
): string => {
  for (
    let position = from + step;
    position >= 0 && position < segments.length;
    position += step
  ) {
    const segment = segments[position];
    if (segment.kind === "text" && segment.value.trim()) return segment.value;
  }

  return "";
};

/** Last `count` characters, trimmed to a whole word and collapsed to one line. */
const tail = (text: string, count: number): string => {
  const flat = text.replace(/\s+/g, " ");
  if (flat.length <= count) return flat.trim();

  const cut = flat.slice(-count);
  const space = cut.indexOf(" ");
  return (space === -1 ? cut : cut.slice(space + 1)).trim();
};

/** First `count` characters, trimmed to a whole word. */
const head = (text: string, count: number): string => {
  const flat = text.replace(/\s+/g, " ");
  if (flat.length <= count) return flat.trim();

  const cut = flat.slice(0, count);
  const space = cut.lastIndexOf(" ");
  return (space === -1 ? cut : cut.slice(0, space)).trim();
};

/** The blank as it appears in an unfilled export. Matches the corpus's own. */
export const BLANK = "___";

/**
 * A date the way these contracts write them: 12/05/2023.
 *
 * The `date` input hands back ISO (2023-05-12), which would look foreign in an
 * Arabic legal document, so it is reformatted on the way into the text. Free
 * text the user typed is passed through untouched.
 */
export const formatFieldValue = (
  value: string,
  type: ContractFieldType,
): string => {
  if (type !== "datetime") return value;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
};

/**
 * The finished document as plain text: every blank replaced by its answer, and
 * anything still unanswered left as `___` so the gap is visible rather than
 * silently closed up.
 */
export const fillContractBody = (
  template: ContractTemplate,
  values: Record<number, string>,
): string =>
  parseContractBody(template.body)
    .map((segment) => {
      if (segment.kind === "text") return segment.value;

      const value = values[segment.index]?.trim();
      return value ? formatFieldValue(value, segment.type) : BLANK;
    })
    .join("");
