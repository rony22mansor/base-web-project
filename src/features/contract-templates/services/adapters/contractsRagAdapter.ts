import type {
  ContractBrowseResult,
  ContractFieldType,
  ContractPlaceholder,
  ContractSearchResult,
  ContractSuggestion,
  ContractTemplate,
  ContractTemplateSummary,
  ContractsConfig,
} from "../../types/interfaces/contractTemplateInterface";

/**
 * The contracts-RAG contract and the shape the editor consumes.
 *
 * Backend reference: services/contracts_rag.py. The corpus itself uses
 * PascalCase keys (DocID, RawBody, Placeholders), but the service normalizes
 * those to snake_case before they leave the API — so this maps snake_case, and
 * the PascalCase form only appears in the raw template file.
 */

export interface ContractSearchRequest {
  text: string;
  top_k?: number;
  min_score?: number;
  suggest?: boolean;
}

/**
 * A listing row. Browse and search share it except for `score`, which only the
 * ranked endpoint sets — hence optional here rather than defaulted.
 */
interface ContractResultDto {
  doc_id: string;
  category: string;
  subject: string;
  index_keywords: string;
  placeholders_count: number;
  score?: number;
}

export interface ContractBrowseResponseDto {
  count: number;
  total_matched: number;
  total_contracts: number;
  /** Category → count, unfiltered, so the chips keep their totals. */
  categories: Record<string, number>;
  pagination: {
    page: number;
    /** Null when the caller asked for no paging and got everything. */
    per_page: number | null;
    total_pages: number;
    total: number;
  };
  filters_used: { q: string | null; category: string | null };
  contracts: ContractResultDto[];
}

interface SuggestionDto {
  choice: number | null;
  doc_id?: string;
  subject?: string;
  reason: string | null;
  error?: string;
}

export interface ContractSearchResponseDto {
  query: string;
  found: boolean;
  count: number;
  results: ContractResultDto[];
  suggestion: SuggestionDto | null;
  message: string | null;
  params_used: Record<string, unknown>;
  took_ms: number;
}

export interface ContractDocumentDto {
  doc_id: string;
  category: string;
  subject: string;
  index_keywords: string;
  placeholders: { index: number; type: string }[];
  placeholders_count: number;
  body: string;
  raw_body: string;
}

export interface ContractsConfigDto {
  loaded: boolean;
  total_contracts?: number;
  /** Category → count, only once the index is loaded. */
  categories?: Record<string, number>;
  defaults?: Record<string, unknown>;
}

/** `Index` is a semicolon-joined keyword list in the source file. */
const toKeywords = (raw: string): string[] =>
  (raw ?? "")
    .split(";")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

/**
 * The corpus only ever uses these three, verified across all 211 templates.
 * An unknown type degrades to a plain text field rather than being dropped —
 * a blank the user cannot fill would break the document.
 */
const toFieldType = (raw: string): ContractFieldType =>
  raw === "number" || raw === "datetime" ? raw : "text";

const toPlaceholder = (dto: {
  index: number;
  type: string;
}): ContractPlaceholder => ({
  index: dto.index,
  type: toFieldType(dto.type),
});

const toSummary = (dto: ContractResultDto): ContractTemplateSummary => ({
  docId: dto.doc_id,
  category: dto.category ?? "",
  subject: dto.subject ?? "",
  keywords: toKeywords(dto.index_keywords),
  placeholderCount: dto.placeholders_count ?? 0,
  // Left undefined when browsing: the row was not ranked, and 0% would read as
  // "no match" rather than "not applicable".
  score: dto.score,
});

const toCategoryCounts = (
  raw: Record<string, number> | undefined,
): { category: string; count: number }[] =>
  Object.entries(raw ?? {}).map(([category, count]) => ({ category, count }));

export const toContractBrowseResult = (
  dto: ContractBrowseResponseDto,
): ContractBrowseResult => {
  const page = dto.pagination?.page ?? 1;
  const totalPages = dto.pagination?.total_pages ?? 1;

  return {
    templates: (dto.contracts ?? []).map(toSummary),
    totalMatched: dto.total_matched ?? 0,
    totalContracts: dto.total_contracts ?? 0,
    categories: toCategoryCounts(dto.categories),
    page,
    totalPages,
    hasMore: page < totalPages,
  };
};

const toSuggestion = (dto: SuggestionDto | null): ContractSuggestion | null =>
  dto
    ? {
        choice: dto.choice ?? null,
        docId: dto.doc_id ?? null,
        subject: dto.subject ?? null,
        reason: dto.reason ?? null,
        error: dto.error ?? null,
      }
    : null;

export const toContractSearchResult = (
  dto: ContractSearchResponseDto,
): ContractSearchResult => ({
  query: dto.query,
  found: dto.found,
  templates: (dto.results ?? []).map(toSummary),
  suggestion: toSuggestion(dto.suggestion),
  message: dto.message,
  tookMs: dto.took_ms ?? 0,
});

export const toContractTemplate = (
  dto: ContractDocumentDto,
): ContractTemplate => ({
  docId: dto.doc_id,
  category: dto.category ?? "",
  subject: dto.subject ?? "",
  keywords: toKeywords(dto.index_keywords),
  body: dto.body ?? "",
  rawBody: dto.raw_body ?? "",
  placeholders: (dto.placeholders ?? []).map(toPlaceholder),
});

export const toContractsConfig = (
  dto: ContractsConfigDto,
): ContractsConfig => ({
  loaded: dto.loaded ?? false,
  totalContracts: dto.total_contracts ?? null,
  categories: Object.entries(dto.categories ?? {}).map(([category, count]) => ({
    category,
    count,
  })),
});
