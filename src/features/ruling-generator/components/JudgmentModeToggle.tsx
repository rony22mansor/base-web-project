"use client";

import { cn } from "@/src/core/utils/utils";
import { Gauge, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { JudgmentMode } from "../enums/rulingEnums";

/**
 * Thorough vs. fast, surfaced because the cost is not small: the full pipeline
 * makes five LLM calls and takes about a minute, the fast one makes a single
 * call and takes seconds. Hiding that behind a default would either waste the
 * user's time or quietly downgrade the analysis.
 */
export function JudgmentModeToggle({
  mode,
  onChange,
  disabled,
}: {
  mode: JudgmentMode;
  onChange: (mode: JudgmentMode) => void;
  disabled?: boolean;
}) {
  const t = useTranslations("rulingGenerator.mode");

  const options = [
    { value: JudgmentMode.Thorough, icon: Gauge },
    { value: JudgmentMode.Fast, icon: Zap },
  ] as const;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="notion-label text-[11px]">{t("label")}</span>

      <div
        className="bg-tag-gray inline-flex w-fit gap-1 rounded-md p-1"
        role="group"
        aria-label={t("label")}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            aria-pressed={mode === option.value}
            className={cn(
              "duration-120 ease-gentle inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50",
              mode === option.value
                ? "bg-background shadow-sm"
                : "text-text-secondary hover:text-foreground",
            )}
          >
            <option.icon className="size-4" />
            {t(`${option.value}.label`)}
          </button>
        ))}
      </div>

      <p className="text-text-tertiary text-xs">{t(`${mode}.hint`)}</p>
    </div>
  );
}
