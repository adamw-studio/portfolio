"use client";

import { useEffect, useState, type ReactNode } from "react";

const SESSION_KEY = "aw-intro-seen";
// One 2s cycle (matching globals.css's page-loading-bounce/page-loading-spin
// exactly) reads as a flash, not an animation — gone before it's actually
// registered. Three full loops gives it enough time to actually be seen
// before the site reveals.
const LOOP_COUNT = 3;
const LOOP_MS = 2000 * LOOP_COUNT;

/**
 * Full-screen splash shown once per browser session before the site
 * itself appears — Figma 21:8014 ("Page Loading"). Wraps the whole app in
 * layout.tsx: `children` mount underneath it immediately (not after the
 * splash finishes), so when the splash clears the site is already
 * rendered and appears at once, with no additional load delay of its own.
 *
 * "Hey, I'm [triangle]dam" in real text (font-serif, matching the
 * sitewide `heading` token's own Gentium Basic/tracking, just scaled up
 * for a splash) rather than the pre-rendered vector-outline SVG Figma
 * exports for this frame — that SVG traces individual letterforms as
 * opaque paths, which would ship real copy as an unreadable, unselectable
 * image for no visual gain over just using the same font the rest of the
 * site already loads.
 *
 * Hardcodes the `.theme-dark` class on its own root rather than reading
 * ThemeContext: Figma's own export is dark-only here, this renders before
 * ThemeProvider's stored-preference correction has necessarily run, and
 * dark is this site's own intentional default anyway (see
 * ThemeContext.tsx) — so there's no real "wrong theme" case to guard
 * against.
 *
 * Session-scoped, not per-page-load: same sessionStorage pattern (and the
 * same justified early-return-then-correct-in-effect to avoid a hydration
 * mismatch — SSR and the client's first render both agree on "showing"
 * the splash) as PasswordGate's own unlock state, so repeat navigation
 * within one visit doesn't replay a multi-second intro every time.
 */
export function PageLoading({ children }: { children: ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem(SESSION_KEY) === "seen";
    } catch {
      // sessionStorage unavailable (private mode, disabled storage) — the
      // splash just plays every visit instead of erroring.
    }

    const markSeen = () => {
      try {
        window.sessionStorage.setItem(SESSION_KEY, "seen");
      } catch {
        // Persistence is a nice-to-have; the reveal below still happens
        // either way, it just won't be remembered for next time.
      }
    };

    // Reduced motion skips the intro entirely rather than playing a
    // static-but-delayed version of it — the animation is the entire
    // point of this screen, so for someone who's opted out of motion
    // there's nothing left for it to hold the site behind.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (alreadySeen || reduceMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowSplash(false);
      markSeen();
      return;
    }

    const timer = setTimeout(() => {
      setShowSplash(false);
      markSeen();
    }, LOOP_MS);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && (
        <div aria-hidden className="fixed inset-0 z-[9999]">
          {/* page-dots (globals.css) sets its own position: relative via a
              plain, un-layered rule — combined with Tailwind's `fixed` on
              the *same* element, that plain rule wins regardless of source
              order (un-layered CSS always beats anything inside Tailwind's
              `@layer utilities`), silently downgrading it back to a normal
              flow element. Splitting the dot texture onto this inner div
              keeps `fixed inset-0` on the outer one uncontested. */}
          <div className="page-dots theme-dark flex h-full w-full items-center justify-center bg-bg-default">
            <div className="flex items-end font-serif text-[32px] leading-10 tracking-[-1.3px] text-text-primary">
              <span>Hey, I’m&nbsp;</span>
              {/* Figma 21:8280/21:8332 — the triangle stands in for the "A",
                  the dot sits where its counter/accent would go. Only the
                  triangle animates (see globals.css); the dot is genuinely
                  static in Figma's own motion data, not an oversight. Split
                  across two nested spans (bounce on the outer, spin on the
                  inner) rather than one combined transform because the two
                  axes use different Figma-specified easing curves (linear
                  vertical bounce, a symmetric cubic-bezier spin) that would
                  collide if packed into a single element's `transform` —
                  nesting composes them the same way a combined transform
                  would, since the inner span's rotation happens purely
                  around its own center regardless of where the outer one
                  has moved it. */}
              <span className="relative inline-block h-[34.5px] w-[39.837px]">
                <span className="page-loading-bounce absolute inset-0 inline-block">
                  <span className="page-loading-spin block h-full w-full">
                    <svg viewBox="0 0 39.8372 34.5" width="39.8372" height="34.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.9186 0L39.8372 34.5H0L19.9186 0Z" fill="currentColor" />
                    </svg>
                  </span>
                </span>
                <span className="absolute left-[16px] top-[19px] size-[7px] rounded-full bg-bg-default" />
              </span>
              <span>dam</span>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
