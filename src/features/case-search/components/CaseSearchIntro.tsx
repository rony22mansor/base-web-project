"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

/** Ready-made queries. Kept in the message files so each locale reads naturally. */
const EXAMPLE_KEYS = ["theft", "assault", "fraud"] as const;

/**
 * What the screen shows before the first search.
 *
 * The cases corpus has no browse endpoint, so there is genuinely nothing to
 * list here — and an empty grid would read as a failure. Instead the screen
 * explains what the retrieval matches on (facts, not keywords) and offers
 * three examples that fill the search bar, because the quality of a RAG result
 * depends almost entirely on how the question was phrased.
 */
export function CaseSearchIntro({
  onExample,
}: {
  onExample: (query: string) => void;
}) {
  const t = useTranslations("caseSearch.intro");

  return (
    <div className="flex flex-col items-center gap-4 rounded-md border border-dashed p-10 text-center">
      <span className="bg-accent text-text-secondary flex size-10 items-center justify-center rounded-full">
        <Sparkles className="size-5" />
      </span>

      <div className="flex flex-col gap-1.5">
        <h2 className="text-base font-semibold">{t("title")}</h2>
        <p className="text-text-secondary mx-auto max-w-lg text-sm">
          {t("description")}
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="notion-label text-[11px]">{t("examplesLabel")}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {EXAMPLE_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onExample(t(`examples.${key}`))}
              className="bg-tag-gray text-tag-gray-fg hover:bg-accent hover:text-foreground duration-120 ease-gentle max-w-full truncate rounded-sm px-2.5 py-1.5 text-xs font-medium transition-colors"
            >
              {t(`examples.${key}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
