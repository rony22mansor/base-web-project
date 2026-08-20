# Monsef — UI Feature Spec (from wireframes)

Source: hand-drawn wireframes for two screen patterns. Pattern A (input → loading → structured result) covers Feature 1. Pattern B (browse grid + bottom search bar) is reused across Features 2–4, with different card content per feature. This doc describes intent and structure, not pixel layout — visual design is still open (see `frontend-design` conventions / shadcn components from CLAUDE.md).

Shared chrome in every wireframe: a left nav sidebar (logo mark + a few nav items + a bottom item, likely settings/profile). Treat this as the app's persistent `AppShell` sidebar, not something to rebuild per feature.

All copy in this doc is UI chrome and must go through i18n (AR/EN) per `CLAUDE.md`. Legal content (article/case/ruling text) is API data, not translation strings.

---

## Feature 1: Preliminary Ruling Generator (`features/ruling-generator`)

Three states, one flow: **Input → Loading → Result**.

### 1a. Input screen
- Large multi-line textarea: free-form description of the incident/dispute (this is the primary input — the whole RAG pipeline runs off this text).
- Secondary option, near the textarea: upload a `.txt` or `.docx` file instead of/in addition to typing. Wireframe shows this as a small link/affordance under the textarea, not a separate page — treat it as an inline "or upload a file" control that populates or supplements the textarea.
- Submit action sends the text to the ruling-generation endpoint.
- **Open question:** does uploading a file replace the textarea content, or can a user provide both typed text *and* a file? Needs a product decision before building.

### 1b. Loading screen
- Not detailed in the sketch beyond "there is one" — this step exists because ruling generation is a RAG + LLM call and will take a few seconds, not instant.
- Show a distinct loading/processing state (spinner or skeleton), not a blank screen. A short status message ("Analyzing your case…") is reasonable but not specified — treat as a placeholder to refine.
- No partial/streaming output implied by the wireframe — assume the result arrives as one complete response, not token-by-token.

### 1c. Result screen
- **Not a chat bubble.** The result renders as a structured, organized layout of distinct sections — closer to a report than a conversation.
- Per `monsif.md`'s defined output shape, the sections are:
  1. **Preliminary Ruling** — the predicted outcome
  2. **Confidence Score** — a percentage
  3. **Explanation** — the detailed reasoning
  4. **Legal Basis** — a list of laws/articles relied on
  5. **Precedents** — a list of similar historical cases
- The wireframe shows the list-type sections (Legal Basis, Precedents) as individual reference/citation cards rather than plain bullet text — build these as small clickable cards (e.g. "Article 241" / case name), not inline links, so they can later deep-link into Feature 2/3's article or case detail view.
- Per the "AI-output components" rule in CLAUDE.md: render this content exactly as returned, and if any cited article's `status` is repealed (ملغاة), badge it on the card.
- **Open question:** what happens if confidence is very low or the RAG engine finds no real match? `monsif.md` says the RAG should be strict and "return nothing" on no match — the result screen needs an explicit empty/low-confidence state, not sketched here.

---

## Features 2–4: Browse + Semantic Search (shared pattern)

One screen pattern, reused for:
- `features/law-search` — browsing/searching legal articles
- `features/case-search` — browsing/searching case law
- `features/contract-templates` — browsing/searching contract templates (selecting one opens the in-browser editor from `monsif.md` — that editor screen isn't covered by this wireframe)

### Layout
- A grid of item cards (wireframe shows 2 columns) — each card is a placeholder for one law/case/template, title only in the sketch. Real content per feature:
  - **Law search card:** article number/title, parent law name, and hierarchy (باب/فصل) breadcrumb; repealed articles badged per CLAUDE.md's rule.
  - **Case search card:** case title/number, category (Civil/Criminal/Commercial per `monsif.md`), date.
  - **Contract templates card:** template name/type, short description.
- Some filtering options above or alongside the grid. **Not detailed in the sketch** — likely candidates, to be confirmed:
  - Law search: filter by law/category (the باب/فصل hierarchy), status (regular/amended/repealed)
  - Case search: filter by category (Civil/Criminal/Commercial), date range
  - Contract templates: filter by template type/category
- A search bar anchored at the bottom of the screen, sized for variable-length input (a few words up to a full sentence/scenario description) — this is the semantic query, not a keyword filter.
- Submitting the search bar populates the same grid with RAG-retrieved results (i.e. this is a single view that serves both "browse everything" and "search results" — not two separate pages).

### Open questions
- Exact filter controls (dropdowns vs. chips vs. sidebar) aren't specified — the list above is inferred from `monsif.md`'s data model, not from the sketch.
- No empty-state / no-results wireframe for a search that returns nothing.
- No wireframe yet for: the law/case detail view a card opens into, or the contract-template in-browser editor itself.

---

## Next steps
This doc, together with `CLAUDE.md`, should be enough to scaffold the four feature folders and their screens. Before implementation, worth resolving the "open question" bullets above (file-upload behavior, low-confidence/empty states, filter fields) since they change component structure, not just styling.
