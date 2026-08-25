import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import { apiClient } from "@/src/core/network/axios";
import { API_ENDPOINTS } from "@/src/core/network/endpoints";
import type { PagedResult } from "@/src/core/types/pagination";
import { toLawBook } from "../helpers/lawBookTree";
import type { LawArticlesParams, LawCatalogParams } from "../types/dtos";
import type { LawBook } from "../types/interfaces/bookInterface";
import type { LawArticle, LawCatalog } from "../types/interfaces/lawInterface";
import {
  STATUS_TO_ARABIC,
  toCatalog,
  toCatalogArticle,
  toPagedArticles,
  type LawArticleDto,
  type LawArticlesResponseDto,
  type LawsCatalogResponseDto,
} from "./adapters/lawsCatalogAdapter";

/**
 * Browsing the corpus, as opposed to retrieving from it. These endpoints read
 * the JSONL file directly on the server — no models, no Qdrant — so they are
 * instant even while the RAG feature is still cold, and they are what every
 * navigation path should use. `lawSearchService.search` is reserved for actual
 * semantic questions, which cost ~45s on a cold server.
 */
export const lawCatalogService = {
  /** Every law, plus the group roll-up (تشريعات العفو العام / ungrouped). */
  async laws(params: LawCatalogParams = {}): Promise<ApiResponse<LawCatalog>> {
    const { data } = await apiClient.get<ApiResponse<LawsCatalogResponseDto>>(
      API_ENDPOINTS.LAW_CATALOG.LAWS,
      {
        params: {
          q: params.q,
          category: params.group,
        },
      },
    );

    return { data: toCatalog(data.data), succeeded: true };
  },

  /**
   * One page of a law's articles. Grouping stays on so each article keeps its
   * كتاب/باب/فصل breadcrumb even in the flat list view.
   */
  async articles(
    params: LawArticlesParams,
  ): Promise<ApiResponse<PagedResult<LawArticle>>> {
    const { data } = await apiClient.get<ApiResponse<LawArticlesResponseDto>>(
      API_ENDPOINTS.LAW_CATALOG.LAW_ARTICLES(params.lawId),
      { params: toQuery(params) },
    );

    return { data: toPagedArticles(data.data), succeeded: true };
  },

  /**
   * A whole law, read as a book.
   *
   * Deliberately unpaginated: the reader is a continuous document with a table
   * of contents, so it fetches every article with its body in one request and
   * builds the كتاب › باب › فصل tree client-side. The largest law in the corpus
   * (the penal code, 747 articles) is ~1.9 MB — one slow load beats a reading
   * view that stops every 50 articles.
   */
  async book(lawId: string): Promise<ApiResponse<LawBook>> {
    const { data } = await apiClient.get<ApiResponse<LawArticlesResponseDto>>(
      API_ENDPOINTS.LAW_CATALOG.LAW_ARTICLES(lawId),
      { params: { grouped: true, include_body: true } },
    );

    return { data: toLawBook(data.data), succeeded: true };
  },

  /**
   * One article by its composite id. Used to resolve a citation from another
   * article without refetching the law it belongs to.
   */
  async article(articleId: string): Promise<ApiResponse<LawArticle>> {
    const { data } = await apiClient.get<ApiResponse<LawArticleDto>>(
      API_ENDPOINTS.LAW_CATALOG.ARTICLE(articleId),
    );

    return { data: toCatalogArticle(data.data), succeeded: true };
  },
};

/**
 * Axios drops `undefined` params, so optional filters simply fall away and the
 * server applies its own defaults. `status` has to go back out as the Arabic
 * word the corpus stores.
 */
const toQuery = (params: LawArticlesParams): Record<string, unknown> => ({
  grouped: true,
  include_body: params.includeBody ?? true,
  status: params.status ? STATUS_TO_ARABIC[params.status] : undefined,
  category: params.categoryKey || undefined,
  q: params.q || undefined,
  page: params.page,
  per_page: params.pageSize,
});
