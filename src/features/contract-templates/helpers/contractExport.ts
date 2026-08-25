import type { ContractTemplate } from "../types/interfaces/contractTemplateInterface";
import { fillContractBody } from "./contractBody";

/**
 * Getting the finished contract out of the browser.
 *
 * Everything here is client-side: the API has no render or export route, and
 * the filled values never leave the user's machine — which for a document
 * naming real parties is the right default, not a limitation to work around.
 */

const download = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoking immediately can cancel the download in some browsers; a tick is
  // enough for the navigation to have started.
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

/** Windows-friendly, and safe on the Arabic subjects these templates carry. */
const toFileName = (subject: string, extension: string): string => {
  const base = subject.replace(/[\/:*?"<>|]/g, "").trim() || "contract";
  return `${base.slice(0, 80)}.${extension}`;
};

export const exportAsText = (
  template: ContractTemplate,
  values: Record<number, string>,
): void => {
  const text = `${template.subject}\n\n${fillContractBody(template, values)}`;
  // The BOM is what makes Notepad read the Arabic as UTF-8 rather than mojibake.
  const blob = new Blob([`\uFEFF${text}`], {
    type: "text/plain;charset=utf-8",
  });

  download(blob, toFileName(template.subject, "txt"));
};

/**
 * A Word-openable document, without shipping a .docx writer.
 *
 * Word reads HTML saved under a .doc extension and keeps the direction, the
 * heading and the paragraph breaks — which is all this document has. It is a
 * real editable file, not a screenshot, so the user can keep working on it.
 */
export const exportAsWord = (
  template: ContractTemplate,
  values: Record<number, string>,
): void => {
  const paragraphs = fillContractBody(template, values)
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br />")}</p>`)
    .join("\n");

  const html = `<!doctype html>
<html dir="rtl" lang="ar">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(template.subject)}</title>
<style>
body { font-family: "Times New Roman", serif; font-size: 14pt; line-height: 1.9; direction: rtl; }
h1 { font-size: 16pt; text-align: center; }
p { text-align: justify; }
</style>
</head>
<body>
<h1>${escapeHtml(template.subject)}</h1>
${paragraphs}
</body>
</html>`;

  const blob = new Blob([`\uFEFF${html}`], {
    type: "application/msword;charset=utf-8",
  });

  download(blob, toFileName(template.subject, "doc"));
};

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/**
 * Print, and therefore also "save as PDF" — every browser's print dialog
 * offers it, which is why there is no separate PDF export here.
 *
 * The page's print stylesheet hides everything except the document itself.
 */
export const printContract = (): void => {
  window.print();
};
