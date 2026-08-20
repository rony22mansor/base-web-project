/**
 * Central React Query key registry.
 * Never inline a query-key string literal in a feature hook — add it here.
 */
export const QUERY_KEYS = {
  RULING_GENERATOR: "rulingGenerator",

  LAW_SEARCH: "lawSearch",
  LAW_ARTICLE: "lawArticle",
  LAW_CATEGORIES: "lawCategories",

  CASE_SEARCH: "caseSearch",
  CASE_DETAIL: "caseDetail",
  CASE_CATEGORIES: "caseCategories",

  CONTRACT_TEMPLATES: "contractTemplates",
  CONTRACT_TEMPLATE: "contractTemplate",
  CONTRACT_TEMPLATE_CATEGORIES: "contractTemplateCategories",
} as const;
