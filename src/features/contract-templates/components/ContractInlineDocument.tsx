"use client";

import { cn } from "@/src/core/utils/utils";
import { useTranslations } from "next-intl";
import {
  parseContractBody,
  type ContractSegment,
} from "../helpers/contractBody";
import type { ContractTemplate } from "../types/interfaces/contractTemplateInterface";

/**
 * The contract with its blanks as inputs, filled in place.
 *
 * This is the mode that matches how the document is actually read: the answer
 * is typed into the sentence it belongs to, so there is no jumping between a
 * list of numbered boxes and the prose that gives them meaning. It replaces the
 * separate label entirely — the surrounding words *are* the label.
 *
 * It cannot be printed as-is (browsers print inputs as boxes), so the editor
 * keeps the read-only `ContractDocument` mounted for print alongside it. Both
 * render from the same parse of the same body, so they cannot disagree.
 */
export function ContractInlineDocument({
  template,
  values,
  onChange,
}: {
  template: ContractTemplate;
  values: Record<number, string>;
  onChange: (index: number, value: string) => void;
}) {
  const t = useTranslations("contractTemplates.editor");
  const segments: ContractSegment[] = parseContractBody(template.body);

  return (
    <article
      dir="rtl"
      className="bg-background rounded-md border p-6 text-sm leading-[2.6]"
    >
      <h2 className="mb-6 text-center text-lg font-bold">{template.subject}</h2>

      <p className="text-justify whitespace-pre-line">
        {segments.map((segment, position) => {
          if (segment.kind === "text") {
            return <span key={position}>{segment.value}</span>;
          }

          const value = values[segment.index] ?? "";
          const isFilled = value.trim().length > 0;

          return (
            <input
              key={position}
              id={`contract-input-${segment.index}`}
              type={segment.type === "datetime" ? "date" : "text"}
              inputMode={segment.type === "number" ? "numeric" : undefined}
              dir={segment.type === "text" ? "auto" : undefined}
              value={value}
              onChange={(event) => onChange(segment.index, event.target.value)}
              // The blank is numbered until it is answered: that is what ties
              // it to the progress count and to "next blank".
              placeholder={
                segment.type === "datetime"
                  ? t("types.datetime")
                  : String(segment.index)
              }
              title={t("blankNumber", { number: segment.index })}
              // `field-sizing-content` grows the input with what is typed, so
              // the sentence keeps its shape instead of being broken up by
              // fixed-width boxes. `size` is the fallback where it is missing.
              size={Math.max(value.length || 4, 4)}
              className={cn(
                "mx-1 inline-block min-w-16 field-sizing-content rounded-sm px-1.5 py-0.5 text-center align-baseline",
                "border-b-2 outline-none transition-colors duration-120 ease-gentle",
                "focus:border-link focus:bg-link-bg",
                isFilled
                  ? "border-border-strong bg-transparent font-semibold"
                  : "border-tag-white-fg bg-tag-white text-tag-white-fg",
              )}
            />
          );
        })}
      </p>
    </article>
  );
}
