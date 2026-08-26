"use client";

import { requestNotificationPermission } from "@/src/core/services/notifications/browserNotifications";
import { useMemo, useState } from "react";
import { CaseScope } from "../enums/caseEnums";
import { collectOutcomes } from "../helpers/caseOutcome";
import {
  DEFAULT_HYBRID_TOP_K,
  DEFAULT_TOP_K,
  scopeToThreshold,
} from "../helpers/caseRetrieval";
import { useCaseSearchConfig } from "../services/queries/useCaseSearchConfig";
import { useCaseSemanticSearch } from "../services/queries/useCaseSemanticSearch";

/**
 * Drives the precedents screen.
 *
 * Unlike laws, this feature has no browse mode: the cases corpus is reachable
 * only by describing facts, so with no query the screen explains itself rather
 * than listing anything. The query applies on submit; the outcome chip only
 * filters the ranked set already on screen.
 *
 * Scope (the similarity threshold) used to be a chip the user picked; it is
 * now fixed at Balanced — the server's own default — rather than exposed as a
 * choice. See `CaseScope` for what the other settings meant.
 */
export function useCaseSearchScreen() {
  const [query, setQuery] = useState("");
  const [outcome, setOutcome] = useState<string | null>(null);

  const isSearchMode = query.length > 0;

  const search = useCaseSemanticSearch({
    query,
    threshold: scopeToThreshold(CaseScope.Broad),
    topK: DEFAULT_TOP_K,
    hybridTopK: DEFAULT_HYBRID_TOP_K,
  });
  const config = useCaseSearchConfig();

  const result = search.data?.data;
  const retrieved = useMemo(() => result?.cases ?? [], [result]);

  // Chip values come from the results themselves — there is no facet endpoint
  // for this corpus, and the chips filter exactly the set on screen.
  const outcomes = useMemo(
    () => collectOutcomes(retrieved.map((legalCase) => legalCase.outcomes)),
    [retrieved],
  );

  const outcomeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const legalCase of retrieved) {
      for (const value of legalCase.outcomes) {
        counts[value] = (counts[value] ?? 0) + 1;
      }
    }
    return counts;
  }, [retrieved]);

  // A new query rebuilds the chip set, so a selection left over from the last
  // one is simply not applied — no effect needed to reset it.
  const activeOutcome = outcome && outcomes.includes(outcome) ? outcome : null;

  const cases = useMemo(
    () =>
      activeOutcome
        ? retrieved.filter((legalCase) =>
            legalCase.outcomes.includes(activeOutcome),
          )
        : retrieved,
    [retrieved, activeOutcome],
  );

  return {
    // mode
    isSearchMode,

    // filters
    query,
    outcome: activeOutcome,
    setOutcome,
    outcomes,
    outcomeCounts,
    // Asked for here, inside the click that starts the search: browsers only
    // show the permission prompt in response to a user gesture, and a request
    // made later — once retrieval is already in flight — is silently ignored.
    search: (next: string) => {
      requestNotificationPermission();
      setQuery(next);
    },
    clearSearch: () => setQuery(""),

    // data
    cases,
    total: isSearchMode && !search.isPending ? cases.length : undefined,
    /** The server's own Arabic "nothing matched" prose, when it sent one. */
    serverMessage: result?.message ?? undefined,
    tookMs: result?.tookMs,

    /**
     * False while the models are still on disk. The first search then costs
     * about a minute, which is worth saying before the user starts waiting.
     * A completed search is itself proof the index is warm — the config query
     * is not re-fetched afterwards, so it would otherwise keep claiming cold.
     */
    isIndexWarm: (config.data?.data.loaded ?? true) || search.isSuccess,

    // request state
    isLoading: isSearchMode && search.isPending,
    isSearching: search.isFetching,
    isSuccess: search.isSuccess,
    isError: search.isError,
    errorMessage: search.error?.message,
    retry: search.refetch,
  };
}
