import type { CrimeClassification } from "../../types/interfaces/classificationInterface";

/**
 * Backend reference: services/classification_service.py. `message` is present
 * only on the negative branch, which is why it is optional here and normalized
 * to null.
 */
export interface ClassifyResponseDto {
  classified: boolean;
  crimes: string[];
  message?: string;
}

export const toCrimeClassification = (
  dto: ClassifyResponseDto,
): CrimeClassification => ({
  classified: dto.classified ?? false,
  crimes: dto.crimes ?? [],
  message: dto.message ?? null,
});
