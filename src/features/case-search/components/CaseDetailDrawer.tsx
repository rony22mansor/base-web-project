"use client";

import { DetailDrawer } from "@/src/shared/components/browse/DetailDrawer";
import { RedactedText } from "@/src/shared/components/legal/RedactedText";
import { ScoreMeter } from "@/src/shared/components/legal/ScoreMeter";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/shared/components/ui/tabs";
import { useTranslations } from "next-intl";
import type { LegalCase } from "../types/interfaces/caseInterface";
import { CaseOutcomeBadge } from "./CaseOutcomeBadge";

type SectionKey = "facts" | "claims" | "reasoning" | "judgment";

/**
 * A precedent, in full.
 *
 * A judgment is four documents, not one: الوقائع, الادعاء, التعليل and منطوق
 * الحكم. Stacked they are a wall of Arabic thousands of words long, and the
 * part a reader actually wants — usually the ruling — sits at the bottom of
 * it. Tabs put all four one click apart, which is what the API docs recommend
 * for exactly this reason.
 */
export function CaseDetailDrawer({
  legalCase,
  open,
  onOpenChange,
}: {
  legalCase: LegalCase;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("caseSearch.detail");
  const tCard = useTranslations("caseSearch.card");

  // Not every judgment in the corpus carries all four; an empty tab would be a
  // dead end, so only the sections that have text are offered.
  const sections: { key: SectionKey; text: string }[] = (
    [
      { key: "facts", text: legalCase.factsText },
      { key: "claims", text: legalCase.claimsText },
      { key: "reasoning", text: legalCase.reasoningText },
      { key: "judgment", text: legalCase.judgmentText },
    ] as const
  ).filter((section) => section.text.trim().length > 0);

  const percent = Math.round(legalCase.similarityScore * 100);

  return (
    <DetailDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={t("title", { number: legalCase.caseNumber })}
      subtitle={legalCase.fileName}
      meta={
        <>
          {legalCase.decisionYear && (
            <span className="bg-tag-gray text-tag-gray-fg rounded-sm px-1.5 py-0.5 text-xs font-medium tabular-nums">
              {legalCase.decisionYear}
            </span>
          )}
          {legalCase.outcomes.map((outcome) => (
            <CaseOutcomeBadge key={outcome} outcome={outcome} />
          ))}
          <ScoreMeter
            value={legalCase.similarityScore}
            label={tCard("relevance", { percent })}
          />
        </>
      }
      footer={
        <p className="text-text-tertiary text-xs">{t("redactionNote")}</p>
      }
    >
      <div className="flex flex-col gap-4">
        <CaseReferences legalCase={legalCase} />

        {sections.length > 0 && (
          <Tabs defaultValue={sections[0].key} className="gap-3">
            <TabsList className="w-full">
              {sections.map((section) => (
                <TabsTrigger key={section.key} value={section.key}>
                  {t(`sections.${section.key}`)}
                </TabsTrigger>
              ))}
            </TabsList>

            {sections.map((section) => (
              <TabsContent key={section.key} value={section.key}>
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

/** Charges and statutes: the parts a reader scans before reading anything. */
function CaseReferences({ legalCase }: { legalCase: LegalCase }) {
  const t = useTranslations("caseSearch.card");
  const hasArticles =
    legalCase.penalCodeArticles.length > 0 || legalCase.otherLaws.length > 0;

  if (legalCase.crimes.length === 0 && !hasArticles) return null;

  return (
    <div className="bg-accent/40 flex flex-col gap-2 rounded-md p-3">
      {legalCase.crimes.length > 0 && (
        <p className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted-foreground">{t("crimes")}</span>
          {legalCase.crimes.map((crime) => (
            <span
              key={crime}
              className="bg-tag-orange text-tag-orange-fg rounded-sm px-1.5 py-0.5 font-medium"
            >
              {crime}
            </span>
          ))}
        </p>
      )}

      {legalCase.penalCodeArticles.length > 0 && (
        <p className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted-foreground">{t("penalArticles")}</span>
          {legalCase.penalCodeArticles.map((article) => (
            <span
              key={article}
              className="bg-tag-blue text-tag-blue-fg rounded-sm px-1.5 py-0.5 font-medium tabular-nums"
            >
              {article}
            </span>
          ))}
        </p>
      )}

      {legalCase.otherLaws.length > 0 && (
        <p className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted-foreground">{t("otherLaws")}</span>
          {legalCase.otherLaws.map((law) => (
            <span
              key={law}
              className="bg-tag-purple text-tag-purple-fg rounded-sm px-1.5 py-0.5 font-medium"
            >
              {law}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
