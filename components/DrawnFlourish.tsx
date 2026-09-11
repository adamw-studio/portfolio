"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { themedIcon } from "@/components/themedIcon";

// Same curve as components/motion/tokens.ts's own EASE_OUT — that one's
// packaged as a Tailwind arbitrary-value class ("ease-[cubic-bezier(...)]")
// for use in a className string; this needs the raw cubic-bezier() value
// instead, for an inline `transition` string (AboutCardStack.tsx's own
// EASE_OUT constant is the same raw-string pattern, for the same reason).
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

// The flourish above "Hey, I'm Adam" (public/images/home/hey-adam-
// flourish.svg) is a single, dense *filled* path — a traced brush-stroke
// texture (thousands of tiny disconnected fragment shapes, confirmed by
// inspecting the raw file directly: fill="#F4F4F4" fill-opacity="0.1",
// no stroke anywhere), not one continuous stroked line. That rules out
// the classic stroke-dasharray/stroke-dashoffset "path draw" technique —
// there's no stroke for it to animate, and no single continuous path to
// measure a meaningful length from. A left-to-right clip-path wipe reads
// the same way an audience actually cares about ("the line appearing as
// if drawn"), without depending on the asset's own internal path
// structure, and works on the image exactly as it already ships — no
// need to inline ~200KB of raw SVG path data into the DOM to reach its
// individual sub-shapes.
//
// A small dedicated client component (rather than making the whole, so
// far server-rendered, page.tsx a client component) — same shape as
// AboutCardStack's own IntersectionObserver-gated, one-time mount
// reveal, reused here for consistency rather than inventing a second
// pattern for what's functionally the same kind of entrance.
export default function DrawnFlourish() {
  const ref = useRef<HTMLDivElement>(null);
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
      // Syncing from the reducedMotion signal, known only after mount —
      // same justified exception AboutCardStack's own identical effect
      // uses.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRevealed(true);
      return;
    }
    const el = ref.current;
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
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      className="inline-block"
      style={{
        clipPath: revealed ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
        transition: reducedMotion ? undefined : `clip-path 800ms ${EASE_OUT}`,
      }}
    >
      <Image src="/images/home/hey-adam-flourish.svg" alt="" width={75} height={5} className={themedIcon} />
    </div>
  );
}
