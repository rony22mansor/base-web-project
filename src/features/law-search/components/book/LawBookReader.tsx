"use client";

import { useCallback, useMemo, useState } from "react";
import { toDomId, toTocEntries } from "../../helpers/lawBookTree";
import type { LawBook, LawBookNode } from "../../types/interfaces/bookInterface";
import { LawBookArticle } from "./LawBookArticle";
import { LawBookSection } from "./LawBookSection";
import { LawBookToc } from "./LawBookToc";

/** Every node key in the tree, depth-first — what "collapse all" needs. */
const allKeys = (nodes: LawBookNode[]): string[] =>
  nodes.flatMap((node) => [node.key, ...allKeys(node.children)]);

/**
 * "Read as a book": the whole law as one continuous document, with its
 * كتاب › باب › فصل structure recovered from the API's `category_key` paths.
 *
 * Deliberately unpaginated — the law is already in memory in full, and a
 * reader that stopped every 20 articles would defeat the point of the view.
 * The table of contents does the navigating that paging would otherwise do.
 */
export function LawBookReader({ book }: { book: LawBook }) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toc = useMemo(() => toTocEntries(book.nodes), [book.nodes]);

  const toggle = useCallback((key: string) => {
    setCollapsed((current) => {
      const next = new Set(current);
      if (!next.delete(key)) next.add(key);
      return next;
    });
  }, []);

  const scrollTo = (id: string) => {
    // The section may have only just been expanded, so wait for the paint.
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  /** Reveal a heading: open it and every ancestor, then scroll to it. */
  const goToSection = useCallback((key: string) => {
    setCollapsed((current) => {
      const next = new Set(current);
      // Ancestors are exactly the path prefixes of this key, so dropping every
      // collapsed key the target starts with opens the whole branch at once.
      for (const collapsedKey of current) {
        if (key === collapsedKey || key.startsWith(`${collapsedKey}\\`)) {
          next.delete(collapsedKey);
        }
      }
      return next;
    });
    scrollTo(toDomId("section", key));
  }, []);

  /**
   * Follow a citation. The catalog gives citations as bare article numbers
   * within the same law, so the target is already on the page — unless it sits
   * in a collapsed branch, which is why everything opens first.
   */
  const goToArticle = useCallback((articleNumber: string) => {
    setCollapsed(new Set());
    scrollTo(toDomId("article", `${book.lawId}:${articleNumber}`));
  }, [book.lawId]);

  // Laws with no internal structure (the amnesty decrees) read as one run of
  // articles, with no table of contents to show.
  if (book.isFlat) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        {book.looseArticles.map((article) => (
          <LawBookArticle
            key={article.id}
            article={article}
            onJumpToArticle={goToArticle}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      <LawBookToc
        entries={toc}
        onSelect={goToSection}
        onExpandAll={() => setCollapsed(new Set())}
        onCollapseAll={() => setCollapsed(new Set(allKeys(book.nodes)))}
      />

      <div className="min-w-0">
        {book.nodes.map((node) => (
          <LawBookSection
            key={node.key}
            node={node}
            collapsed={collapsed}
            onToggle={toggle}
            onJumpToArticle={goToArticle}
          />
        ))}

        {/* A structured law can still have articles filed under no heading. */}
        {book.looseArticles.length > 0 && (
          <div className="mt-10">
            {book.looseArticles.map((article) => (
              <LawBookArticle
                key={article.id}
                article={article}
                onJumpToArticle={goToArticle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
