"use client";

import type { ArticleStatus } from "@/src/core/enums/legalDomain";
import { usePathname, useRouter } from "@/src/core/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useLawArticles } from "../services/queries/useLawArticles";
import { useLawBook } from "../services/queries/useLawBook";
import { useLawCatalog } from "../services/queries/useLawCatalog";

/** The two ways to read one law. */
export type LawView = "list" | "book";

/** Kept in the URL so a reading view can be linked to and restored. */
const VIEW_PARAM = "view";

/**
 * Drives one law's screen.
 *
 * The two views are separate queries on purpose. The list is paginated and
 * filterable — the right shape for looking something up. The book is a single
 * unpaginated fetch of the whole law — the right shape for reading it — so it
 * is only started once the reader actually asks for it, and then kept in cache
 * (the penal code is ~1.9 MB; paying that twice would be careless).
 */
export function useLawScreen(lawId: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const view: LawView = searchParams.get(VIEW_PARAM) === "book" ? "book" : "list";

  const [status, setStatus] = useState<ArticleStatus | null>(null);
  const [articleQuery, setArticleQuery] = useState("");

  const setView = useCallback(
    (next: LawView) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === "book") params.set(VIEW_PARAM, "book");
      else params.delete(VIEW_PARAM);

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  // The catalog is already cached from the browse screen, so the header
  // renders immediately instead of waiting on the law's own articles.
  const catalog = useLawCatalog();
  const law = useMemo(
    () => catalog.data?.data.laws.find((item) => item.id === lawId) ?? null,
    [catalog.data, lawId],
  );

  const articles = useLawArticles(
    { lawId, status: status ?? undefined, q: articleQuery || undefined },
    view === "list",
  );

  const book = useLawBook(lawId, view === "book");

  const pages = articles.data?.pages ?? [];

  return {
    lawId,
    law,
    isLawLoading: catalog.isPending,

    // view
    view,
    setView,

    // list filters
    status,
    setStatus,
    articleQuery,
    setArticleQuery,

    // list data
    articles: pages.flatMap((page) => page.items),
    total: articles.isPending ? undefined : pages[0]?.total,
    isListLoading: articles.isPending,
    isListError: articles.isError,
    listErrorMessage: articles.error?.message,
    retryList: articles.refetch,
    hasMore: articles.hasNextPage,
    isLoadingMore: articles.isFetchingNextPage,
    loadMore: articles.fetchNextPage,

    // book data
    book: book.data?.data ?? null,
    isBookLoading: book.isPending && view === "book",
    isBookError: book.isError,
    bookErrorMessage: book.error?.message,
    retryBook: book.refetch,
  };
}
