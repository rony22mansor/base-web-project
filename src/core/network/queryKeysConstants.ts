/**
 * Central React Query key registry.
 * Never inline a query-key string literal in a feature hook — add it here.
 */
export const QUERY_KEYS = {
  /** Judgment prediction: the mutation itself. */
  RULING_GENERATOR: "rulingGenerator",
  /** Judgment prediction: `ready`, the LLM backend, and the live defaults. */
  JUDGMENT_CONFIG: "judgmentConfig",

  LAW_SEARCH: "lawSearch",
  /** Legacy combined search: articles + جتهاد, used only when that toggle is on. */
  LAW_SEARCH_JURISPRUDENCE: "lawSearchJurisprudence",
  LAW_ARTICLE: "lawArticle",
  LAW_CATEGORIES: "lawCategories",
  /** Catalog: the list of laws + their group roll-up. */
  LAW_CATALOG: "lawCatalog",
  /** Catalog: one law's articles, paginated. */
  LAW_ARTICLES: "lawArticles",
  /** Catalog: one law's articles in full, for the book reader. */
  LAW_BOOK: "lawBook",

  /** Cases RAG: one retrieval run, keyed by the query and its params. */
  CASE_SEARCH: "caseSearch",
  /** Cases RAG: server defaults + whether the index is warm. */
  CASE_SEARCH_CONFIG: "caseSearchConfig",

  /** Catalog: one page of browsed cases, keyed by the filters applied. */
  CASE_CATALOG: "caseCatalog",
  /** Catalog: one judgment in full, keyed by its case number. */
  CASE_DOCUMENT: "caseDocument",

  /** Instant tools: one run each, keyed by the submitted text. */
  SUMMARIZE: "summarize",
  CLASSIFY: "classify",

  /** Contracts: the candidate search, one full template, and the category map. */
  CONTRACT_TEMPLATES: "contractTemplates",
  CONTRACT_TEMPLATE: "contractTemplate",
  CONTRACT_TEMPLATES_CONFIG: "contractTemplatesConfig",
} as const;
