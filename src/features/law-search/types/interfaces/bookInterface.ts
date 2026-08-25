import type { LawArticle, LawHierarchyNode } from "./lawInterface";

/**
 * One node of the "read as a book" tree — a كتاب, a باب, a فصل, or the
 * unlabelled heading a law puts above a run of articles.
 *
 * Built from the API's `category_key`, which is a backslash-separated path:
 *   "01. الكتاب الأول - الأحكام العامة\01. الباب الأول - القانون الجزائي\…"
 * Every distinct prefix of that path becomes one node, so a law that only ever
 * reports leaf groups still reads as a nested book.
 */
export interface LawBookNode {
  /** The path prefix this node covers — unique within a law, used as a key. */
  key: string;
  /** Raw segment, e.g. "01. الباب الأول - القانون الجزائي". */
  raw: string;
  /** كتاب | باب | فصل — null on unlabelled segments. */
  type: string | null;
  number: number | null;
  ordinal: string | null;
  /** The heading to render, e.g. "القانون الجزائي". */
  name: string;
  /** How deep this node sits, 0 for a top-level كتاب. */
  depth: number;
  children: LawBookNode[];
  /** Articles filed directly under this node (leaves normally hold them all). */
  articles: LawArticle[];
  /** Articles here and everywhere below — what the heading's badge shows. */
  articleCount: number;
}

/** A whole law laid out for the reader: metadata, tree, and a flat run. */
export interface LawBook {
  lawId: string;
  lawName: string;
  shortName: string | null;
  /** The top-level group (تشريعات العفو العام) or null. */
  group: string | null;
  articleCount: number;
  /** Top-level nodes. Empty when the law has no internal structure. */
  nodes: LawBookNode[];
  /**
   * Articles of a law that reports no structure at all (the amnesty decrees).
   * The reader falls back to this flat run so those laws are still readable.
   */
  looseArticles: LawArticle[];
  /** True when `nodes` is empty — the reader hides its table of contents. */
  isFlat: boolean;
}

/** A flattened heading, for the table of contents. */
export interface LawBookTocEntry {
  key: string;
  label: string;
  depth: number;
  articleCount: number;
  hierarchy: LawHierarchyNode[];
}
