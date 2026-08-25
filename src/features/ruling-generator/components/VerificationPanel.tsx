"use client";

import { cn } from "@/src/core/utils/utils";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Verification } from "../types/interfaces/rulingInterface";

/**
 * Whether the model stayed inside the evidence it was given.
 *
 * This is the panel that replaced the old confidence meter, and the difference
 * matters: the endpoint never scores its own certainty. What it does is re-read
 * the answer against what was actually retrieved and report every citation it
 * could not account for. So this shows *what* failed to check out, by name,
 * rather than a percentage that would be invented here.
 *
 * The five checks do not share a shape. Three report bare ids, which say all
 * there is to say; the other two report objects, because "this quote is not in
 * that article" is only useful if you can see the quote and the reason. They
 * are rendered as the three different things they are rather than forced into
 * one list — which is what broke when they were all assumed to be strings.
 */
export function VerificationPanel({
  verification,
}: {
  verification: Verification;
}) {
  const t = useTranslations("rulingGenerator.verification");

  const idIssues = (
    [
      { key: "unknownStatutes", items: verification.unknownStatuteCitations },
      { key: "unknownCases", items: verification.unknownCaseCitations },
      {
        key: "penaltyDoubt",
        items: verification.possiblePenaltyHallucinationIn,
      },
    ] as const
  ).filter((issue) => issue.items.length > 0);

  const { unsupportedChargeQuotes, precedentArticleMismatches } = verification;

  const hasIssues =
    idIssues.length > 0 ||
    unsupportedChargeQuotes.length > 0 ||
    precedentArticleMismatches.length > 0;

  const isClean = verification.fullyGrounded && !hasIssues;

  return (
    <section
      className={cn(
        "flex flex-col gap-3 rounded-md p-4",
        isClean ? "bg-tag-green" : "bg-tag-yellow",
      )}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "mt-0.5 shrink-0",
            isClean ? "text-tag-green-fg" : "text-tag-yellow-fg",
          )}
        >
          {isClean ? (
            <ShieldCheck className="size-5" />
          ) : (
            <AlertTriangle className="size-5" />
          )}
        </span>

        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-sm font-semibold">
            {isClean ? t("groundedTitle") : t("ungroundedTitle")}
          </h3>
          {/* The server's own Arabic verdict on grounding. */}
          <p dir="rtl" className="text-sm leading-relaxed">
            {verification.label}
          </p>
        </div>
      </div>

      {hasIssues && (
        <div className="flex flex-col gap-3 border-t border-current/10 pt-3">
          {idIssues.map((issue) => (
            <div key={issue.key} className="flex flex-col gap-1 text-xs">
              <span className="font-semibold">{t(`issues.${issue.key}`)}</span>
              <span className="flex flex-wrap gap-1.5">
                {issue.items.map((item) => (
                  <span
                    key={item}
                    dir="rtl"
                    className="bg-background/60 rounded-sm px-1.5 py-0.5 font-medium"
                  >
                    {item}
                  </span>
                ))}
              </span>
            </div>
          ))}

          {unsupportedChargeQuotes.length > 0 && (
            <div className="flex flex-col gap-2 text-xs">
              <span className="font-semibold">
                {t("issues.unsupportedQuotes")}
              </span>

              {unsupportedChargeQuotes.map((issue, index) => (
                <div
                  key={`${issue.charge}-${issue.articleId}-${index}`}
                  className="bg-background/60 flex flex-col gap-1 rounded-sm p-2"
                >
                  <span dir="rtl" className="font-medium">
                    {issue.charge}
                    {issue.articleId && (
                      <span className="opacity-70"> · {issue.articleId}</span>
                    )}
                  </span>

                  {/* The backend's own Arabic explanation of the failure. */}
                  <span dir="rtl">{issue.reason}</span>

                  {issue.quoted && (
                    <blockquote
                      dir="rtl"
                      className="border-current/30 border-s-2 ps-2 opacity-80"
                    >
                      {issue.quoted}
                    </blockquote>
                  )}
                </div>
              ))}
            </div>
          )}

          {precedentArticleMismatches.length > 0 && (
            <div className="flex flex-col gap-2 text-xs">
              <span className="font-semibold">
                {t("issues.precedentMismatch")}
              </span>

              {precedentArticleMismatches.map((mismatch) => (
                <p
                  key={mismatch.caseNumber}
                  dir="rtl"
                  className="bg-background/60 rounded-sm p-2"
                >
                  {t("mismatchDetail", {
                    caseNumber: mismatch.caseNumber,
                    precedentArticles: mismatch.precedentArticles.join("، "),
                    chosenArticles: mismatch.chosenArticles.join("، "),
                  })}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
