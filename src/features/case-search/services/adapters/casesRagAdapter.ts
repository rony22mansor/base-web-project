import type {
  CaseSearchConfig,
  CaseSearchResult,
  LegalCase,
} from "../../types/interfaces/caseInterface";

/**
 * The Flask cases-RAG contract (`POST /api/legal/cases/search`) and the shape
 * the UI consumes are not the same thing, and neither side should bend: the
 * backend speaks snake_case Arabic legal vocabulary, the components speak
 * `LegalCase`. The translation lives here so it stays in one file.
 *
 * Backend reference: routes/cases_rag_routes.py + services/cases_rag.py.
 */

/** Request body. Every field but `text` is optional; the server has defaults. */
export interface CasesRagRequest {
  text: string;
  top_k?: number;
  hybrid_top_k?: number;
  threshold?: number;
  rerank_max_length?: number;
}

export interface CasesRagResultDto {
  case_number: string;
  file_name: string;
  /** Reranker similarity. See `toFraction` for the scale it arrives on. */
  similarity_score: number;
  decision_year: string;
  /** Several values arrive already joined with " | ". */
  outcome: string;
  crimes: string[];
  penal_code_articles: string[];
  other_laws: string[];
  facts_text: string;
  claims_text: string;
  reasoning_text: string;
  judgment_text: string;
}

/** Payload under the server's `data` key. */
export interface CasesRagResponseDto {
  query: string;
  found: boolean;
  count: number;
  results: CasesRagResultDto[];
  message: string | null;
  params_used: Record<string, unknown>;
  took_ms: number;
}

export interface CasesRagConfigDto {
  defaults: {
    top_k?: number;
    hybrid_top_k?: number;
    threshold?: number;
    rerank_max_length?: number;
  };
  tunable_in_request: string[];
  loaded: boolean;
  index_path?: string;
  corpus_path?: string;
}

/**
 * `similarity_score` comes back as a percentage (32.8), while `threshold` in
 * the request is a fraction (0.3) — the server scales the one it prints and
 * not the one it compares. The published contract documents the opposite for
 * this endpoint, so rather than trust either, anything above 1 is read as a
 * percentage. Everything downstream then works in 0..1, the same as
 * `LawArticle.score`.
 */
const toFraction = (score: number): number =>
  score > 1 ? score / 100 : score;

/** The API's own separator for multi-valued `outcome`. */
const OUTCOME_SEPARATOR = "|";

const toOutcomes = (outcome: string): string[] =>
  (outcome ?? "")
    .split(OUTCOME_SEPARATOR)
    .map((value) => value.trim())
    .filter(Boolean);

/**
 * `case_number` is the court's number and repeats across files (two different
 * courts, same number), so the file name — unique per document — carries the
 * identity and the pair makes a readable key.
 */
const toId = (dto: CasesRagResultDto): string =>
  `${dto.case_number}:${dto.file_name}`;

/**
 * Also used by judgment prediction: `evidence.cases[]` is this same shape —
 * the endpoint runs cases RAG internally and hands back the precedents the
 * model actually saw.
 */
export const toCase = (dto: CasesRagResultDto): LegalCase => ({
  id: toId(dto),
  caseNumber: dto.case_number,
  fileName: dto.file_name,
  decisionYear: dto.decision_year,
  similarityScore: toFraction(dto.similarity_score),
  outcome: dto.outcome ?? "",
  outcomes: toOutcomes(dto.outcome),
  crimes: dto.crimes ?? [],
  penalCodeArticles: dto.penal_code_articles ?? [],
  otherLaws: dto.other_laws ?? [],
  factsText: dto.facts_text ?? "",
  claimsText: dto.claims_text ?? "",
  reasoningText: dto.reasoning_text ?? "",
  judgmentText: dto.judgment_text ?? "",
});

export const toCaseSearchResult = (
  dto: CasesRagResponseDto,
): CaseSearchResult => ({
  query: dto.query,
  found: dto.found,
  cases: (dto.results ?? []).map(toCase),
  message: dto.message,
  paramsUsed: dto.params_used ?? {},
  tookMs: dto.took_ms,
});

export const toCaseSearchConfig = (
  dto: CasesRagConfigDto,
): CaseSearchConfig => ({
  defaults: {
    topK: dto.defaults?.top_k,
    hybridTopK: dto.defaults?.hybrid_top_k,
    threshold: dto.defaults?.threshold,
    rerankMaxLength: dto.defaults?.rerank_max_length,
  },
  tunableInRequest: dto.tunable_in_request ?? [],
  loaded: dto.loaded ?? false,
});
