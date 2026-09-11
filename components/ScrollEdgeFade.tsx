"use client";

import { useEffect, useState } from "react";

// Purely decorative — a soft, blurred smear of text along the top and
// bottom edges of the viewport, sitting behind all real content. Not
// real copy (confirmed: no such section exists or is planned), so the
// exact words don't matter; this reuses the snippet from the reference
// screenshot as plausible-looking filler rather than inventing new bio
// copy that would never actually be read.
//
// The bottom strip is there from the start; the top one only fades in
// once the page has actually been scrolled (a small threshold, not
// scrollY > 0, so an incidental 1-2px scroll-bounce on some
// trackpads/browsers doesn't flicker it) — mirroring "there's more
// above you now" only once that's true, rather than showing a fixed
// pair from the very first frame.
//
// mask-image (not just opacity) fades each strip toward the *outer*
// screen edge specifically — top strip fades out going up, bottom strip
// fades out going down — so the text reads as dissolving off-screen
// rather than sitting in a hard-edged box. pointer-events: none and a
// low z-index keep this from ever intercepting a click or sitting above
// real content; aria-hidden since a screen reader has nothing here
// worth announcing.
const FADE_TEXT = "I grew up in an environment that taught me to observe, stay curious, and take the time to do things right.";
const SCROLL_THRESHOLD_PX = 24;

function FadeStrip({ edge }: { edge: "top" | "bottom" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 z-0 flex justify-center overflow-hidden ${edge === "top" ? "top-0" : "bottom-0"}`}
      style={{
        height: 96,
        maskImage: `linear-gradient(to ${edge}, black, transparent)`,
        WebkitMaskImage: `linear-gradient(to ${edge}, black, transparent)`,
      }}
    >
      <p
        className="w-full max-w-[420px] px-6 text-center font-sans text-[15px] leading-6 tracking-[-0.112px] text-text-primary"
        style={{ filter: "blur(3px)", opacity: 0.16 }}
      >
        {FADE_TEXT}
      </p>
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
      <FadeStrip edge="bottom" />
      <div
        className="transition-opacity duration-500 motion-reduce:transition-none"
        style={{ opacity: scrolled ? 1 : 0 }}
      >
        <FadeStrip edge="top" />
      </div>
    </>
  );
}
