import type { ArticleStatus } from "@/src/core/enums/legalDomain";

/**
 * One legal article. `title` and `text` are legal content straight from the
 * Python API — they are never routed through the i18n message files.
 */
export interface LawArticle {
  id: string;
  /** e.g. "المادة 540". */
  articleNumber: string;
  /** The bare number as the API returns it ("540"), for anchors and lookups. */
  rawArticleNumber: string;
  /** Short heading for the article. */
  title: string;
  /** Parent law, e.g. "قانون العقوبات السوري". */
  lawName: string;
  lawId: string;
  /** باب / فصل breadcrumb, ordered outermost first. */
  hierarchy: string[];
  /**
   * The same breadcrumb with the structure the API attaches to it (كتاب/باب/
   * فصل + number + ordinal). Empty for laws with no internal structure, such
   * as the amnesty decrees. Only the catalog fills this in.
   */
  structure?: LawHierarchyNode[];
  /** Opaque backslash-separated path — a filter value, never displayed. */
  categoryKey?: string;
  /** The readable "كتاب › باب › فصل" form of `categoryKey`. */
  categoryLabel?: string;
  text: string;
  status: ArticleStatus;
  /**
   * 0..1 semantic relevance. Present only on semantic-search results, absent
   * when plain browsing.
   */
  score?: number;
  /**
   * Articles the retrieved one references (المواد المرتبطة), pulled in by the laws-RAG
   * pipeline. Present only on semantic results, and only while the backend's
   * `with_dependencies` is on.
   */
  dependencies?: LawArticleDependency[];
  /**
   * Article numbers this one cites, as the catalog reports them. The catalog
   * gives numbers only (not whole articles like the RAG pipeline does), which
   * is exactly what an in-law "see also" link needs.
   */
  citedArticleNumbers?: string[];
  /** Article numbers that cite this one. */
  citedByArticleNumbers?: string[];
  /**
   * Citation phrases located inside `text`, so a reference such as
   * "المادة الخامسة" can be rendered as a link rather than as prose.
   *
   * Offsets index `text` — which the catalog fills from the API's normalized
   * `body`, the only body field the offsets align with. Absent on semantic
   * search results: the RAG payload carries no `body_links`, so those bodies
   * render as plain text.
   */
  bodyLinks?: LawArticleBodyLink[];
}

/**
 * One citation phrase inside an article body, with the article(s) it points at.
 *
 * `start`/`end` are character offsets into `LawArticle.text`. They are the
 * server's word on where the phrase sits, so anything that slices by them must
 * check the slice still equals `text` before trusting it — see
 * `toArticleBodySegments`.
 */
export interface LawArticleBodyLink {
  start: number;
  end: number;
  /** The phrase as it appears in the body, e.g. "الماده الخامسه". */
  text: string;
  /**
   * Never empty. One phrase can name several articles ("المواد ال 19 و 20 و
   * 21") — about a fifth of the corpus's links do — so this is a list and the
   * UI has to let the reader choose which one to open.
   */
  targets: LawArticleLinkTarget[];
}

/** An article a citation phrase resolves to. */
export interface LawArticleLinkTarget {
  /** Composite "{law_name}:{article_number}" id — what fetches the article. */
  articleId: string;
  articleNumber: string;
  lawId: string;
  /** The extractor's confidence in the match ("high"…). */
  confidence: string;
}

/** A related article dragged in because a result cites it. */
export interface LawArticleDependency {
  id: string;
  articleNumber: string;
  lawName: string;
  text: string;
  status: ArticleStatus;
  /** 1 = cited by the result itself, 2 = cited by a dependency. */
  depth: number;
  /** The article that cited this one. */
  via: string;
}

/**
 * One level of a law's internal structure, as the catalog reports it.
 * `type` and `ordinal` are null on the innermost, unlabelled segments.
 */
export interface LawHierarchyNode {
  /** كتاب | باب | فصل — null when the segment carries no type word. */
  type: string | null;
  number: number | null;
  /** "الأول", "الثاني"… — null when absent. */
  ordinal: string | null;
  name: string;
  /** The raw segment, e.g. "01. الباب الأول - القانون الجزائي". */
  raw: string;
}

/**
 * One law in the catalog. Thirteen laws use their full name as `id`; the twelve
 * amnesty decrees have opaque ids (`Law-4418…`) and carry a `shortName`, so the
 * UI must show `name`/`shortName` and never `id`.
 */
export interface Law {
  id: string;
  name: string;
  shortName: string | null;
  /**
   * Top-level group this law belongs to (تشريعات العفو العام). `null` for the
   * thirteen standalone laws — that is the corpus's own "no group" value, not
   * missing data.
   */
  group: string | null;
  articleCount: number;
  /** How many internal كتاب/باب/فصل groups the law is divided into. */
  sectionCount: number;
  /** False for the amnesty decrees, which are a flat run of articles. */
  hasSections: boolean;
  /** Article counts per lifecycle status; absent statuses simply have no key. */
  statusCounts: Partial<Record<ArticleStatus, number>>;
  firstArticleNumber: string | null;
  lastArticleNumber: string | null;
}

/**
 * A group of laws (تشريعات العفو العام). Distinct from a law's *internal*
 * كتاب/باب/فصل structure, which the API also calls "category" — see
 * `LawHierarchyNode`.
 */
export interface LawGroup {
  /** `null` is the real value for the ungrouped laws, so it is a valid key. */
  id: string | null;
  label: string;
  lawCount: number;
  articleCount: number;
  lawIds: string[];
}

/** The whole laws catalog: what `GET /api/legal/laws` returns. */
export interface LawCatalog {
  laws: Law[];
  groups: LawGroup[];
  /** Group ids the backend accepts as a `category` filter. */
  availableGroups: string[];
  lawCount: number;
  totalArticles: number;
}
