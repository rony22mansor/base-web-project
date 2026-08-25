import type {
  CaseCatalog,
  CaseCategory,
  CaseDocument,
  CaseDocumentSection,
  CaseSummary,
} from "../../types/interfaces/caseInterface";

/**
 * The cases-catalog contract (`GET /api/legal/cases…`) — the judgments corpus
 * browsed rather than retrieved. Sits next to `casesRagAdapter`, which does the
 * same job for `POST /api/legal/cases/search`.
 *
 * The two endpoints describe the same corpus in different shapes: retrieval
 * returns four flat `*_text` fields per hit, the catalog returns a `sections`
 * object with nine Arabic headings. Neither is converted into the other — see
 * `CaseSummary` / `CaseDocument` for why they stay separate types.
 */

/* -------------------------------------------------------------------------- */
/* DTOs                                                                       */
/* -------------------------------------------------------------------------- */

interface CaseSummaryDto {
  case_number: string;
  case_uid: string;
  file_name: string;
  decision_year: string;
  outcome: string;
  crimes: string[];
  penal_code_articles: string[];
  other_laws: string[];
  text_preview: string;
  type: string;
}

interface CaseCategoryDto {
  crime: string;
  case_count: number;
}

export interface CasesCatalogResponseDto {
  cases: CaseSummaryDto[];
  categories: CaseCategoryDto[];
  available_outcomes: string[];
  available_years: string[];
  count: number;
  total_cases: number;
  total_matched: number;
  filters_used: Record<string, unknown>;
  pagination: {
    page: number;
    /** `null` when the caller asked for everything. */
    per_page: number | null;
    total: number;
    total_pages: number;
  };
}

export interface CaseDocumentDto extends CaseSummaryDto {
  criminal_proceedings_articles: string[];
  fees_law: string[];
  is_public_prosecution: string;
  /** Arabic heading → body. Delivered with its keys sorted alphabetically. */
  sections: Record<string, string>;
}

/* -------------------------------------------------------------------------- */
/* Mappers                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The nine headings of a judgment, in the order the document is written.
 *
 * The API sends `sections` as a JSON object, and Flask sorts object keys
 * alphabetically by default — which lands أقرر (the verdict) first and في
 * الوقائع (the facts) sixth. Rendering in received order would therefore print
 * every judgment back to front, so the reading order is restored here. All 302
 * cases in the corpus carry exactly these nine keys.
 */
export const CASE_SECTION_ORDER: string[] = [
  "المدعي",
  "المدعي الشخصي",
  "المدعى عليه",
  "الجرم",
  "في الوقائع",
  "في المحاكمة",
  "في الأدلة والمناقشة",
  "لذلك",
  "أقرر",
];

/** The API's own separator for a multi-valued `outcome`. */
const OUTCOME_SEPARATOR = "|";

const toOutcomes = (outcome: string): string[] =>
  (outcome ?? "")
    .split(OUTCOME_SEPARATOR)
    .map((value) => value.trim())
    .filter(Boolean);

/**
 * Sections in reading order, empties dropped.
 *
 * A fifth of the corpus's section entries are empty strings — a judgment with
 * no personal plaintiff still carries the heading — and an empty heading reads
 * as missing data rather than as "this did not apply". Any heading the corpus
 * grows later is unknown to `CASE_SECTION_ORDER`, so it is kept and appended
 * rather than silently dropped.
 */
const toSections = (
  sections: Record<string, string> | undefined,
): CaseDocumentSection[] => {
  const entries = Object.entries(sections ?? {}).filter(([, text]) =>
    text?.trim(),
  );

  const rank = (title: string) => {
    const index = CASE_SECTION_ORDER.indexOf(title);
    return index === -1 ? CASE_SECTION_ORDER.length : index;
  };

  return entries
    .sort(([a], [b]) => rank(a) - rank(b))
    .map(([title, text]) => ({ title, text }));
};

/**
 * `case_number` is the court's number and repeats across documents, so the
 * unique `case_uid` carries the identity — matching what `casesRagAdapter`
 * does with `file_name` for the same reason.
 */
export const toCaseSummary = (dto: CaseSummaryDto): CaseSummary => ({
  id: dto.case_uid || `${dto.case_number}:${dto.file_name}`,
  caseNumber: dto.case_number,
  caseUid: dto.case_uid,
  fileName: dto.file_name,
  decisionYear: dto.decision_year ?? "",
  outcome: dto.outcome ?? "",
  outcomes: toOutcomes(dto.outcome),
  crimes: dto.crimes ?? [],
  penalCodeArticles: dto.penal_code_articles ?? [],
  otherLaws: dto.other_laws ?? [],
  textPreview: dto.text_preview ?? "",
  type: dto.type ?? "",
});

const toCategory = (dto: CaseCategoryDto): CaseCategory => ({
  crime: dto.crime,
  caseCount: dto.case_count ?? 0,
});

export const toCaseCatalog = (dto: CasesCatalogResponseDto): CaseCatalog => {
  const { page, per_page, total_pages } = dto.pagination ?? {};

  return {
    cases: (dto.cases ?? []).map(toCaseSummary),
    // Busiest crime first — the server already sorts this way, and the panel
    // shows the head of the list before the reader expands it.
    categories: (dto.categories ?? []).map(toCategory),
    availableOutcomes: dto.available_outcomes ?? [],
    availableYears: dto.available_years ?? [],
    totalMatched: dto.total_matched ?? dto.count ?? 0,
    totalCases: dto.total_cases ?? 0,
    page: page ?? 1,
    totalPages: total_pages ?? 1,
    // `per_page: null` means the caller asked for the whole set, which is one
    // complete page by definition.
    hasMore: per_page == null ? false : (page ?? 1) < (total_pages ?? 1),
  };
};

export const toCaseDocument = (dto: CaseDocumentDto): CaseDocument => ({
  ...toCaseSummary(dto),
  criminalProceedingsArticles: dto.criminal_proceedings_articles ?? [],
  feesLaw: dto.fees_law ?? [],
  isPublicProsecution: dto.is_public_prosecution ?? "",
  sections: toSections(dto.sections),
});
