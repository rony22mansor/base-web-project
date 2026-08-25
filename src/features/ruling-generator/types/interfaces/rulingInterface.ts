import type { LegalCase } from "@/src/features/case-search/types/interfaces/caseInterface";
import type { LawArticle } from "@/src/features/law-search/types/interfaces/lawInterface";
import type { ArticleStatus } from "../../enums/rulingEnums";

/**
 * `POST /api/legal/judgment/predict`, as the UI consumes it.
 *
 * Every string here is legal content produced by the model in Arabic — it is
 * displayed as it arrives and never routed through the i18n message files.
 *
 * Note what is *not* here: a confidence number. The endpoint does not score
 * itself. What it does instead is verify, after the fact, that every statute
 * and precedent the model cited genuinely appears in the retrieved context —
 * see `Verification`, which is grounding, not confidence, and must not be
 * rendered as a percentage.
 */
export interface JudgmentPrediction {
  /** The pipeline's own success flag. False means no usable prediction. */
  ok: boolean;
  /** One of إدانة / براءة / إسقاط دعوى — the vocabulary /config publishes. */
  outcome: string;
  /** False when the model answered outside that closed vocabulary. */
  outcomeIsStandard: boolean;
  /** The charge the model settled on. */
  finalCharge: string;
  /** The facts, restated by the model. */
  factsSummary: string;
  /** Arabic prose on how sufficient the context was. Deliberately not a score. */
  confidenceNote: string;
  /** The penalty the cited article prescribes, in the model's words. */
  suggestedPenaltyRange: string;
  /** Every charge considered, including the ones ruled out. */
  candidateCharges: CandidateCharge[];
  reasoning: JudgmentReasoning;
  verification: Verification;
  /** Composite article ids the model cited. Resolve against `evidence.statutes`. */
  citedStatutes: string[];
  /** Precedent references, e.g. "case_number=512". */
  citedPrecedents: string[];
  /** What the two retrieval pipelines handed the model before it answered. */
  evidence: JudgmentEvidence;
  meta: JudgmentMeta;
}

/** One charge the model weighed, matched to the article that defines it. */
export interface CandidateCharge {
  /** The composite "{law_name}:{article_number}" id. */
  id: string;
  charge: string;
  articleNumber: string;
  lawName: string;
  /** Null when the retrieved article carried no status. */
  articleStatus: ArticleStatus | null;
  /** Whether the article's elements are met by these facts. */
  elementsMatch: boolean;
  /** Raised by the backend's own checks — render it as a warning. */
  flagged: boolean;
  /** Why it was flagged. Arabic, ready to display. Null when not flagged. */
  flagReason: string | null;
  /** The clause of the article the model leaned on. Capped server-side. */
  supportingQuote: string;
}

export interface JudgmentReasoning {
  /** Why each candidate charge does or does not fit. */
  chargesAnalysis: string;
  /** Why the rejected charges were rejected. */
  exclusionNotes: string;
  /** How the retrieved precedents line up with these facts. */
  precedentAlignment: string;
}

/**
 * The backend re-reads the model's answer against what was actually retrieved.
 * Every list here is a citation it could *not* account for, so a non-empty one
 * is a concrete warning to show, not a debug detail.
 */
export interface Verification {
  /** Identity, elements and precedent alignment all check out. */
  fullyGrounded: boolean;
  /** The weaker check: citations resolve, without the deeper agreement. */
  grounded: boolean;
  /** Arabic summary of the verdict on grounding. Display directly. */
  label: string;
  /** Cited article ids that are not in the retrieved statutes. */
  unknownStatuteCitations: string[];
  /** Cited precedents that are not in the retrieved cases. */
  unknownCaseCitations: string[];
  /** Charge quotes that could not be found in the article they cite. */
  unsupportedChargeQuotes: UnsupportedChargeQuote[];
  /** Precedents whose articles disagree with the charge chosen. */
  precedentArticleMismatches: PrecedentArticleMismatch[];
  /** Penalties that may not come from the cited article. */
  possiblePenaltyHallucinationIn: string[];
}

/**
 * One failed quote check. The backend tests every `supporting_quote` against
 * the actual body of the article it was attributed to — after Arabic
 * normalization, so this is a real content check and not an id comparison.
 */
export interface UnsupportedChargeQuote {
  /** The charge whose quote failed. */
  charge: string;
  /** The article it was attributed to. Null on a malformed charge. */
  articleId: string | null;
  /** Why it failed, in Arabic, ready to display. */
  reason: string;
  /**
   * The quote itself — present only when it was checked against a real article
   * and simply was not there. Absent when the quote was empty or the article
   * unknown, since there is nothing to show.
   */
  quoted: string | null;
}

/**
 * A retrieved precedent that cites a different article than the one chosen.
 * Not necessarily an error — precedents can turn on a different provision —
 * but it is the disagreement a reviewer most wants pointed out.
 */
export interface PrecedentArticleMismatch {
  caseNumber: string;
  /** Article numbers the precedent's own reasoning cites. */
  precedentArticles: string[];
  /** Article numbers this prediction settled on. */
  chosenArticles: string[];
}

/**
 * What the model saw. Both lists arrive in the shape their own RAG endpoint
 * uses, so they are mapped with those features' adapters and render through
 * the same cards — a precedent here is the same object as a precedent on the
 * precedents screen.
 */
export interface JudgmentEvidence {
  statutes: LawArticle[];
  cases: LegalCase[];
  /** The statistical classifier's guesses, before the LLM saw anything. */
  classifierCandidates: ClassifierCandidate[];
  /** The facts broken into legal elements. Null when that stage was off. */
  reorganizedFacts: ReorganizedFacts | null;
  /** Article pairs the pipeline judged easy to confuse. Thorough mode only. */
  confusablePairs: ConfusablePair[];
  /** How it told each of those pairs apart. Thorough mode only. */
  discrimination: StatuteDiscrimination[];
  /** The retrieval query the pipeline actually ran. */
  retrievalText: string;
}

/**
 * The facts restated as the three elements a charge is tested against. Fields
 * are Arabic prose and any of them can come back empty — the model leaves a
 * blank rather than inventing a motive it cannot find in the facts.
 */
export interface ReorganizedFacts {
  /** الفعل المادي — what was actually done. */
  objectiveBehavior: string;
  /** القصد — the intent behind it. */
  subjectiveMotivation: string;
  /** ما تلا الفعل — what happened afterwards. */
  exPostFactoCircumstances: string;
}

/** A composite article id, split for display. */
export interface ArticleRef {
  /** The full "{law_name}:{article_number}" id, as the API uses it. */
  id: string;
  articleNumber: string;
  lawName: string;
}

/** Two articles whose wording overlaps enough to be mistaken for each other. */
export interface ConfusablePair {
  articleA: ArticleRef;
  articleB: ArticleRef;
  /** 0..1 textual overlap. */
  overlap: number;
}

/**
 * The ADAPT stage: rather than guess between two similar articles, the
 * pipeline asks itself pointed questions and answers them from the facts.
 * This is the most reviewable part of the whole report — it shows the test
 * that separated the charge that was chosen from the one that was not.
 */
export interface StatuteDiscrimination {
  articleA: ArticleRef;
  articleB: ArticleRef;
  questions: DiscriminationQuestion[];
}

export interface DiscriminationQuestion {
  question: string;
  /** The answer the pipeline drew from the submitted facts. */
  answerFromFacts: string;
  /** Which article the answer favours. Null when it settled nothing. */
  pointsToArticle: string | null;
}

export interface ClassifierCandidate {
  label: string;
  /** Whether the classifier put this label above its own cut-off. */
  predicted: boolean;
  score: number;
}

export interface JudgmentMeta {
  tookMs: number;
  llm: { backend: string; model: string };
  /** Which optional stages actually ran. */
  pipeline: {
    domainClassifier: boolean;
    factReorganization: boolean;
    statuteDiscrimination: boolean;
  };
  /** Every parameter applied, defaults included. For the debug panel. */
  configUsed: Record<string, unknown>;
}

/**
 * `GET /api/legal/judgment/config` — read before the screen opens.
 *
 * `ready: false` means the LLM key is missing and every prediction will fail,
 * so the feature is blocked up front rather than after a minute of waiting.
 */
export interface JudgmentConfig {
  ready: boolean;
  /** Arabic explanation of why it is not ready. Null when it is. */
  blockingReason: string | null;
  /** The three values `outcome` may take. */
  outcomes: string[];
  llm: {
    activeBackend: string;
    activeModel: string;
    /** False when no provider has a key set. */
    configured: boolean;
  };
  dependsOn: {
    lawsRagLoaded: boolean;
    casesRagLoaded: boolean;
    classifierAvailable: boolean;
    llmKeySet: boolean;
  };
  /** Keys the request's `config` object may override. */
  tunableInRequest: string[];
}

/** `GET /api/legal/judgment/llm/ping` — a few-token round trip to the model. */
export interface LlmPingResult {
  ok: boolean;
  backend?: string;
  model?: string;
  /** The provider's own message when the ping failed. */
  error?: string;
}
