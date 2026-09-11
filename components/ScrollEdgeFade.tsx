"use client";

import { useEffect, useState } from "react";

// Figma 52:11158 specifies a plain, flat 48px backdrop-blur band. Live
// reference (julienaudiger.com/institut-national-des-danses-actuelles)
// does something more refined: not one uniform blur, but several
// backdrop-filter layers stacked on top of each other, each blurred by
// a different (doubling) amount and each masked to its own narrow,
// overlapping band — inspected directly on that site (8 layers per
// edge, blur doubling 0.2px→25px, each layer's mask-image a 4-stop
// linear-gradient roughly 25% wide, shifted 12.5% from the last). Where
// the bands overlap, their backdrop-filters compound, so the *effective*
// blur ramps smoothly from imperceptible at the true screen edge to
// strongest near the boundary with sharp content, rather than snapping
// from "0 blur" to "2px blur" in one step. A single backdrop-filter
// can't do this — it's one flat value for the whole element — so this
// reproduces the same multi-layer approach rather than Figma's literal
// (flatter) spec.
//
// MAX_BLUR_PX / STRIP_HEIGHT_PX — two rounds of live feedback here, and
// the second one pointed at the actual root cause the first fix missed.
// Round 1 (20px blur, 96px strip): a whole line of real body copy
// rendered fully illegible mid-scroll — fixed by dropping the blur to
// 5px. Round 2, with that gentler blur still in place: ONE line came
// back fully blurred while the lines immediately above *and below* it
// stayed sharp — a sandwiched, glitchy-looking artifact, not a smooth
// fade. That's a height problem, not a blur-strength one: body text
// runs a 24px line-height, and a 64px-tall band gives this graduated
// technique's own *cumulative* blur (several overlapping layers
// compounding near the strip's inner edge, per its own doubling
// design) enough room to peak squarely in the middle of one line while
// its neighbors — a half-line-height away in either direction — sit
// far enough outside that peak to stay comparatively sharp. Shrinking
// the strip to roughly one line height removes the room for that
// peak-then-clean-neighbor discontinuity to ever land mid-paragraph;
// at most the bottom portion of whichever line is actually at the true
// edge fades, the same way a real edge vignette should read. 3px (down
// from 5) on top of that is extra margin, now closer to Figma's own
// 2px spec than any of the reference site's own values, which were
// tuned for a hero photo, not dense text — the throughline both rounds
// of feedback were actually pointing at.
//
// bg-bg-default (not a hardcoded rgba) is what makes the tint layer
// theme-aware for free — resolves through the project's existing
// bg-default token, so light mode gets its own correct value
// automatically the same way every other themed surface on this site
// does, rather than only working in the one theme a literal value would
// have matched.
const LAYER_COUNT = 8;
const MAX_BLUR_PX = 3;
const STRIP_HEIGHT_PX = 28;

// Layer i (0-indexed) blurs at MAX_BLUR_PX / 2^(LAYER_COUNT-1-i) — the
// same doubling progression measured on the reference (…, 5, 10, 20).
// Its mask is active over a 25%-wide band starting at i * (100 /
// (LAYER_COUNT + 2))%, so consecutive layers overlap by half their own
// band width — the actual mechanism that lets adjacent blur amounts
// blend into each other instead of stepping visibly.
const layers = Array.from({ length: LAYER_COUNT }, (_, i) => {
  const blur = MAX_BLUR_PX / 2 ** (LAYER_COUNT - 1 - i);
  const step = 100 / (LAYER_COUNT + 2);
  const start = i * step;
  return { blur, stops: [start, start + step, start + step * 2, start + step * 3] };
});

const SCROLL_THRESHOLD_PX = 24;

function FrostStrip({ edge }: { edge: "top" | "bottom" }) {
  // Mask direction runs from the true screen edge toward real content:
  // "to top" for the bottom strip (0% = the strip's own bottom = the
  // viewport's bottom edge), the plain top-to-bottom default for the
  // top strip (0% = the strip's own top = the viewport's top edge).
  const gradientDirection = edge === "bottom" ? "to top" : "to bottom";

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 z-0 ${edge === "top" ? "top-0" : "bottom-0"}`}
      style={{ height: STRIP_HEIGHT_PX }}
    >
      {layers.map(({ blur, stops }, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            maskImage: `linear-gradient(${gradientDirection}, transparent ${stops[0]}%, black ${stops[1]}%, black ${stops[2]}%, transparent ${stops[3]}%)`,
            WebkitMaskImage: `linear-gradient(${gradientDirection}, transparent ${stops[0]}%, black ${stops[1]}%, black ${stops[2]}%, transparent ${stops[3]}%)`,
          }}
        />
      ))}
      {/* A light theme-aware tint on top of the graduated blur, applied
          once (not per-layer) since it doesn't need to ramp the way the
          blur amount does — trimmed from Figma's own literal 80% down to
          25%, same "genuinely subtle over real text" reasoning as
          MAX_BLUR_PX above; 80% read as a near-solid curtain once
          layered on top of even a gentle blur. */}
      <div className="absolute inset-0 bg-bg-default/25" />
    </div>
  );
}

export default function ScrollEdgeFade() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (scrolled) return;
    // A plain `scroll` listener is the standard way to do this, but not
    // the *only* trigger here: a rAF poll runs alongside it, directly
    // sampling window.scrollY every frame regardless of whether a
    // `scroll` event actually fires. Belt-and-suspenders for the same
    // reason FlourishDivider's own reveal has a timeout fallback next to
    // its IntersectionObserver — this project has already hit more than
    // one case this session where a standard browser event/observer
    // didn't fire reliably in every environment it needed to run in.
    // Once crossed, this stays revealed permanently (scrolling back to
    // the top doesn't hide it again) — a one-time cue, same as every
    // other scroll-reveal in this codebase (AboutCardStack,
    // FlourishDivider), not a live scroll-position indicator.
    const check = () => window.scrollY > SCROLL_THRESHOLD_PX;
    const onScroll = () => {
      if (check()) setScrolled(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    let frame: number;
    const poll = () => {
      if (check()) {
        setScrolled(true);
        return;
      }
      frame = requestAnimationFrame(poll);
    };
    frame = requestAnimationFrame(poll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [scrolled]);

  return (
    <>
      <FrostStrip edge="bottom" />
      <div className="transition-opacity duration-500 motion-reduce:transition-none" style={{ opacity: scrolled ? 1 : 0 }}>
        <FrostStrip edge="top" />
      </div>
    </>
  );
}
