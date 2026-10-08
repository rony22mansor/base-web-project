"use client";

import { DetailDrawer } from "@/src/shared/components/browse/DetailDrawer";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { toArticleLabel } from "../../services/adapters/lawsCatalogAdapter";
import { useLawArticle } from "../../services/queries/useLawArticle";
import { LawArticleDrawer } from "../LawArticleDrawer";

/**
 * Opens an article clicked in the citation graph.
 *
 * All the graph knows about a node is a bare article number — its own article
 * list is fetched with `includeBody: false` to stay light, so it never has
 * the full `LawArticle` the ordinary `LawArticleDrawer` expects as a
 * ready-made prop. This fetches the full article first, showing the same
 * loading shell `LawArticleDrawer` itself uses while resolving a followed
 * citation, then hands off to that exact component — so once open, reading
 * from the graph behaves identically to opening an article from a search
 * result or a book page.
 */
export function CitationGraphArticleDrawer({
  lawId,
  articleNumber,
  open,
  onOpenChange,
}: {
  lawId: string;
  /** `null` while nothing has been clicked yet. */
  articleNumber: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("lawSearch.links");
  const articleId = articleNumber ? `${lawId}:${articleNumber}` : null;
  const query = useLawArticle(articleId);
  const article = query.data?.data;

  if (article) {
    return (
      <LawArticleDrawer
        article={article}
        open={open}
        onOpenChange={onOpenChange}
      />
    );
  }

  const label = articleNumber ? toArticleLabel(articleNumber) : "";

  return (
    <DetailDrawer open={open} onOpenChange={onOpenChange} title={label}>
      {query.isError ? (
        <p className="bg-tag-red text-tag-red-fg flex items-start gap-2 rounded-md px-3 py-2 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>{query.error?.message || t("error", { article: label })}</span>
        </p>
      ) : (
        <div className="flex flex-col gap-3" role="status" aria-busy="true">
          <span className="sr-only">{t("loading", { article: label })}</span>
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}
    </DetailDrawer>
  );
}
