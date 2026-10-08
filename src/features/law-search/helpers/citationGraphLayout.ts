import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";
import type { CitationGraph, CitationGraphNode } from "./citationGraph";

export interface PositionedNode extends CitationGraphNode {
  x: number;
  y: number;
}

export interface PositionedEdge {
  source: PositionedNode;
  target: PositionedNode;
}

export interface CitationGraphLayout {
  nodes: PositionedNode[];
  edges: PositionedEdge[];
}

/** d3-force writes `x`/`y` (and `vx`/`vy` while ticking) onto each node. */
type SimNode = CitationGraphNode & SimulationNodeDatum;

const ITERATIONS = 300;

/**
 * Bubble radius: sized to fit the article number printed inside it, and
 * grown a little further with how connected the article is. Shared between
 * the collide force below (so bubbles with long numbers don't overlap their
 * neighbours) and `CitationGraphCanvas`, which draws the same circle.
 */
export const nodeRadius = (node: CitationGraphNode): number =>
  9 + node.id.length * 2.6 + Math.min(node.inDegree + node.outDegree, 10) * 0.6;

/**
 * Runs a force-directed layout to convergence and returns final positions —
 * a static snapshot, not a running simulation.
 *
 * Ticked synchronously in a loop rather than kept alive on
 * `requestAnimationFrame`: a few hundred nodes settle well within one frame
 * budget's worth of `tick()` calls, and nothing on screen needs a physics
 * step 60 times a second once the layout has settled. The canvas renders this
 * once and only re-renders in response to the reader's own pan, zoom, or the
 * graph itself changing (a different law, or the isolated-articles toggle).
 *
 * Both `graph.nodes` and `graph.edges` are read, never mutated — d3-force
 * normally mutates a link array in place (replacing `source`/`target` ids
 * with node references), which would otherwise leak into the caller's data.
 * Everything the simulation touches here is a clone.
 */
export function layoutCitationGraph(
  graph: CitationGraph,
  width: number,
  height: number,
): CitationGraphLayout {
  const simNodes: SimNode[] = graph.nodes.map((node) => ({ ...node }));
  const simEdges: SimulationLinkDatum<SimNode>[] = graph.edges.map(
    (edge) => ({ ...edge }),
  );

  const simulation = forceSimulation(simNodes)
    .force(
      "link",
      forceLink<SimNode, SimulationLinkDatum<SimNode>>(simEdges)
        .id((node) => node.id)
        .distance(30)
        .strength(0.4),
    )
    // Kept deliberately weak: a stronger charge (the d3 default territory,
    // -100 and beyond) spreads ~400 nodes across several thousand units, which
    // then has to be zoomed out so far to fit that every node shrinks to a
    // couple of screen pixels — technically "fitting", but unreadable and
    // unclickable. This value keeps the settled graph within a few hundred
    // units, which `fitTransform`'s comfortable-minimum floor can then show at
    // a scale where nodes are still real targets.
    .force("charge", forceManyBody().strength(-25))
    .force("center", forceCenter(width / 2, height / 2))
    // A few px past the bubble's own radius so labelled circles keep a gap
    // between them rather than touching.
    .force("collide", forceCollide<SimNode>((node) => nodeRadius(node) + 4))
    .stop();

  for (let i = 0; i < ITERATIONS; i++) simulation.tick();

  const positionedById = new Map<string, PositionedNode>();
  const nodes: PositionedNode[] = simNodes.map((node) => {
    // d3 assigns an initial x/y to every node as soon as the simulation is
    // constructed (before the first tick), so these are only a fallback for
    // the type checker — never expected to actually be reached.
    const positioned: PositionedNode = {
      ...node,
      x: node.x ?? width / 2,
      y: node.y ?? height / 2,
    };
    positionedById.set(positioned.id, positioned);
    return positioned;
  });

  const edges: PositionedEdge[] = simEdges.flatMap((edge) => {
    // forceLink resolved these from the ids in `graph.edges` to the actual
    // node objects once the simulation started — the cast reflects that
    // runtime contract, which `SimulationLinkDatum`'s union type can't
    // express on its own.
    const sourceId = (edge.source as SimNode).id;
    const targetId = (edge.target as SimNode).id;
    const source = positionedById.get(sourceId);
    const target = positionedById.get(targetId);
    return source && target ? [{ source, target }] : [];
  });

  return { nodes, edges };
}
