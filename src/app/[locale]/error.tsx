"use client";

/**
 * Error Boundary Component
 */

import { Button } from "@/src/shared/components/ui/button";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error")

  useEffect(() => {
    // Log error to error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <h2 className="mb-3 text-2xl font-semibold">
        {t('message')}
        </h2>
        <p className="text-text-secondary mb-8 text-sm">
          {error.message || "An unexpected error occurred"}
        </p>
        <div className="flex justify-center gap-2">
          <Button onClick={reset}>{t("retry")}</Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            {t('action')}
          </Button>
        </div>
      </div>
    </div>
  );
}
