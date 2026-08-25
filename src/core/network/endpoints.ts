/**
 * Central endpoint registry for the MONSIF Python (RAG) backend.
 *
 * Every path here is transcribed from `Monsif_API.postman_collection.json`,
 * which is the contract. Nothing is invented: if a route is not in the
 * collection it does not exist on the Flask side, and the note saying so stays
 * next to it.
 */
export const API_ENDPOINTS = {
  /**
   * Liveness, and which models are currently resident. Features load lazily on
   * their first request, so this is what a "warming up" state should poll —
   * though each feature's own /config reports the same `loaded` flag for itself.
   */
  SYSTEM: {
    HEALTH: "/api/health",
  },

  /**
   * Judgment prediction (إصدار الحكم الأولي) — the slowest path in the
   * project: it runs both retrieval pipelines, the statistical classifier and
   * up to five LLM calls, so 40–90s on CPU. All tuning goes inside a nested
   * `config` object; parameters sent at the root are silently ignored.
   *
   * The API exposes no upload or text-extraction route, which is why the
   * feature reads .txt in the browser and does not accept .docx.
   */
  RULING_GENERATOR: {
    PREDICT: "/api/legal/judgment/predict",
    /** `ready: false` + a ready-to-display Arabic `blocking_reason`. */
    CONFIG: "/api/legal/judgment/config",
    /**
     * A few-token LLM call. Separates a bad key or model from a retrieval
     * failure, so the screen can fail fast instead of waiting out a minute.
     */
    LLM_PING: "/api/legal/judgment/llm/ping",
  },

  /**
   * The two instant tools. Both are pure CPU — regex and a pre-fitted SVM, no
   * neural models and no API key — so they answer in milliseconds and need
   * none of the warm-up handling the RAG features do.
   */
  LEGAL_TOOLS: {
    /** POST `{ text }`. Extractive summary + regex-extracted fields. */
    SUMMARIZE: "/api/legal/summarize",
    /** POST `{ facts }` — note the field name is not `text` here. */
    CLASSIFY: "/api/legal/classify",
  },

  LAW_SEARCH: {
    /** Live: Flask laws-RAG. POST, see services/adapters/lawsRagAdapter.ts. */
    SEMANTIC: "/api/legal/laws/search",
    /** Server defaults, the request-tunable names, and `loaded`. */
    CONFIG: "/api/legal/laws/config",
  },

  /**
   * Laws catalog — the corpus browsed rather than retrieved. Reads the JSONL
   * file server-side, so every one of these is instant even on a cold server
   * (unlike LAW_SEARCH.SEMANTIC, which loads models).
   *
   * Ids contain Arabic, spaces and (in one law) a comma, so every path segment
   * is `encodeURIComponent`-ed here — never interpolate a raw id.
   */
  LAW_CATALOG: {
    /** All 25 laws + the top-level group roll-up. */
    LAWS: "/api/legal/laws",
    /** Every article of one law, grouped into its internal كتاب/باب/فصل. */
    LAW_ARTICLES: (lawId: string) =>
      `/api/legal/laws/${encodeURIComponent(lawId)}/articles`,
    /** One article by its composite "{law_name}:{article_number}" id. */
    ARTICLE: (articleId: string) =>
      `/api/legal/laws/article/${encodeURIComponent(articleId)}`,
  },

  /**
   * Cases RAG — retrieval over past judgments by describing facts. Pairs with
   * CASE_CATALOG the way LAW_SEARCH pairs with LAW_CATALOG: this one loads
   * models and costs ~45s cold, the catalog reads the corpus and is instant.
   */
  CASE_SEARCH: {
    /** POST. FAISS + BM25 + RRF + rerank. ~7-13s warm, ~45s cold. */
    SEMANTIC: "/api/legal/cases/search",
    /** Live defaults, the tunable field names, and whether the index is loaded. */
    CONFIG: "/api/legal/cases/config",
  },

  /**
   * Cases catalog — the judgments corpus browsed rather than retrieved. Reads
   * the corpus server-side, so it answers instantly even while the RAG index is
   * still cold, and it is what every navigation path should use.
   */
  CASE_CATALOG: {
    /**
     * Every case, plus the crime/outcome/year facets. Accepts `crime`,
     * `outcome`, `year`, `q`, `page` and `per_page`.
     */
    CASES: "/api/legal/cases",
    /** One judgment in full, by the court's case number. */
    CASE: (caseNumber: string) =>
      `/api/legal/cases/${encodeURIComponent(caseNumber)}`,
  },

  /**
   * Contract templates RAG — a two-step flow, not one: SEMANTIC returns
   * candidates carrying a `doc_id` but no body, then DOCUMENT fetches the body
   * and placeholder list of the chosen one. There is no browse route.
   */
  CONTRACT_TEMPLATES: {
    /**
     * Browse, without touching the encoder: substring filter, category filter
     * and paging straight off the in-memory records. Instant next to SEMANTIC,
     * which embeds the query first.
     *
     * Not in the Postman collection — it was added to the backend after the
     * collection was last exported (routes/contracts_routes.py, `list_contracts`),
     * so the shape here comes from that source, not from the documentation.
     */
    LIST: "/api/legal/contracts",
    SEMANTIC: "/api/legal/contracts/search",
    /**
     * POST `{ doc_id }`. Preferred over GET_BY_ID: doc ids contain a `#`
     * ("390277833119024#2"), and a template whose id is literally "config"
     * would collide with the config route on the GET form.
     */
    DOCUMENT: "/api/legal/contracts/get",
    /** Once the index is warm this also reports a category → count map. */
    CONFIG: "/api/legal/contracts/config",
  },
} as const;
