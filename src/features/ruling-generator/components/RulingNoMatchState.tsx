"use client";

import { Button } from "@/src/shared/components/ui/button";
import { SearchX } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Shown instead of a report when the engine found nothing solid. monsif.md
 * requires strictness here: no ruling, no confidence figure, no fabricated
 * legal basis.
 */
export function RulingNoMatchState({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations("rulingGenerator.noMatch");

  return (
    <div className="flex flex-col items-center gap-4 rounded-md border border-dashed p-10 text-center">
      <span className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
        <SearchX className="size-6" />
      </span>
      <h2 className="text-lg font-semibold">{t("title")}</h2>
      <p className="text-muted-foreground max-w-lg text-sm">
        {t("description")}
      </p>
      <p className="text-muted-foreground max-w-lg text-xs">{t("hint")}</p>
      <Button onClick={onRetry} variant="outline">
        {t("retry")}
      </Button>
    </div>
  );
}
