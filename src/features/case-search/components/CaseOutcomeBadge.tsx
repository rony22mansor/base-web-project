"use client";

import { cn } from "@/src/core/utils/utils";
import { outcomeTone, type OutcomeTone } from "../helpers/caseOutcome";

/** Notion's named tag colours, same vocabulary as `ArticleStatusBadge`. */
const TONE_STYLES: Record<OutcomeTone, string> = {
  red: "bg-tag-red text-tag-red-fg",
  green: "bg-tag-green text-tag-green-fg",
  yellow: "bg-tag-yellow text-tag-yellow-fg",
  gray: "bg-tag-gray text-tag-gray-fg",
};

/**
 * How a judgment ended. The wording is raw Arabic from the corpus — never a
 * translation key — so this only colours it, and leaves anything it does not
 * recognise neutral rather than guessing.
 */
export function CaseOutcomeBadge({
  outcome,
  className,
}: {
  outcome: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-1.5 py-0.5 text-lg font-medium",
        TONE_STYLES[outcomeTone(outcome)],
        className,
      )}
    >
      {outcome}
    </span>
  );
}
