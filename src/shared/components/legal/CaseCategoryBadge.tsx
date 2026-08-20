"use client";

import { CaseCategory } from "@/src/core/enums/legalDomain";
import { cn } from "@/src/core/utils/utils";
import { useTranslations } from "next-intl";

/** Civil / Criminal / Commercial, per CLAUDE_monsif.md's case model. */
export function CaseCategoryBadge({
  category,
  className,
}: {
  category: CaseCategory;
  className?: string;
}) {
  const t = useTranslations("legal.caseCategory");

  return (
    <span className={cn("bg-tag-gray text-tag-gray-fg inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs font-medium", className)}>
      {t(category)}
    </span>
  );
}
