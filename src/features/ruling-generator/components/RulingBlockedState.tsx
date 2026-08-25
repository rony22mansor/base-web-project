"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Loader2, PlugZap, ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePingLlm } from "../services/mutations/usePingLlm";

/**
 * Shown when `/judgment/config` reports `ready: false` — no model key is set,
 * so every prediction would fail after a minute of waiting. The API docs are
 * explicit that the feature should be disabled up front rather than letting
 * users hit that wall, and `blocking_reason` arrives as Arabic prose written
 * for display.
 *
 * The ping button is here rather than anywhere else because this is the one
 * screen where "is the model reachable?" is the actual question.
 */
export function RulingBlockedState({ reason }: { reason?: string }) {
  const t = useTranslations("rulingGenerator.blocked");
  const ping = usePingLlm();
  const result = ping.data?.data;

  return (
    <div className="bg-tag-yellow flex flex-col items-center gap-4 rounded-md p-10 text-center">
      <span className="text-tag-yellow-fg flex size-12 items-center justify-center">
        <ShieldAlert className="size-6" />
      </span>

      <h2 className="text-lg font-semibold">{t("title")}</h2>

      <p dir="rtl" className="text-text-secondary max-w-lg text-sm">
        {reason || t("description")}
      </p>

      <Button
        variant="outline"
        onClick={() => ping.mutate()}
        disabled={ping.isPending}
        className="gap-2"
      >
        {ping.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <PlugZap className="size-4" />
        )}
        {t("testConnection")}
      </Button>

      {ping.isSuccess && result && (
        <p className="text-xs">
          {result.ok
            ? t("pingOk", { model: result.model ?? "" })
            : t("pingFailed", { error: result.error ?? "" })}
        </p>
      )}

      {ping.isError && (
        <p className="text-tag-red-fg text-xs">
          {ping.error?.message || t("pingFailed", { error: "" })}
        </p>
      )}
    </div>
  );
}
