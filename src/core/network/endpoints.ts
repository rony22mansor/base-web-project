/**
 * Central endpoint registry for the Monsef Python (RAG) backend.
 *
 * NOTE: these paths are provisional — they mirror the feature domains described
 * in CLAUDE_monsif.md, but the Python API contract is not finalized yet.
 * Update here (and nowhere else) once the backend routes are agreed.
 */
export const API_ENDPOINTS = {
  RULING_GENERATOR: {
    GENERATE: "/ruling/generate",
    UPLOAD: "/ruling/upload",
  },
  LAW_SEARCH: {
    LIST: "/laws/articles",
    SEMANTIC: "/laws/search",
    CATEGORIES: "/laws/categories",
    GET_BY_ID: (id: string) => `/laws/articles/${id}`,
  },
  CASE_SEARCH: {
    LIST: "/cases",
    SEMANTIC: "/cases/search",
    CATEGORIES: "/cases/categories",
    GET_BY_ID: (id: string) => `/cases/${id}`,
  },
  CONTRACT_TEMPLATES: {
    LIST: "/contract-templates",
    SEMANTIC: "/contract-templates/search",
    CATEGORIES: "/contract-templates/categories",
    GET_BY_ID: (id: string) => `/contract-templates/${id}`,
  },
} as const;
