"use client";

import { QUERY_KEYS } from "@/src/core/network/queryKeysConstants";
import { useApiQuery } from "@/src/core/network/useApiHooks";
import { contractTemplatesService } from "../contractTemplatesService";

/**
 * One full template, with its body and placeholder list.
 *
 * Cached for the session: the editor re-reads it on every keystroke's render,
 * and a template is immutable once published.
 */
export function useContractTemplate(docId: string) {
  return useApiQuery({
    queryKey: [QUERY_KEYS.CONTRACT_TEMPLATE, docId],
    queryFn: () => contractTemplatesService.document(docId),
    enabled: docId.length > 0,
    staleTime: Infinity,
    retry: false,
  });
}
