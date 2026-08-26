"use client";

import { cn } from "@/src/core/utils/utils";
import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, type RefObject } from "react";

/** How far down the container has to scroll before the button appears. */
const SHOW_AFTER_PX = 400;

/**
 * A "back to top" button for a long-scrolling page.
 *
 * `position: fixed` to the viewport with a z-index above everything else on
 * the page, rather than `sticky` inside the scrolling container — a sticky
 * element only stays clear of a later sibling (like `BrowseScreen`'s
 * bottom-anchored search bar) as long as nothing disturbs the stacking order,
 * and in practice the button ended up rendering underneath it. Fixed
 * positioning has no such dependency: it always paints above the page.
 *
 * Positioned at the trailing bottom corner (`bottom-*` + `end-*`), which is
 * clear of the sidebar on both callers — the sidebar always occupies the
 * *leading* side, whichever side that is for the current locale. Callers with
 * their own bottom-anchored chrome (`BrowseScreen`'s search bar) pass a
 * taller `bottom` via `className` so the button still floats above it.
 */
export function ScrollToTopButton({
  containerRef,
  className,
}: {
  containerRef: RefObject<HTMLElement | null>;
  /** Override the default `bottom-6` — e.g. to clear a bottom search bar. */
  className?: string;
}) {
  const t = useTranslations("browse");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => setIsVisible(container.scrollTop > SHOW_AFTER_PX);
    onScroll();

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [containerRef]);

  return (
    <button
      type="button"
      onClick={() =>
        containerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
      }
      aria-label={t("scrollToTop")}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      className={cn(
        "bg-background text-foreground duration-200 ease-gentle fixed bottom-6 end-6 z-40 flex size-10 items-center justify-center rounded-full border shadow-md transition-[opacity,transform]",
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
        className,
      )}
    >
      <ArrowUp className="size-4" />
    </button>
  );
}
