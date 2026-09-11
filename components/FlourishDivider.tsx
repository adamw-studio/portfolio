"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { themedIcon } from "@/components/themedIcon";

// Same hand-drawn squiggle that used to sit above "Hey, I'm Adam"
// (hey-adam-flourish.svg, removed from there per live feedback — this
// component is now the asset's only use) reused as a section divider —
// confirmed against Figma 46:10661, which referenced the identical
// asset at both this position and that former heading spot, not a
// visually-similar but distinct graphic. Two instances of this
// component sit further down the page (before "What I do" and before
// "Selected works"), each below the fold on first load, so it needs to
// wait and draw in *as the user scrolls to it* rather than immediately
// on mount.
//
// That "wait for scroll" requirement is exactly what broke an earlier
// version of the (now-removed) heading flourish's own reveal
// (DrawnFlourish.tsx): gating visibility entirely behind an
// IntersectionObserver callback, hidden by default, with nothing to
// un-hide it if that callback never fired. Reported live as genuinely
// never appearing at all, not just delayed. This version keeps the
// IntersectionObserver (there's no way to know "has this specific
// element scrolled into view" from CSS alone with reliable cross-
// browser support today), but adds a hard timeout fallback: if the
// observer hasn't fired within a few seconds of mount — plenty of time
// for a real scroll, not for "never" — it reveals anyway regardless of
// intersection state. That's the actual fix for what broke last time:
// not "don't use an observer," but "never let an observer callback be
// the *only* way this becomes visible."
const FALLBACK_REVEAL_MS = 4000;

export default function FlourishDivider() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- next/image forwards ref to the underlying <img>, whose exact element type isn't exported
  const ref = useRef<any>(null);
  const [revealed, setRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    updateMotion();
    motionQuery.addEventListener("change", updateMotion);
    return () => motionQuery.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRevealed(true);
      return;
    }
    const el = ref.current as HTMLElement | null;
    if (!el || typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    const fallback = setTimeout(() => setRevealed(true), FALLBACK_REVEAL_MS);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [reducedMotion]);

  return (
    <div className="flex w-full justify-center">
      <Image
        ref={ref}
        src="/images/home/hey-adam-flourish.svg"
        alt=""
        width={75}
        height={5}
        className={themedIcon}
        style={{
          clipPath: revealed ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          transition: reducedMotion ? undefined : "clip-path 800ms cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      />
    </div>
  );
}
