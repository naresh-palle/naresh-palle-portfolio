"use client";

import "@xyflow/react/dist/style.css";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { diagrams, type Diagram, type DiagramId, type DiagramNode } from "@/content/diagrams";
import { EVIDENCE } from "./evidence";

const UNIT_X = 230;
const UNIT_Y = 118;
const NODE_W = 190;

type ServiceData = { node: DiagramNode; active: boolean };
type ZoneData = { label: string; width: number; height: number };

const sides = [
  { pos: Position.Left, id: "l" },
  { pos: Position.Right, id: "r" },
  { pos: Position.Top, id: "t" },
  { pos: Position.Bottom, id: "b" },
];

function ServiceNode({ data }: NodeProps<Node<ServiceData>>) {
  const { node, active } = data;
  const tone = EVIDENCE[node.evidence];
  return (
    <div
      style={{ width: NODE_W }}
      className={`rounded-xl border bg-ink-900/90 px-3 py-2.5 text-left shadow-[0_12px_32px_-12px_rgb(0_0_0/0.8)] backdrop-blur transition-colors ${
        active ? "border-cyan/70 ring-2 ring-cyan/30" : "border-line-strong hover:border-cyan/40"
      }`}
    >
      {sides.map((s) => (
        <Handle key={`s-${s.id}`} id={`s-${s.id}`} type="source" position={s.pos} className="!h-1.5 !w-1.5 !border-0 !bg-transparent" />
      ))}
      {sides.map((s) => (
        <Handle key={`t-${s.id}`} id={`t-${s.id}`} type="target" position={s.pos} className="!h-1.5 !w-1.5 !border-0 !bg-transparent" />
      ))}
      <div className="flex items-start gap-2">
        <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${tone.dot}`} aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-[12.5px] leading-tight font-semibold text-white">{node.label}</p>
          {node.sub && <p className="mt-0.5 font-mono text-[10px] leading-snug text-mist">{node.sub}</p>}
        </div>
      </div>
    </div>
  );
}

function ZoneNode({ data }: NodeProps<Node<ZoneData>>) {
  return (
    <div style={{ width: data.width, height: data.height }} className="rounded-2xl border border-dashed border-cyan/25 bg-cyan/[0.025]">
      <span className="absolute -top-2.5 left-4 rounded-md bg-ink-950 px-2 font-mono text-[10px] tracking-[0.14em] text-cyan-soft/80 uppercase">{data.label}</span>
    </div>
  );
}

const nodeTypes = { service: ServiceNode, zone: ZoneNode };

function handlesFor(a: DiagramNode, b: DiagramNode) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) * UNIT_X >= Math.abs(dy) * UNIT_Y * 0.9) return dx >= 0 ? ["s-r", "t-l"] : ["s-l", "t-r"];
  return dy >= 0 ? ["s-b", "t-t"] : ["s-t", "t-b"];
}

function useInteractionProfile() {
  const [profile, setProfile] = useState({ finePointer: false, motion: false, compact: false });
  useEffect(() => {
    const compactQuery = window.matchMedia("(max-width: 767px)");
    const update = () =>
      setProfile({
        finePointer: window.matchMedia("(hover: hover) and (pointer: fine)").matches,
        motion: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        compact: compactQuery.matches,
      });
    update();
    compactQuery.addEventListener("change", update);
    return () => compactQuery.removeEventListener("change", update);
  }, []);
  return profile;
}

/** Nodes in flow order (topological, ties kept in declaration order) for the step-by-step view. */
function flowOrder(diagram: Diagram) {
  const incoming = new Map(diagram.nodes.map((n) => [n.id, 0]));
  for (const e of diagram.edges) incoming.set(e.to, (incoming.get(e.to) ?? 0) + 1);
  const order: DiagramNode[] = [];
  const done = new Set<string>();
  while (order.length < diagram.nodes.length) {
    const next = diagram.nodes.find((n) => !done.has(n.id) && incoming.get(n.id) === 0) ?? diagram.nodes.find((n) => !done.has(n.id))!;
    done.add(next.id);
    order.push(next);
    for (const e of diagram.edges) if (e.from === next.id) incoming.set(e.to, (incoming.get(e.to) ?? 1) - 1);
  }
  return order;
}

function StepList({ diagram }: { diagram: Diagram }) {
  const steps = useMemo(() => flowOrder(diagram), [diagram]);
  const labels = Object.fromEntries(diagram.nodes.map((n) => [n.id, n.label]));
  return (
    <ol className="relative space-y-3 p-5">
      <span className="absolute top-8 bottom-8 left-[1.85rem] w-px bg-gradient-to-b from-cyan/40 via-line-strong to-transparent" aria-hidden="true" />
      {steps.map((n) => {
        const next = diagram.edges.filter((e) => e.from === n.id);
        return (
          <li key={n.id} className="relative flex gap-3">
            <span className={`relative z-10 mt-3.5 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-ink-950 ${EVIDENCE[n.evidence].dot}`} aria-hidden="true" />
            <div className="min-w-0 flex-1 rounded-xl border border-line bg-ink-900/70 px-3.5 py-3">
              <p className="text-[14px] font-semibold text-white">{n.label}</p>
              {n.sub && <p className="mt-0.5 font-mono text-[10.5px] text-mist">{n.sub}</p>}
              <p className="mt-2 text-[13px] leading-relaxed text-haze">{n.detail}</p>
              <p className={`mt-2 font-mono text-[10px] uppercase ${EVIDENCE[n.evidence].text}`}>{EVIDENCE[n.evidence].label}</p>
              {next.length > 0 && (
                <p className="mt-2 text-[12px] text-mist">
                  → {next.map((e) => `${labels[e.to]}${e.label ? ` (${e.label})` : ""}`).join(" · ")}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function ArchitectureFlow({ id }: { id: DiagramId }) {
  const diagram: Diagram = diagrams[id];
  const [selected, setSelected] = useState<string | null>(null);
  const { finePointer, motion, compact } = useInteractionProfile();
  const [canvasOnMobile, setCanvasOnMobile] = useState(false);
  const showCanvas = !compact || canvasOnMobile;
  const interactive = finePointer || canvasOnMobile;

  const byId = useMemo(() => Object.fromEntries(diagram.nodes.map((n) => [n.id, n])), [diagram]);

  const nodes = useMemo<Node[]>(() => {
    const zones: Node[] = (diagram.zones ?? []).map((z) => ({
      id: `zone-${z.id}`,
      type: "zone",
      position: { x: z.x * UNIT_X, y: z.y * UNIT_Y },
      data: { label: z.label, width: z.w * UNIT_X, height: z.h * UNIT_Y },
      draggable: false,
      selectable: false,
      focusable: false,
      zIndex: -1,
    }));
    const services: Node[] = diagram.nodes.map((n) => ({
      id: n.id,
      type: "service",
      position: { x: n.x * UNIT_X, y: n.y * UNIT_Y },
      data: { node: n, active: selected === n.id },
      ariaLabel: `${n.label}. ${EVIDENCE[n.evidence].label}.`,
    }));
    return [...zones, ...services];
  }, [diagram, selected]);

  const edges = useMemo<Edge[]>(
    () =>
      diagram.edges.map((e, i) => {
        const [sourceHandle, targetHandle] = handlesFor(byId[e.from], byId[e.to]);
        const lit = selected === e.from || selected === e.to;
        const stroke = lit ? "var(--color-cyan)" : "rgb(148 163 184 / 0.55)";
        return {
          id: `e${i}`,
          source: e.from,
          target: e.to,
          sourceHandle,
          targetHandle,
          type: "smoothstep",
          label: e.label,
          animated: motion && !e.dashed,
          style: { stroke, strokeWidth: lit ? 2 : 1.4, ...(e.dashed ? { strokeDasharray: "5 5" } : {}) },
          markerEnd: { type: MarkerType.ArrowClosed, color: stroke, width: 16, height: 16 },
          labelStyle: { fill: "#cbd5e1", fontSize: 10, fontFamily: "var(--font-mono)" },
          labelBgStyle: { fill: "#070b18", fillOpacity: 0.9 },
          labelBgPadding: [4, 2] as [number, number],
          labelBgBorderRadius: 4,
        };
      }),
    [diagram, byId, selected, motion],
  );

  const active = selected ? byId[selected] : null;

  return (
    <figure className="glass overflow-hidden rounded-[1.6rem]">
      {compact && (
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <span className="text-[12px] text-mist">{canvasOnMobile ? "Drag to pan · pinch to zoom" : "Step-by-step view"}</span>
          <button
            type="button"
            onClick={() => setCanvasOnMobile((v) => !v)}
            className="rounded-full border border-line-strong px-3 py-1.5 text-[12px] font-medium text-white hover:border-cyan/50"
          >
            {canvasOnMobile ? "Show steps" : "Open diagram"}
          </button>
        </div>
      )}
      {showCanvas ? (
        <div className="h-[460px] w-full md:h-[540px]" aria-hidden="true">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            colorMode="dark"
            fitView
            fitViewOptions={{ padding: 0.1 }}
            minZoom={0.25}
            maxZoom={1.6}
            nodesConnectable={false}
            nodesDraggable={finePointer}
            panOnDrag={interactive}
            zoomOnPinch={interactive}
            zoomOnScroll={false}
            zoomOnDoubleClick={false}
            preventScrolling={false}
            onNodeClick={(_, n) => n.type === "service" && setSelected((s) => (s === n.id ? null : n.id))}
            onPaneClick={() => setSelected(null)}
            style={{ "--xy-background-color": "transparent" } as CSSProperties}
            className="!bg-transparent"
          >
            <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="rgb(148 163 184 / 0.18)" />
            {finePointer && <Controls showInteractive={false} position="bottom-right" />}
          </ReactFlow>
        </div>
      ) : (
        <StepList diagram={diagram} />
      )}

      <figcaption className="border-t border-line p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {(["code", "documented", "practice", "plan"] as const).map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5 text-[11.5px] text-mist">
              <span className={`h-2 w-2 rounded-full ${EVIDENCE[k].dot}`} aria-hidden="true" />
              {EVIDENCE[k].label}
            </span>
          ))}
          <span className="text-[11.5px] text-mist/70 md:ml-auto">{finePointer ? "Click a component for details · drag to pan" : showCanvas ? "Tap a component for details" : null}</span>
        </div>
        <div aria-live="polite" className="mt-4 min-h-[3.25rem] rounded-xl border border-line bg-white/[0.02] px-4 py-3 text-[13.5px] leading-relaxed text-haze">
          {active ? (
            <>
              <span className="font-semibold text-white">{active.label}</span>
              <span className={`ml-2 font-mono text-[10.5px] uppercase ${EVIDENCE[active.evidence].text}`}>{EVIDENCE[active.evidence].label}</span>
              <span className="mt-1 block">{active.detail}</span>
            </>
          ) : (
            diagram.description
          )}
        </div>
        <details className="mt-3 text-[13px] text-mist">
          <summary className="cursor-pointer select-none hover:text-white">Text description of this diagram</summary>
          <ul className="mt-3 space-y-1.5">
            {diagram.nodes.map((n) => (
              <li key={n.id}>
                <span className="text-white">{n.label}</span> ({EVIDENCE[n.evidence].label}) — {n.detail}
              </li>
            ))}
          </ul>
        </details>
      </figcaption>
    </figure>
  );
}
