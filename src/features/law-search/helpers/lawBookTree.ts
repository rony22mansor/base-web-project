import type {
  LawArticleGroupDto,
  LawArticlesResponseDto,
} from "../services/adapters/lawsCatalogAdapter";
import { toCatalogArticle } from "../services/adapters/lawsCatalogAdapter";
import type {
  LawBook,
  LawBookNode,
  LawBookTocEntry,
} from "../types/interfaces/bookInterface";
import type { LawHierarchyNode } from "../types/interfaces/lawInterface";

/**
 * Turns a law's flat list of groups into the nested كتاب › باب › فصل tree the
 * book reader renders.
 *
 * The API only ever reports *leaf* groups: one entry per innermost heading,
 * each carrying the full path in `category_key`, backslash-separated —
 *
 *   "01. الكتاب الأول - الأحكام العامة\\01. الباب الأول - القانون الجزائي\\
 *    01. الفصل الأول - في تطبيق القانون الجزائي من حيث الزمان\\01. قانونية الجرائم"
 *
 * Splitting on "\\" and folding every distinct prefix into a node is what
 * recovers the book structure: the كتاب above appears once, with its أبواب
 * beneath it, even though the API never sent a "كتاب" row of its own.
 *
 * `hierarchy` is the same path already parsed by the backend, so where it lines
 * up with the segments it supplies the type/number/ordinal and the raw segment
 * is only a fallback for laws whose hierarchy array is shorter than their path.
 */

/** The separator inside `category_key`, as a literal single backslash. */
const SEGMENT_SEPARATOR = "\\";

/**
 * Bidi control characters the corpus sprinkles into headings (the sample ends
 * in a RLM). They are invisible but break both `===` keys and sorting.
 */
const BIDI_MARKS = /[‎‏‪-‮⁦-⁩]/g;

const clean = (value: string): string =>
  (value ?? "").replace(BIDI_MARKS, "").trim();

/** "01. الباب الأول - القانون الجزائي" → number 1, the rest of the segment. */
const ORDER_PREFIX = /^(\d+)\.\s*/;

/** "الباب الأول" — the label half, when a segment has "<label> - <name>". */
const TYPED_LABEL = /^(الكتاب|الباب|الفصل|القسم|الجزء|الفرع)\s+(\S+)$/;

/**
 * Reads a raw segment when the backend's parsed `hierarchy` doesn't cover it.
 * Mirrors the fields the API would have produced, so the renderer never has to
 * care which of the two supplied a node.
 */
const parseSegment = (raw: string): LawHierarchyNode => {
  const text = clean(raw);
  const order = text.match(ORDER_PREFIX);
  const body = text.replace(ORDER_PREFIX, "");

  // "الباب الأول - القانون الجزائي": the type/ordinal sit before the dash.
  const dash = body.indexOf(" - ");
  if (dash !== -1) {
    const label = body.slice(0, dash).trim();
    const name = body.slice(dash + 3).trim();
    const typed = label.match(TYPED_LABEL);
    if (typed) {
      return {
        // "الكتاب" → "كتاب", matching what the API's `type` reports.
        type: typed[1].replace(/^ال/, ""),
        number: order ? Number(order[1]) : null,
        ordinal: typed[2],
        name,
        raw: text,
      };
    }
    return { type: null, number: order ? Number(order[1]) : null, ordinal: null, name: body, raw: text };
  }

  // An unlabelled heading, e.g. "01. قانونية الجرائم".
  return {
    type: null,
    number: order ? Number(order[1]) : null,
    ordinal: null,
    name: body,
    raw: text,
  };
};

/** Splits a `category_key` into its cleaned, non-empty path segments. */
export const splitCategoryKey = (categoryKey: string): string[] =>
  (categoryKey ?? "")
    .split(SEGMENT_SEPARATOR)
    .map(clean)
    .filter((segment) => segment.length > 0);

const createNode = (
  key: string,
  meta: LawHierarchyNode,
  depth: number,
): LawBookNode => ({
  key,
  raw: meta.raw,
  type: meta.type,
  number: meta.number,
  ordinal: meta.ordinal,
  name: meta.name,
  depth,
  children: [],
  articles: [],
  articleCount: 0,
});

/**
 * Folds one leaf group into the tree, creating every missing ancestor on the
 * way down and crediting each of them with the group's article count.
 *
 * `index` maps a path prefix to its node so a كتاب met for the tenth time is
 * still the same node — that lookup is what makes this O(segments) per group
 * instead of a search of the tree.
 */
const insertGroup = (
  roots: LawBookNode[],
  index: Map<string, LawBookNode>,
  group: LawArticleGroupDto,
): void => {
  const segments = splitCategoryKey(group.category_key);
  if (segments.length === 0) return;

  const articles = (group.articles ?? []).map(toCatalogArticle);
  const hierarchy = group.hierarchy ?? [];

  let siblings = roots;
  let path = "";
  let node: LawBookNode | undefined;

  segments.forEach((segment, depth) => {
    path = depth === 0 ? segment : `${path}${SEGMENT_SEPARATOR}${segment}`;

    let existing = index.get(path);
    if (!existing) {
      // Prefer the backend's own parse of this level; fall back to the segment
      // for laws whose `hierarchy` is shorter than their `category_key`.
      const parsed = hierarchy[depth];
      const meta: LawHierarchyNode = parsed
        ? {
            type: parsed.type ?? null,
            number: parsed.number ?? null,
            ordinal: parsed.ordinal ?? null,
            name: clean(parsed.name) || clean(segment),
            raw: clean(parsed.raw) || segment,
          }
        : parseSegment(segment);

      existing = createNode(path, meta, depth);
      index.set(path, existing);
      siblings.push(existing);
    }

    existing.articleCount += articles.length;
    siblings = existing.children;
    node = existing;
  });

  // Articles belong to the innermost heading only; ancestors carry the count.
  if (node) node.articles.push(...articles);
};

/**
 * Builds the reader's view of a law.
 *
 * Call this with a response fetched *without* pagination and *with* bodies —
 * the book is meant to be read end to end, so it is one request, not pages.
 */
export const toLawBook = (dto: LawArticlesResponseDto): LawBook => {
  const roots: LawBookNode[] = [];
  const index = new Map<string, LawBookNode>();
  const looseArticles = (dto.articles ?? []).map(toCatalogArticle);

  for (const group of dto.categories ?? []) {
    // The amnesty decrees report a single group with an empty `category_key`:
    // no structure at all, so its articles read as one continuous run.
    if (splitCategoryKey(group.category_key).length === 0) {
      looseArticles.push(...(group.articles ?? []).map(toCatalogArticle));
      continue;
    }
    insertGroup(roots, index, group);
  }

  return {
    lawId: dto.law.law_id,
    lawName: dto.law.law_name,
    shortName: dto.law.short_name,
    group: dto.law.category,
    articleCount: dto.law.article_count ?? dto.total_matched ?? 0,
    nodes: roots,
    looseArticles,
    isFlat: roots.length === 0,
  };
};

/**
 * A heading's display title: "الباب الأول — القانون الجزائي", or just the name
 * when the segment carries no type word.
 */
export const toNodeTitle = (node: {
  type: string | null;
  ordinal: string | null;
  number: number | null;
  name: string;
}): string => {
  if (!node.type) return node.name;
  const ordinal = node.ordinal ?? (node.number !== null ? `${node.number}` : "");
  const label = `ال${node.type} ${ordinal}`.trim();
  return node.name ? `${label} — ${node.name}` : label;
};

/** Depth-first flatten, for the table of contents. */
export const toTocEntries = (
  nodes: LawBookNode[],
  ancestors: LawHierarchyNode[] = [],
): LawBookTocEntry[] =>
  nodes.flatMap((node) => {
    const hierarchy: LawHierarchyNode[] = [
      ...ancestors,
      {
        type: node.type,
        number: node.number,
        ordinal: node.ordinal,
        name: node.name,
        raw: node.raw,
      },
    ];

    return [
      {
        key: node.key,
        label: toNodeTitle(node),
        depth: node.depth,
        articleCount: node.articleCount,
        hierarchy,
      },
      ...toTocEntries(node.children, hierarchy),
    ];
  });

/**
 * A stable DOM id for a heading or an article.
 *
 * Both are keyed by Arabic strings that contain spaces, backslashes and bidi
 * marks — none of which belong in an `id` a fragment link has to address — so
 * the key is hashed rather than slugified. The hash is deterministic, so the
 * table of contents and the section it points at agree without sharing state.
 */
export const toDomId = (prefix: string, value: string): string => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return `${prefix}-${(hash >>> 0).toString(36)}`;
};
