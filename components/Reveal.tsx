"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

// The site's one shared text-reveal system — "smooth, consistent...
// subtle, premium, editorial" motion, on direct instruction, built once
// here rather than every heading/label/card hand-rolling its own
// opacity+translate. Every duration/distance/easing value this reads
// lives in app/globals.css's own --motion-text-* custom properties,
// keyed by `tier` — change the feel of the whole site from that one
// file, not by hunting down individual components. The mask wrapper
// (below) is the one part that has to live here rather than CSS alone:
// it's what makes a heading look like it's revealing from behind an
// edge rather than just fading up in place.
//
// Motion shape: text starts a few px below its final position, clipped
// by an overflow-hidden mask the same size as the content, and both
// slides up (translateY) and fades in (opacity) at once — "hidden
// below → smooth upward reveal → final position," per spec. transform
// and opacity only (no width/height/top/left), so this never triggers
// layout during the animation.
//
// Progressive enhancement: this element's HTML never ships with a
// permanent opacity:0 — the very first render (`phase: "initial"`)
// looks IDENTICAL to the fully-revealed state, on purpose, so a visitor
// with JS disabled (or a crawler, or a client that never hydrates) sees
// plain, fully-readable text with no animation, not hidden content.
// Only once this component actually mounts does a synchronous
// useLayoutEffect flip it to `"hidden"` — before the browser's next
// paint, so a JS-enabled visitor never sees that fully-visible
// "initial" frame render on screen either. From there, `"visible"` is
// triggered either immediately next frame (`mode="load"`, for content
// already on screen at first paint — a hero) or by IntersectionObserver
// (`mode="scroll"`, the default — everything further down the page).
//
// Runs once, never replays: the observer disconnects itself the moment
// it fires, and nothing here ever moves `phase` back to `"hidden"` —
// scrolling an already-revealed element back out of view and back in
// does nothing, matching "once revealed, stays revealed."
//
// prefers-reduced-motion: checked once on mount (matchMedia, corrected
// live on change — same pattern as ThemeContext's own stored-theme
// correction elsewhere in this codebase). When set, no transform ever
// applies and content jumps straight back to "visible" the moment the
// reveal effect runs, with `withTransition` false — no animation, no
// stagger, no delay. The mount-only layout effect above still arms
// "hidden" unconditionally for a frame first (see its own comment on
// why gating it on reducedMotion directly isn't safe); a reduced-motion
// visitor can see a single brief flash between that and the correction,
// not permanent motion — the same one-frame tradeoff ThemeContext's own
// stored-theme correction already accepts elsewhere in this codebase.
export type RevealTier = "eyebrow" | "heading" | "hero" | "body";

// 10-20% of the element visible before it reveals ("aim for something
// like reveal when 10-20% of the element enters the viewport, or
// rootMargin around 0px 0px -10% 0px") — both halves of that guidance
// combined: a real intersection threshold AND a bottom rootMargin that
// pulls the trigger line up from the true viewport edge, so a reveal
// doesn't wait until an element is already fully on screen and settled
// before it starts moving.
const VIEWPORT_THRESHOLD = 0.15;
const VIEWPORT_ROOT_MARGIN = "0px 0px -10% 0px";

// This project statically pre-renders every route (see `next build`'s
// own "○ (Static)" output) — useLayoutEffect warns on that server pass
// ("useLayoutEffect does nothing on the server") even though nothing
// here actually depends on running during it. Aliasing to plain
// useEffect for that one pass silences the warning without changing
// behavior: neither hook body runs during a server render either way.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Phase = "initial" | "hidden" | "visible";

export function Reveal({
  children,
  as: Tag = "div",
  tier = "body",
  delay = 0,
  mode = "scroll",
  className = "",
  style,
}: {
  children: ReactNode;
  /** The real DOM tag this renders as — pass the tag the content would
   * have used anyway (e.g. "h1", "p"); Reveal adds a mask wrapper around
   * it, not a whole extra layer of meaningless divs where a heading
   * used to be. */
  as?: ElementType;
  tier?: RevealTier;
  /** Stagger offset in ms against sibling Reveal elements — build this
   * from REVEAL_STAGGER_TIGHT/LOOSE (components/motion.ts), not an
   * arbitrary per-call-site number. */
  delay?: number;
  /** "scroll" (default): reveal via IntersectionObserver once this
   * element enters the viewport — everything below the fold.
   * "load": reveal on next paint after mount, no scroll trigger — for
   * content already visible at first paint (a hero). */
  mode?: "scroll" | "load";
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<Phase>("initial");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Unconditional and mount-only ([], not [reducedMotion]) — deliberately
  // NOT gated on reducedMotion here. reducedMotion's own detection effect
  // (above) is a plain, passive useEffect, ordered no earlier than this
  // layout effect within the same commit; on the very first commit its
  // real matchMedia value hasn't landed yet, so reading `reducedMotion`
  // here would only ever see its stale `false` default anyway — gating
  // on it bought nothing but a second source of truth to keep in sync.
  // The reveal effect below is what actually has to react correctly if
  // reducedMotion later turns out to be true, and it does.
  useIsomorphicLayoutEffect(() => {
    setPhase("hidden");
  }, []);

  useEffect(() => {
    if (phase !== "hidden") return;
    // Checked every time this effect (re)runs, not just once — if
    // reducedMotion flips true *after* the layout effect above has
    // already armed "hidden" (the ordering this whole effect exists to
    // handle: reducedMotion's own detection effect can only ever
    // confirm the real value strictly after that layout effect's first
    // commit), this is what un-sticks it rather than leaving the
    // element permanently invisible. No `return` without first setting
    // a phase — that's the actual bug this guards against.
    if (reducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("visible");
      return;
    }
    const el = ref.current;
    if (!el) return;

    if (mode === "load") {
      // Two nested rAFs, not one: the first only guarantees the
      // "hidden" style the layout effect above just committed has been
      // scheduled for paint — starting the transition on that same
      // frame can still coalesce with it in some browsers (no visible
      // animation, it just appears already-revealed). The second frame
      // is what actually guarantees a real paint happened in between,
      // so the browser has something to transition *from*.
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setPhase("visible"));
      });
      return () => {
        cancelAnimationFrame(raf1);
        if (raf2) cancelAnimationFrame(raf2);
      };
    }

    if (typeof IntersectionObserver === "undefined") {
      setPhase("visible");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("visible");
          observer.disconnect();
        }
      },
      { threshold: VIEWPORT_THRESHOLD, rootMargin: VIEWPORT_ROOT_MARGIN },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase, mode, reducedMotion]);

  // "initial" and "visible" both render fully shown — the only visual
  // difference between them is whether a transition is present to
  // animate INTO that state (see `withTransition` below). Only
  // "hidden" ever actually looks different on screen.
  const shown = reducedMotion || phase !== "hidden";
  // No transition on the very first ("initial") render — there's
  // nothing to animate from yet, and reduced motion never leaves
  // "initial" at all, so it never needs one either.
  const withTransition = phase !== "initial" && !reducedMotion;
  const durationVar = `var(--motion-text-duration-${tier})`;
  const distanceVar = `var(--motion-text-distance-${tier})`;

  return (
    <Tag ref={ref} className={className} style={{ display: "block", overflow: "hidden", ...style }}>
      <span
        style={{
          display: "block",
          width: "100%",
          transform: shown ? "translateY(0)" : `translateY(${distanceVar})`,
          opacity: shown ? 1 : 0,
          transition: withTransition
            ? `transform ${durationVar} var(--motion-text-ease) ${delay}ms, opacity ${durationVar} var(--motion-text-ease) ${delay}ms`
            : undefined,
        }}
      >
        {children}
      </span>
    </Tag>
  );
}
