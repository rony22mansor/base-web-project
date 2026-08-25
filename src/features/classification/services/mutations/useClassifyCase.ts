"use client";

import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiMutation } from "@/src/core/network/useApiHooks";
import type { ClassifyCaseDto } from "../../types/dtos";
import type { CrimeClassification } from "../../types/interfaces/classificationInterface";
import { classificationService } from "../classificationService";

/** One classification run. Fires only on submit. */
export function useClassifyCase() {
  return useApiMutation<ApiResponse<CrimeClassification>, ClassifyCaseDto>({
    mutationKey: [QUERY_KEYS.CLASSIFY],
    mutationFn: (payload) => classificationService.classify(payload),
    retry: false,
  });
}
