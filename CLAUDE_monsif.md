# CLAUDE.md

Guidance for Claude Code (and any AI agent) when working in this repository. Follow these rules so generated code matches the project's conventions.

> Adapted from a friend's ERP frontend `CLAUDE.md`. The engineering *patterns* (feature-based architecture, service layer, query wrappers, i18n discipline) are carried over because they're good habits — the ERP-specific parts (accounting domain, RSA/AES payload encryption) have been dropped or marked TBD below since Monsef doesn't need them yet.

## Project overview

**Monsef** — an AI-powered legal assistant web app for Syrian law (starting with محكمة الجزاء / criminal court). It lets law students, lawyers, and jury members search laws and case law semantically, browse/edit contract templates, and get an AI-generated preliminary ruling (with confidence score, explanation, legal basis, and precedents) for a described incident.

Architecture: a **Next.js frontend** talking over REST/JSON to a **separate Python backend** that owns the RAG pipeline (FAISS vector index + embeddings + reranker + LLM). The frontend never runs AI/retrieval logic itself — it calls the Python API and renders the result.

## Tech stack

- **Framework:** Next.js (App Router, RSC enabled) + React, TypeScript (`strict: true`)
- **Package manager:** `pnpm`. Do **not** use npm or yarn.
- **Styling:** Tailwind CSS + shadcn/ui (`lucide` icons)
- **Server state:** TanStack React Query v5, for all calls to the Python backend
- **Forms:** react-hook-form + Zod (`@hookform/resolvers`) — except the contract-template editor, see [Contract editor](#contract-template-editor) below
- **HTTP:** axios (single client, `src/core/network/axios.ts`)
- **i18n:** `next-intl` — Arabic + English, RTL-aware (see [i18n & RTL](#i18n--rtl))

> **TBD, fill in once decided:** global client state library (Redux Toolkit vs. Zustand vs. plain Context — only add one once a feature genuinely needs cross-feature client state beyond what React Query gives you for free); auth strategy (JWT? session cookie?); whether the Python API needs request/response encryption (the ERP project used RSA+AES — Monsef doesn't need this by default, revisit only if a real compliance requirement shows up).

## Commands

```bash
pnpm dev          # start dev server (next dev)
pnpm build        # production build
pnpm start         # run production build
pnpm lint          # eslint
```

There is **no test runner configured** yet. Verify changes with `pnpm lint` and `pnpm build`.

## Path aliases

`@/*` maps to the repo root (see `tsconfig.json`). Import from `@/src/...`, e.g.:

```ts
import { apiClient } from "@/src/core/network/axios";
import { ApiResponse } from "@/src/core/network/apiInterfaces";
```

shadcn aliases (`components.json`): `components → @/core/components`, `ui → @/core/components/ui`, `utils → @/core/utils`, `hooks → @/core/hooks`.

## Directory structure

```
src/
  app/              # Next.js App Router. Routes live under app/[locale]/
    [locale]/(app)/   # authenticated / main app route group
    [locale]/(auth)/  # public/auth route group, if auth is added
    api/              # route handlers (e.g. proxy/config), only if needed
  core/             # cross-cutting infrastructure (NOT feature-specific)
    network/          # axios, endpoints, query keys, api interfaces, api hooks
    services/         # cookies, monitor, etc.
    routing/          # AppRoutes constants
    i18n/             # next-intl routing/navigation/request
    types/, hooks/, utils/, config/, enums/, providers/
  features/         # one folder per domain — see below
  shared/           # reusable UI, fields, dialogs, i18n message JSON, styles
  middlewares/      # intl / route middleware
```

### Feature domains (current scope, per monsif.md)

- `features/ruling-generator/` — free-text incident input → retrieval → LLM ruling, confidence score, explanation, legal basis, precedents
- `features/law-search/` — categorized browsing + semantic search over legal articles
- `features/case-search/` — categorized browsing + semantic search over historical cases
- `features/contract-templates/` — semantic search + in-browser template editor

## Feature architecture (IMPORTANT)

Each feature in `src/features/<name>/` follows this layout. Mirror it exactly when adding a feature:

```
features/<name>/
  components/       # feature React components (Container + pieces)
  config/           # <name>Config.ts — DynamicForm definitions + Zod schemas (where the feature uses standard forms)
  hooks/            # feature-local hooks (use<Name>.ts)
  helpers/          # feature-local helpers (if needed)
  services/
    <name>Service.ts          # plain async functions calling apiClient
    queries/use<Name>List.ts  # React Query read hooks
    mutations/use<Name>.ts    # React Query write hooks
  types/            # interfaces/, dtos.ts, *Interface.ts
  enums/            # feature enums
```

Only add a `redux/` (or other global-state) subfolder once a feature actually needs cross-feature client state — don't default to it.

### Layering rules

1. **Service layer** (`<name>Service.ts`): export a single object of `async` methods. Each calls `apiClient` and returns `ApiResponse<T>`. Endpoints come from `API_ENDPOINTS`, never hard-coded strings.
2. **Query/mutation hooks** wrap the service. Use the project wrappers `useApiQuery` / `useApiMutation` from `@/src/core/network/useApiHooks` (they default the error type to `ApiError`) — do **not** call `useQuery` / `useMutation` from `@tanstack/react-query` directly.
3. **Query keys** come from `QUERY_KEYS` in `src/core/network/queryKeysConstants.ts`. Add a key there; do not inline string literals.
4. Service/hook files that use client-only hooks start with `"use client";`.

Example service method:

```ts
async search(query: string): Promise<ApiResponse<LawArticle[]>> {
  const { data } = await apiClient.get<ApiResponse<LawArticle[]>>(
    API_ENDPOINTS.LAW_SEARCH.SEMANTIC,
    { params: { q: query } },
  );
  return data;
}
```

Example query hook:

```ts
"use client";
export function useLawSearch(query: string) {
  return useApiQuery({
    queryKey: [QUERY_KEYS.LAW_SEARCH, query],
    queryFn: () => lawSearchService.search(query),
    enabled: query.length > 0,
  });
}
```

## AI-output components

The ruling generator, law search, and case search all render structured output that came from the RAG/LLM backend (ruling text, confidence score, explanation, legal basis list, precedent list, matched articles). Treat this the same as any other server data:

- Fetch it through a query hook, never fabricate or hardcode it in a component.
- Render **exactly** what the API returned — don't let the UI silently reword or truncate legal text.
- If an article's `status` is "repealed" (ملغاة), the UI must surface that clearly next to the article (badge/note), since it's still searchable but not authoritative.
- Confidence score and "AI-generated, not legal advice"-type disclaimers are UI chrome — they go through i18n like any other label, unlike the legal content itself (see below).

## Contract-template editor

The in-browser template editor is not a `react-hook-form` form — it's a rich-text/document editor over template content with fillable fields. Pick one editor library (e.g. Tiptap/ProseMirror-based) when you get to this feature and document the choice here; don't mix in a second editor library later.

## i18n & RTL

- All **UI chrome** (buttons, labels, nav, error messages, disclaimers) must be translation keys, with entries in **both** `src/shared/messages/en/` and `src/shared/messages/ar/`.
- **Legal content is data, not UI copy.** Law article text, case text, ruling explanations, and precedents come from the Python API in whatever language they were stored in (Arabic) — do **not** route this through next-intl message files. It's fetched and rendered as-is.
- The app is RTL-aware — keep layouts direction-agnostic (logical CSS properties / Tailwind RTL utilities, not hardcoded left/right).
- Use `next-intl` navigation helpers from `src/core/i18n/navigation.ts`; pages live under `src/app/[locale]/`.

## Networking

- All requests go through the **single axios instance** (`apiClient`) — never create new axios instances in features.
- Base URL points at the Python backend. No request/response encryption layer by default (see TBD note above).
- Endpoints: add to `API_ENDPOINTS` in `src/core/network/endpoints.ts`. Use function form for path params: `GET_BY_ID: (id) => \`/.../${id}\``.
- If auth is added later, keep token injection and refresh logic centralized in `apiClient` — don't duplicate it per feature.

## Conventions

- **TypeScript:** `@typescript-eslint/no-explicit-any` is an **error** — never use `any`. Use `unknown` + narrowing. Unused vars are a warning. Run `pnpm lint` before finishing.
- **Naming:** files use camelCase (`lawSearchService.ts`, `useRulingGenerator.ts`); React components PascalCase; constants objects SCREAMING_SNAKE keys (`API_ENDPOINTS`, `QUERY_KEYS`).
- `"use client"` directive at the top of any file using client-only hooks (React Query, react-hook-form, editor libraries).
- Keep `core/` free of feature-specific code; keep feature folders self-contained.

## What NOT to do

- Don't bypass `apiClient` or hardcode the Python API base URL in a feature.
- Don't hard-code endpoints, query keys, or route paths — use the central constants.
- Don't call TanStack Query hooks directly; use the `useApiQuery` / `useApiMutation` wrappers.
- Don't introduce `any`, npm/yarn lockfiles, or a second axios instance.
- Don't put legal content (laws, cases, rulings) through the i18n message files — only UI chrome gets translation keys.
- Don't add UI-chrome text without both Arabic and English translations.
- Don't silently reword or truncate AI-generated legal output in components — render what the API returns.
