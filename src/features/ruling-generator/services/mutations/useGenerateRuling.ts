"use client";

import type { ApiResponse } from "@/src/core/network/apiInterfaces";
import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiMutation } from "@/src/core/network/useApiHooks";
import type { GenerateRulingDto } from "../../types/dtos";
import type { RulingResult } from "../../types/interfaces/rulingInterface";
import { rulingGeneratorService } from "../rulingGeneratorService";

export function useGenerateRuling() {
  return useApiMutation<ApiResponse<RulingResult>, GenerateRulingDto>({
    mutationKey: [QUERY_KEYS.RULING_GENERATOR],
    mutationFn: (payload) => rulingGeneratorService.generate(payload),
  });
}
