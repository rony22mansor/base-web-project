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
    <div className="container mx-auto px-4 py-16 min-h-screen  flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
        {t('message')}
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-8">
          {error.message || "An unexpected error occurred"}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>Try again</Button>
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
