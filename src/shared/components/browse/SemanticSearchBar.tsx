"use client";

import { cn } from "@/src/core/utils/utils";
import { Button } from "@/src/shared/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  MAX_SEARCH_QUERY_LENGTH,
  MIN_SEARCH_QUERY_LENGTH,
  SemanticSearchSchema,
  type SemanticSearchErrorKey,
  type SemanticSearchFormType,
} from "./semanticSearchConfig";

interface SemanticSearchBarProps {
  /** Placeholder copy differs per feature; already translated by the caller. */
  placeholder: string;
  /** The query currently applied to the grid, "" while browsing. */
  activeQuery: string;
  isSearching: boolean;
  onSubmit: (query: string) => void;
  /** Drop the query and go back to plain browsing. */
  onClear: () => void;
}

const MIN_ROWS_PX = 44;
const MAX_ROWS_PX = 160;

/**
 * The bottom-anchored semantic search bar from the wireframe. It is sized for
 * anything from two words to a full scenario, so it is a textarea that grows
 * with its content rather than a single-line input: Enter submits, Shift+Enter
 * adds a newline.
 */
export function SemanticSearchBar({
  placeholder,
  activeQuery,
  isSearching,
  onSubmit,
  onClear,
}: SemanticSearchBarProps) {
  const t = useTranslations("browse.search");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const form = useForm<SemanticSearchFormType>({
    resolver: zodResolver(SemanticSearchSchema),
    mode: "onSubmit",
    defaultValues: { query: activeQuery },
  });

  // `useWatch` rather than `form.watch()` — the latter returns a new function
  // every render, which the React Compiler cannot memoize safely.
  const query = useWatch({ control: form.control, name: "query" }) ?? "";

  // Grow the textarea to fit its content, capped so it never eats the grid.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(Math.max(el.scrollHeight, MIN_ROWS_PX), MAX_ROWS_PX)}px`;
  }, [query]);

  const { ref: registerRef, ...queryField } = form.register("query");

  // react-hook-form owns the element ref; keep our own alongside it for sizing.
  const setRefs = useCallback(
    (el: HTMLTextAreaElement | null) => {
      registerRef(el);
      textareaRef.current = el;
    },
    [registerRef],
  );

  const submit = form.handleSubmit((values) => onSubmit(values.query.trim()));

  const handleClear = () => {
    form.reset({ query: "" });
    onClear();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  };

  // Zod is configured to emit message *keys*, so this is always one of them.
  const errorKey = form.formState.errors.query?.message as
    | SemanticSearchErrorKey
    | undefined;
  const isTooShort = query.trim().length < MIN_SEARCH_QUERY_LENGTH;

  return (
    <div className="bg-background shrink-0 border-t">
      <form
        onSubmit={submit}
        className="mx-auto flex w-full max-w-4xl flex-col gap-1.5 px-4 py-3 md:px-6 lg:px-8"
      >
        <div
          className={cn(
            "bg-input-filled-color flex items-end gap-2 rounded-md border px-2.5 py-1.5 transition-colors duration-120 ease-gentle",
            "focus-within:border-link focus-within:ring-2 focus-within:ring-ring/35",
            errorKey && "border-destructive focus-within:ring-destructive/30",
          )}
        >
          <Search className="text-text-tertiary mt-2.5 size-4 shrink-0" />

          <textarea
            {...queryField}
            ref={setRefs}
            rows={1}
            dir="auto"
            maxLength={MAX_SEARCH_QUERY_LENGTH}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            aria-label={placeholder}
            aria-invalid={Boolean(errorKey)}
            className="placeholder:text-placeHolder max-h-40 min-h-11 flex-1 resize-none bg-transparent py-2 text-sm leading-relaxed outline-none"
          />

          {activeQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              aria-label={t("clear")}
              className="mb-1 shrink-0"
            >
              <X className="size-4" />
            </Button>
          )}

          <Button
            type="submit"
            size="sm"
            disabled={isSearching || isTooShort}
            className="mb-1 shrink-0 gap-2"
          >
            {isSearching ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            <span className="hidden sm:inline">{t("submit")}</span>
          </Button>
        </div>

        <p
          className={cn(
            "text-text-tertiary px-1 text-xs",
            errorKey && "text-destructive",
          )}
        >
          {errorKey ? t(`errors.${errorKey}`) : t("hint")}
        </p>
      </form>
    </div>
  );
}
