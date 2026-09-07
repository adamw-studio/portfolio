"use client";

import { useEffect, useRef } from "react";

// Same grid as the CSS dot pattern (globals.css's .page-dots::before) —
// this component replaces that rendering (see .dots-canvas-active there)
// for visitors who can actually use it, adding cursor-reactive dots the
// static version can't. Kept as a from-scratch canvas loop rather than a
// library: a mouse-tracked full-page dot field isn't one of the
// off-the-shelf recipes (RECIPES.md), and canvas is the cheapest tool
// that can move a few thousand individual points at 60fps — doing this
// with real DOM nodes (even with CSS transitions) would mean that many
// elements, and a WAAPI/CSS-driven approach can't express "continuously
// follow a moving point" at all, only animate toward a fixed end state.
const GRID = 24;
const DOT_RADIUS = 1;

// How far the cursor's influence reaches, and how far a caught dot can
// be pushed at the very center of that reach — kept small deliberately
// ("subtle... understated", not a scatter effect).
const INFLUENCE_RADIUS = 110;
const MAX_PUSH = 9;

// Manual critically-damped-ish spring (velocity += (target-pos)*stiffness,
// then velocity *= damping) rather than a physics library — same
// "cheapest tool that works" call as above. These two constants are what
// make the motion read as "smoothly return" rather than snapping back:
// stiffness this low means small steps toward the target every frame,
// damping this high means those steps don't overshoot and oscillate.
const SPRING_STIFFNESS = 0.1;
const SPRING_DAMPING = 0.82;
// Once a dot's displacement and velocity both fall under this, it's
// close enough to home to stop paying for its spring update every frame.
const SETTLE_EPSILON = 0.02;

// Same breakpoints as the CSS mask-image, so the canvas version fades
// out toward the horizontal center (where the content column sits)
// exactly like the static one it replaces.
function edgeFadeOpacity(screenX: number, viewportWidth: number): number {
  const t = viewportWidth > 0 ? screenX / viewportWidth : 0;
  if (t <= 0.12 || t >= 0.88) return 1;
  if (t >= 0.3 && t <= 0.7) return 0.15;
  if (t < 0.3) return 1 - ((t - 0.12) / (0.3 - 0.12)) * 0.85;
  return 1 - ((0.88 - t) / (0.88 - 0.7)) * 0.85;
}

type Spring = { ox: number; oy: number; vx: number; vy: number };

export default function DotFieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Only takes over for visitors who can actually hover with a precise
    // pointer and haven't asked for less motion — see globals.css's
    // .dots-canvas-active for the CSS side of this same gate. A
    // touchscreen has no persistent "cursor" for dots to react to, and
    // this entire component's reason to exist is motion the reduced-
    // motion CSS version deliberately doesn't have.
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduceMotion) return;

    const root = canvas.parentElement;
    root?.classList.add("dots-canvas-active");

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dotColor = "rgba(244, 244, 244, 0.12)";
    const readDotColor = () => {
      dotColor = getComputedStyle(root ?? document.documentElement).getPropertyValue("--dot-color").trim() || dotColor;
    };
    readDotColor();
    // The color is a CSS custom property that only changes when the
    // theme class toggles — cheaper to catch that one moment than to
    // call getComputedStyle from inside the render loop every frame.
    const themeObserver = root ? new MutationObserver(readDotColor) : null;
    if (root) themeObserver?.observe(root, { attributes: true, attributeFilter: ["class"] });

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let viewportW = window.innerWidth;
    let viewportH = window.innerHeight;

    const resize = () => {
      viewportW = window.innerWidth;
      viewportH = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(viewportW * dpr);
      canvas.height = Math.ceil(viewportH * dpr);
      canvas.style.width = `${viewportW}px`;
      canvas.style.height = `${viewportH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let mouseX = -Infinity;
    let mouseY = -Infinity;
    let hasPointer = false;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      hasPointer = true;
    };
    const onMouseLeave = () => {
      hasPointer = false;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    // mouseleave (not mouseout) on the document root specifically: mouseout
    // bubbles and fires constantly while moving between ordinary child
    // elements, which would spuriously reset hasPointer on every element
    // boundary crossed. mouseleave doesn't bubble, so this only fires when
    // the cursor actually exits the viewport.
    document.documentElement.addEventListener("mouseleave", onMouseLeave, { passive: true });
    window.addEventListener("resize", resize);

    // Only dots currently displaced (or being pushed) get spring math —
    // every other visible dot draws straight at its resting position, so
    // the per-frame cost stays proportional to "dots near the cursor",
    // not "dots on screen".
    const active = new Map<string, Spring>();

    let rafId = 0;
    const frame = () => {
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      const startGX = Math.floor(scrollX / GRID) - 1;
      const endGX = Math.ceil((scrollX + viewportW) / GRID) + 1;
      const startGY = Math.floor(scrollY / GRID) - 1;
      const endGY = Math.ceil((scrollY + viewportH) / GRID) + 1;

      ctx.clearRect(0, 0, viewportW, viewportH);
      ctx.fillStyle = dotColor;

      for (let gx = startGX; gx <= endGX; gx++) {
        const worldX = gx * GRID + GRID / 2;
        const screenX = worldX - scrollX;
        const fade = edgeFadeOpacity(screenX, viewportW);
        if (fade <= 0.001) continue;

        for (let gy = startGY; gy <= endGY; gy++) {
          const worldY = gy * GRID + GRID / 2;
          const screenY = worldY - scrollY;
          const key = `${gx},${gy}`;

          let ox = 0;
          let oy = 0;

          const dx = screenX - mouseX;
          const dy = screenY - mouseY;
          const dist = hasPointer ? Math.sqrt(dx * dx + dy * dy) : Infinity;
          const withinReach = dist < INFLUENCE_RADIUS;

          let spring = active.get(key);
          if (withinReach || spring) {
            if (!spring) {
              spring = { ox: 0, oy: 0, vx: 0, vy: 0 };
              active.set(key, spring);
            }

            let targetX = 0;
            let targetY = 0;
            if (withinReach && dist > 0.001) {
              // Squared falloff: gentle at the edge of the influence
              // radius, strongest right under the cursor — reads as a
              // soft push rather than a hard-edged boundary.
              const strength = (1 - dist / INFLUENCE_RADIUS) ** 2 * MAX_PUSH;
              targetX = (dx / dist) * strength;
              targetY = (dy / dist) * strength;
            }

            spring.vx = (spring.vx + (targetX - spring.ox) * SPRING_STIFFNESS) * SPRING_DAMPING;
            spring.vy = (spring.vy + (targetY - spring.oy) * SPRING_STIFFNESS) * SPRING_DAMPING;
            spring.ox += spring.vx;
            spring.oy += spring.vy;

            if (
              !withinReach &&
              Math.abs(spring.ox) < SETTLE_EPSILON &&
              Math.abs(spring.oy) < SETTLE_EPSILON &&
              Math.abs(spring.vx) < SETTLE_EPSILON &&
              Math.abs(spring.vy) < SETTLE_EPSILON
            ) {
              active.delete(key);
            } else {
              ox = spring.ox;
              oy = spring.oy;
            }
          }

          ctx.globalAlpha = fade;
          ctx.beginPath();
          ctx.arc(screenX + ox, screenY + oy, DOT_RADIUS, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", resize);
      themeObserver?.disconnect();
      root?.classList.remove("dots-canvas-active");
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[-1]" />;
}
