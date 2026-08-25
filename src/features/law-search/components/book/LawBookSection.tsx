"use client";

import { cn } from "@/src/core/utils/utils";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { toDomId, toNodeTitle } from "../../helpers/lawBookTree";
import type { LawBookNode } from "../../types/interfaces/bookInterface";
import { LawBookArticle } from "./LawBookArticle";

/** Heading size per depth: كتاب reads largest, the innermost heading smallest. */
const HEADING_SIZE = [
  "text-xl font-bold",
  "text-lg font-semibold",
  "text-base font-semibold",
  "text-sm font-semibold",
];

interface LawBookSectionProps {
  node: LawBookNode;
  collapsed: Set<string>;
  onToggle: (key: string) => void;
  onJumpToArticle: (articleNumber: string) => void;
}

/**
 * One heading of the book and everything beneath it, recursively.
 *
 * The tree is arbitrarily deep — the penal code runs كتاب › باب › فصل › an
 * unlabelled heading — so the renderer recurses rather than assuming three
 * levels, and indents by `depth` instead of by node type.
 */
export function LawBookSection({
  node,
  collapsed,
  onToggle,
  onJumpToArticle,
}: LawBookSectionProps) {
  const t = useTranslations("lawSearch.book");
  const isCollapsed = collapsed.has(node.key);
  const size = HEADING_SIZE[Math.min(node.depth, HEADING_SIZE.length - 1)];

  return (
    <section
      id={toDomId("section", node.key)}
      className={cn(
        "scroll-mt-24",
        // Top-level كتب get air around them; nested levels get a rule
        // on the leading edge so the nesting stays readable in both directions.
        node.depth === 0
          ? "mt-10 first:mt-0"
          : "border-border/60 mt-6 border-s ps-4",
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(node.key)}
        aria-expanded={!isCollapsed}
        className="group flex w-full items-start gap-2 text-start"
      >
        <ChevronDown
          className={cn(
            "text-muted-foreground mt-1 size-4 shrink-0 transition-transform",
            isCollapsed && "-rotate-90 rtl:rotate-90",
          )}
        />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className={cn(size, "leading-snug")}>{toNodeTitle(node)}</span>
          <span className="text-muted-foreground text-xs tabular-nums">
            {t("articleCount", { count: node.articleCount })}
          </span>
        </span>
      </button>

      {!isCollapsed && (
        <div className="mt-2">
          {node.articles.map((article) => (
            <LawBookArticle
              key={article.id}
              article={article}
              onJumpToArticle={onJumpToArticle}
            />
          ))}

          {node.children.map((child) => (
            <LawBookSection
              key={child.key}
              node={child}
              collapsed={collapsed}
              onToggle={onToggle}
              onJumpToArticle={onJumpToArticle}
            />
          ))}
        </div>
      )}
    </section>
  );
}
