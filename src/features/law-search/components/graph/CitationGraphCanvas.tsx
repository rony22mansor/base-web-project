"use client";

import { ArticleStatus } from "@/src/core/enums/legalDomain";
import { cn } from "@/src/core/utils/utils";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import type { CitationGraph } from "../../helpers/citationGraph";
import {
  layoutCitationGraph,
  nodeRadius,
  type PositionedNode,
} from "../../helpers/citationGraphLayout";

// Low enough that the reader can always zoom out to the whole graph by hand,
// however widely a particular layout happens to spread.
const MIN_SCALE = 0.08;
const MAX_SCALE = 3;
const ZOOM_STEP = 1.3;

/**
 * The initial view never opens below this scale, even when "fit everything"
 * would ask for less. At a few hundred nodes, a scale small enough to fit the
 * whole graph shrinks each one to a couple of screen pixels — technically
 * visible, not actually clickable. Opening zoomed in enough to read and click
 * individual nodes matters more than seeing the whole shape on first paint;
 * a few outliers sitting just past the edge are one scroll-to-zoom-out away.
 */
const COMFORTABLE_MIN_SCALE = 0.45;

/** Scales with the bubble so the label always fits its circle. */
const nodeFontSize = (radius: number): number =>
  Math.min(12, Math.max(8, radius * 0.65));

/** Same vocabulary `ArticleStatusBadge` uses, as SVG fill colors. */
const STATUS_COLOR: Record<ArticleStatus, string> = {
  [ArticleStatus.Regular]: "var(--color-tag-green-fg)",
  [ArticleStatus.Amended]: "var(--color-tag-yellow-fg)",
  [ArticleStatus.Repealed]: "var(--color-tag-red-fg)",
};

interface Transform {
  scale: number;
  x: number;
  y: number;
}

/**
 * The scale + pan that fits a layout's nodes inside a `width` × `height`
 * viewport, centred.
 *
 * Charge repulsion routinely spreads a few hundred nodes across an area many
 * times the canvas's own pixel size — the penal code's layout, for one, spans
 * roughly 5000×4700 units. Opening at `scale: 1, x: 0, y: 0` would show a
 * near-empty canvas with a handful of nodes in the top-left corner and the
 * rest of the graph off-screen, so the initial view is fit to whatever the
 * simulation actually produced instead of assumed.
 */
const fitTransform = (
  nodes: PositionedNode[],
  width: number,
  height: number,
): Transform => {
  if (nodes.length === 0 || width === 0 || height === 0) {
    return { scale: 1, x: width / 2, y: height / 2 };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const node of nodes) {
    if (node.x < minX) minX = node.x;
    if (node.x > maxX) maxX = node.x;
    if (node.y < minY) minY = node.y;
    if (node.y > maxY) maxY = node.y;
  }

  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  // A little breathing room so nodes at the very edge aren't clipped by the
  // container border.
  const PADDING = 0.85;
  const scale = Math.min(
    MAX_SCALE,
    Math.max(
      COMFORTABLE_MIN_SCALE,
      Math.min(width / spanX, height / spanY) * PADDING,
    ),
  );

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  return {
    scale,
    x: width / 2 - centerX * scale,
    y: height / 2 - centerY * scale,
  };
};

/**
 * The graph itself: an SVG canvas the reader pans and zooms with the mouse,
 * nodes coloured by article status and sized by how connected they are.
 *
 * The force layout runs once per `graph`/size change and is otherwise static
 * — see `layoutCitationGraph`. Pan and zoom are plain CSS transform state
 * driven by pointer/wheel events, not a library: at this scale (a few hundred
 * DOM nodes) there is nothing a zoom library buys over transforming one `<g>`.
 */
export function CitationGraphCanvas({
  graph,
  highlightedId,
  onSelectArticle,
}: {
  graph: CitationGraph;
  /** An article number to visually pick out — from the search box, typically. */
  highlightedId: string | null;
  onSelectArticle: (articleNumber: string) => void;
}) {
  const t = useTranslations("lawSearch.graph");
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      // Rounded to the nearest 20px so ordinary sub-pixel resize churn (a
      // scrollbar appearing, a fractional layout pass) doesn't retrigger the
      // force simulation for a size change nobody would notice.
      setSize({
        width: Math.round(width / 20) * 20,
        height: Math.round(height / 20) * 20,
      });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const layout = useMemo(() => {
    if (size.width === 0 || size.height === 0) return null;
    return layoutCitationGraph(graph, size.width, size.height);
  }, [graph, size.width, size.height]);

  const [transform, setTransform] = useState<Transform>({
    scale: 1,
    x: 0,
    y: 0,
  });
  // Fit the view to whatever the new layout actually produced whenever it
  // changes (a different law, the isolated-articles toggle, or the container
  // being resized) — see `fitTransform` for why that can't just be a reset to
  // identity. Adjusted during render rather than in an effect: an effect
  // would cascade a second render for a value already known by the time this
  // one is committing.
  const [lastLayout, setLastLayout] = useState(layout);
  if (layout !== lastLayout) {
    setLastLayout(layout);
    setTransform(fitTransform(layout?.nodes ?? [], size.width, size.height));
  }

  const zoomBy = useCallback((factor: number) => {
    setTransform((current) => ({
      ...current,
      scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, current.scale * factor)),
    }));
  }, []);

  const handleWheel = (event: ReactWheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    zoomBy(event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP);
  };

  // Panning drags the whole `<g>`; a plain pointer-capture drag rather than a
  // library, since it's the only gesture this canvas needs beyond zoom.
  const panState = useRef<{ x: number; y: number } | null>(null);

  const handleBackgroundPointerDown = (
    event: ReactPointerEvent<SVGSVGElement>,
  ) => {
    if (event.button !== 0) return;
    panState.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleBackgroundPointerMove = (
    event: ReactPointerEvent<SVGSVGElement>,
  ) => {
    const start = panState.current;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    panState.current = { x: event.clientX, y: event.clientY };
    setTransform((current) => ({
      ...current,
      x: current.x + dx,
      y: current.y + dy,
    }));
  };

  const handleBackgroundPointerUp = (
    event: ReactPointerEvent<SVGSVGElement>,
  ) => {
    panState.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoveredNode = layout?.nodes.find((node) => node.id === hoveredId);

  return (
    <div
      ref={containerRef}
      className="bg-accent/20 relative min-h-0 flex-1 overflow-hidden rounded-md border"
    >
      {layout && (
        <svg
          role="img"
          aria-label={t("canvasLabel")}
          className="size-full cursor-grab touch-none active:cursor-grabbing"
          onWheel={handleWheel}
          onPointerDown={handleBackgroundPointerDown}
          onPointerMove={handleBackgroundPointerMove}
          onPointerUp={handleBackgroundPointerUp}
        >
          <g
            transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
          >
            {layout.edges.map((edge, index) => (
              <line
                key={index}
                x1={edge.source.x}
                y1={edge.source.y}
                x2={edge.target.x}
                y2={edge.target.y}
                stroke="black"
                strokeWidth={1}
                opacity={0.6}
              />
            ))}

            {layout.nodes.map((node) => {
              const isHighlighted = node.id === highlightedId;
              const isHovered = node.id === hoveredId;
              const radius = nodeRadius(node);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onPointerEnter={() => setHoveredId(node.id)}
                  onPointerLeave={() =>
                    setHoveredId((current) =>
                      current === node.id ? null : current,
                    )
                  }
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => onSelectArticle(node.id)}
                  className="cursor-pointer"
                >
                  {isHighlighted && (
                    <circle
                      r={radius + 5}
                      fill="none"
                      stroke="var(--color-link)"
                      strokeWidth={2}
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0.3;1"
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  <circle
                    r={radius}
                    fill={STATUS_COLOR[node.status]}
                    opacity={isHovered ? 1 : 0.85}
                    stroke={isHovered ? "var(--color-background)" : "none"}
                    strokeWidth={2}
                  />

                  {/* The bubble's own label — the article number, always on,
                      not just on hover. White with a dark outline so it stays
                      legible against any status color. */}
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={nodeFontSize(radius)}
                    fontWeight={600}
                    fill="white"
                    stroke="black"
                    strokeWidth={2}
                    strokeOpacity={0.35}
                    paintOrder="stroke"
                    className="pointer-events-none select-none"
                  >
                    {node.id}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      )}

      {hoveredNode && (
        <div
          dir="rtl"
          className="bg-popover text-popover-foreground pointer-events-none absolute top-3 start-3 flex flex-col gap-0.5 rounded-md border px-2.5 py-1.5 text-xs shadow-md"
        >
          <span className="font-semibold">{hoveredNode.articleNumber}</span>
          <span className="text-muted-foreground">
            {t("degree", {
              cites: hoveredNode.outDegree,
              citedBy: hoveredNode.inDegree,
            })}
          </span>
        </div>
      )}

      <div className="absolute bottom-3 end-3 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => zoomBy(ZOOM_STEP)}
          aria-label={t("zoomIn")}
          className={cn(
            "bg-background text-foreground flex size-8 items-center justify-center rounded-md border shadow-sm",
            "hover:bg-accent transition-colors",
          )}
        >
          <Plus className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => zoomBy(1 / ZOOM_STEP)}
          aria-label={t("zoomOut")}
          className={cn(
            "bg-background text-foreground flex size-8 items-center justify-center rounded-md border shadow-sm",
            "hover:bg-accent transition-colors",
          )}
        >
          <Minus className="size-4" />
        </button>
      </div>
    </div>
  );
}
