"use client";

import { cn } from "@/src/core/utils/utils";

/**
 * Retrieval confidence, as a bar rather than a bare percentage.
 *
 * Every result on these screens is ranked, and the gap between the first hit
 * and the fifth is the single most useful thing a reader can know about a set
 * of RAG results — a number in small grey text does not show it, a filled
 * track does.
 *
 * The scale is always 0..1 here. The backend reports 0..100 on some endpoints
 * and 0..1 on others, so callers normalize before this point.
 */
export function ScoreMeter({
  value,
  label,
  className,
}: {
  /** 0..1. Clamped, because a reranker can return a hair over 1. */
  value: number;
  /** Accessible name, e.g. "92% match". Also shown next to the bar. */
  label: string;
  className?: string;
}) {
  const percent = Math.round(Math.min(Math.max(value, 0), 1) * 100);

  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      role="img"
      aria-label={label}
    >
      <span className="bg-tag-gray relative h-1.5 w-12 overflow-hidden rounded-full">
        <span
          className="bg-tag-blue-fg absolute inset-y-0 start-0 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </span>
      <span className="text-muted-foreground text-xs tabular-nums">
        {label}
      </span>
    </span>
  );
}
