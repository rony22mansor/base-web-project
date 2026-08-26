"use client";

import { Skeleton } from "@/src/shared/components/ui/skeleton";
import { useTaskCompletionNotification } from "@/src/shared/hooks/useTaskCompletionNotification";
import { useTranslations } from "next-intl";
import { useRulingGenerator } from "../hooks/useRulingGenerator";
import { RulingBlockedState } from "./RulingBlockedState";
import { RulingErrorState } from "./RulingErrorState";
import { RulingInputForm } from "./RulingInputForm";
import { RulingLoadingState } from "./RulingLoadingState";
import { RulingNoMatchState } from "./RulingNoMatchState";
import { RulingResultView } from "./RulingResultView";

/** Input -> Loading -> Result, driven entirely by the mutation's status. */
export function RulingGeneratorContainer() {
  const t = useTranslations("rulingGenerator");
  const screen = useRulingGenerator();

  // The wait is 40-90s of a single LLM-and-retrieval pass with no streaming
  // — exactly the kind of gap a reader switches tabs during.
  useTaskCompletionNotification({
    isLoading: screen.isLoading,
    isSuccess: screen.isSuccess,
    isError: screen.isError,
    tag: "ruling-generator",
    successTitle: t("notification.successTitle"),
    successBody: t("notification.successBody"),
    errorTitle: t("notification.errorTitle"),
    errorBody: t("notification.errorBody"),
  });

  const renderStage = () => {
    // The availability check is instant; a spinner for it would flash.
    if (screen.isCheckingAvailability) {
      return <Skeleton className="h-64 w-full rounded-xl" />;
    }

    // No model key set — every prediction would fail after a long wait.
    if (screen.isBlocked) {
      return <RulingBlockedState reason={screen.blockingReason} />;
    }

    if (screen.isLoading) return <RulingLoadingState />;

    if (screen.isError) {
      return (
        <RulingErrorState
          message={screen.error?.message}
          evidence={screen.failedEvidence}
          onRetry={screen.startNewQuery}
        />
      );
    }

    if (screen.result) {
      // `ok: false` is the pipeline saying it could not produce a usable
      // prediction — the one case where no report is shown at all.
      return screen.result.ok ? (
        <RulingResultView
          prediction={screen.result}
          description={screen.description}
          onNewQuery={screen.startNewQuery}
        />
      ) : (
        <RulingNoMatchState onRetry={screen.startNewQuery} />
      );
    }

    return (
      <RulingInputForm
        defaultDescription={screen.description}
        onSubmit={screen.generate}
      />
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-[32px] leading-tight font-bold tracking-tight">
          {t("title")}
        </h1>
        <p className="text-text-secondary max-w-2xl text-sm">
          {t("subtitle")}
        </p>
      </header>

      {renderStage()}
    </div>
  );
}
