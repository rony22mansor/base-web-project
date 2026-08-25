"use client";

import { cn } from "@/src/core/utils/utils";
import { useTranslations } from "next-intl";
import type { LawBookTocEntry } from "../../types/interfaces/bookInterface";

interface LawBookTocProps {
  entries: LawBookTocEntry[];
  onSelect: (key: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

/**
 * The book's table of contents.
 *
 * Sticky rather than scroll-linked: with 226 headings in the penal code, a
 * highlight that chases the scroll position would move constantly and read as
 * noise. Clicking a heading scrolls to it and opens it if it was collapsed.
 */
export function LawBookToc({
  entries,
  onSelect,
  onExpandAll,
  onCollapseAll,
}: LawBookTocProps) {
  const t = useTranslations("lawSearch.book");

  return (
    <nav
      aria-label={t("toc")}
      className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="notion-label text-[11px]">{t("toc")}</h2>
        <span className="flex items-center gap-1">
          <button
            type="button"
            onClick={onExpandAll}
            className="text-text-tertiary hover:text-foreground text-[11px] transition-colors"
          >
            {t("expandAll")}
          </button>
          <span className="text-text-tertiary text-[11px]">/</span>
          <button
            type="button"
            onClick={onCollapseAll}
            className="text-text-tertiary hover:text-foreground text-[11px] transition-colors"
          >
            {t("collapseAll")}
          </button>
        </span>
      </div>

      <ul className="flex flex-col">
        {entries.map((entry) => (
          <li key={entry.key}>
            <button
              type="button"
              onClick={() => onSelect(entry.key)}
              // Indent by depth with a logical property so the tree reads the
              // same way in Arabic and English.
              style={{ paddingInlineStart: `${entry.depth * 12}px` }}
              className={cn(
                "hover:bg-accent flex w-full items-baseline gap-2 rounded-sm px-2 py-1 text-start transition-colors",
                entry.depth === 0
                  ? "text-sm font-semibold"
                  : "text-text-secondary text-xs",
              )}
            >
              <span className="min-w-0 flex-1 truncate">{entry.label}</span>
              <span className="text-text-tertiary shrink-0 text-[11px] tabular-nums">
                {entry.articleCount}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
