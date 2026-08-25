"use client";

import { cn } from "@/src/core/utils/utils";
import { ArticleStatusBadge } from "@/src/shared/components/legal/ArticleStatusBadge";
import { Card } from "@/src/shared/components/ui/card";
import { AlertTriangle, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CandidateCharge } from "../types/interfaces/rulingInterface";

/**
 * One charge the model weighed — including the ones it ruled out, which is the
 * point: seeing that Article 656 was considered and rejected is what makes the
 * chosen charge reviewable rather than something to take on faith.
 *
 * `flagged` comes from the backend's own checks and arrives with its reason
 * already written in Arabic, so it is surfaced verbatim.
 */
export function CandidateChargeCard({ charge }: { charge: CandidateCharge }) {
  const t = useTranslations("rulingGenerator.charges");

  return (
    <Card
      className={cn(
        "gap-3 p-4",
        charge.flagged && "border-tag-yellow-fg/40",
        !charge.elementsMatch && "opacity-75",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          {/* Legal content — rendered exactly as the API returned it. */}
          <h4 dir="rtl" className="font-semibold">
            {charge.charge}
          </h4>
          {charge.lawName && (
            <p dir="rtl" className="text-muted-foreground truncate text-xs">
              {charge.lawName}
            </p>
          )}
        </div>

        <span className="flex shrink-0 items-center gap-1.5">
          {charge.articleStatus && (
            <ArticleStatusBadge status={charge.articleStatus} />
          )}
          {/* Absent when the model returned a charge the backend could not
              parse — there is no article to name. */}
          {charge.articleNumber && (
            <span className="bg-tag-blue text-tag-blue-fg rounded-sm px-1.5 py-0.5 text-xs font-medium tabular-nums">
              {t("article", { number: charge.articleNumber })}
            </span>
          )}
        </span>
      </div>

      <p
        className={cn(
          "inline-flex w-fit items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-medium",
          charge.elementsMatch
            ? "bg-tag-green text-tag-green-fg"
            : "bg-tag-gray text-tag-gray-fg",
        )}
      >
        {charge.elementsMatch ? (
          <Check className="size-3.5" />
        ) : (
          <X className="size-3.5" />
        )}
        {charge.elementsMatch ? t("elementsMatch") : t("elementsMismatch")}
      </p>

      {charge.supportingQuote && (
        <blockquote
          dir="rtl"
          className="border-border/60 text-muted-foreground border-s-2 ps-3 text-sm leading-relaxed"
        >
          {charge.supportingQuote}
        </blockquote>
      )}

      {charge.flagged && (
        <p className="bg-tag-yellow text-tag-yellow-fg flex items-start gap-2 rounded-sm px-2 py-1.5 text-xs">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          <span dir="rtl">{charge.flagReason ?? t("flaggedFallback")}</span>
        </p>
      )}
    </Card>
  );
}
