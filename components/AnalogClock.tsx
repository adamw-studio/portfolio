"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeContext";
import { BUDAPEST_TZ, getBudapestTime } from "@/components/budapestClock";

// Figma 175:4031 (light) / 175:3994 (dark) — the nav's own "watch
// widget," rebuilt as a live analog clock (real hour/minute hands)
// instead of the static SVG pair this replaces (nav-watch-{light,dark}.
// svg, now unused — deleted rather than left as dead assets). Redrawn
// as inline SVG at the same 24x24 viewBox/size rather than reproducing
// those two files' own literal path data: their hour hand's rotation
// pivots around a point ~1.4 units off the true face center (an
// authoring quirk of however the original was constructed in Figma,
// confirmed by rotating each of its corners through its own transform
// by hand) — fine for a static glyph frozen at one angle, but a real
// hand has to pivot exactly at the face's own center (12, 12) for every
// angle, not just the one this was originally drawn at. Colors, relative
// hand thickness/length, the four hour ticks, and the off-axis orange
// accent dot (still sitting at its own original ~10-o'clock position,
// still static — it was never a hand) are all carried over from those
// same two files, just redrawn as clean SVG primitives.
const FACE = {
  light: { fill: "#F2F2F5", stroke: "#DADADD" },
  dark: { fill: "#171717", stroke: "#363636" },
} as const;
const HOUR_COLOR = { light: "#262626", dark: "#E0DACE" } as const;
const MINUTE_COLOR = { light: "#DADADD", dark: "#5E5E5E" } as const;
const TICK_COLOR = MINUTE_COLOR;
const ACCENT_COLOR = { light: "#FFA000", dark: "#F75C03" } as const;

// The four hour ticks (12/3/6/9) plus the design's own off-axis orange
// accent dot — none of these rotate; positions copied directly from the
// original nav-watch-*.svg source.
const TICKS: { cx: number; cy: number; r: number; accent?: boolean }[] = [
  { cx: 12, cy: 2.486, r: 0.465 },
  { cx: 21.142, cy: 12.001, r: 0.465 },
  { cx: 12, cy: 21.514, r: 0.465 },
  { cx: 2.858, cy: 12.001, r: 0.465 },
  { cx: 4.16, cy: 7.348, r: 0.837, accent: true },
];

// Continuous, not snapped-to-the-minute: both hands fold in the current
// seconds (and the hour hand folds in minutes too), so the minute hand
// visibly creeps between whole-minute positions and the hour hand
// visibly creeps between whole-hour ones, rather than jumping once a
// minute/hour. `rotate(angle 12 12)` — SVG's own rotate transform is
// clockwise for a positive angle with Y pointing down (the same
// convention a clock face already uses), so no sign flip is needed
// going from "degrees clockwise from 12 o'clock" to this transform.
//
// Budapest's own wall-clock time, not the visitor's local time: this
// clock (and the expanded widget it grows into, NavClockWidget.tsx) is
// "MY local clock / portfolio identity, not the visitor's location" —
// getBudapestTime resolves the real instant `date` represents into
// Budapest's own hour/minute/second via Intl, correctly tracking CET/
// CEST across DST changes rather than a fixed offset. Milliseconds
// still come from the real `date` (Intl only reports whole seconds) —
// folded back in here for the same sub-second hand smoothness as before.
function getHandAngles(date: Date) {
  const { hour, minute, second } = getBudapestTime(date);
  const seconds = second + date.getMilliseconds() / 1000;
  const hours = hour % 12;
  const minuteAngle = ((minute + seconds / 60) / 60) * 360;
  const hourAngle = ((hours + (minute + seconds / 60) / 60) / 12) * 360;
  return { hourAngle, minuteAngle };
}

// Budapest time here too, matching the hands themselves — an aria-label
// reading out the visitor's own local time while the hands point at
// Budapest's would just be a second, disagreeing clock.
const TIME_LABEL_FORMAT = new Intl.DateTimeFormat("en-US", { timeZone: BUDAPEST_TZ, hour: "numeric", minute: "2-digit" });

export function AnalogClock() {
  const { theme } = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const hourHandRef = useRef<SVGRectElement>(null);
  const minuteHandRef = useRef<SVGLineElement>(null);
  // The displayed HH:MM string, tracked outside React state (a plain
  // ref, not useState) purely so the tick loop below can tell whether
  // it changed since the last paint without ever triggering a
  // re-render itself — see that loop's own comment.
  const lastLabelRef = useRef<string>("");

  useEffect(() => {
    // No seconds hand exists in this design (this system's own brief:
    // "if the existing design has a seconds hand, make it functional
    // too; otherwise don't add one" — it doesn't), and both hands here
    // move far too slowly for a human eye to catch a 1-second step
    // (the minute hand covers 0.1deg/s, the hour hand 0.0083deg/s) — so
    // this updates once a second, not once a frame. That's also what
    // keeps this "smooth... without unnecessary re-renders": a plain
    // ref-driven `setAttribute` on the two hand elements directly,
    // never a React state update or re-render, once a second rather
    // than sixty times a second for motion nothing could actually see
    // the difference on.
    //
    // A self-correcting setTimeout chain, not setInterval — each firing
    // schedules the *next* one from a fresh `1000 - (Date.now() % 1000)`
    // rather than a fixed 1000ms cadence, so this can't drift off the
    // real second boundary over a long-open tab the way a plain
    // setInterval would.
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const now = new Date();
      const { hourAngle, minuteAngle } = getHandAngles(now);
      hourHandRef.current?.setAttribute("transform", `rotate(${hourAngle} 12 12)`);
      minuteHandRef.current?.setAttribute("transform", `rotate(${minuteAngle} 12 12)`);

      const label = `Current time: ${TIME_LABEL_FORMAT.format(now)}`;
      if (label !== lastLabelRef.current) {
        lastLabelRef.current = label;
        svgRef.current?.setAttribute("aria-label", label);
      }

      timeoutId = setTimeout(tick, 1000 - now.getMilliseconds());
    };
    tick();

    return () => clearTimeout(timeoutId);
    // Deliberately no dependency on `theme` — this effect only ever
    // touches transform/aria-label attributes, never fill/stroke colors
    // (those are plain render-time props below, already re-rendered by
    // React itself whenever `theme` changes), so restarting the timer
    // on a theme toggle would just be pointless churn.
  }, []);

  const face = FACE[theme];
  const hourColor = HOUR_COLOR[theme];
  const minuteColor = MINUTE_COLOR[theme];
  const tickColor = TICK_COLOR[theme];
  const accentColor = ACCENT_COLOR[theme];

  return (
    // role="img" + aria-label (kept in sync above): reads as one live
    // clock to assistive tech, not a wall of individual shape elements.
    // aria-hidden isn't right here — this *is* the content, not a
    // decorative icon beside a text label the way the old static asset
    // sat next to NavDateWidget's own weekday/date text.
    <svg
      ref={svgRef}
      role="img"
      aria-label="Current time"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
    >
      <circle cx={12} cy={12} r={11.8} fill={face.fill} stroke={face.stroke} strokeWidth={0.4} />

      {TICKS.map((tick, i) => (
        <circle key={i} cx={tick.cx} cy={tick.cy} r={tick.r} fill={tick.accent ? accentColor : tickColor} />
      ))}

      {/* Hour hand: short, thick, pill-capped — rest position (0deg,
          before the effect above sets a real transform) points straight
          up at 12, matching both this element's own un-rotated geometry
          and the server-rendered/pre-hydration frame, so there's nothing
          for React to reconcile a mismatch against. */}
      <rect ref={hourHandRef} x={10.6} y={4.9} width={2.8} height={8.5} rx={1.4} fill={hourColor} />

      {/* Minute hand: thin, longer, round-capped line — same rest-at-12
          reasoning as the hour hand above. */}
      <line ref={minuteHandRef} x1={12} y1={13} x2={12} y2={2.7} stroke={minuteColor} strokeWidth={0.9} strokeLinecap="round" />
    </svg>
  );
}
