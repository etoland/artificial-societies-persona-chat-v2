"use client";

import { Persona } from "@/lib/types";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";

interface Point3D {
  persona: Persona;
  x: number;
  y: number;
  z: number;
}

interface Edge {
  key: string;
  aIndex: number;
  bIndex: number;
}

const NEIGHBORS_PER_POINT = 2;
const RADIUS_PCT = 42; // projected sphere radius, in 0-100 container space
const DRAG_SUPPRESS_THRESHOLD = 6; // px of movement before a drag stops counting as a click

// Base dot size by seniority — the more senior the respondent, the more
// visual weight their dot carries, so the graph itself hints at who's
// worth clicking first (same idea as headliner-sized acts on a festival
// lineup vs. supporting slots).
const SENIORITY_BASE_SIZE: Record<Persona["seniority"], number> = {
  "Executive Level": 13,
  "Senior Level": 10.5,
  "Mid Level": 8.5,
  "Entry Level": 7,
};

// Evenly distributes n points on a unit sphere — this is the sphere's
// fixed geometry. Rotation never changes a dot's position relative to
// the others, it only changes the camera.
function fibonacciSphere(n: number): { x: number; y: number; z: number }[] {
  const points = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;
    points.push({ x, y, z });
  }
  return points;
}

function buildEdges(points: { x: number; y: number; z: number }[]): Edge[] {
  const seen = new Set<string>();
  const edges: Edge[] = [];
  points.forEach((a, i) => {
    const distances = points
      .map((b, j) => ({
        j,
        dist: Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z),
      }))
      .filter((d) => d.j !== i)
      .sort((p, q) => p.dist - q.dist)
      .slice(0, NEIGHBORS_PER_POINT);
    distances.forEach(({ j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) return;
      seen.add(key);
      edges.push({ key, aIndex: i, bIndex: j });
    });
  });
  return edges;
}

export function DotGraph({
  personas,
  selectedId,
  onSelect,
}: {
  personas: Persona[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Fixed 3D geometry — computed once per persona list, never touched by rotation.
  const basePoints = useMemo<Point3D[]>(() => {
    const sphere = fibonacciSphere(personas.length);
    return personas.map((persona, i) => ({ persona, ...sphere[i] }));
  }, [personas]);

  const edges = useMemo(() => buildEdges(basePoints), [basePoints]);

  // Camera rotation only — this is what drag/scroll change.
  const [rotY, setRotY] = useState(0.4);
  const [rotX, setRotX] = useState(-0.15);

  const dragRef = useRef<{
    dragging: boolean;
    startX: number;
    startY: number;
    startRotY: number;
    startRotX: number;
    moved: number;
  } | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      dragRef.current = {
        dragging: true,
        startX: e.clientX,
        startY: e.clientY,
        startRotY: rotY,
        startRotX: rotX,
        moved: 0,
      };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [rotY, rotX]
  );

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || !drag.dragging) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    drag.moved = Math.max(drag.moved, Math.hypot(dx, dy));
    setRotY(drag.startRotY + dx * 0.012);
    setRotX(
      Math.max(-1.3, Math.min(1.3, drag.startRotX - dy * 0.012))
    );
  }, []);

  const endDrag = useCallback(() => {
    if (dragRef.current) dragRef.current.dragging = false;
  }, []);

  // Wheel-to-rotate, attached manually so we can preventDefault reliably
  // (React's synthetic wheel handler is passive by default).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setRotY((prev) => prev + e.deltaY * 0.0025 + e.deltaX * 0.0025);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Project the fixed 3D geometry through the current camera rotation.
  const projected = useMemo(() => {
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    return basePoints.map((p) => {
      // Yaw (around vertical axis)
      const x1 = p.x * cosY + p.z * sinY;
      const z1 = -p.x * sinY + p.z * cosY;
      const y1 = p.y;
      // Pitch (around horizontal axis)
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;
      const x2 = x1;

      return {
        persona: p.persona,
        screenX: Number((50 + x2 * RADIUS_PCT).toFixed(3)),
        screenY: Number((50 + y2 * RADIUS_PCT).toFixed(3)),
        depth: z2, // -1 (far) to 1 (near)
      };
    });
  }, [basePoints, rotY, rotX]);

  function depthScale(depth: number) {
    return Number((0.62 + ((depth + 1) / 2) * 0.75).toFixed(4)); // 0.62 (back) -> 1.37 (front)
  }
  function depthOpacity(depth: number) {
    return Number((0.32 + ((depth + 1) / 2) * 0.68).toFixed(4)); // 0.32 (back) -> 1 (front)
  }

  // Render back-to-front so nearer dots sit visually (and for click
  // priority) above farther ones, like real depth.
  const drawOrder = useMemo(
    () => projected.map((_, i) => i).sort((a, b) => projected[a].depth - projected[b].depth),
    [projected]
  );

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      className="relative w-full aspect-square max-w-[720px] mx-auto touch-none select-none cursor-grab active:cursor-grabbing"
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        {edges.map((e) => {
          const a = projected[e.aIndex];
          const b = projected[e.bIndex];
          const avgDepth = (a.depth + b.depth) / 2;
          return (
            <line
              key={e.key}
              x1={a.screenX}
              y1={a.screenY}
              x2={b.screenX}
              y2={b.screenY}
              stroke="#000000"
              strokeOpacity={Number((0.03 + ((avgDepth + 1) / 2) * 0.09).toFixed(4))}
              strokeWidth={0.15}
            />
          );
        })}
      </svg>

      {drawOrder.map((i) => {
        const { persona, screenX, screenY, depth } = projected[i];
        const isSelected = persona.id === selectedId;
        const scale = depthScale(depth) * (isSelected ? 1.5 : 1);
        const baseSize = SENIORITY_BASE_SIZE[persona.seniority];
        const size = Number((baseSize * scale).toFixed(3));
        return (
          <button
            key={persona.id}
            onClick={() => {
              // A drag that moved past the threshold shouldn't also fire a click.
              if (dragRef.current && dragRef.current.moved > DRAG_SUPPRESS_THRESHOLD) return;
              onSelect(persona.id);
            }}
            aria-label={`View ${persona.name}`}
            className="absolute rounded-full transition-[width,height] duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              left: `${screenX}%`,
              top: `${screenY}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: persona.color,
              opacity: depthOpacity(depth),
              transform: "translate(-50%, -50%)",
              boxShadow: isSelected ? `0 0 0 3px ${persona.color}33` : "none",
              zIndex: Math.round((depth + 1) * 10),
              // @ts-expect-error -- CSS var for focus ring color
              "--tw-ring-color": persona.color,
            }}
          />
        );
      })}
    </div>
  );
}
