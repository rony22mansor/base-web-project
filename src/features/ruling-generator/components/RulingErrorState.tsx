"use client";

import { Button } from "@/src/shared/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

export function RulingErrorState({
  message,
  onRetry,
}: {
  /** Server-supplied detail, when there is one. */
  message?: string;
  onRetry: () => void;
}) {
  const t = useTranslations("rulingGenerator.error");

  return (
    <div className="bg-tag-red flex flex-col items-center gap-3 rounded-md p-10 text-center">
      <span className="text-tag-red-fg flex size-10 items-center justify-center">
        <AlertTriangle className="size-6" />
      </span>
      <h2 className="text-lg font-semibold">{t("title")}</h2>
      <p className="text-muted-foreground max-w-lg text-sm">
        {message || t("description")}
      </p>
      <Button onClick={onRetry} variant="outline">
        {t("retry")}
      </Button>
    </div>
  );
}
