"use client";

import { Skeleton } from "@/src/shared/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * The wait is the defining feature of this screen: both retrieval pipelines,
 * the classifier and up to five LLM calls, returned in one piece with no
 * streaming, and the pipeline always runs in full — so this names that real
 * duration, about a minute, rather than showing an unbounded spinner.
 */
export function RulingLoadingState() {
  const t = useTranslations("rulingGenerator.loading");

  return (
    <div
      className="flex flex-col gap-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <Loader2 className="text-text-tertiary size-8 animate-spin" />
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <p className="text-muted-foreground max-w-md text-sm">
          {t("subtitle")}
        </p>
      </div>

      {/* Skeleton mirrors the result layout so the swap isn't jarring. */}
      <div aria-hidden className="flex flex-col gap-4">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
