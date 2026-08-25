"use client";

import { Direction } from "radix-ui";

/**
 * Tells every Radix primitive which way the page runs.
 *
 * Radix reads direction from its own context, not from the `dir` attribute on
 * `<html>`, and `useDirection()` falls back to `"ltr"` when nothing provides
 * one. Components that act on it — Tabs above all — then stamp `dir="ltr"`
 * onto their own root and panes, which overrides the inherited RTL for
 * everything inside them. That is how Arabic bodies ended up rendering
 * left-to-right inside the detail drawer while the rest of the page was fine.
 *
 * Mounted once at the root so the fix covers Select, Popover, Slider and the
 * rest as they arrive, rather than being re-applied per component.
 */
export function DirectionProvider({
  dir,
  children,
}: {
  dir: "rtl" | "ltr";
  children: React.ReactNode;
}) {
  return <Direction.Provider dir={dir}>{children}</Direction.Provider>;
}
