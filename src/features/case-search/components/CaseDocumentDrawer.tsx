"use client";

import { DetailDrawer } from "@/src/shared/components/browse/DetailDrawer";
import { RedactedText } from "@/src/shared/components/legal/RedactedText";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/shared/components/ui/tabs";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCaseDocument } from "../services/queries/useCaseDocument";
import type {
  CaseDocument,
  CaseSummary,
} from "../types/interfaces/caseInterface";
import { CaseOutcomeBadge } from "./CaseOutcomeBadge";

/**
 * A browsed judgment, in full.
 *
 * The catalog row carries only a preview, so the body is fetched here. It
 * arrives as nine Arabic-titled sections which the adapter has already put back
 * into reading order — the API sends them alphabetically, which would otherwise
 * open every judgment on its verdict.
 *
 * Tabs rather than a single column: stacked, the sections are a wall of Arabic
 * thousands of words long, and the part a reader usually wants — أقرر — sits at
 * the very bottom of it.
 */
export function CaseDocumentDrawer({
  summary,
  open,
  onOpenChange,
}: {
  /** What the grid already knows, shown while the body loads. */
  summary: CaseSummary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("caseSearch.detail");

  // Nothing is requested until the panel is actually opened.
  const query = useCaseDocument(open ? summary.caseNumber : null);
  const document = query.data?.data;

  return (
    <DetailDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={t("title", { number: summary.caseNumber })}
      // subtitle={summary.fileName}
      meta={
        <>
          {summary.decisionYear && (
            <span className="bg-tag-gray text-tag-gray-fg rounded-sm px-1.5 py-0.5 text-xs font-medium tabular-nums">
              {summary.decisionYear}
            </span>
          )}
          {summary.outcomes.map((outcome) => (
            <CaseOutcomeBadge key={outcome} outcome={outcome} />
          ))}
        </>
      }
      footer={
        <p className="text-text-tertiary text-xs">{t("redactionNote")}</p>
      }
    >
      <div className="flex flex-col gap-4">
        <CaseReferences summary={summary} document={document} />

        {query.isPending ? (
          <div className="flex flex-col gap-3" role="status" aria-busy="true">
            <span className="sr-only">{t("loading")}</span>
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : query.isError || !document ? (
          <p className="bg-tag-red text-tag-red-fg flex items-start gap-2 rounded-md px-3 py-2 text-sm">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>{query.error?.message || t("error")}</span>
          </p>
        ) : document.sections.length === 0 ? (
          <p className="text-text-tertiary text-sm">{t("noSections")}</p>
        ) : (
          <Tabs defaultValue={document.sections[0].title} className="gap-3">
            {/* Nine tabs will not fit on one row, so the strip scrolls. */}
            <TabsList className="w-full justify-start overflow-x-auto">
              {document.sections.map((section) => (
                <TabsTrigger
                  key={section.title}
                  value={section.title}
                  className="shrink-0"
                >
                  {/* The corpus's own headings — never translated. */}
                  <span dir="rtl">{section.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {document.sections.map((section) => (
              <TabsContent key={section.title} value={section.title}>
                {/* Legal content — rendered as the API returned it, with the
                    corpus's redaction tokens turned into readable labels. */}
                <RedactedText text={section.text} />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </DetailDrawer>
  );
}

/**
 * Charges and statutes: the parts a reader scans before reading anything.
 *
 * Built from the summary so it is complete before the body arrives, then
 * topped up with the two lists only the full document carries.
 */
function CaseReferences({
  summary,
  document,
}: {
  summary: CaseSummary;
  document?: CaseDocument;
}) {
  const t = useTranslations("caseSearch.card");

  const rows: { key: string; label: string; values: string[]; tone: string }[] =
    [
      {
        key: "crimes",
        label: t("crimes"),
        values: summary.crimes,
        tone: "bg-tag-orange text-tag-orange-fg",
      },
      {
        key: "penalArticles",
        label: t("penalArticles"),
        values: summary.penalCodeArticles,
        tone: "bg-tag-blue text-tag-blue-fg",
      },
      {
        key: "proceedingsArticles",
        label: t("proceedingsArticles"),
        values: document?.criminalProceedingsArticles ?? [],
        tone: "bg-tag-green text-tag-green-fg",
      },
      {
        key: "otherLaws",
        label: t("otherLaws"),
        values: summary.otherLaws,
        tone: "bg-tag-purple text-tag-purple-fg",
      },
    ].filter((row) => row.values.length > 0);

  if (rows.length === 0) return null;

  return (
    <div className="bg-accent/40 flex flex-col gap-2 rounded-md p-3">
      {rows.map((row) => (
        <p
          key={row.key}
          className="flex flex-wrap items-center gap-1.5 text-xs"
        >
          <span className="text-muted-foreground">{row.label}</span>
          {row.values.map((value) => (
            <span
              key={value}
              dir="rtl"
              className={`${row.tone} rounded-sm px-1.5 py-0.5 font-medium`}
            >
              {value}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
