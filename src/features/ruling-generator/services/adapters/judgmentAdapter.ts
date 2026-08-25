import {
  toCase,
  type CasesRagResultDto,
} from "@/src/features/case-search/services/adapters/casesRagAdapter";
import {
  toArticle,
  type LawsRagResultDto,
} from "@/src/features/law-search/services/adapters/lawsRagAdapter";
import { ArticleStatus } from "../../enums/rulingEnums";
import type {
  ArticleRef,
  CandidateCharge,
  ConfusablePair,
  JudgmentConfig,
  JudgmentEvidence,
  JudgmentMeta,
  JudgmentPrediction,
  LlmPingResult,
  PrecedentArticleMismatch,
  ReorganizedFacts,
  StatuteDiscrimination,
  UnsupportedChargeQuote,
  Verification,
} from "../../types/interfaces/rulingInterface";

/**
 * The judgment-prediction contract (`POST /api/legal/judgment/predict`) and the
 * shape the report renders from. The translation lives here so it stays in one
 * file, as with the other two RAG features.
 *
 * This endpoint is a composite: it runs laws RAG and cases RAG internally and
 * returns what they produced under `evidence`, in those endpoints' own shapes.
 * Rather than re-describe them, the two adapters are reused — which is also
 * what lets the report render precedents and statutes through the very same
 * cards the browse screens use.
 */

/**
 * Everything but `charge` and the two flag fields is optional here, and that
 * is not defensive padding: when the model returns a charge the backend cannot
 * parse, it is passed through as `{ charge, article_id: null, flagged: true,
 * flag_reason }` with no article fields at all. That row still has to render.
 */
interface CandidateChargeDto {
  article_id: string | null;
  article_number?: string;
  /** Arabic status word, or absent when the retrieved article carried none. */
  article_status?: string | null;
  charge: string;
  elements_match?: boolean;
  flag_reason: string | null;
  flagged: boolean;
  law_name?: string;
  supporting_quote?: string;
}

/**
 * Three of these lists hold plain ids and two hold objects. That asymmetry is
 * the API's, not a mistake: an unknown citation is fully described by its id,
 * whereas a failed quote check has to carry what was quoted and why it failed.
 */
interface VerificationDto {
  fully_grounded: boolean;
  grounded: boolean;
  label: string;
  /** Composite article ids. */
  unknown_statute_citations: string[];
  /** Case numbers. */
  unknown_case_citations: string[];
  /** Composite article ids whose penalty text carried unsupported numbers. */
  possible_penalty_hallucination_in: string[];
  unsupported_charge_quotes: UnsupportedChargeQuoteDto[];
  precedent_article_mismatches: PrecedentArticleMismatchDto[];
}

interface UnsupportedChargeQuoteDto {
  charge: string;
  article_id: string | null;
  reason: string;
  /** Only set when the quote was checked against a real article body. */
  quoted?: string;
}

interface PrecedentArticleMismatchDto {
  case_number: string;
  precedent_articles: string[];
  chosen_articles: string[];
}

interface ReorganizedFactsDto {
  objective_behavior?: string;
  subjective_motivation?: string;
  ex_post_facto_circumstances?: string;
}

interface ConfusablePairDto {
  article_a: string;
  article_b: string;
  overlap: number;
}

interface DiscriminationDto {
  article_a: string;
  article_b: string;
  distinguishing_questions: {
    question: string;
    answer_from_facts: string;
    /** Absent when the answer settled nothing between the two. */
    points_to_article?: string;
  }[];
}

interface EvidenceDto {
  statutes: LawsRagResultDto[];
  cases: CasesRagResultDto[];
  classifier_candidates: { label: string; predicted: boolean; score: number }[];
  /**
   * The three-part restatement when the fact-reorganization stage ran, and an
   * empty object when it did not — hence the shape check in `toReorganizedFacts`.
   */
  reorganized_facts: ReorganizedFactsDto;
  /** Both empty unless statute discrimination ran. */
  confusable_pairs: ConfusablePairDto[];
  discrimination: DiscriminationDto[];
  retrieval_text: string;
}

interface MetaDto {
  took_ms: number;
  llm: { backend: string; model: string };
  pipeline: {
    domain_classifier: boolean;
    fact_reorganization: boolean;
    statute_discrimination: boolean;
  };
  config_used: Record<string, unknown>;
}

/** Payload under the server's `data` key. */
export interface JudgmentPredictionDto {
  ok: boolean;
  outcome: string;
  outcome_is_standard: boolean;
  final_charge: string;
  facts_summary: string;
  confidence_note: string;
  suggested_penalty_range: string;
  candidate_charges: CandidateChargeDto[];
  reasoning: {
    charges_analysis: string;
    exclusion_notes: string;
    precedent_alignment: string;
  };
  verification: VerificationDto;
  cited_statutes: string[];
  cited_precedents: string[];
  evidence: EvidenceDto;
  meta: MetaDto;
}

export interface JudgmentConfigDto {
  ready: boolean;
  blocking_reason: string | null;
  outcomes: string[];
  llm: {
    active_backend: string;
    active_model: string;
    configured: boolean;
  };
  depends_on: {
    laws_rag_loaded: boolean;
    cases_rag_loaded: boolean;
    classifier_available: boolean;
    llm_key_set: boolean;
  };
  tunable_in_request: string[];
  defaults: Record<string, unknown>;
}

export interface LlmPingDto {
  ok: boolean;
  backend?: string;
  model?: string;
  error?: string;
}

/** Arabic status words as the corpus writes them, same map as laws RAG. */
const STATUS_MAP: Record<string, ArticleStatus> = {
  عادية: ArticleStatus.Regular,
  نافذة: ArticleStatus.Regular,
  معدلة: ArticleStatus.Amended,
  ملغاة: ArticleStatus.Repealed,
};

/**
 * Null is meaningful here and is not defaulted away: a charge whose article
 * carried no status must not be labelled "in force" on a screen whose whole
 * job is flagging repealed law.
 */
const toStatus = (raw: string | null): ArticleStatus | null =>
  raw ? (STATUS_MAP[raw.trim()] ?? null) : null;

const toCandidateCharge = (dto: CandidateChargeDto): CandidateCharge => ({
  id: dto.article_id ?? "",
  charge: dto.charge,
  articleNumber: dto.article_number ?? "",
  lawName: dto.law_name ?? "",
  articleStatus: toStatus(dto.article_status ?? null),
  // Absent on an unparseable charge, and "unknown" is not "met".
  elementsMatch: dto.elements_match ?? false,
  flagged: dto.flagged,
  flagReason: dto.flag_reason,
  supportingQuote: dto.supporting_quote ?? "",
});

const toUnsupportedQuote = (
  dto: UnsupportedChargeQuoteDto,
): UnsupportedChargeQuote => ({
  charge: dto.charge,
  articleId: dto.article_id ?? null,
  reason: dto.reason,
  quoted: dto.quoted ?? null,
});

const toPrecedentMismatch = (
  dto: PrecedentArticleMismatchDto,
): PrecedentArticleMismatch => ({
  caseNumber: String(dto.case_number ?? ""),
  precedentArticles: dto.precedent_articles ?? [],
  chosenArticles: dto.chosen_articles ?? [],
});

const toVerification = (dto: VerificationDto | undefined): Verification => ({
  fullyGrounded: dto?.fully_grounded ?? false,
  grounded: dto?.grounded ?? false,
  label: dto?.label ?? "",
  unknownStatuteCitations: dto?.unknown_statute_citations ?? [],
  unknownCaseCitations: dto?.unknown_case_citations ?? [],
  unsupportedChargeQuotes: (dto?.unsupported_charge_quotes ?? []).map(
    toUnsupportedQuote,
  ),
  precedentArticleMismatches: (dto?.precedent_article_mismatches ?? []).map(
    toPrecedentMismatch,
  ),
  possiblePenaltyHallucinationIn: dto?.possible_penalty_hallucination_in ?? [],
});

/**
 * `{}` when the stage was skipped, and a three-field object when it ran — so
 * an object with nothing in it is the same as nothing at all.
 */
const toReorganizedFacts = (
  dto: ReorganizedFactsDto | undefined,
): ReorganizedFacts | null => {
  const facts: ReorganizedFacts = {
    objectiveBehavior: dto?.objective_behavior?.trim() ?? "",
    subjectiveMotivation: dto?.subjective_motivation?.trim() ?? "",
    exPostFactoCircumstances: dto?.ex_post_facto_circumstances?.trim() ?? "",
  };

  return Object.values(facts).some(Boolean) ? facts : null;
};

/**
 * Article ids are "{law_name}:{article_number}", and the law name itself has
 * no colon, so the last one separates the two. Printing the whole id in a
 * comparison table would bury the only part that differs.
 */
const toArticleRef = (id: string): ArticleRef => {
  const cut = id.lastIndexOf(":");
  return cut === -1
    ? { id, articleNumber: id, lawName: "" }
    : { id, articleNumber: id.slice(cut + 1), lawName: id.slice(0, cut) };
};

const toConfusablePair = (dto: ConfusablePairDto): ConfusablePair => ({
  articleA: toArticleRef(dto.article_a),
  articleB: toArticleRef(dto.article_b),
  overlap: dto.overlap,
});

const toDiscrimination = (dto: DiscriminationDto): StatuteDiscrimination => ({
  articleA: toArticleRef(dto.article_a),
  articleB: toArticleRef(dto.article_b),
  questions: (dto.distinguishing_questions ?? []).map((question) => ({
    question: question.question,
    answerFromFacts: question.answer_from_facts,
    pointsToArticle: question.points_to_article ?? null,
  })),
});

const toEvidence = (dto: EvidenceDto): JudgmentEvidence => ({
  statutes: (dto?.statutes ?? []).map(toArticle),
  cases: (dto?.cases ?? []).map(toCase),
  classifierCandidates: dto?.classifier_candidates ?? [],
  reorganizedFacts: toReorganizedFacts(dto?.reorganized_facts),
  confusablePairs: (dto?.confusable_pairs ?? []).map(toConfusablePair),
  discrimination: (dto?.discrimination ?? []).map(toDiscrimination),
  retrievalText: dto?.retrieval_text ?? "",
});

const toMeta = (dto: MetaDto): JudgmentMeta => ({
  tookMs: dto?.took_ms ?? 0,
  llm: { backend: dto?.llm?.backend ?? "", model: dto?.llm?.model ?? "" },
  pipeline: {
    domainClassifier: dto?.pipeline?.domain_classifier ?? false,
    factReorganization: dto?.pipeline?.fact_reorganization ?? false,
    statuteDiscrimination: dto?.pipeline?.statute_discrimination ?? false,
  },
  configUsed: dto?.config_used ?? {},
});

export const toJudgmentPrediction = (
  dto: JudgmentPredictionDto,
): JudgmentPrediction => ({
  ok: dto.ok,
  outcome: dto.outcome ?? "",
  outcomeIsStandard: dto.outcome_is_standard ?? false,
  finalCharge: dto.final_charge ?? "",
  factsSummary: dto.facts_summary ?? "",
  confidenceNote: dto.confidence_note ?? "",
  suggestedPenaltyRange: dto.suggested_penalty_range ?? "",
  candidateCharges: (dto.candidate_charges ?? []).map(toCandidateCharge),
  reasoning: {
    chargesAnalysis: dto.reasoning?.charges_analysis ?? "",
    exclusionNotes: dto.reasoning?.exclusion_notes ?? "",
    precedentAlignment: dto.reasoning?.precedent_alignment ?? "",
  },
  verification: toVerification(dto.verification),
  citedStatutes: dto.cited_statutes ?? [],
  citedPrecedents: dto.cited_precedents ?? [],
  evidence: toEvidence(dto.evidence),
  meta: toMeta(dto.meta),
});

export const toJudgmentConfig = (dto: JudgmentConfigDto): JudgmentConfig => ({
  ready: dto.ready ?? false,
  blockingReason: dto.blocking_reason ?? null,
  outcomes: dto.outcomes ?? [],
  llm: {
    activeBackend: dto.llm?.active_backend ?? "",
    activeModel: dto.llm?.active_model ?? "",
    configured: dto.llm?.configured ?? false,
  },
  dependsOn: {
    lawsRagLoaded: dto.depends_on?.laws_rag_loaded ?? false,
    casesRagLoaded: dto.depends_on?.cases_rag_loaded ?? false,
    classifierAvailable: dto.depends_on?.classifier_available ?? false,
    llmKeySet: dto.depends_on?.llm_key_set ?? false,
  },
  tunableInRequest: dto.tunable_in_request ?? [],
});

export const toLlmPingResult = (dto: LlmPingDto): LlmPingResult => ({
  ok: dto.ok ?? false,
  backend: dto.backend,
  model: dto.model,
  error: dto.error,
});

/**
 * What retrieval produced, salvaged from a failed run.
 *
 * When the model cannot be parsed the route answers 502 — but it still puts
 * the whole payload under `data`, and that payload still carries the statutes
 * and precedents both pipelines found. Those cost most of the minute the user
 * just spent, so the error screen shows them rather than throwing the work
 * away. The failure payload's `evidence` holds only `statutes` and `cases`;
 * every other field of `toEvidence` degrades to empty on its own.
 */
export const toFailedEvidence = (error: unknown): JudgmentEvidence | null => {
  const evidence = (error as { data?: { evidence?: EvidenceDto } })?.data
    ?.evidence;

  if (!evidence) return null;

  const salvaged = toEvidence(evidence);
  return salvaged.statutes.length > 0 || salvaged.cases.length > 0
    ? salvaged
    : null;
};
