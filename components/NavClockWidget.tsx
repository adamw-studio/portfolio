"use client";

import { useEffect, useRef, useState } from "react";
import { AnalogClock } from "@/components/AnalogClock";
import { ClockArtwork } from "@/components/ClockArtwork";
import { useTheme } from "@/components/ThemeContext";
import { getBudapestTime, getBudapestTzAbbr, getTimeOfDayMessage, DIGITAL_TIME_FORMAT } from "@/components/budapestClock";

// Same accent pair as AnalogClock.tsx/ClockArtwork.tsx's own
// ACCENT_COLOR — kept as one more literal copy here rather than an
// import specifically because it's read through a CSS custom property
// (`--clock-accent`, set inline below) for the location row's own dot,
// not passed as a React prop like the SVGs' own fill colors are.
const ACCENT_COLOR = { light: "#FFA000", dark: "#F75C03" } as const;

// Figma 187:4688 (dark) / 182:4527 (light) — the compact "watch widget"
// (AnalogClock.tsx, next to today's weekday/date) now unfolds into a
// wider panel on hover/tap: the same abstract clock drawn larger
// (ClockArtwork.tsx) alongside a live digital clock, "Budapest • CET/
// CEST," and a contextual line that changes with the time of day. Two
// states of one physical object, on direct instruction — not a tooltip
// that happens to show a clock — so the compact and expanded views
// cross-fade inside one continuously-sized box that grows/shrinks
// between them, rather than a popover mounting on top of separate,
// static compact content.
//
// The expanded panel is `absolute`, not part of this widget's own flow
// footprint: only the compact icon (plus, at rest, the weekday/date text
// next to it) actually occupies space in the nav bar's own flex layout.
// Growing a flow element from 24px to ~300px would drag Nav.tsx's own
// centered Home/Playground segment and the theme toggle sideways with
// it every time this opens — exactly the "neighboring content jumping
// around" this was asked not to do. Anchored top-left to this
// component's own relative wrapper (which sits where the compact icon
// already sits), so it grows up and out over the page instead.
const MORPH_MS = 550;
const MORPH_EASE = "var(--motion-text-ease)"; // cubic-bezier(0.22, 1, 0.36, 1) — this project's own shared text-reveal curve (globals.css), and coincidentally the exact curve this system's own brief suggested for the morph itself.
const CONTENT_DURATION_MS = 380;
const CONTENT_DISTANCE_PX = 8;
// Stagger offsets straight from the brief's own suggested sequence
// (artwork ~80ms, digital time ~130ms, location ~180ms, message
// ~230ms) — kept as one small table here rather than four magic numbers
// scattered through the JSX below.
const STAGGER = { artwork: 80, time: 130, location: 180, message: 230 } as const;

const EXPANDED_WIDTH = 309;
const EXPANDED_HEIGHT = 100;
const COMPACT_SIZE = 24;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useCanHover() {
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);
  return canHover;
}

// Live-updating digital time/location/message — mounted only while the
// panel is expanded, not for the widget's whole lifetime, so this
// component's own once-a-second re-render (unlike AnalogClock/
// ClockArtwork's own ref-driven, render-free ticking) only ever happens
// while there's actually a digital readout on screen to update, not
// continuously in the background whether anyone's looking or not.
function ExpandedText({ stagger }: { stagger: boolean }) {
  // Starts null, not `new Date()` — a lazy initializer still runs
  // during render on *both* the server and the client's first
  // (pre-hydration) pass, and those are two different instants in time
  // (confirmed live: a real hydration-mismatch error, the two
  // `dateTime` values differing by however many ms the server render
  // and the client's first render were apart). Same fix as every other
  // "what time is it right now" read in this codebase (NavDateWidget's
  // own weekday/date, ThemeContext's stored-theme correction): render
  // nothing time-dependent until a client-only effect supplies the
  // first real value.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const tick = () => {
      const current = new Date();
      setNow(current);
      timeoutId = setTimeout(tick, 1000 - current.getMilliseconds());
    };
    tick();
    return () => clearTimeout(timeoutId);
  }, []);

  const { hour } = getBudapestTime(now ?? new Date(0));
  const tzAbbr = getBudapestTzAbbr(now ?? new Date(0));
  const message = getTimeOfDayMessage(hour);

  const reveal = (delayMs: number) => ({
    transition: stagger ? `opacity ${CONTENT_DURATION_MS}ms ${MORPH_EASE} ${delayMs}ms, transform ${CONTENT_DURATION_MS}ms ${MORPH_EASE} ${delayMs}ms` : undefined,
    opacity: stagger ? 1 : 0,
    transform: stagger ? "translateY(0)" : `translateY(${CONTENT_DISTANCE_PX}px)`,
  });

  return (
    <div className="flex w-[197px] shrink-0 flex-col items-start gap-5">
      <div className="flex w-full flex-col items-start">
        {/* time="..." dateTime, not just visual text — a real <time>
            element gives assistive tech and any future tooling a
            machine-readable instant, independent of the "20:06:02"
            display string. No aria-live here (accessibility brief:
            "do NOT use an aggressive aria-live region for the seconds
            counter") — a screen reader that lands on this reads the
            current second once, not a running commentary. */}
        <time
          dateTime={now ? now.toISOString() : undefined}
          style={reveal(STAGGER.time)}
          className="w-full text-[20px] font-medium tracking-[-0.8px] text-text-primary"
        >
          {now ? DIGITAL_TIME_FORMAT.format(now) : "00:00:00"}
        </time>
        <div style={reveal(STAGGER.location)} className="flex w-full items-center gap-1.5">
          <p className="whitespace-nowrap text-[12px] leading-[12px] text-text-primary">Budapest</p>
          <span aria-hidden className="size-1 shrink-0 rounded-full" style={{ backgroundColor: "var(--clock-accent)" }} />
          <p className="whitespace-nowrap text-[12px] leading-[12px] text-text-primary">{tzAbbr}</p>
        </div>
      </div>
      <p style={reveal(STAGGER.message)} className="w-full text-[14px] leading-[14px] text-text-subtle">
        {message}
      </p>
    </div>
  );
}

export function NavClockWidget() {
  const { theme } = useTheme();
  const [hovering, setHovering] = useState(false);
  const [tapped, setTapped] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const canHover = useCanHover();

  const isOpen = hovering || tapped;

  // Outside click/tap collapses an open, tap-activated panel — a real
  // requirement on touch ("tap outside / tap clock again → collapse"),
  // and harmless on desktop (hover already collapses itself on
  // pointerleave; this only ever fires there if a click happened to
  // land outside first, which a genuine outside click by definition
  // already implies).
  useEffect(() => {
    if (!tapped) return;
    const onPointerDown = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setTapped(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTapped(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [tapped]);

  const width = isOpen ? EXPANDED_WIDTH : COMPACT_SIZE;
  const height = isOpen ? EXPANDED_HEIGHT : COMPACT_SIZE;
  const radius = isOpen ? 16 : 999;

  return (
    // One hover/focus region covering BOTH the compact icon and the
    // panel it grows into — moving the pointer from one into the other
    // never crosses a boundary that isn't still inside this same
    // element, which is what actually prevents the flicker-close the
    // brief calls out ("do NOT collapse it when moving the pointer from
    // the original clock into the expanded area"). A separate
    // mouseenter/mouseleave pair on just the small icon, with the panel
    // as an unrelated sibling, is the version that flickers — the gap
    // between "pointer left the 24px icon" and "pointer entered the
    // panel a few px away" is real screen space with nothing under it.
    <div
      ref={wrapperRef}
      className="relative"
      style={{ width: COMPACT_SIZE, height: COMPACT_SIZE }}
      onMouseEnter={() => canHover && setHovering(true)}
      onMouseLeave={() => canHover && setHovering(false)}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Collapse clock" : "Expand clock"}
        onClick={() => setTapped((current) => !current)}
        onFocus={() => setHovering(true)}
        onBlur={(e) => {
          // Only collapse if focus actually left the whole widget, not
          // just this button for some *other* element still inside it
          // (the panel currently has no focusable content of its own,
          // but this guard costs nothing and keeps the same
          // "collapse where appropriate" rule correct if that changes).
          if (!wrapperRef.current?.contains(e.relatedTarget as Node)) setHovering(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setTapped(false);
            setHovering(false);
          }
        }}
        className="absolute left-0 top-0 z-10 overflow-hidden bg-bg-default"
        style={{
          width,
          height,
          borderRadius: radius,
          border: isOpen ? "1px solid var(--color-border-subtle)" : "none",
          padding: isOpen ? 8 : 0,
          // Read by ExpandedText's own location-row dot below — a CSS
          // custom property rather than a second prop thread, since
          // ExpandedText already sits several JSX levels away from
          // this literal.
          ["--clock-accent" as string]: ACCENT_COLOR[theme],
          transition: reducedMotion
            ? undefined
            : [
                `width ${MORPH_MS}ms ${MORPH_EASE}`,
                `height ${MORPH_MS}ms ${MORPH_EASE}`,
                `border-radius ${MORPH_MS}ms ${MORPH_EASE}`,
                `padding ${MORPH_MS}ms ${MORPH_EASE}`,
              ].join(", "),
        }}
      >
        {/* Compact face: the plain icon, fading out as the panel grows —
            absolutely positioned over the same top-left corner as the
            artwork below so the two genuinely cross-fade in place
            rather than one being laid out next to empty space left by
            the other. */}
        <div
          aria-hidden={isOpen}
          className="absolute left-0 top-0 flex items-center justify-center"
          style={{
            width: COMPACT_SIZE,
            height: COMPACT_SIZE,
            opacity: isOpen ? 0 : 1,
            transition: reducedMotion ? undefined : `opacity ${isOpen ? 150 : 200}ms ${MORPH_EASE} ${isOpen ? 0 : 120}ms`,
            pointerEvents: isOpen ? "none" : "auto",
          }}
        >
          <AnalogClock />
        </div>

        {/* Expanded face. */}
        <div
          aria-hidden={!isOpen}
          className="flex h-full items-center gap-3"
          style={{
            opacity: isOpen ? 1 : 0,
            transition: reducedMotion ? undefined : `opacity ${isOpen ? 250 : 150}ms ${MORPH_EASE} ${isOpen ? 100 : 0}ms`,
            pointerEvents: isOpen ? "auto" : "none",
          }}
        >
          <div
            style={{
              opacity: isOpen || reducedMotion ? 1 : 0,
              transform: isOpen || reducedMotion ? "translateY(0)" : `translateY(${CONTENT_DISTANCE_PX}px)`,
              transition: reducedMotion
                ? undefined
                : `opacity ${CONTENT_DURATION_MS}ms ${MORPH_EASE} ${STAGGER.artwork}ms, transform ${CONTENT_DURATION_MS}ms ${MORPH_EASE} ${STAGGER.artwork}ms`,
            }}
          >
            <ClockArtwork />
          </div>
          <ExpandedText stagger={isOpen || reducedMotion} />
        </div>
      </button>
    </div>
  );
}
