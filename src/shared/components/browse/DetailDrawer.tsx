"use client";

import { cn } from "@/src/core/utils/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/src/shared/components/ui/sheet";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface DetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Plain-text heading — also the accessible name of the dialog. */
  title: string;
  /** Sub-heading under the title (the parent law, the file name…). */
  subtitle?: string;
  /** Badge row rendered under the heading, inside the sticky header. */
  meta?: React.ReactNode;
  /** The long content. Scrolls on its own; the header stays put. */
  children: React.ReactNode;
  /** Optional pinned bar at the bottom of the panel. */
  footer?: React.ReactNode;
  className?: string;
}

/**
 * The side panel that long legal bodies open into.
 *
 * Article and judgment texts run to thousands of characters, which is why the
 * grids no longer expand in place: a card that grows by ten screens pushes
 * every other result out of view and loses the reader's position. The grid
 * keeps its shape and the full text slides in over it instead.
 *
 * It enters from the trailing edge of the screen — right in English, left in
 * Arabic — so the panel never covers the sidebar the user came from.
 */
export function DetailDrawer({
  open,
  onOpenChange,
  title,
  subtitle,
  meta,
  children,
  footer,
  className,
}: DetailDrawerProps) {
  const t = useTranslations("browse.drawer");
  const isRtl = useLocale() === "ar";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isRtl ? "left" : "right"}
        showCloseButton={false}
        className={cn(
          "w-full gap-0 p-0 sm:max-w-xl lg:max-w-2xl",
          "[&>*]:min-w-0",
          className,
        )}
      >
        <header className="bg-background flex shrink-0 items-start gap-3 border-b px-5 py-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            {/* Legal content — rendered exactly as the API returned it. */}
            <SheetTitle className="text-lg leading-snug">{title}</SheetTitle>

            {subtitle ? (
              <SheetDescription className="truncate">
                {subtitle}
              </SheetDescription>
            ) : (
              // Radix warns when a dialog has no description; the panel's
              // content is the description, so hide one for screen readers.
              <SheetDescription className="sr-only">{title}</SheetDescription>
            )}

            {meta && (
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                {meta}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label={t("close")}
            className="text-text-secondary hover:bg-accent hover:text-foreground duration-120 ease-gentle -me-1 flex size-8 shrink-0 items-center justify-center rounded-sm transition-colors"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>

        {footer && (
          <footer className="bg-background shrink-0 border-t px-5 py-3">{footer}</footer>
        )}
      </SheetContent>
    </Sheet>
  );
}
