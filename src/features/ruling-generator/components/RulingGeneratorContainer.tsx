"use client";

import { useTranslations } from "next-intl";
import { isReliableResult } from "../helpers/confidence";
import { useRulingGenerator } from "../hooks/useRulingGenerator";
import { RulingErrorState } from "./RulingErrorState";
import { RulingInputForm } from "./RulingInputForm";
import { RulingLoadingState } from "./RulingLoadingState";
import { RulingNoMatchState } from "./RulingNoMatchState";
import { RulingResultView } from "./RulingResultView";

/** Input -> Loading -> Result, driven entirely by the mutation's status. */
export function RulingGeneratorContainer() {
  const t = useTranslations("rulingGenerator");
  const {
    description,
    generate,
    startNewQuery,
    result,
    isLoading,
    isError,
    error,
  } = useRulingGenerator();

  const renderStage = () => {
    if (isLoading) return <RulingLoadingState />;

    if (isError) {
      return (
        <RulingErrorState message={error?.message} onRetry={startNewQuery} />
      );
    }

    if (result) {
      return isReliableResult(result) ? (
        <RulingResultView
          result={result}
          description={description}
          onNewQuery={startNewQuery}
        />
      ) : (
        <RulingNoMatchState onRetry={startNewQuery} />
      );
    }

    return (
      <RulingInputForm defaultDescription={description} onSubmit={generate} />
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
