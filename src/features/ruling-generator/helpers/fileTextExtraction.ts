export const ACCEPTED_UPLOAD_TYPES = ".txt";
export const MAX_UPLOAD_SIZE_MB = 5;

/** Message keys under `rulingGenerator.upload.errors`. */
export type UploadErrorKey =
  | "unsupportedFileType"
  | "docxUnsupported"
  | "fileTooLarge"
  | "emptyFile"
  | "extractionFailed";

export type ExtractionResult =
  | { ok: true; text: string }
  | { ok: false; errorKey: UploadErrorKey };

/**
 * Turns an uploaded .txt into plain text for the description textarea.
 *
 * .docx used to round-trip to the backend for OOXML parsing, but the API has
 * no upload or extraction route — that request was written against an endpoint
 * that never existed. Rather than quietly accept a .docx and do nothing useful
 * with it, the picker now offers .txt only and a dropped .docx gets a straight
 * answer. Returns a result object rather than throwing so the caller can map
 * the failure onto a translation key.
 */
export async function extractTextFromFile(
  file: File,
): Promise<ExtractionResult> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".docx")) {
    return { ok: false, errorKey: "docxUnsupported" };
  }

  if (!name.endsWith(".txt")) {
    return { ok: false, errorKey: "unsupportedFileType" };
  }

  if (file.size === 0) {
    return { ok: false, errorKey: "emptyFile" };
  }

  if (file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
    return { ok: false, errorKey: "fileTooLarge" };
  }

  try {
    const trimmed = (await file.text()).trim();
    if (!trimmed) return { ok: false, errorKey: "emptyFile" };

    return { ok: true, text: trimmed };
  } catch {
    return { ok: false, errorKey: "extractionFailed" };
  }
}
