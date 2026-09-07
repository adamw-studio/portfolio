"use client";

import { useEffect, useRef, useState } from "react";
import { PLAYGROUND_PROJECTS, type PlaygroundProject } from "@/content/playground-projects";
import { PlaygroundCard } from "@/components/PlaygroundCard";

// The reference frame the Figma composition (306:12162) was designed
// against. The initial pan below centers this rectangle in whatever the
// real viewport turns out to be, so the "5-7 projects visible" opening
// composition holds at any screen size instead of only at exactly
// 1440x1080 — see content/playground-projects.ts's own header comment.
const REFERENCE_W = 1440;
const REFERENCE_H = 1080;

const MIN_SCALE = 0.6;
const MAX_SCALE = 1.4;

// How far past the content's own bounding box panning is still allowed —
// generous enough that dragging toward empty space still feels like
// there's *somewhere* to go (satisfies "extends well beyond the initial
// viewport"), but not infinite, so a visitor can't wander so far that
// finding their way back means guessing (the "users don't get completely
// lost" requirement — see also the reset-view button below).
const PAN_MARGIN = 560;

// A pointer has to move at least this many CSS px before a press counts
// as a drag rather than a click — otherwise every click on a card would
// register a few px of jitter and get misread as a pan.
const DRAG_THRESHOLD = 6;

// Inertia: velocity decays by this fraction every animation frame once
// the pointer releases. Tuned to settle in well under a second at a
// normal flick speed — "controlled", per the brief, not a long floaty
// drift.
const INERTIA_FRICTION = 0.93;
const INERTIA_STOP_VELOCITY = 0.02;

const RESET_DURATION = 500;

type Point = { x: number; y: number };

const INITIAL_POSITIONS: Record<string, Point> = Object.fromEntries(
  PLAYGROUND_PROJECTS.map((p) => [p.id, { x: p.x, y: p.y }]),
);

// Takes a live positions map, not just the static data, because cards are
// individually draggable — panning has to stay clamped to wherever
// everything actually is *now*, not just where it started. Cheap enough
// (a handful of cards) to just recompute on every clampPan call rather
// than caching and invalidating.
function computeContentBounds(positions: Record<string, Point>) {
  // With no projects yet, fall back to a small bounds box centered on the
  // origin rather than the Infinity/-Infinity an empty reduce would leave
  // behind — that would otherwise turn clampPan's math to NaN and give the
  // dot-grid layer a negative width/height.
  if (PLAYGROUND_PROJECTS.length === 0) return { minX: -200, minY: -200, maxX: 200, maxY: 200 };
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of PLAYGROUND_PROJECTS) {
    const pos = positions[p.id] ?? { x: p.x, y: p.y };
    minX = Math.min(minX, pos.x);
    minY = Math.min(minY, pos.y);
    maxX = Math.max(maxX, pos.x + p.width);
    maxY = Math.max(maxY, pos.y + p.height);
  }
  return { minX, minY, maxX, maxY };
}

// The dot-grid background layer only needs to be *generously* sized, not
// live-accurate — it's decoration, not a hit area, and PAN_MARGIN already
// pads it well past the original layout. Computed once from the starting
// positions rather than tracking every drag.
const STATIC_BOUNDS = computeContentBounds(INITIAL_POSITIONS);

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function PlaygroundCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLSpanElement>(null);

  // Live pan/scale, mutated imperatively (see applyTransform) rather than
  // through React state — with a dozen-plus absolutely-positioned cards
  // in the tree, re-rendering all of them on every pointermove would be
  // the difference between smooth and janky. React only ever learns about
  // "isDragging" (for cursor + suppressing card clicks), which changes at
  // most twice per gesture, not once per pixel moved.
  const panRef = useRef<Point>({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const initialRef = useRef<Point>({ x: 0, y: 0 });

  const [isDragging, setIsDragging] = useState(false);

  // Where every card currently sits — starts equal to its own data
  // position, then diverges per-card once it's been dragged. This is the
  // *rendered* copy (drives each wrapper's left/top in JSX); positionsRef
  // right below is the always-current copy read by clampPan and the wheel
  // handler, which close over state from whichever render first bound
  // them and would otherwise see a stale layout after a drag.
  const [positions, setPositions] = useState<Record<string, Point>>(INITIAL_POSITIONS);
  const positionsRef = useRef(positions);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  // Ever-increasing, handed out one higher each time a card is picked up
  // — simplest way to keep whichever card you last touched on top of the
  // rest, without tracking a full stacking order for cards that were
  // never moved.
  const zCounter = useRef(10);

  const commitPosition = (id: string, pos: Point) => {
    positionsRef.current = { ...positionsRef.current, [id]: pos };
    setPositions(positionsRef.current);
  };

  // One entry per active pointer — length 1 is a plain pan, length 2 is a
  // pinch. Also plain refs: pointer identity and position change far more
  // often than anything that should trigger a render.
  const pointers = useRef(new Map<number, Point>());
  const dragState = useRef<{ last: Point; startPan: Point; distance: number } | null>(null);
  const pinchState = useRef<{ startDist: number; anchorWorld: Point; startScale: number } | null>(null);
  // Card-drag is a separate, simpler gesture from the canvas pan above —
  // single pointer only (no pinch-to-resize-a-card), no inertia, and it
  // moves one card's own position instead of the world's pan. curLeft/
  // curTop track the running position directly rather than re-reading the
  // DOM each move.
  const cardDragState = useRef<{ id: string; last: Point; distance: number; curLeft: number; curTop: number } | null>(
    null,
  );
  const velocity = useRef<Point>({ x: 0, y: 0 });
  const lastMoveTime = useRef(0);
  const inertiaFrame = useRef<number | null>(null);
  const resetFrame = useRef<number | null>(null);
  const suppressNextClick = useRef(false);

  const applyTransform = () => {
    const world = worldRef.current;
    if (world) world.style.transform = `translate3d(${panRef.current.x}px, ${panRef.current.y}px, 0) scale(${scaleRef.current})`;
    if (coordRef.current) {
      coordRef.current.textContent = `${Math.round(-panRef.current.x)}, ${Math.round(-panRef.current.y)}`;
    }
  };

  const clampPan = (x: number, y: number, scale: number): Point => {
    const el = containerRef.current;
    const vw = el?.clientWidth ?? 0;
    const vh = el?.clientHeight ?? 0;
    const bounds = computeContentBounds(positionsRef.current);
    const boundA_X = vw - bounds.maxX * scale - PAN_MARGIN;
    const boundB_X = -bounds.minX * scale + PAN_MARGIN;
    const boundA_Y = vh - bounds.maxY * scale - PAN_MARGIN;
    const boundB_Y = -bounds.minY * scale + PAN_MARGIN;
    return {
      x: Math.min(Math.max(x, Math.min(boundA_X, boundB_X)), Math.max(boundA_X, boundB_X)),
      y: Math.min(Math.max(y, Math.min(boundA_Y, boundB_Y)), Math.max(boundA_Y, boundB_Y)),
    };
  };

  const stopInertia = () => {
    if (inertiaFrame.current !== null) {
      cancelAnimationFrame(inertiaFrame.current);
      inertiaFrame.current = null;
    }
  };
  const stopReset = () => {
    if (resetFrame.current !== null) {
      cancelAnimationFrame(resetFrame.current);
      resetFrame.current = null;
    }
  };

  const runInertia = () => {
    const tick = () => {
      const v = velocity.current;
      if (Math.hypot(v.x, v.y) < INERTIA_STOP_VELOCITY) {
        inertiaFrame.current = null;
        return;
      }
      const next = clampPan(panRef.current.x + v.x, panRef.current.y + v.y, scaleRef.current);
      // Hitting a bound bleeds the inertia for that axis immediately
      // instead of pinning it and letting the other axis keep coasting
      // into an increasingly odd diagonal — reads as a controlled stop,
      // not a rubber-band bounce (the brief explicitly asked for the
      // latter to be avoided).
      if (next.x === panRef.current.x) v.x = 0;
      if (next.y === panRef.current.y) v.y = 0;
      panRef.current = next;
      applyTransform();
      v.x *= INERTIA_FRICTION;
      v.y *= INERTIA_FRICTION;
      inertiaFrame.current = requestAnimationFrame(tick);
    };
    inertiaFrame.current = requestAnimationFrame(tick);
  };

  const panBy = (dx: number, dy: number) => {
    panRef.current = clampPan(panRef.current.x + dx, panRef.current.y + dy, scaleRef.current);
    applyTransform();
  };

  const zoomAt = (screenX: number, screenY: number, factor: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = screenX - rect.left;
    const py = screenY - rect.top;
    const prevScale = scaleRef.current;
    const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prevScale * factor));
    if (nextScale === prevScale) return;
    // Keep the point under the cursor/fingers stationary on screen —
    // solve for the world point currently under (px,py), then re-derive
    // the pan that puts that same world point back under (px,py) at the
    // new scale.
    const worldX = (px - panRef.current.x) / prevScale;
    const worldY = (py - panRef.current.y) / prevScale;
    scaleRef.current = nextScale;
    panRef.current = clampPan(px - worldX * nextScale, py - worldY * nextScale, nextScale);
    applyTransform();
  };

  const resetView = () => {
    stopInertia();
    stopReset();
    const from = { ...panRef.current };
    const fromScale = scaleRef.current;
    const to = initialRef.current;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / RESET_DURATION);
      const e = easeOutCubic(t);
      panRef.current = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e };
      scaleRef.current = fromScale + (1 - fromScale) * e;
      applyTransform();
      if (t < 1) resetFrame.current = requestAnimationFrame(tick);
      else resetFrame.current = null;
    };
    resetFrame.current = requestAnimationFrame(tick);
  };

  // Initial centering — computed from the real viewport so the opening
  // composition holds on a laptop, an ultrawide, or a phone alike, not
  // just at exactly 1440x1080.
  //
  // ResizeObserver, not a synchronous read in the effect body: a plain
  // `containerRef.current.clientWidth` right on mount can still read 0 on
  // the very first paint (the same "wait for a real layout size" problem
  // AboutCardStack.tsx solves the same way) — that raced version centered
  // against a phantom 0x0 viewport instead of the real one, throwing the
  // whole opening composition off to one corner.
  //
  // Centering is only ever *applied* to the live view on that first real
  // measurement. Every later resize just recomputes what "centered" now
  // means (so the reset-view button still targets something sensible for
  // the new size) without touching the visitor's current pan/scale — a
  // rotated phone or a resized window shouldn't discard whatever they'd
  // already dragged their way to, the same way scrolling a normal page
  // doesn't jump back to the top when the window resizes.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let centered = false;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width === 0 || height === 0) return;
      const initial = { x: (width - REFERENCE_W) / 2, y: (height - REFERENCE_H) / 2 };
      initialRef.current = initial;
      if (!centered) {
        centered = true;
        panRef.current = initial;
        scaleRef.current = 1;
        applyTransform();
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Wheel: plain scroll pans (trackpad two-finger swipe or a mouse
  // wheel), ctrl/cmd+wheel zooms (trackpad pinch reports as ctrlKey
  // wheel events; cmd+scroll is the same gesture's mouse-wheel
  // equivalent). Bound manually with { passive: false } — React's own
  // onWheel can't reliably preventDefault in every browser, and skipping
  // that here would leak the gesture into the page's own scroll.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      stopInertia();
      if (e.ctrlKey || e.metaKey) {
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else {
        panBy(-e.deltaX, -e.deltaY);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
    // Deliberately bound once on mount, not re-bound per render: panBy/
    // zoomAt read their own state through refs, so a stale closure over
    // them is harmless, and re-running this effect on every render would
    // mean tearing down and re-adding the listener constantly instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const midpoint = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

  const onPointerDown = (e: React.PointerEvent) => {
    // A right/middle click or a second unrelated left click shouldn't
    // start a pan.
    if (e.button !== 0 && e.pointerType === "mouse") return;
    stopInertia();
    stopReset();
    containerRef.current?.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 1) {
      dragState.current = { last: { x: e.clientX, y: e.clientY }, startPan: { ...panRef.current }, distance: 0 };
      velocity.current = { x: 0, y: 0 };
      lastMoveTime.current = performance.now();
      setIsDragging(true);
    } else if (pointers.current.size === 2) {
      dragState.current = null;
      const pts = Array.from(pointers.current.values());
      const mid = midpoint(pts[0], pts[1]);
      const rect = containerRef.current?.getBoundingClientRect();
      const px = mid.x - (rect?.left ?? 0);
      const py = mid.y - (rect?.top ?? 0);
      pinchState.current = {
        startDist: distance(pts[0], pts[1]),
        startScale: scaleRef.current,
        anchorWorld: { x: (px - panRef.current.x) / scaleRef.current, y: (py - panRef.current.y) / scaleRef.current },
      };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchState.current) {
      const pts = Array.from(pointers.current.values());
      const dist = distance(pts[0], pts[1]);
      const mid = midpoint(pts[0], pts[1]);
      const rect = containerRef.current?.getBoundingClientRect();
      const px = mid.x - (rect?.left ?? 0);
      const py = mid.y - (rect?.top ?? 0);
      const { startDist, startScale, anchorWorld } = pinchState.current;
      const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, startScale * (dist / startDist)));
      scaleRef.current = nextScale;
      panRef.current = clampPan(px - anchorWorld.x * nextScale, py - anchorWorld.y * nextScale, nextScale);
      applyTransform();
      return;
    }

    const drag = dragState.current;
    if (!drag || pointers.current.size !== 1) return;
    const now = performance.now();
    const dx = e.clientX - drag.last.x;
    const dy = e.clientY - drag.last.y;
    const dt = Math.max(1, now - lastMoveTime.current);

    drag.distance += Math.hypot(dx, dy);
    panRef.current = clampPan(panRef.current.x + dx, panRef.current.y + dy, scaleRef.current);
    applyTransform();

    // Smoothed instantaneous velocity (px/frame at ~60fps) rather than a
    // raw single-sample reading — one noisy pointermove right before
    // release would otherwise launch inertia in a slightly wrong
    // direction at the wrong speed.
    const instX = (dx / dt) * 16.67;
    const instY = (dy / dt) * 16.67;
    velocity.current = { x: velocity.current.x * 0.7 + instX * 0.3, y: velocity.current.y * 0.7 + instY * 0.3 };

    drag.last = { x: e.clientX, y: e.clientY };
    lastMoveTime.current = now;

    if (drag.distance > DRAG_THRESHOLD) {
      suppressNextClick.current = true;
    }
  };

  const endPointer = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    containerRef.current?.releasePointerCapture?.(e.pointerId);

    if (pointers.current.size === 0) {
      setIsDragging(false);
      if (dragState.current && dragState.current.distance > DRAG_THRESHOLD) {
        runInertia();
      }
      dragState.current = null;
      pinchState.current = null;
    } else if (pointers.current.size === 1) {
      // Dropped from a pinch back to a single finger — re-anchor so the
      // remaining finger doesn't cause a jump.
      pinchState.current = null;
      const [remaining] = Array.from(pointers.current.values());
      dragState.current = { last: remaining, startPan: { ...panRef.current }, distance: DRAG_THRESHOLD + 1 };
      lastMoveTime.current = performance.now();
    }
  };

  // Per-card dragging — repositioning a single card within the world,
  // distinct from panning the whole canvas above. stopPropagation on
  // pointerdown is what keeps the two from fighting over the same
  // gesture: it never reaches the container's own onPointerDown, so a
  // press starting on a card always moves *that card*, never the camera.
  //
  // Screen-space deltas are divided by the current scale before being
  // applied — at 1.4x zoom a 10px mouse move should shift the card 10px
  // on screen, i.e. ~7px in world units, not 10 world px (which would
  // visibly outrun the cursor).
  const onCardPointerDown = (project: PlaygroundProject, e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.stopPropagation();
    stopInertia();
    const el = cardRefs.current.get(project.id);
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    el.style.zIndex = String(++zCounter.current);
    const pos = positionsRef.current[project.id] ?? { x: project.x, y: project.y };
    cardDragState.current = { id: project.id, last: { x: e.clientX, y: e.clientY }, distance: 0, curLeft: pos.x, curTop: pos.y };
  };

  const onCardPointerMove = (project: PlaygroundProject, e: React.PointerEvent) => {
    const drag = cardDragState.current;
    if (!drag || drag.id !== project.id) return;
    e.stopPropagation();
    const dxScreen = e.clientX - drag.last.x;
    const dyScreen = e.clientY - drag.last.y;
    drag.distance += Math.hypot(dxScreen, dyScreen);
    drag.last = { x: e.clientX, y: e.clientY };
    drag.curLeft += dxScreen / scaleRef.current;
    drag.curTop += dyScreen / scaleRef.current;

    const el = cardRefs.current.get(project.id);
    if (el) {
      el.style.left = `${drag.curLeft}px`;
      el.style.top = `${drag.curTop}px`;
    }
    if (drag.distance > DRAG_THRESHOLD) {
      suppressNextClick.current = true;
    }
  };

  const endCardDrag = (project: PlaygroundProject, e: React.PointerEvent) => {
    const drag = cardDragState.current;
    if (!drag || drag.id !== project.id) return;
    e.stopPropagation();
    cardRefs.current.get(project.id)?.releasePointerCapture?.(e.pointerId);
    commitPosition(project.id, { x: drag.curLeft, y: drag.curTop });
    cardDragState.current = null;
  };

  // A click that lands right after a real drag needs to be swallowed
  // before it reaches a card's <Link> — capture phase means this runs
  // before the anchor's own click handler ever fires, so stopping it
  // here prevents the navigation outright rather than racing it.
  const onClickCapture = (e: React.MouseEvent) => {
    if (suppressNextClick.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressNextClick.current = false;
    }
  };

  const PAN_STEP = 80;
  const onKeyDown = (e: React.KeyboardEvent) => {
    const steps: Record<string, Point> = {
      ArrowLeft: { x: PAN_STEP, y: 0 },
      ArrowRight: { x: -PAN_STEP, y: 0 },
      ArrowUp: { x: 0, y: PAN_STEP },
      ArrowDown: { x: 0, y: -PAN_STEP },
    };
    const step = steps[e.key];
    if (!step) return;
    e.preventDefault();
    stopInertia();
    panBy(step.x, step.y);
  };

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label="Project archive — a draggable spatial canvas. Drag, scroll, or use the arrow keys to explore; press Enter on a card to open a project."
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onClickCapture={onClickCapture}
      onKeyDown={onKeyDown}
      className={`relative h-full w-full touch-none overflow-hidden bg-bg-default outline-none select-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <div ref={worldRef} className="absolute left-0 top-0 will-change-transform" style={{ transformOrigin: "0 0" }}>
        {/* Uniform dot grid, part of the world itself (pans and zooms with
            everything else) rather than the fixed viewport-relative
            texture the rest of the site uses — this is a place, and the
            grid is what sells that it has an edge you haven't reached
            yet. Sized generously past the content bounds, not viewport-
            clamped, so panning to the margins doesn't run out of texture
            before it runs out of pan room. */}
        <div
          aria-hidden
          className="absolute"
          style={{
            left: STATIC_BOUNDS.minX - PAN_MARGIN * 2,
            top: STATIC_BOUNDS.minY - PAN_MARGIN * 2,
            width: STATIC_BOUNDS.maxX - STATIC_BOUNDS.minX + PAN_MARGIN * 4,
            height: STATIC_BOUNDS.maxY - STATIC_BOUNDS.minY + PAN_MARGIN * 4,
            backgroundImage: "radial-gradient(var(--dot-color) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {PLAYGROUND_PROJECTS.map((project) => {
          const pos = positions[project.id] ?? { x: project.x, y: project.y };
          return (
            <div
              key={project.id}
              ref={(el) => {
                if (el) cardRefs.current.set(project.id, el);
                else cardRefs.current.delete(project.id);
              }}
              // touch-none is repeated here rather than relied on purely
              // from the container — touch-action is supposed to compose
              // by intersection up the ancestor chain, but Safari has a
              // history of not honoring that correctly for a descendant
              // sitting inside a `transform`ed ancestor (exactly this
              // card's situation, one level under the world div's own
              // pan/zoom transform), letting a touch drag on a card start
              // scrolling the page underneath it instead. Setting it again
              // directly on the element actually being touched removes
              // any doubt. WebkitTouchCallout/WebkitUserDrag block iOS's
              // long-press "save image" menu from hijacking the same
              // gesture partway through a drag.
              className="absolute cursor-grab touch-none select-none active:cursor-grabbing"
              style={{
                left: pos.x,
                top: pos.y,
                width: project.width,
                height: project.height,
                // Blocks iOS's long-press "save image" callout from
                // hijacking a drag partway through — the images inside
                // already carry draggable={false} for the equivalent HTML5
                // drag-and-drop case.
                WebkitTouchCallout: "none",
              }}
              onPointerDown={(e) => onCardPointerDown(project, e)}
              onPointerMove={(e) => onCardPointerMove(project, e)}
              onPointerUp={(e) => endCardDrag(project, e)}
              onPointerCancel={(e) => endCardDrag(project, e)}
            >
              <PlaygroundCard project={project} />
            </div>
          );
        })}
      </div>

      {/* Viewport-fixed chrome — stays put regardless of pan/zoom. Kept to
          exactly two small elements per the "minimal UI chrome" brief. */}
      <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[11px] tracking-wide text-text-subtle">
        <span ref={coordRef}>0, 0</span>
      </div>
      <button
        type="button"
        onClick={resetView}
        aria-label="Reset view"
        className="absolute bottom-4 right-4 flex size-9 items-center justify-center rounded-full border border-border-subtle bg-bg-default/80 text-text-secondary backdrop-blur-sm transition-colors duration-150 hover:text-text-primary active:scale-95"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
          <circle cx="7" cy="7" r="2" fill="currentColor" />
          <path
            d="M7 1V3.5M7 10.5V13M1 7H3.5M10.5 7H13"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
