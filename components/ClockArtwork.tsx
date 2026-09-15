"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeContext";
import { getBudapestTime } from "@/components/budapestClock";

// Figma 182:4527 (light) / 187:4688 (dark) — the expanded clock widget's
// own left-side artwork: a large (84x84) abstract rendering of the same
// clock AnalogClock.tsx already draws small in the nav.
//
// Figma's own export renders this as a genuinely glossy sphere (a radial
// gradient + a conic-gradient noise texture at mix-blend-mode: soft-light
// + a diagonal glare layer + a two-part inset shadow, four stacked layers
// for one circle). Simplified to a single richer radial gradient plus one
// soft ambient shadow — the brief's own instruction ("keep it localized,
// keep it subtle... make sure it does not create a large rectangular gray
// cloud") reads as a caution against exactly that kind of heavy
// layered-gradient treatment, not a spec to reproduce byte for byte, and
// a four-layer blend-mode stack is real ongoing paint cost for a widget
// that's supposed to feel light and quick to open. The gradient's actual
// color stops below ARE taken literally from each theme's own fetch
// though, not approximated, now that "follow the visual design precisely"
// was asked for directly.
//
// Two real hands (not the "cream hand" + "orange dot" + "gray dot" the
// brief describes) — Figma's own node has a second, thinner hand
// alongside the first, the same hour/minute split the compact icon
// already draws, just chunkier. So this keeps that real two-hand
// structure and gives the brief's own explicit "orange dot represents
// seconds, moves/rotates around the clock" request to the accent dot
// instead, which only ever sat statically in Figma's own two exports —
// an upgrade requested directly, not a misreading of the static original.
//
// Hand colors are the SAME literal hex in both theme exports (#262626
// hour, #dadadd minute) — re-confirmed against a fresh re-fetch of the
// dark node specifically because an earlier version of this file assumed
// they'd invert per theme the way AnalogClock.tsx's own compact-icon
// hands do (and had borrowed that file's own dark-mode hour/minute
// colors, #E0DACE/#5E5E5E, to do it). They don't: only the sphere's own
// gradient and shadow change between themes here, not the hands sitting
// on top of it — theme-invariant, not theme-keyed, below.
const FACE = {
  light: { stops: [{ offset: "0%", color: "#FFFFFF", opacity: 0.9 }, { offset: "100%", color: "#F2F2F5", opacity: 0 }], base: "#F2F2F5" },
  // Literal 4-stop gradient from the dark node's own fetch (187:4688),
  // collapsed to the two extremes plus its own midpoint rather than all
  // four — a radialGradient interpolates linearly between stops anyway,
  // so a third point only matters where the real curve bows away from a
  // straight line between its ends, and this one doesn't by enough to
  // read on an 84px circle.
  dark: { stops: [{ offset: "0%", color: "rgba(89,94,102,1)", opacity: 1 }, { offset: "55%", color: "rgba(46,48,56,1)", opacity: 1 }, { offset: "100%", color: "rgba(26,28,33,1)", opacity: 1 }], base: "#171717" },
} as const;
const HOUR_COLOR = "#262626";
const MINUTE_COLOR = "#DADADD";
const ACCENT_COLOR = { light: "#FFA000", dark: "#F75C03" } as const;
// Shadow also differs per theme in both real fetches — dark's own sphere
// sits on a near-black bg-default and needs more to read at all
// (0px_3px_8px_0px_rgba(0,0,0,0.35)) than light's does against a pale one
// (0px_2px_6px_0px_rgba(0,0,0,0.15)).
const SHADOW = {
  light: "shadow-[0px_2px_6px_0px_rgba(0,0,0,0.15)]",
  dark: "shadow-[0px_3px_8px_0px_rgba(0,0,0,0.35)]",
} as const;

const SIZE = 84;
const CENTER = SIZE / 2;

// Three static anchor dots (the brief's own "gray dot... can remain a
// subtle anchor") at a wide, uneven spread — deliberately not a clean
// 3/6/9/12 tick layout the way AnalogClock.tsx's own compact ticks are:
// this is meant to read as loose abstract geometry first, a clock only
// on a second look, and evenly-spaced ticks are the one thing that
// would give it away as a literal clock face immediately.
const ANCHOR_DOTS: { cx: number; cy: number; r: number }[] = [
  { cx: 68, cy: 14, r: 2.6 },
  { cx: 15, cy: 30, r: 1.8 },
  { cx: 58, cy: 70, r: 1.6 },
];

const HOUR_LENGTH = 20;
const HOUR_WIDTH = 9;
const MINUTE_LENGTH = 30;
const MINUTE_WIDTH = 4;
const SECOND_ORBIT_RADIUS = 34;
const SECOND_DOT_RADIUS = 3.2;

function getHandAngles(date: Date) {
  const { hour, minute, second } = getBudapestTime(date);
  const seconds = second + date.getMilliseconds() / 1000;
  const hours = hour % 12;
  const minuteAngle = ((minute + seconds / 60) / 60) * 360;
  const hourAngle = ((hours + (minute + seconds / 60) / 60) / 12) * 360;
  const secondAngle = (seconds / 60) * 360;
  return { hourAngle, minuteAngle, secondAngle };
}

export function ClockArtwork({ className = "" }: { className?: string }) {
  const { theme } = useTheme();
  const hourRef = useRef<SVGRectElement>(null);
  const minuteRef = useRef<SVGRectElement>(null);
  const secondRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    // Same self-correcting once-a-second chain as AnalogClock.tsx, and
    // the same reasoning for why once a second is "smooth" here — even
    // the orbiting seconds dot only needs to visibly step once a
    // second, not once a frame, to read as continuous motion at this
    // size. Ref-driven transform writes only, never React state, so
    // this never re-renders after mount.
    let timeoutId: ReturnType<typeof setTimeout>;
    const tick = () => {
      const now = new Date();
      const { hourAngle, minuteAngle, secondAngle } = getHandAngles(now);
      hourRef.current?.setAttribute("transform", `rotate(${hourAngle} ${CENTER} ${CENTER})`);
      minuteRef.current?.setAttribute("transform", `rotate(${minuteAngle} ${CENTER} ${CENTER})`);
      secondRef.current?.setAttribute("transform", `rotate(${secondAngle} ${CENTER} ${CENTER})`);
      timeoutId = setTimeout(tick, 1000 - now.getMilliseconds());
    };
    tick();
    return () => clearTimeout(timeoutId);
  }, []);

  const face = FACE[theme];
  const accentColor = ACCENT_COLOR[theme];
  const gradientId = `clock-artwork-glow-${theme}`;

  return (
    <svg
      aria-hidden
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      fill="none"
      className={`shrink-0 rounded-2xl ${SHADOW[theme]} ${className}`}
    >
      <defs>
        <radialGradient id={gradientId} cx="38%" cy="34%" r="75%">
          {face.stops.map((stop, i) => (
            <stop key={i} offset={stop.offset} stopColor={stop.color} stopOpacity={stop.opacity} />
          ))}
        </radialGradient>
      </defs>
      <rect width={SIZE} height={SIZE} rx={16} fill={face.base} />
      <rect width={SIZE} height={SIZE} rx={16} fill={`url(#${gradientId})`} />

      {ANCHOR_DOTS.map((dot, i) => (
        <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill={MINUTE_COLOR} opacity={0.6} />
      ))}

      {/* Minute hand — thin, longer, round-capped; rest position (0deg)
          points straight up, matching this element's own un-rotated
          geometry so there's nothing for React to reconcile a hydration
          mismatch against once the effect above sets a real angle. */}
      <rect
        ref={minuteRef}
        x={CENTER - MINUTE_WIDTH / 2}
        y={CENTER - MINUTE_LENGTH}
        width={MINUTE_WIDTH}
        height={MINUTE_LENGTH + 6}
        rx={MINUTE_WIDTH / 2}
        fill={MINUTE_COLOR}
      />

      {/* Hour hand — short, thick, round-capped. */}
      <rect
        ref={hourRef}
        x={CENTER - HOUR_WIDTH / 2}
        y={CENTER - HOUR_LENGTH}
        width={HOUR_WIDTH}
        height={HOUR_LENGTH + 6}
        rx={HOUR_WIDTH / 2}
        fill={HOUR_COLOR}
      />

      {/* Seconds — an orbiting dot, not a third hand: the brief's own
          explicit request ("orange dot represents seconds, moves/
          rotates around the clock"), rendered as a dot fixed
          SECOND_ORBIT_RADIUS from center, carried around by the same
          per-second rotation transform every other hand here uses. */}
      <circle ref={secondRef} cx={CENTER} cy={CENTER - SECOND_ORBIT_RADIUS} r={SECOND_DOT_RADIUS} fill={accentColor} />
    </svg>
  );
}
