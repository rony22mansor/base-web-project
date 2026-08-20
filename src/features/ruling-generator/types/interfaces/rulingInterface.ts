import { ArticleStatus, CaseCategory } from "../../enums/rulingEnums";

/**
 * A law article the ruling relied on. `text` is legal content straight from the
 * API — it is never routed through the i18n message files.
 */
export interface LegalBasisArticle {
  id: string;
  articleNumber: string;
  lawName: string;
  /** باب / فصل breadcrumb, ordered outermost first. */
  hierarchy: string[];
  text: string;
  status: ArticleStatus;
}

/** A similar historical case surfaced alongside the ruling. */
export interface Precedent {
  id: string;
  title: string;
  caseNumber: string;
  category: CaseCategory;
  /** ISO date string. */
  date: string;
  summary: string;
}

/** The full structured output of one ruling generation. */
export interface RulingResult {
  /**
   * False when the RAG engine found no genuine match. monsif.md requires the
   * engine to be strict and return nothing rather than improvise, so the UI
   * must not render a report in that case.
   */
  matched: boolean;
  /** Predicted outcome. Empty when `matched` is false. */
  ruling: string;
  /** 0..1 — rendered as a percentage. */
  confidence: number;
  explanation: string;
  legalBasis: LegalBasisArticle[];
  precedents: Precedent[];
}

/** Text extracted from an uploaded .docx by the backend. */
export interface ExtractedDocument {
  text: string;
}
