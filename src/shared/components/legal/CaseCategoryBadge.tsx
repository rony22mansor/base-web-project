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
    <span className={cn("bg-muted rounded-full px-2 py-0.5", className)}>
      {t(category)}
    </span>
  );
}
