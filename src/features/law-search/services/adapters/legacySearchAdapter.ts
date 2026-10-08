import { ArticleStatus } from "@/src/core/enums/legalDomain";
import type { JurisprudenceResult } from "../../types/interfaces/jurisprudenceInterface";
import type { LawArticle } from "../../types/interfaces/lawInterface";

/**
 * The legacy combined endpoint (`POST /api/legal/search`) — the only one that
 * covers جتهاد (jurisprudence) alongside articles. Kept for compatibility by
 * the backend and used here for exactly that reason: `/laws/search` has no
 * jurisprudence of its own.
 *
 * Backend reference: monsif-api.html#search.
 */
export interface LegacySearchRequest {
  text: string;
  top_k?: number;
  mode?: "articles" | "jurisprudence" | "both";
}

interface LegacyArticleResultDto {
  article_number: string;
  law_name: string;
  law_category: string | null;
  status: string;
  body: string;
  /** 0..100, unlike the laws-RAG endpoint's 0..1. */
  similarity_score: number;
}

interface LegacyJurisprudenceResultDto {
  jtihad_text: string;
  article_number: string;
  law_name: string;
  law_category: string | null;
  status: string;
  article_body: string;
  similarity_score: number;
}

/** Present only when the section found something — check `found` first. */
type LegacySection<T> =
  | { found: true; results: T[] }
  | { found: false; message: string };

export interface LegacySearchResponseDto {
  query: string;
  mode: "articles" | "jurisprudence" | "both";
  articles?: LegacySection<LegacyArticleResultDto>;
  jurisprudence?: LegacySection<LegacyJurisprudenceResultDto>;
}

/** Arabic status strings as they appear in this corpus. */
const STATUS_MAP: Record<string, ArticleStatus> = {
  عادية: ArticleStatus.Regular,
  نافذة: ArticleStatus.Regular,
  معدلة: ArticleStatus.Amended,
  ملغاة: ArticleStatus.Repealed,
};

const toStatus = (raw: string): ArticleStatus =>
  STATUS_MAP[raw?.trim()] ?? ArticleStatus.Regular;

const toArticleLabel = (articleNumber: string): string => {
  const n = (articleNumber ?? "").trim();
  if (!n) return "";
  return n.startsWith("المادة") ? n : `المادة ${n}`;
};

const toArticle = (dto: LegacyArticleResultDto): LawArticle => ({
  // No article_id on this endpoint — synthesized the same way the RAG one
  // builds its own, so an article found via both routes shares one id.
  id: `${dto.law_name}:${dto.article_number}`,
  articleNumber: toArticleLabel(dto.article_number),
  rawArticleNumber: dto.article_number,
  title: toArticleLabel(dto.article_number),
  lawName: dto.law_name,
  lawId: dto.law_name,
  hierarchy: [],
  text: dto.body,
  status: toStatus(dto.status),
  score: dto.similarity_score / 100,
  dependencies: [],
});

const toJurisprudence = (
  dto: LegacyJurisprudenceResultDto,
  index: number,
): JurisprudenceResult => ({
  id: `${dto.law_name}:${dto.article_number}:${index}`,
  jtihadText: dto.jtihad_text,
  articleNumber: toArticleLabel(dto.article_number),
  lawName: dto.law_name,
  lawCategory: dto.law_category,
  status: toStatus(dto.status),
  articleBody: dto.article_body,
  score: dto.similarity_score / 100,
});

export interface LegacySearchResult {
  articles: LawArticle[];
  jurisprudence: JurisprudenceResult[];
}

export const toLegacyResult = (
  dto: LegacySearchResponseDto,
): LegacySearchResult => ({
  articles: dto.articles?.found ? dto.articles.results.map(toArticle) : [],
  jurisprudence: dto.jurisprudence?.found
    ? dto.jurisprudence.results.map(toJurisprudence)
    : [],
});
