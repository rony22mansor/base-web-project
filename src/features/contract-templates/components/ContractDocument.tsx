"use client";

import { cn } from "@/src/core/utils/utils";
import { useTranslations } from "next-intl";
import {
  formatFieldValue,
  parseContractBody,
  type ContractSegment,
} from "../helpers/contractBody";
import type { ContractTemplate } from "../types/interfaces/contractTemplateInterface";

/**
 * The contract as it will be printed.
 *
 * This is the same element the print stylesheet keeps and everything else is
 * hidden around it, so what is on screen is literally what comes out of the
 * printer — no second rendering path to drift.
 *
 * An unfilled blank stays visible as a numbered gap rather than collapsing:
 * a contract silently missing a party's name is far more dangerous than one
 * with an obvious hole in it. Clicking a gap jumps to its input.
 */
export function ContractDocument({
  template,
  values,
  onFieldFocus,
}: {
  template: ContractTemplate;
  values: Record<number, string>;
  onFieldFocus?: (index: number) => void;
}) {
  const t = useTranslations("contractTemplates.editor");
  const segments: ContractSegment[] = parseContractBody(template.body);

  return (
    <article
      id="contract-document"
      dir="rtl"
      className="bg-background rounded-md border p-6 leading-9 print:border-0 print:p-0"
    >
      <h2 className="mb-6 text-center text-lg font-bold">{template.subject}</h2>

      <p className="text-justify text-sm leading-9 whitespace-pre-line">
        {segments.map((segment, position) => {
          if (segment.kind === "text") {
            return <span key={position}>{segment.value}</span>;
          }

          const raw = values[segment.index]?.trim();

          if (raw) {
            return (
              <span
                key={position}
                className="font-semibold underline decoration-dotted underline-offset-4"
              >
                {formatFieldValue(raw, segment.type)}
              </span>
            );
          }

          return (
            <button
              key={position}
              type="button"
              onClick={() => onFieldFocus?.(segment.index)}
              disabled={!onFieldFocus}
              aria-label={t("goToField", { number: segment.index })}
              className={cn(
                "bg-tag-yellow text-tag-yellow-fg mx-0.5 rounded-sm px-2 py-0.5 text-xs font-medium tabular-nums",
                "hover:opacity-80 print:bg-transparent print:text-inherit",
              )}
            >
              {/* In print the chrome falls away and a plain blank is left. */}
              <span className="print:hidden">{segment.index}</span>
              <span className="hidden print:inline">______</span>
            </button>
          );
        })}
      </p>
    </article>
  );
}
