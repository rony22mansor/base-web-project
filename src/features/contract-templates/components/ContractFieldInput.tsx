"use client";

import { cn } from "@/src/core/utils/utils";
import { Input } from "@/src/shared/components/ui/input";
import { useTranslations } from "next-intl";
import type { ContractField } from "../helpers/contractBody";

/**
 * One blank, labelled by the sentence it sits in.
 *
 * The corpus gives a blank nothing but an index and a type, so the label is
 * built from the surrounding words: "…و مساحته [ ] متراً مربعاً" is answerable,
 * "Field 14 (text)" is not. The blank's position inside that quoted fragment is
 * marked so a run of similar sentences stays distinguishable.
 */
export function ContractFieldInput({
  field,
  value,
  onChange,
  isHighlighted,
}: {
  field: ContractField;
  value: string;
  onChange: (value: string) => void;
  /** True while this field is the one the document preview is pointing at. */
  isHighlighted?: boolean;
}) {
  const t = useTranslations("contractTemplates.editor");

  return (
    <div
      id={`contract-field-${field.index}`}
      className={cn(
        "duration-120 ease-gentle flex scroll-mt-24 flex-col gap-1.5 rounded-md p-2 transition-colors",
        isHighlighted && "bg-tag-blue/40",
      )}
    >
      <label
        htmlFor={`contract-input-${field.index}`}
        dir="rtl"
        className="text-text-secondary flex flex-wrap items-baseline gap-1 text-xs leading-relaxed"
      >
        <span className="bg-tag-gray text-tag-gray-fg rounded-sm px-1.5 py-0.5 font-medium tabular-nums">
          {field.index}
        </span>
        {/* Context from the template itself — never a translated label. */}
        <span>{field.before}</span>
        <span className="text-link font-bold">[ ]</span>
        <span>{field.after}</span>
      </label>

      <Input
        id={`contract-input-${field.index}`}
        // `date` gives the browser's own picker; the value is reformatted to
        // dd/mm/yyyy when it goes into the document.
        type={field.type === "datetime" ? "date" : "text"}
        inputMode={field.type === "number" ? "numeric" : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t(`types.${field.type}`)}
        dir={field.type === "text" ? "auto" : undefined}
        className="h-9"
      />
    </div>
  );
}
