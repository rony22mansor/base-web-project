import { CitationGraphContainer } from "@/src/features/law-search/components/graph/CitationGraphContainer";

/**
 * A static segment under `law-search/`, not `law-search/[lawId]` — Next
 * resolves an exact `/law-search/graph` request against this route rather
 * than the dynamic one, so there is no id collision to worry about.
 */
export default function LawCitationGraphPage() {
  return <CitationGraphContainer />;
}
