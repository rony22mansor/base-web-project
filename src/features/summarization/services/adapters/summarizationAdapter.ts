import type {
  CaseSummary,
  ExtractedFields,
} from "../../types/interfaces/summaryInterface";

/**
 * The summarization contract and the shape the report renders from.
 *
 * Backend reference: services/summarization.py — `StructuredFieldExtractor`
 * seeds every key, so the nullish handling here is for a truncated response,
 * not for the normal case.
 */

interface ExtractedFieldsDto {
  date: string | null;
  accused: string[];
  victim: string | null;
  action: string | null;
  evidence: string[];
  confession_status: string[];
  ruling: string | null;
}

export interface SummarizeResponseDto {
  summary: string;
  original_length: number;
  extracted_fields: ExtractedFieldsDto;
}

const toFields = (dto: ExtractedFieldsDto | undefined): ExtractedFields => ({
  date: dto?.date ?? null,
  accused: dto?.accused ?? [],
  victim: dto?.victim ?? null,
  action: dto?.action ?? null,
  evidence: dto?.evidence ?? [],
  confessionStatus: dto?.confession_status ?? [],
  ruling: dto?.ruling ?? null,
});

export const toCaseSummary = (dto: SummarizeResponseDto): CaseSummary => ({
  summary: dto.summary ?? "",
  originalLength: dto.original_length ?? 0,
  fields: toFields(dto.extracted_fields),
});
