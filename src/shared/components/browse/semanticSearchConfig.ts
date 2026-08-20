import { z } from "zod";

/**
 * The bottom search bar is one semantic query, shared verbatim by law search,
 * case search and template search — so the schema lives here rather than being
 * copied into three feature configs. Feature-specific bits (placeholder keys,
 * filter options) stay in each feature's `config/`.
 */
export const MIN_SEARCH_QUERY_LENGTH = 3;
export const MAX_SEARCH_QUERY_LENGTH = 1000;

export const SemanticSearchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(MIN_SEARCH_QUERY_LENGTH, "queryTooShort")
    .max(MAX_SEARCH_QUERY_LENGTH, "queryTooLong"),
});

export type SemanticSearchFormType = z.infer<typeof SemanticSearchSchema>;

/**
 * The validation keys `SemanticSearchSchema` can emit. Declared as a union so
 * the `browse.search.errors.*` lookup stays typed against the message files.
 */
export type SemanticSearchErrorKey = "queryTooShort" | "queryTooLong";
