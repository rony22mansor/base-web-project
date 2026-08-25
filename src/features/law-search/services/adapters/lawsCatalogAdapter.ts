import { ArticleStatus } from "@/src/core/enums/legalDomain";
import type { PagedResult } from "@/src/core/types/pagination";
import type {
  Law,
  LawArticle,
  LawArticleBodyLink,
  LawCatalog,
  LawGroup,
  LawHierarchyNode,
} from "../../types/interfaces/lawInterface";

/**
 * The laws-catalog contract (`GET /api/legal/laws…`) speaks snake_case Arabic
 * legal vocabulary; the components speak `Law` / `LawArticle`. Neither side
 * bends — the translation lives here, next to the RAG adapter that does the
 * same job for `POST /api/legal/laws/search`.
 */

/* -------------------------------------------------------------------------- */
/* DTOs                                                                       */
/* -------------------------------------------------------------------------- */

interface LawSummaryDto {
  law_id: string;
  law_name: string;
  short_name: string | null;
  /** Top-level group; only the amnesty decrees carry one. */
  category: string | null;
  article_count: number;
  category_count: number;
  has_categories: boolean;
  /** Keyed by the Arabic status word. */
  status_counts: Record<string, number>;
  first_article_number: string | null;
  last_article_number: string | null;
}

interface LawGroupDto {
  category: string | null;
  category_label: string;
  law_count: number;
  article_count: number;
  law_ids: string[];
}

export interface LawsCatalogResponseDto {
  count: number;
  total_articles: number;
  laws: LawSummaryDto[];
  categories: LawGroupDto[];
  available_categories: string[];
  filters_used: Record<string, unknown>;
}

interface LawHierarchyNodeDto {
  type: string | null;
  number: number | null;
  ordinal: string | null;
  name: string;
  raw: string;
}

interface LawArticleReferenceDto {
  target: string;
  resolved: boolean;
  type: string;
  confidence: string;
  paragraph: string | null;
  snippet: string;
}

interface LawArticleLinkTargetDto {
  article_id: string;
  article_number: string;
  law_id: string;
  confidence: string;
}

/**
 * A citation phrase with its position in the body. `start`/`end` index
 * `body`/`body_normalized` (identical in the whole corpus) and NOT `body_raw`,
 * whose different orthography shifts every offset — which is why `text` below
 * is filled from `body`.
 */
interface LawArticleBodyLinkDto {
  start: number;
  end: number;
  text: string;
  targets: LawArticleLinkTargetDto[];
}

export interface LawArticleDto {
  article_id: string;
  article_number: string;
  law_id: string;
  law_name: string;
  short_name: string | null;
  /** The law's top-level group, repeated on every article. */
  category: string | null;
  category_key: string;
  category_label: string;
  hierarchy: LawHierarchyNodeDto[];
  status: string;
  /** Absent when the request asked for `include_body=false`. */
  body?: string;
  body_raw?: string;
  body_normalized?: string;
  /** Article numbers this one cites. */
  dependencies: string[];
  references: LawArticleReferenceDto[];
  referenced_by: LawArticleReferenceDto[];
  /** Citation phrases positioned within `body`. Absent on older payloads. */
  body_links?: LawArticleBodyLinkDto[];
}

/** One of a law's internal كتاب/باب/فصل groups, with its articles. */
export interface LawArticleGroupDto {
  category_key: string;
  category_label: string;
  hierarchy: LawHierarchyNodeDto[];
  article_count: number;
  articles: LawArticleDto[];
}

export interface LawArticlesResponseDto {
  law: Pick<
    LawSummaryDto,
    "law_id" | "law_name" | "short_name" | "category" | "article_count"
  > & { status_counts: Record<string, number> };
  count: number;
  total_matched: number;
  grouped: boolean;
  category_count: number;
  pagination: {
    page: number;
    per_page: number | null;
    total_pages: number;
    total: number;
  };
  filters_used: Record<string, unknown>;
  /** Present when `grouped=true` (the default). */
  categories?: LawArticleGroupDto[];
  /** Present when `grouped=false`. */
  articles?: LawArticleDto[];
}

/* -------------------------------------------------------------------------- */
/* Mappers                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Arabic status words as they appear in the corpus. The catalog and the RAG
 * endpoint disagree on one of them — the corpus writes عادية, the retrieval
 * payload writes نافذة for the same thing — so both map to `Regular`.
 */
const STATUS_MAP: Record<string, ArticleStatus> = {
  عادية: ArticleStatus.Regular,
  نافذة: ArticleStatus.Regular,
  معدلة: ArticleStatus.Amended,
  ملغاة: ArticleStatus.Repealed,
};

/** The Arabic word to send back when filtering by status. */
export const STATUS_TO_ARABIC: Record<ArticleStatus, string> = {
  [ArticleStatus.Regular]: "عادية",
  [ArticleStatus.Amended]: "معدلة",
  [ArticleStatus.Repealed]: "ملغاة",
};

export const toStatus = (raw: string): ArticleStatus =>
  STATUS_MAP[raw?.trim()] ?? ArticleStatus.Regular;

/** "540" → "المادة 540"; leaves an already-prefixed or descriptive label alone. */
export const toArticleLabel = (articleNumber: string): string => {
  const n = (articleNumber ?? "").trim();
  if (!n) return "";
  return n.startsWith("المادة") ? n : `المادة ${n}`;
};

/** Arabic-keyed counts → an enum-keyed record the badges can read. */
const toStatusCounts = (
  counts: Record<string, number>,
): Partial<Record<ArticleStatus, number>> => {
  const result: Partial<Record<ArticleStatus, number>> = {};
  for (const [word, count] of Object.entries(counts ?? {})) {
    const status = toStatus(word);
    result[status] = (result[status] ?? 0) + count;
  }
  return result;
};

/**
 * Structural mapping only. Whether an offset actually lands on the phrase it
 * claims is decided at render time, against the body being displayed — see
 * `toArticleBodySegments`.
 */
const toBodyLink = (dto: LawArticleBodyLinkDto): LawArticleBodyLink => ({
  start: dto.start,
  end: dto.end,
  text: dto.text ?? "",
  targets: (dto.targets ?? []).map((target) => ({
    articleId: target.article_id,
    articleNumber: target.article_number,
    lawId: target.law_id,
    confidence: target.confidence,
  })),
});

const toHierarchyNode = (dto: LawHierarchyNodeDto): LawHierarchyNode => ({
  type: dto.type ?? null,
  number: dto.number ?? null,
  ordinal: dto.ordinal ?? null,
  name: dto.name ?? "",
  raw: dto.raw ?? "",
});

export const toLaw = (dto: LawSummaryDto): Law => ({
  id: dto.law_id,
  name: dto.law_name,
  shortName: dto.short_name,
  group: dto.category,
  articleCount: dto.article_count,
  sectionCount: dto.category_count,
  hasSections: dto.has_categories,
  statusCounts: toStatusCounts(dto.status_counts),
  firstArticleNumber: dto.first_article_number,
  lastArticleNumber: dto.last_article_number,
});

const toGroup = (dto: LawGroupDto): LawGroup => ({
  id: dto.category,
  label: dto.category_label,
  lawCount: dto.law_count,
  articleCount: dto.article_count,
  lawIds: dto.law_ids ?? [],
});

export const toCatalog = (dto: LawsCatalogResponseDto): LawCatalog => ({
  laws: (dto.laws ?? []).map(toLaw),
  groups: (dto.categories ?? []).map(toGroup),
  availableGroups: dto.available_categories ?? [],
  lawCount: dto.count ?? 0,
  totalArticles: dto.total_articles ?? 0,
});

export const toCatalogArticle = (dto: LawArticleDto): LawArticle => {
  const hierarchy = (dto.hierarchy ?? []).map(toHierarchyNode);

  return {
    id: dto.article_id,
    articleNumber: toArticleLabel(dto.article_number),
    rawArticleNumber: dto.article_number,
    // The corpus stores no per-article heading, so the article's own label
    // carries the title slot and the hierarchy supplies the context.
    title: toArticleLabel(dto.article_number),
    lawName: dto.law_name,
    lawId: dto.law_id,
    hierarchy: hierarchy.map((node) => node.name).filter(Boolean),
    structure: hierarchy,
    categoryKey: dto.category_key ?? "",
    categoryLabel: dto.category_label ?? "",
    // `body` is absent under include_body=false; the caller that asked for
    // that renders headers only, so an empty string is the right fallback.
    text: dto.body ?? "",
    status: toStatus(dto.status),
    citedArticleNumbers: dto.dependencies ?? [],
    citedByArticleNumbers: (dto.referenced_by ?? []).map((ref) => ref.target),
    bodyLinks: (dto.body_links ?? []).map(toBodyLink),
  };
};

/** Every article of a response, grouped or flat, in corpus order. */
export const toArticleList = (dto: LawArticlesResponseDto): LawArticle[] => {
  if (dto.articles) return dto.articles.map(toCatalogArticle);
  return (dto.categories ?? []).flatMap((group) =>
    (group.articles ?? []).map(toCatalogArticle),
  );
};

/**
 * The catalog paginates properly (unlike the RAG endpoint), so the list view
 * gets a real `hasMore`. `per_page: null` means the caller asked for
 * everything, which is one complete page by definition.
 */
export const toPagedArticles = (
  dto: LawArticlesResponseDto,
): PagedResult<LawArticle> => {
  const { page, per_page, total_pages, total } = dto.pagination;
  const items = toArticleList(dto);

  return {
    items,
    page: page ?? 1,
    pageSize: per_page ?? items.length,
    total: total ?? dto.total_matched ?? items.length,
    hasMore: per_page === null ? false : (page ?? 1) < (total_pages ?? 1),
  };
};
