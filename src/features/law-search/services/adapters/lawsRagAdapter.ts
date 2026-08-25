import { ArticleStatus } from "@/src/core/enums/legalDomain";
import type { PagedResult } from "@/src/core/types/pagination";
import type {
  LawArticle,
  LawArticleDependency,
} from "../../types/interfaces/lawInterface";

/**
 * The Flask laws-RAG contract (`POST /api/legal/laws/search`) and the shape the
 * browse UI consumes are not the same thing, and neither side should bend:
 * the backend speaks snake_case Arabic legal vocabulary, the components speak
 * `LawArticle`. The translation lives here so it stays in one file.
 *
 * Backend reference: routes/laws_rag_routes.py + services/laws_rag.py.
 */

/** Request body. Every field but `text` is optional; the server has defaults. */
export interface LawsRagRequest {
  text: string;
  top_n?: number;
  hybrid_top_k?: number;
  exclude_repealed?: boolean;
  min_score?: number;
  with_dependencies?: boolean;
  dep_depth?: number;
  dep_max?: number;
  /** Drop a linked article that is already one of the hits. */
  dep_dedupe_vs_hits?: boolean;
  decompose?: boolean;
  /** Cross-encoder window. Higher reranks long articles better, and slower. */
  rerank_max_length?: number;
}

/** A related article the server pulled in because a hit references it. */
interface LawsRagDependencyDto {
  article_id: string;
  law_name: string;
  article_number: string;
  status: string;
  body: string;
  /** 1 = referenced by a hit, 2 = referenced by a dependency. */
  depth: number;
  /** Article number that pulled this one in. */
  via: string;
}

export interface LawsRagResultDto {
  article_id: string;
  law_name: string;
  article_number: string;
  status: string;
  /** 0..1 after reranking. */
  score: number;
  similarity_score: number;
  body: string;
  dependencies: LawsRagDependencyDto[];
}

/** Payload under the server's `data` key. */
export interface LawsRagResponseDto {
  query: string;
  /** Sub-questions, when the server split a long query. Null otherwise. */
  issues: string[] | null;
  found: boolean;
  count: number;
  results: LawsRagResultDto[];
  message: string | null;
  params_used: Record<string, unknown>;
  took_ms: number;
}

/** Arabic status strings as they appear in articles_unified.jsonl. */
const STATUS_MAP: Record<string, ArticleStatus> = {
  عادية: ArticleStatus.Regular,
  // Retrieval payloads write نافذة where the corpus file writes عادية.
  نافذة: ArticleStatus.Regular,
  معدلة: ArticleStatus.Amended,
  ملغاة: ArticleStatus.Repealed,
};

const toStatus = (raw: string): ArticleStatus =>
  STATUS_MAP[raw?.trim()] ?? ArticleStatus.Regular;

/**
 * `article_id` is built server-side as `"<law_id>:<article_number>"`, and
 * `law_id` is itself the full law name, which contains no colon. So the last
 * colon separates the two.
 */
const toLawId = (articleId: string): string => {
  const cut = articleId.lastIndexOf(":");
  return cut === -1 ? articleId : articleId.slice(0, cut);
};

/** "540" → "المادة 540"; leaves an already-prefixed number alone. */
const toArticleLabel = (articleNumber: string): string => {
  const n = (articleNumber ?? "").trim();
  if (!n) return "";
  return n.startsWith("المادة") ? n : `المادة ${n}`;
};

const toDependency = (dto: LawsRagDependencyDto): LawArticleDependency => ({
  id: dto.article_id,
  articleNumber: toArticleLabel(dto.article_number),
  lawName: dto.law_name,
  text: dto.body,
  status: toStatus(dto.status),
  depth: dto.depth,
  via: toArticleLabel(dto.via),
});

/**
 * Also used by judgment prediction: `evidence.statutes[]` is this same shape —
 * the endpoint runs laws RAG internally and hands back what it retrieved.
 */
export const toArticle = (dto: LawsRagResultDto): LawArticle => ({
  id: dto.article_id,
  articleNumber: toArticleLabel(dto.article_number),
  rawArticleNumber: dto.article_number,
  // The RAG index stores no per-article heading, so the law name carries the
  // context and the title slot shows the article's own label.
  title: toArticleLabel(dto.article_number),
  lawName: dto.law_name,
  lawId: toLawId(dto.article_id),
  // Not part of the search payload — only the corpus file has باب/فصل.
  hierarchy: [],
  text: dto.body,
  status: toStatus(dto.status),
  score: dto.score,
  dependencies: (dto.dependencies ?? []).map(toDependency),
});

/**
 * Semantic retrieval returns one ranked set, not pages — asking for page 2
 * would mean re-running the whole pipeline. So the result is always a single
 * complete page and `hasMore` is false; the infinite-query hook simply stops.
 */
export const toPagedResult = (
  dto: LawsRagResponseDto,
  pageSize: number,
): PagedResult<LawArticle> => {
  const items = (dto.results ?? []).map(toArticle);
  return {
    items,
    page: 1,
    pageSize,
    total: items.length,
    hasMore: false,
  };
};
