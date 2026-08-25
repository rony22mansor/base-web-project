"use client";

import { Button } from "@/src/shared/components/ui/button";
import { useRenderField } from "@/src/shared/hooks/useRenderField";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  GetRulingForm,
  MAX_DESCRIPTION_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  RulingFormSchema,
  type RulingFormType,
} from "../config/rulingGeneratorConfig";
import { JudgmentMode } from "../enums/rulingEnums";
import { FileUploadTrigger } from "./FileUploadTrigger";
import { JudgmentModeToggle } from "./JudgmentModeToggle";

interface RulingInputFormProps {
  defaultDescription?: string;
  onSubmit: (description: string) => void;
  mode: JudgmentMode;
  onModeChange: (mode: JudgmentMode) => void;
}

export function RulingInputForm({
  defaultDescription = "",
  onSubmit,
  mode,
  onModeChange,
}: RulingInputFormProps) {
  const t = useTranslations("rulingGenerator");
  const formData = GetRulingForm();
  const [extractedFrom, setExtractedFrom] = useState<string | null>(null);

  const form = useForm<RulingFormType>({
    resolver: zodResolver(RulingFormSchema),
    mode: "onChange",
    defaultValues: { description: defaultDescription },
  });
  const { renderField } = useRenderField<RulingFormType>();

  // `useWatch` rather than `form.watch()`: the latter returns a fresh function
  // each render, which the React Compiler cannot memoize safely.
  const description =
    useWatch({ control: form.control, name: "description" }) ?? "";

  const handleExtracted = (text: string, fileName: string) => {
    form.setValue("description", text, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setExtractedFrom(fileName);
  };

  const handleClear = () => {
    form.reset({ description: "" });
    setExtractedFrom(null);
  };

  return (
    <form
      onSubmit={form.handleSubmit((values) => onSubmit(values.description))}
      className="flex flex-col gap-4"
    >
      {renderField({
        field: formData.fields.description,
        register: form.register,
        control: form.control,
        errors: form.formState.errors,
      })}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <FileUploadTrigger onExtracted={handleExtracted} />
        <span className="text-muted-foreground text-xs tabular-nums">
          {t("form.charCount", {
            count: description.length,
            max: MAX_DESCRIPTION_LENGTH,
          })}
        </span>
      </div>

      {extractedFrom && (
        <p className="text-muted-foreground bg-muted rounded-md px-3 py-2 text-sm">
          {t("upload.extracted", { fileName: extractedFrom })}
        </p>
      )}

      {description.length < MIN_DESCRIPTION_LENGTH && (
        <p className="text-muted-foreground text-xs">
          {t("form.minLengthHint", { min: MIN_DESCRIPTION_LENGTH })}
        </p>
      )}

      <JudgmentModeToggle mode={mode} onChange={onModeChange} />

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={!form.formState.isValid} className="gap-2">
          <Sparkles className="size-4" />
          {t("form.submit")}
        </Button>
        {description.length > 0 && (
          <Button type="button" variant="ghost" onClick={handleClear}>
            {t("form.clear")}
          </Button>
        )}
      </div>
    </form>
  );
}
