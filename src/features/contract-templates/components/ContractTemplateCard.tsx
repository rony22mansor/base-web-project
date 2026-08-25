"use client";

import { Link } from "@/src/core/i18n/navigation";
import { AppRoutes } from "@/src/core/routing/app_routes";
import { cn } from "@/src/core/utils/utils";
import { ScoreMeter } from "@/src/shared/components/legal/ScoreMeter";
import { Card } from "@/src/shared/components/ui/card";
import { ChevronRight, FileSignature, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ContractTemplateSummary } from "../types/interfaces/contractTemplateInterface";

/**
 * One candidate template. A link rather than a drawer: opening a template
 * means starting to fill it in, which is a screen of its own with a saved
 * draft attached to the URL.
 */
export function ContractTemplateCard({
  template,
  isSuggested,
}: {
  template: ContractTemplateSummary;
  /** The model's pick. Marked, never auto-selected. */
  isSuggested?: boolean;
}) {
  const t = useTranslations("contractTemplates.card");

  return (
    <Card
      className={cn(
        "h-full gap-0 overflow-hidden py-0",
        isSuggested && "border-tag-blue-fg/50",
      )}
    >
      <Link
        href={AppRoutes.contractTemplate(template.docId)}
        className="hover:bg-accent/50 duration-120 ease-gentle flex h-full w-full flex-col gap-2 p-4 transition-colors"
      >
        <span className="flex items-start gap-3">
          <span className="bg-accent text-text-secondary mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-sm">
            <FileSignature className="size-4" />
          </span>

          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="flex flex-wrap items-center gap-2">
              {/* Legal content, rendered exactly as the API returned it. */}
              <span dir="rtl" className="font-semibold">
                {template.subject}
              </span>
              {isSuggested && (
                <span className="bg-tag-blue text-tag-blue-fg inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs font-medium">
                  <Sparkles className="size-3" />
                  {t("suggested")}
                </span>
              )}
            </span>

            <span dir="rtl" className="text-muted-foreground truncate text-sm">
              {template.category}
            </span>
          </span>

          {/* Ranked results only: a browsed template was never scored, and
              an empty meter would read as a zero match. */}
          {template.score !== undefined && (
            <ScoreMeter
              value={template.score}
              label={t("relevance", {
                percent: Math.round(template.score * 100),
              })}
              className="mt-1 shrink-0"
            />
          )}
        </span>

        {template.keywords.length > 0 && (
          <span className="flex flex-wrap gap-1.5">
            {template.keywords.slice(0, 6).map((keyword) => (
              <span
                key={keyword}
                dir="rtl"
                className="bg-tag-gray text-tag-gray-fg rounded-sm px-1.5 py-0.5 text-xs"
              >
                {keyword}
              </span>
            ))}
          </span>
        )}

        <span className="mt-auto flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-muted-foreground tabular-nums">
            {t("fieldCount", { count: template.placeholderCount })}
          </span>

          <span className="text-link ms-auto inline-flex items-center gap-1 font-medium">
            {t("open")}
            <ChevronRight className="size-3.5 rtl:rotate-180" />
          </span>
        </span>
      </Link>
    </Card>
  );
}
