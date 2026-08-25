"use client";

import { Link } from "@/src/core/i18n/navigation";
import { AppRoutes } from "@/src/core/routing/app_routes";
import { cn } from "@/src/core/utils/utils";
import { Button } from "@/src/shared/components/ui/button";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import {
  AlertTriangle,
  ArrowRight,
  Columns2,
  Download,
  Eraser,
  FileType,
  PenLine,
  Printer,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  exportAsText,
  exportAsWord,
  printContract,
} from "../helpers/contractExport";
import { useContractEditor } from "../hooks/useContractEditor";
import { useContractTemplate } from "../services/queries/useContractTemplate";
import { ContractDocument } from "./ContractDocument";
import { ContractFieldInput } from "./ContractFieldInput";
import { ContractInlineDocument } from "./ContractInlineDocument";

/**
 * Two ways to fill the same document.
 *
 * `inline` types the answers into the sentences themselves, which is how the
 * contract reads and how it will be printed; `split` keeps the two-column
 * layout, which is easier to work through mechanically when a template runs to
 * eighty blanks and you want a checklist rather than a document.
 */
type EditorView = "inline" | "split";

/**
 * Fill in one template, then print or export it.
 *
 * Everything is local: nothing typed here is sent anywhere, and the draft
 * survives a refresh. Whichever view is showing, printing always renders the
 * read-only document, so the output never depends on how it was filled in.
 */
export function ContractEditorContainer({ docId }: { docId: string }) {
  const t = useTranslations("contractTemplates.editor");
  const tBrowse = useTranslations("browse.states");
  const query = useContractTemplate(docId);
  const template = query.data?.data;
  const editor = useContractEditor(docId, template);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [view, setView] = useState<EditorView>("inline");

  const focusField = (index: number) => {
    setFocusedIndex(index);
    document.getElementById(`contract-input-${index}`)?.focus();
    document
      .getElementById(`contract-field-${index}`)
      ?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  if (query.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-96 w-full rounded-md" />
      </div>
    );
  }

  if (query.isError || !template) {
    return (
      <div className="bg-tag-red flex flex-col items-center gap-3 rounded-md p-10 text-center">
        <AlertTriangle className="text-tag-red-fg size-6" />
        <h2 className="text-base font-semibold">{tBrowse("errorTitle")}</h2>
        <p dir="rtl" className="text-text-secondary max-w-lg text-sm">
          {query.error?.message || tBrowse("errorDescription")}
        </p>
        <Button variant="outline" onClick={() => query.refetch()}>
          {tBrowse("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Everything but the document itself falls away when printing. */}
      <div className="flex flex-col gap-6 print:hidden">
        <Link
          href={AppRoutes.contractTemplates}
          className="text-text-secondary hover:text-foreground inline-flex w-fit items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowRight className="size-4 rotate-180 rtl:rotate-0" />
          {t("backToSearch")}
        </Link>

        <header className="flex flex-col gap-2">
          <h1 dir="rtl" className="text-[28px] leading-tight font-bold">
            {template.subject}
          </h1>
          <p
            dir="rtl"
            className="text-text-secondary flex flex-wrap items-center gap-x-3 gap-y-1 text-xs"
          >
            <span className="bg-tag-gray text-tag-gray-fg rounded-sm px-1.5 py-0.5">
              {template.category}
            </span>
            <span className="tabular-nums">
              {t("progress", {
                filled: editor.filledCount,
                total: editor.totalCount,
              })}
            </span>
          </p>
        </header>

        <ViewToggle view={view} onChange={setView} />

        <ExportBar
          isComplete={editor.isComplete}
          hasValues={editor.filledCount > 0}
          onPrint={printContract}
          onExportText={() => exportAsText(template, editor.values)}
          onExportWord={() => exportAsWord(template, editor.values)}
          onClear={editor.clear}
          onJumpToFirstEmpty={
            editor.firstEmptyIndex !== undefined
              ? () => focusField(editor.firstEmptyIndex as number)
              : undefined
          }
        />
      </div>

      {view === "inline" ? (
        <>
          <div className="print:hidden">
            <ContractInlineDocument
              template={template}
              values={editor.values}
              onChange={editor.setValue}
            />
          </div>

          {/* Browsers print an <input> as an empty box, so the printable copy
              is the read-only document: mounted, hidden on screen, and built
              from the same parse of the same body so the two cannot diverge. */}
          <div className="hidden print:block">
            <ContractDocument template={template} values={editor.values} />
          </div>
        </>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="flex flex-col gap-2 print:hidden">
            <h2 className="text-lg font-semibold">{t("fieldsTitle")}</h2>
            <p className="text-text-secondary text-sm">{t("fieldsHint")}</p>

            {editor.fields.length === 0 ? (
              <p className="text-text-tertiary rounded-md border border-dashed p-6 text-center text-sm">
                {t("noFields")}
              </p>
            ) : (
              <div className="flex max-h-[70vh] flex-col gap-1 overflow-y-auto pe-1">
                {editor.fields.map((field) => (
                  <ContractFieldInput
                    key={field.index}
                    field={field}
                    value={editor.values[field.index] ?? ""}
                    onChange={(value) => editor.setValue(field.index, value)}
                    isHighlighted={focusedIndex === field.index}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-2 print:col-span-2">
            <h2 className="text-lg font-semibold print:hidden">
              {t("previewTitle")}
            </h2>
            <div className="lg:max-h-[70vh] lg:overflow-y-auto print:max-h-none print:overflow-visible">
              <ContractDocument
                template={template}
                values={editor.values}
                onFieldFocus={focusField}
              />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

/** Inline vs. split. Segmented rather than a dropdown: there are exactly two. */
function ViewToggle({
  view,
  onChange,
}: {
  view: EditorView;
  onChange: (view: EditorView) => void;
}) {
  const t = useTranslations("contractTemplates.editor");

  const options: { value: EditorView; icon: typeof PenLine }[] = [
    { value: "inline", icon: PenLine },
    { value: "split", icon: Columns2 },
  ];

  return (
    <div
      className="bg-tag-gray inline-flex w-fit gap-1 rounded-md p-1"
      role="group"
      aria-label={t("viewLabel")}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={view === option.value}
          className={cn(
            "duration-120 ease-gentle inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
            view === option.value
              ? "bg-background shadow-sm"
              : "text-text-secondary hover:text-foreground",
          )}
        >
          <option.icon className="size-4" />
          {t(`views.${option.value}`)}
        </button>
      ))}
    </div>
  );
}

/** Print, export, and the two things that make a long form navigable. */
function ExportBar({
  isComplete,
  hasValues,
  onPrint,
  onExportText,
  onExportWord,
  onClear,
  onJumpToFirstEmpty,
}: {
  isComplete: boolean;
  hasValues: boolean;
  onPrint: () => void;
  onExportText: () => void;
  onExportWord: () => void;
  onClear: () => void;
  onJumpToFirstEmpty?: () => void;
}) {
  const t = useTranslations("contractTemplates.editor");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={onPrint} className="gap-2">
          <Printer className="size-4" />
          {t("print")}
        </Button>

        <Button variant="outline" onClick={onExportWord} className="gap-2">
          <FileType className="size-4" />
          {t("exportWord")}
        </Button>

        <Button variant="outline" onClick={onExportText} className="gap-2">
          <Download className="size-4" />
          {t("exportText")}
        </Button>

        {onJumpToFirstEmpty && (
          <Button variant="ghost" onClick={onJumpToFirstEmpty}>
            {t("jumpToEmpty")}
          </Button>
        )}

        {hasValues && (
          <Button variant="ghost" onClick={onClear} className="gap-2">
            <Eraser className="size-4" />
            {t("clear")}
          </Button>
        )}
      </div>

      {/* Exporting a half-filled contract is allowed — printing a draft to
          review is normal — but it should never happen unnoticed. */}
      {!isComplete && (
        <p className="text-tag-red-fg flex items-center gap-1.5 text-xs">
          <AlertTriangle className="size-3.5" />
          {t("incompleteWarning")}
        </p>
      )}
    </div>
  );
}
