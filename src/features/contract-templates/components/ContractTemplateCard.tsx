"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Card } from "@/src/shared/components/ui/card";
import { FileSignature, ListChecks, PencilLine } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import type { ContractTemplate } from "../types/interfaces/contractTemplateInterface";

/**
 * One template in the browse grid.
 *
 * Selecting a template is meant to open the in-browser editor, but that screen
 * is not designed or built yet (ui-features.md, and CLAUDE_monsif.md still has
 * the editor library undecided). The action is therefore rendered but disabled,
 * so the card's shape is right and only the handler is missing.
 */
export function ContractTemplateCard({
  template,
}: {
  template: ContractTemplate;
}) {
  const t = useTranslations("contractTemplates.card");
  const tTypes = useTranslations("contractTemplates.types");
  const format = useFormatter();

  return (
    <Card className="h-full gap-3 p-4">
      <div className="flex items-start gap-3">
        <span className="bg-primary/10 text-primary mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
          <FileSignature className="size-4" />
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* Template content — rendered exactly as the API returned it. */}
            <h3 className="font-semibold">{template.name}</h3>
            <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
              {tTypes(template.type)}
            </span>
            {template.score !== undefined && (
              <span className="text-muted-foreground text-xs tabular-nums">
                {t("relevance", { percent: Math.round(template.score * 100) })}
              </span>
            )}
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">
            {template.description}
          </p>
        </div>
      </div>

      <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span className="flex items-center gap-1.5">
          <PencilLine className="size-3.5" />
          {t("fields", { count: template.fieldCount })}
        </span>
        <span className="flex items-center gap-1.5">
          <ListChecks className="size-3.5" />
          {t("clauses", { count: template.clauseCount })}
        </span>
        <time dateTime={template.updatedAt}>
          {t("updated", {
            date: format.dateTime(new Date(template.updatedAt), {
              year: "numeric",
              month: "long",
            }),
          })}
        </time>
      </div>

      <div className="flex items-center gap-3">
        <Button size="sm" disabled className="gap-2">
          <PencilLine className="size-4" />
          {t("openEditor")}
        </Button>
        <span className="text-muted-foreground text-xs">
          {t("editorComingSoon")}
        </span>
      </div>
    </Card>
  );
}
