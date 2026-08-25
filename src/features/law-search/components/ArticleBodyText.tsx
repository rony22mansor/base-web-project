"use client";

import { cn } from "@/src/core/utils/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/shared/components/ui/popover";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { toArticleBodySegments } from "../helpers/articleBodyLinks";
import type {
  LawArticleBodyLink,
  LawArticleLinkTarget,
} from "../types/interfaces/lawInterface";

/**
 * An article body with its citations turned into links.
 *
 * The corpus writes cross-references as prose ("وفاقا لأحكام المادة الخامسة"),
 * and following one used to mean reading the number, leaving the article, and
 * finding it by hand. The API now reports where each phrase sits, so the phrase
 * itself becomes the link and the reference reads the way it does on the page.
 *
 * Roughly a fifth of the corpus's citations name several articles in one phrase
 * ("المواد ال 19 و 20 و 21"). Those cannot resolve to a single destination, so
 * they open a chooser rather than guessing at the first target — picking one
 * silently would misrepresent what the text cites.
 *
 * Falls back to plain prose whenever there is nothing to link: articles from
 * semantic search carry no link data, and any link whose offsets no longer
 * match the body is discarded upstream.
 */
export function ArticleBodyText({
  text,
  links,
  onOpenArticle,
  className,
}: {
  text: string;
  links?: LawArticleBodyLink[];
  /** Omitted → the body renders as plain text. */
  onOpenArticle?: (target: LawArticleLinkTarget) => void;
  className?: string;
}) {
  const segments = useMemo(
    () => toArticleBodySegments(text, links),
    [text, links],
  );

  // Legal content — rendered exactly as the API returned it, and always
  // right-to-left: the corpus is Arabic whatever the interface language.
  const bodyClass = cn("whitespace-pre-line", className);

  if (!onOpenArticle) {
    return (
      <p dir="rtl" className={bodyClass}>
        {text}
      </p>
    );
  }

  return (
    <p dir="rtl" className={bodyClass}>
      {segments.map((segment) =>
        segment.kind === "text" ? (
          <span key={segment.key}>{segment.text}</span>
        ) : (
          <ArticleBodyLink
            key={segment.key}
            text={segment.text}
            targets={segment.targets}
            onOpenArticle={onOpenArticle}
          />
        ),
      )}
    </p>
  );
}

/** The look of a followable citation, shared by both link shapes. */
const LINK_CLASS =
  "text-link decoration-link/40 hover:decoration-link cursor-pointer rounded-sm underline decoration-dotted underline-offset-4 transition-colors";

function ArticleBodyLink({
  text,
  targets,
  onOpenArticle,
}: {
  text: string;
  targets: LawArticleLinkTarget[];
  onOpenArticle: (target: LawArticleLinkTarget) => void;
}) {
  const t = useTranslations("lawSearch.links");

  if (targets.length === 1) {
    return (
      <button
        type="button"
        onClick={() => onOpenArticle(targets[0])}
        title={t("openArticle", { article: targets[0].articleNumber })}
        className={LINK_CLASS}
      >
        {text}
      </button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger
        className={LINK_CLASS}
        title={t("chooseArticle", { count: targets.length })}
      >
        {text}
      </PopoverTrigger>

      <PopoverContent align="start" className="w-56 p-1.5">
        <p className="text-text-tertiary px-2 py-1 text-xs">
          {t("chooseArticle", { count: targets.length })}
        </p>

        <div className="flex flex-col">
          {targets.map((target) => (
            <button
              key={target.articleId}
              type="button"
              onClick={() => onOpenArticle(target)}
              dir="rtl"
              className="hover:bg-accent rounded-sm px-2 py-1.5 text-start text-sm transition-colors"
            >
              {t("articleLabel", { number: target.articleNumber })}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
