import { rulingGeneratorService } from "../services/rulingGeneratorService";

export const ACCEPTED_UPLOAD_TYPES = ".txt,.docx";
export const MAX_UPLOAD_SIZE_MB = 5;

/** Message keys under `rulingGenerator.upload.errors`. */
export type UploadErrorKey =
  | "unsupportedFileType"
  | "fileTooLarge"
  | "emptyFile"
  | "extractionFailed";

export type ExtractionResult =
  | { ok: true; text: string }
  | { ok: false; errorKey: UploadErrorKey };

/**
 * Turns an uploaded .txt/.docx into plain text for the description textarea.
 * .txt is read in the browser; .docx round-trips to the backend, which owns
 * OOXML parsing. Returns a result object rather than throwing so the caller can
 * map the failure straight onto a translation key.
 */
export async function extractTextFromFile(
  file: File,
): Promise<ExtractionResult> {
  const name = file.name.toLowerCase();

  if (!name.endsWith(".txt") && !name.endsWith(".docx")) {
    return { ok: false, errorKey: "unsupportedFileType" };
  }

  if (file.size === 0) {
    return { ok: false, errorKey: "emptyFile" };
  }

  if (file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
    return { ok: false, errorKey: "fileTooLarge" };
  }

  try {
    const text = name.endsWith(".txt")
      ? await file.text()
      : ((await rulingGeneratorService.extractDocumentText(file)).data?.text ??
        "");

    const trimmed = text.trim();
    if (!trimmed) return { ok: false, errorKey: "emptyFile" };

    return { ok: true, text: trimmed };
  } catch {
    return { ok: false, errorKey: "extractionFailed" };
  }
}
