"use client";

import { Card } from "@/src/shared/components/ui/card";
import {
  CalendarDays,
  Gavel,
  MessageSquareQuote,
  Scale,
  Search,
  UserRound,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { ExtractedFields } from "../types/interfaces/summaryInterface";

type FieldKey =
  | "date"
  | "accused"
  | "victim"
  | "action"
  | "evidence"
  | "confessionStatus"
  | "ruling";

const ICONS: Record<FieldKey, typeof CalendarDays> = {
  date: CalendarDays,
  accused: Users,
  victim: UserRound,
  action: Scale,
  evidence: Search,
  confessionStatus: MessageSquareQuote,
  ruling: Gavel,
};

/**
 * The fields the extractor matched in the text.
 *
 * Every value is a literal span from the submitted document — nothing is
 * inferred — so a field that found nothing says "not stated in the text"
 * rather than being hidden. Hiding it would suggest the extractor did not look,
 * when in fact it looked and the text was silent.
 */
export function ExtractedFieldsCard({ fields }: { fields: ExtractedFields }) {
  const t = useTranslations("summarization.fields");

  /** Single-value and list fields render the same way: as chips. */
  const rows: { key: FieldKey; values: string[] }[] = [
    { key: "date", values: fields.date ? [fields.date] : [] },
    { key: "accused", values: fields.accused },
    { key: "victim", values: fields.victim ? [fields.victim] : [] },
    { key: "action", values: fields.action ? [fields.action] : [] },
    { key: "evidence", values: fields.evidence },
    { key: "confessionStatus", values: fields.confessionStatus },
    { key: "ruling", values: fields.ruling ? [fields.ruling] : [] },
  ];

  const foundCount = rows.filter((row) => row.values.length > 0).length;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold">{t("title")}</h2>
        <span className="text-text-tertiary text-xs tabular-nums">
          {t("foundCount", { found: foundCount, total: rows.length })}
        </span>
      </div>

      {/* <p className="text-text-secondary text-sm">{t("hint")}</p> */}

      <Card className="gap-0 p-0">
        <dl className="divide-y">
          {rows.map((row) => {
            const Icon = ICONS[row.key];

            return (
              <div
                key={row.key}
                className="flex flex-col gap-1.5 p-4 sm:flex-row sm:items-start sm:gap-4"
              >
                <dt className="text-text-secondary flex w-44 shrink-0 items-center gap-2 text-sm font-medium">
                  <Icon className="size-4 shrink-0" />
                  {t(row.key)}
                </dt>

                <dd className="min-w-0 flex-1">
                  {row.values.length === 0 ? (
                    <span className="text-text-tertiary text-sm">
                      {t("notStated")}
                    </span>
                  ) : (
                    <span className="flex flex-wrap gap-1.5">
                      {/* Literal spans from the text — never reworded. */}
                      {row.values.map((value) => (
                        <span
                          key={value}
                          dir="rtl"
                          className="bg-tag-blue text-tag-blue-fg rounded-sm px-2 py-1 text-sm leading-relaxed"
                        >
                          {value}
                        </span>
                      ))}
                    </span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </Card>
    </section>
  );
}
