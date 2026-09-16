"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// Figma 202:5118's "Speaker Cone" + "Center Port" pair, turned into a
// tiny foosball trapped inside the pill on direct instruction — visual
// appearance (the two SVGs, their 18px/4px sizes, concentric) is
// unchanged; what's new is that both now move together as one rigid
// "ball" unit instead of sitting at one fixed spot.
//
// Everything below is refs + direct DOM writes, not React state — a
// dozen-plus position/velocity updates a second would mean re-rendering
// this (and re-running its own effect) on every frame otherwise. Same
// imperative-transform approach PlaygroundCanvas.tsx already uses for
// its own pan/zoom, for the same reason.
const BALL_DIAMETER = 18; // matches "Speaker Cone"'s own size — the ball's visual/collision radius
const BALL_RADIUS = BALL_DIAMETER / 2;
const PORT_SIZE = 4; // "Center Port"'s own size, centered inside the ball

// --- Tweakable constants ---
// Idle speed: BASE_SPEED is px/s, calibrated so crossing most of a
// ~180px-wide pill takes ~180/BASE_SPEED ≈ 3s — the brief's own
// "roughly 2-4s" pace. SPEED_VARIANCE randomizes each bounce's post-
// collision speed by up to this many px/s either way, and DRIFT_RATE
// (0-1, higher = snaps back faster) is how quickly an impulse's extra
// speed decays back toward BASE_SPEED, so a click boost fades to the
// calm baseline instead of staying fast forever.
const BASE_SPEED = 52;
const SPEED_VARIANCE = 14;
const DRIFT_RATE = 0.5;
// WOBBLE_STRENGTH: continuous small random steering (radians/s) applied
// every frame regardless of collisions — this alone is what keeps the
// path from ever reading as a fixed, repeating loop, on top of the
// per-bounce jitter below.
const WOBBLE_STRENGTH = 0.5;
// BOUNCE_SPEED_JITTER (fraction) and BOUNCE_ANGLE_JITTER (radians): a
// small random speed/angle perturbation applied on every wall bounce,
// so no two bounces reflect identically.
const BOUNCE_SPEED_JITTER = 0.18;
const BOUNCE_ANGLE_JITTER = 0.35;

// Interaction: POINTER_RADIUS is how close (px, in the pill's own local
// space) a moving pointer has to be before it starts nudging the ball;
// POINTER_STRENGTH is that nudge's max push (px/s^2 — a gentle,
// continuous force, not a snap-to-cursor). CLICK_RADIUS/CLICK_STRENGTH
// are the same idea for a one-off click/tap impulse (px/s of
// instantaneous velocity added, away from the click point).
const POINTER_RADIUS = 46;
const POINTER_STRENGTH = 30;
const CLICK_RADIUS = 60;
const CLICK_STRENGTH = 150;
// Speed ceiling so a string of nudges/impulses can't build up forever.
const MAX_SPEED = 170;

type Vec = { x: number; y: number };

/** Distance from `p` to the horizontal segment [ax, bx] at y = midY —
 * the pill's boundary is every point exactly `capRadius` from this same
 * segment (a capsule is the Minkowski sum of a line segment and a
 * circle), so this one function is what makes the flat top/bottom walls
 * and the two curved end-caps fall out of the *same* check rather than
 * needing separate rectangle/circle cases. */
function closestOnSegment(p: Vec, ax: number, bx: number, midY: number): Vec {
  return { x: Math.min(Math.max(p.x, ax), bx), y: midY };
}

/** Resolves the ball against the capsule boundary in place: if its
 * center is further than (capRadius - ballRadius) from the segment
 * above, clamps it back to that boundary and, if it was still heading
 * outward, reflects the velocity about the boundary's own normal there
 * (the same reflection formula whether that normal comes from a flat
 * wall or a curved cap, since both are just "the direction away from
 * the nearest segment point"). Returns whether a bounce actually
 * happened, so the caller only applies bounce jitter on a real hit. */
function resolveCapsule(pos: Vec, vel: Vec, w: number, h: number, ballRadius: number): boolean {
  const capRadius = h / 2;
  const effRadius = Math.max(0, capRadius - ballRadius);
  const ax = capRadius;
  const bx = Math.max(ax, w - capRadius);
  const q = closestOnSegment(pos, ax, bx, h / 2);
  const dx = pos.x - q.x;
  const dy = pos.y - q.y;
  const dist = Math.hypot(dx, dy);
  if (dist <= effRadius) return false;

  const nx = dist > 1e-4 ? dx / dist : 0;
  const ny = dist > 1e-4 ? dy / dist : -1;
  pos.x = q.x + nx * effRadius;
  pos.y = q.y + ny * effRadius;

  const vn = vel.x * nx + vel.y * ny;
  if (vn <= 0) return false; // already heading back in — nothing to reflect
  vel.x -= 2 * vn * nx;
  vel.y -= 2 * vn * ny;
  return true;
}

function rotate(v: Vec, angle: number) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const { x, y } = v;
  v.x = x * cos - y * sin;
  v.y = x * sin + y * cos;
}

export function PlaygroundArchiveBall({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  const size = useRef<Vec>({ x: 180, y: BALL_DIAMETER * 6.33 }); // corrected to the real measured size on mount
  const pos = useRef<Vec>({ x: 90, y: 57 });
  const vel = useRef<Vec>({ x: 0, y: 0 });
  const pointer = useRef<{ p: Vec; active: boolean }>({ p: { x: 0, y: 0 }, active: false });
  const rafId = useRef<number | null>(null);
  const lastTime = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const ball = ballRef.current;
    if (!container || !ball) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const paint = () => {
      ball.style.transform = `translate3d(${pos.current.x - BALL_RADIUS}px, ${pos.current.y - BALL_RADIUS}px, 0)`;
    };

    const randomVelocity = (speed: number): Vec => {
      const angle = Math.random() * Math.PI * 2;
      return { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
    };

    // First real measurement (and every later resize) — clamps whatever
    // the ball's current position is into the new bounds immediately
    // rather than waiting for the next bounce, so a shrinking container
    // never leaves it poking outside even for one frame.
    let measuredOnce = false;
    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width === 0 || height === 0) return;
      size.current = { x: width, y: height };
      if (!measuredOnce) {
        measuredOnce = true;
        pos.current = { x: width / 2, y: height / 2 };
        // No initial velocity under reduced motion — applyMotionPreference
        // below never starts the loop to integrate it either way, but
        // leaving vel.current genuinely zero here (rather than relying on
        // "nothing reads it" to keep that inert) is one less thing a
        // future change to this file could accidentally make visible.
        vel.current = reducedMotionQuery.matches ? { x: 0, y: 0 } : randomVelocity(BASE_SPEED);
      } else {
        resolveCapsule(pos.current, vel.current, size.current.x, size.current.y, BALL_RADIUS);
      }
      paint();
    });
    resizeObserver.observe(container);

    const tick = (now: number) => {
      if (lastTime.current === null) lastTime.current = now;
      // Clamped so a backgrounded tab's huge first delta after
      // returning doesn't fling the ball across the pill in one frame.
      const dt = Math.min(0.05, (now - lastTime.current) / 1000);
      lastTime.current = now;

      // Continuous gentle steering — this alone keeps the path from
      // ever reading as a fixed repeating loop, independent of bounces.
      rotate(vel.current, (Math.random() - 0.5) * WOBBLE_STRENGTH * dt);

      if (pointer.current.active) {
        const dx = pos.current.x - pointer.current.p.x;
        const dy = pos.current.y - pointer.current.p.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 1e-4 && dist < POINTER_RADIUS) {
          const strength = POINTER_STRENGTH * (1 - dist / POINTER_RADIUS);
          vel.current.x += (dx / dist) * strength * dt;
          vel.current.y += (dy / dist) * strength * dt;
        }
      }

      // Drift speed back toward the calm baseline (an impulse fades out
      // rather than staying fast forever) and enforce the hard ceiling.
      const speed = Math.hypot(vel.current.x, vel.current.y);
      if (speed > 1e-4) {
        const target = Math.min(MAX_SPEED, BASE_SPEED + (speed - BASE_SPEED) * (1 - Math.min(1, DRIFT_RATE * dt * 10)));
        const nextSpeed = Math.min(MAX_SPEED, target);
        vel.current.x = (vel.current.x / speed) * nextSpeed;
        vel.current.y = (vel.current.y / speed) * nextSpeed;
      }

      pos.current.x += vel.current.x * dt;
      pos.current.y += vel.current.y * dt;

      const bounced = resolveCapsule(pos.current, vel.current, size.current.x, size.current.y, BALL_RADIUS);
      if (bounced) {
        const jitter = 1 + (Math.random() - 0.5) * BOUNCE_SPEED_JITTER;
        vel.current.x *= jitter;
        vel.current.y *= jitter;
        rotate(vel.current, (Math.random() - 0.5) * BOUNCE_ANGLE_JITTER);
        // A fresh bounce can still exceed BASE_SPEED + SPEED_VARIANCE by
        // a lot if it landed on top of a recent impulse — re-clamp here
        // too rather than waiting a frame for the drift above to catch up.
        const s = Math.hypot(vel.current.x, vel.current.y);
        const cap = BASE_SPEED + SPEED_VARIANCE;
        if (s > cap && s > BASE_SPEED * 1.6) {
          vel.current.x = (vel.current.x / s) * cap;
          vel.current.y = (vel.current.y / s) * cap;
        }
      }

      paint();
      rafId.current = requestAnimationFrame(tick);
    };

    const toLocal = (clientX: number, clientY: number): Vec => {
      const rect = container.getBoundingClientRect();
      // Un-scales the pointer's real screen position back into the
      // pill's own local coordinate space — necessary because this
      // whole card sits inside PlaygroundCanvas's own zoomable world;
      // at any zoom level other than 1x, getBoundingClientRect's own
      // width differs from clientWidth by exactly that zoom factor, and
      // this ratio divides it back out without needing to know the
      // canvas's own scale value at all.
      const scaleX = container.clientWidth / (rect.width || 1);
      const scaleY = container.clientHeight / (rect.height || 1);
      return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.current = { p: toLocal(e.clientX, e.clientY), active: true };
    };
    const onPointerLeave = () => {
      pointer.current.active = false;
    };
    // Stops here rather than reaching PlaygroundCanvas's own card-drag
    // handler (the ancestor project wrapper also listens for
    // pointerdown, to let a card be dragged to a new spot) — a press
    // that lands on the ball is a flick, not a grab-the-card gesture.
    const onPointerDown = (e: PointerEvent) => {
      e.stopPropagation();
      const click = toLocal(e.clientX, e.clientY);
      const dx = pos.current.x - click.x;
      const dy = pos.current.y - click.y;
      const dist = Math.hypot(dx, dy);
      if (dist >= CLICK_RADIUS) return;
      const nx = dist > 1e-4 ? dx / dist : 0;
      const ny = dist > 1e-4 ? dy / dist : -1;
      const strength = CLICK_STRENGTH * (1 - dist / CLICK_RADIUS);
      vel.current.x += nx * strength;
      vel.current.y += ny * strength;
    };

    const startLoop = () => {
      if (rafId.current !== null) return;
      lastTime.current = null;
      rafId.current = requestAnimationFrame(tick);
    };
    const stopLoop = () => {
      if (rafId.current === null) return;
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    };

    // Reduced motion: no ambient bouncing and no pointer/click
    // interaction either (both exist purely to *add* motion) — the
    // ball just sits at its resting center. Re-checked live if the OS
    // setting changes mid-visit, not just read once on mount.
    const applyMotionPreference = () => {
      stopLoop();
      if (reducedMotionQuery.matches) {
        container.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerleave", onPointerLeave);
        container.removeEventListener("pointerdown", onPointerDown);
        if (measuredOnce) {
          pos.current = { x: size.current.x / 2, y: size.current.y / 2 };
          vel.current = { x: 0, y: 0 };
          paint();
        }
      } else {
        container.addEventListener("pointermove", onPointerMove);
        container.addEventListener("pointerleave", onPointerLeave);
        container.addEventListener("pointerdown", onPointerDown);
        startLoop();
      }
    };
    applyMotionPreference();
    reducedMotionQuery.addEventListener("change", applyMotionPreference);

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      reducedMotionQuery.removeEventListener("change", applyMotionPreference);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <div ref={ballRef} className="absolute left-0 top-0 size-[18px] will-change-transform">
        <Image src="/images/playground/archive-speaker-cone.svg" alt="" width={BALL_DIAMETER} height={BALL_DIAMETER} className="absolute inset-0" />
        <Image
          src="/images/playground/archive-center-port.svg"
          alt=""
          width={PORT_SIZE}
          height={PORT_SIZE}
          className="absolute"
          style={{ left: (BALL_DIAMETER - PORT_SIZE) / 2, top: (BALL_DIAMETER - PORT_SIZE) / 2 }}
        />
      </div>
    </div>
  );
}
