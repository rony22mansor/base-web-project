import type {
  LawArticleBodyLink,
  LawArticleLinkTarget,
} from "../types/interfaces/lawInterface";

/**
 * Splitting an article body into prose and citation links.
 *
 * The API reports each citation as a character range into the body, which means
 * the rendering is only correct while those offsets and the string we display
 * stay in step. They agree today — every one of the corpus's links slices back
 * to its own phrase out of the normalized `body` — but they disagree completely
 * against `body_raw`, whose orthography (المادة vs الماده) shifts the offsets.
 * So nothing here trusts an offset: a range is used only once the slice it
 * produces is confirmed to equal the phrase the server said was there.
 *
 * A link that fails that check is dropped rather than repaired. Highlighting
 * the wrong words in a legal text reads as an assertion about the law, and a
 * silent gap is the safer failure.
 */

/** A run of the body: either plain prose or a citation the reader can follow. */
export type ArticleBodySegment =
  | { kind: "text"; key: string; text: string }
  | { kind: "link"; key: string; text: string; targets: LawArticleLinkTarget[] };

/** A link whose offsets have been checked against the body it belongs to. */
const isUsable = (link: LawArticleBodyLink, text: string): boolean => {
  const { start, end } = link;

  if (!Number.isInteger(start) || !Number.isInteger(end)) return false;
  if (start < 0 || end > text.length || start >= end) return false;
  // No targets means there is nowhere to go, so it is prose, not a link.
  if (!link.targets?.length) return false;

  // The guard the rest of this file rests on.
  return text.slice(start, end) === link.text;
};

/**
 * The body as alternating prose and citation runs.
 *
 * Returns a single text segment when the article has no usable links, so a
 * caller can render the result unconditionally and still get plain text for the
 * semantic-search bodies that carry no link data at all.
 */
export function toArticleBodySegments(
  text: string,
  links: LawArticleBodyLink[] | undefined,
): ArticleBodySegment[] {
  const body = text ?? "";
  if (!body) return [];

  const usable = (links ?? [])
    .filter((link) => isUsable(link, body))
    .sort((a, b) => a.start - b.start);

  if (usable.length === 0) {
    return [{ kind: "text", key: "text-0", text: body }];
  }

  const segments: ArticleBodySegment[] = [];
  let cursor = 0;

  for (const link of usable) {
    // The corpus has no overlapping links, but a future one would otherwise
    // duplicate the overlapping characters — skip rather than render twice.
    if (link.start < cursor) continue;

    if (link.start > cursor) {
      segments.push({
        kind: "text",
        key: `text-${cursor}`,
        text: body.slice(cursor, link.start),
      });
    }

    segments.push({
      kind: "link",
      key: `link-${link.start}`,
      text: body.slice(link.start, link.end),
      targets: link.targets,
    });

    cursor = link.end;
  }

  if (cursor < body.length) {
    segments.push({
      kind: "text",
      key: `text-${cursor}`,
      text: body.slice(cursor),
    });
  }

  return segments;
}
