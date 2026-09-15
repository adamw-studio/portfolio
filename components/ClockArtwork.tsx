"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeContext";
import { getBudapestTime } from "@/components/budapestClock";

// Figma 182:4527 (light) / 187:4688 (dark) — the expanded clock widget's
// own left-side artwork. Rebuilt from scratch against a fresh, precise
// re-fetch of BOTH nodes (including downloading the actual exported
// circle/dot SVG assets, not just the surrounding Tailwind/CSS) after
// live feedback that an earlier pass — a flat gradient square with
// small centered hands — didn't read as the same object as the design
// at all. The real structure is a LARGE circle (r=76, i.e. 153px
// across) sitting mostly off-canvas, offset up-and-left of the 84x84
// frame and clipped by it — not a small circle centered inside a
// padded box. That's what actually produces the design's own bold,
// almost-abstract look: one dominant curved edge cutting across the
// square, with only a thin sliver of the frame's own background
// showing in the opposite corner.
//
// Every color below (circle fill/stroke, both hands, the gray dot, the
// accent dot) is confirmed — by downloading the literal exported SVGs,
// not just reading Tailwind classes — to be AnalogClock.tsx's own
// same-named token, but at the OPPOSITE theme: the dark node's circle
// is filled with AnalogClock's own light-theme face color (#F2F2F5 /
// #DADADD), the light node's with its dark-theme face color (#171717 /
// #363636), and the two hands and the accent dot invert the same way.
// Not a coincidence (checked both nodes, not just one) — this artwork's
// own "sphere" is deliberately the OPPOSITE tone of whichever card it
// sits in (a pale orb on a dark card, a near-black orb on a pale card),
// so it always reads as a bright, deliberate focal object rather than
// blending into the theme around it, unlike the plain compact icon
// next to it which just follows the site's theme directly.
const FACE = {
  light: { fill: "#171717", stroke: "#363636" },
  dark: { fill: "#F2F2F5", stroke: "#DADADD" },
} as const;
// Written out directly here rather than imported from AnalogClock.tsx —
// matches this file's own existing convention (NavClockWidget.tsx
// already duplicates ACCENT_COLOR the same way) rather than exporting
// AnalogClock's private consts purely for this one opposite-theme read.
const HOUR_COLOR = { light: "#E0DACE", dark: "#262626" } as const;
const MINUTE_COLOR = { light: "#5E5E5E", dark: "#DADADD" } as const;
// The artwork's own accent dot, exact literal hex from each node's
// exported asset — close to, but not identical to, AnalogClock's own
// #FFA000/#F75C03 pair, so kept as its own literal rather than reused.
const ACCENT_COLOR = { light: "#F75C03", dark: "#FFA50A" } as const;

// The background radial gradient only ever shows through the thin
// sliver of frame the big circle below doesn't cover — Figma's own
// version adds a conic-gradient noise layer (mix-blend-mode: soft-
// light) and a diagonal glare layer on top of this same gradient, kept
// out here as an intentional simplification (real ongoing paint cost,
// for a sliver of a sliver most users will never consciously look at)
// rather than a fidelity gap in the part that's actually load-bearing —
// but the gradient's own stops ARE the literal exported values now, not
// an approximation.
const BG_GRADIENT_STOPS = {
  light: [
    { offset: "0%", color: "rgba(242,245,247,1)" },
    { offset: "30%", color: "rgba(209,212,217,1)" },
    { offset: "60%", color: "rgba(178,184,189,1)" },
    { offset: "100%", color: "rgba(140,145,153,1)" },
  ],
  dark: [
    { offset: "0%", color: "rgba(89,94,102,1)" },
    { offset: "30%", color: "rgba(64,69,77,1)" },
    { offset: "60%", color: "rgba(46,48,56,1)" },
    { offset: "100%", color: "rgba(26,28,33,1)" },
  ],
} as const;

const SIZE = 84;
const CENTER = SIZE / 2;

// Literal per-theme geometry (circle position, the one gray dot and the
// accent dot that actually land inside the visible 84x84 frame — the
// exported layer data has a few more dot instances, but they fall well
// outside the frame in both nodes and are invisible there too, so
// they're not reproduced here). The two themes' own coordinates differ
// by only a couple of px (the circle sits very slightly differently),
// kept as two full sets rather than collapsed to one shared set now
// that exact fidelity was asked for directly.
const GEOMETRY = {
  light: {
    circle: { cx: 87.5, cy: 76.5, r: 76 },
    grayDot: { cx: 22.265, cy: 76.495 },
  },
  dark: {
    circle: { cx: 89.5, cy: 72.5, r: 76 },
    grayDot: { cx: 24.265, cy: 72.495 },
  },
} as const;

const GRAY_DOT_RADIUS = 2.965; // literal 5.93px diameter / 2
const ACCENT_DOT_RADIUS = 5.337; // literal 10.674px diameter / 2

// Both hands are fully symmetric rods pivoting through the clock's own
// center (not "mostly above center with a short tail below" the way
// the compact icon's hands are drawn) — confirmed from the exported
// hand instances, whose own wrapping flex box centers the un-rotated
// bar on both axes. That's part of what makes this read as abstract
// geometry first, an actual clock only on a second look: a bar through
// the middle doesn't immediately parse as a clock hand the way a
// hand rooted at one end does.
const HOUR_WIDTH = 19; // literal 18.977px
const HOUR_LENGTH = 62; // literal 61.674px, the full symmetric length
const MINUTE_WIDTH = 7; // literal 7.116px
const MINUTE_LENGTH = 72; // literal 71.59px, the full symmetric length

// The brief's own explicit upgrade ("orange dot represents seconds,
// moves/rotates around the clock") applied to the artwork's own static
// accent dot — Figma's own export freezes it at one arbitrary angle, so
// only its SIZE and its distance from center are taken literally here
// (recalibrated down from an earlier, much wider 34px swing to ~11px,
// matching how close the real accent dot actually sits to center in
// both fetches: ~9.5px in the dark node, ~12.4px in the light one).
const SECOND_ORBIT_RADIUS = 11;
const SECOND_DOT_RADIUS = ACCENT_DOT_RADIUS;

function getHandAngles(date: Date) {
  const { hour, minute, second } = getBudapestTime(date);
  const seconds = second + date.getMilliseconds() / 1000;
  const hours = hour % 12;
  const minuteAngle = ((minute + seconds / 60) / 60) * 360;
  const hourAngle = ((hours + (minute + seconds / 60) / 60) / 12) * 360;
  const secondAngle = (seconds / 60) * 360;
  return { hourAngle, minuteAngle, secondAngle };
}

// Combines the outer ambient drop-shadow with Figma's own two-part
// inset shadow (a light rim on the lower edge, a darker one on the
// upper edge — the thing that keeps the big flat circle from reading
// as a paper cutout) — both literal per-theme values, applied as CSS
// box-shadow on the svg root itself since SVG has no native inset-
// shadow primitive of its own.
const SHADOW = {
  light: "shadow-[0px_2px_6px_0px_rgba(0,0,0,0.15),inset_0px_-2px_3px_-1px_rgba(255,255,255,0.5),inset_0px_2px_4px_0px_rgba(0,0,0,0.2)]",
  dark: "shadow-[0px_3px_8px_0px_rgba(0,0,0,0.35),inset_0px_-2px_3px_-1px_rgba(255,255,255,0.12),inset_0px_2px_4px_0px_rgba(0,0,0,0.4)]",
} as const;

export function ClockArtwork({ className = "" }: { className?: string }) {
  const { theme } = useTheme();
  const hourRef = useRef<SVGRectElement>(null);
  const minuteRef = useRef<SVGRectElement>(null);
  const secondRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    // Same self-correcting once-a-second chain as AnalogClock.tsx —
    // ref-driven transform writes only, never React state, so this
    // never re-renders after mount.
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
  const geometry = GEOMETRY[theme];
  const gradientId = `clock-artwork-bg-${theme}`;
  const clipId = `clock-artwork-clip-${theme}`;

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
        {/* userSpaceOnUse cx/cy/r derived directly from Figma's own
            gradientTransform matrix (a uniform 5.25x scale of a unit
            circle at the origin, translated to 36.75,42) — the same
            gradient, just expressed without needing a matrix. */}
        <radialGradient id={gradientId} gradientUnits="userSpaceOnUse" cx="36.75" cy="42" r="52.5">
          {BG_GRADIENT_STOPS[theme].map((stop, i) => (
            <stop key={i} offset={stop.offset} stopColor={stop.color} />
          ))}
        </radialGradient>
        <clipPath id={clipId}>
          <rect width={SIZE} height={SIZE} rx={16} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {/* The thin sliver of frame the big circle below doesn't cover. */}
        <rect width={SIZE} height={SIZE} fill={`url(#${gradientId})`} />

        {/* The big circle itself — literal r=76, offset well outside the
            84x84 frame on purpose; the clipPath above is what actually
            crops it down to the design's own dominant-curved-edge look. */}
        <circle cx={geometry.circle.cx} cy={geometry.circle.cy} r={geometry.circle.r} fill={face.fill} stroke={face.stroke} strokeWidth={1} />

        {/* Hour hand — thick, symmetric through center. Painted before
            the minute hand, matching Figma's own layer order (minute
            sits on top where the two would ever overlap). */}
        <rect
          ref={hourRef}
          x={CENTER - HOUR_WIDTH / 2}
          y={CENTER - HOUR_LENGTH / 2}
          width={HOUR_WIDTH}
          height={HOUR_LENGTH}
          rx={HOUR_WIDTH / 2}
          fill={HOUR_COLOR[theme]}
        />

        {/* Minute hand — thin, longer, also symmetric through center. */}
        <rect
          ref={minuteRef}
          x={CENTER - MINUTE_WIDTH / 2}
          y={CENTER - MINUTE_LENGTH / 2}
          width={MINUTE_WIDTH}
          height={MINUTE_LENGTH}
          rx={MINUTE_WIDTH / 2}
          fill={MINUTE_COLOR[theme]}
        />

        {/* The one static gray anchor dot that actually lands inside the
            visible frame (the brief's own "gray dot... can remain a
            subtle anchor"). */}
        <circle cx={geometry.grayDot.cx} cy={geometry.grayDot.cy} r={GRAY_DOT_RADIUS} fill={MINUTE_COLOR[theme]} />

        {/* Seconds — an orbiting dot, not a third hand: the brief's own
            explicit request ("orange dot represents seconds, moves/
            rotates around the clock"), orbiting near where the design's
            own static accent dot actually sits rather than centered on
            the box. */}
        <circle ref={secondRef} cx={CENTER} cy={CENTER - SECOND_ORBIT_RADIUS} r={SECOND_DOT_RADIUS} fill={accentColor} />
      </g>
    </svg>
  );
}
