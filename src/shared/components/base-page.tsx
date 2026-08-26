"use client";

import { cn } from "@/src/core/utils/utils";
import React, { useRef } from "react";
import { ScrollToTopButton } from "./scroll-to-top-button";

interface BasePageProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

/**
 * Standard page body. The generous top padding and centred, capped column are
 * Notion's block-editor rhythm — content sits in a narrow measure with a lot of
 * air above it rather than filling the viewport edge to edge.
 */
export function BasePage({
  children,
  className,
  containerClassName,
}: BasePageProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <main
      className={cn(
        "flex min-h-0 w-full flex-1 flex-col overflow-hidden",
        containerClassName,
      )}
    >
      <div
        ref={scrollRef}
        className={cn(
          "flex-1 overflow-x-hidden overflow-y-auto px-4 pt-8 pb-16 md:px-8 md:pt-12 lg:px-12",
          className,
        )}
      >
        <div className="mx-auto w-full max-w-4xl">{children}</div>
      </div>

      <ScrollToTopButton containerRef={scrollRef} />
    </main>
  );
}
