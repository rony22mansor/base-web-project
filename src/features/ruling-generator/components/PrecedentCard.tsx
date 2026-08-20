"use client";

import { CaseCategoryBadge } from "@/src/shared/components/legal/CaseCategoryBadge";
import { Card } from "@/src/shared/components/ui/card";
import { ChevronDown, Landmark } from "lucide-react";
import { cn } from "@/src/core/utils/utils";
import { useFormatter } from "next-intl";
import { useState } from "react";
import type { Precedent } from "../types/interfaces/rulingInterface";

/**
 * A similar historical case. Same reasoning as LegalBasisCard: a card, not an
 * inline link, so it can deep-link into case-search (Feature 3) later.
 */
export function PrecedentCard({ precedent }: { precedent: Precedent }) {
  const format = useFormatter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="hover:bg-accent/50 flex w-full items-start gap-3 p-4 text-start transition-colors"
      >
        <span className="bg-accent text-text-secondary mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-sm">
          <Landmark className="size-4" />
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="font-semibold">{precedent.title}</span>
          <span className="text-muted-foreground truncate text-sm">
            {precedent.caseNumber}
          </span>
          <span className="text-muted-foreground/80 flex flex-wrap items-center gap-2 text-xs">
            <CaseCategoryBadge category={precedent.category} />
            <time dateTime={precedent.date}>
              {format.dateTime(new Date(precedent.date), {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </span>
        </span>

        <ChevronDown
          className={cn(
            "text-muted-foreground mt-1 size-4 shrink-0 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div className="border-t px-4 py-3">
          {/* Case summary comes from the API verbatim. */}
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {precedent.summary}
          </p>
        </div>
      )}
    </Card>
  );
}
