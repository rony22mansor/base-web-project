"use client";

import { Paperclip } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import Spinner from "@/src/shared/components/ui/spinner";
import {
  ACCEPTED_UPLOAD_TYPES,
  extractTextFromFile,
  MAX_UPLOAD_SIZE_MB,
  type UploadErrorKey,
} from "../helpers/fileTextExtraction";

interface FileUploadTriggerProps {
  /** Receives the extracted text, which then populates the textarea. */
  onExtracted: (text: string, fileName: string) => void;
  disabled?: boolean;
}

/**
 * Small inline affordance under the textarea (not a separate page). Uploading
 * extracts the text into the textarea, which stays editable — the backend only
 * ever receives text.
 */
export function FileUploadTrigger({
  onExtracted,
  disabled,
}: FileUploadTriggerProps) {
  const t = useTranslations("rulingGenerator.upload");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [errorKey, setErrorKey] = useState<UploadErrorKey | null>(null);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset immediately so picking the same file twice still fires onChange.
    event.target.value = "";
    if (!file) return;

    setErrorKey(null);
    setIsExtracting(true);
    const result = await extractTextFromFile(file);
    setIsExtracting(false);

    if (result.ok) {
      onExtracted(result.text, file.name);
    } else {
      setErrorKey(result.errorKey);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_UPLOAD_TYPES}
        className="hidden"
        onChange={handleChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || isExtracting}
        className="text-muted-foreground hover:text-link flex w-fit items-center gap-2 text-sm underline-offset-4 transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isExtracting ? (
          <Spinner size={14} color="text-muted-foreground" />
        ) : (
          <Paperclip className="size-4" />
        )}
        <span>{isExtracting ? t("extracting") : t("trigger")}</span>
      </button>

      {errorKey && (
        <p className="text-destructive text-sm">
          {t(`errors.${errorKey}`, { size: MAX_UPLOAD_SIZE_MB })}
        </p>
      )}
    </div>
  );
}
