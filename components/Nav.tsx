"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeContext";
import { themedIcon } from "@/components/themedIcon";
import { EASE_OUT, MOTION_REDUCE } from "@/components/motion/tokens";

// Figma 33:9345 ("Segmented Control", 276x36) — one persistent bottom-
// center bar, not the separate top-left toggle + bottom "Menu" trigger/
// panel pair this shipped with one revision ago. Three equal-width route
// segments (Home/Play/Contact) plus a two-icon theme segment, all always
// visible — no open/closed state for navigation at all anymore, only
// Contact (still not a real route, see below) toggles anything.
const links = [
  { href: "/", label: "Home" },
  { href: "/playground", label: "Play" },
];

const CONTACT_EMAIL = "adamweber54@gmail.com";

// Same pill treatment the old top nav used (bg-default/80 + heavy blur)
// for the Contact-reveal panel above the bar, which has no Figma spec of
// its own to match.
const pill = "bg-bg-default/80 backdrop-blur-[23px]";

// The segmented-control bar itself needs more than that: reported live
// (real device, not this environment's own test browser) with page text
// visibly bleeding through it, legible enough to overlap and garble the
// bar's own "Home Play Contact" labels — 80% opacity plus a blur leaves
// real text behind it too readable once backdrop-blur itself renders
// weaker than expected (a known real-device inconsistency, not something
// this environment's own testing reliably catches — see .glass-border's
// own mask-composite failure earlier for the same category of gap).
// Bumped to 95% opacity so the bar stays legible even if blur alone
// doesn't fully carry the job — closer to how solid Figma's own rendered
// reference actually looks anyway (its sampled bar background was a flat
// rgb(30), not a hazy see-through one).
const barPill = "bg-bg-default/95 backdrop-blur-[23px]";

// Figma's own Glass effect (Light: -59deg angle, 80% intensity, plus
// Refraction/Depth/Dispersion/Frost/Splay — Figma's version of Apple's
// Liquid Glass material, confirmed against its own Inspect panel) sits on
// the bar itself, not each segment individually. True refraction can't be
// replicated in CSS — this used to also try approximating the effect's
// own brightening with two full-bleed blend-mode layers (Figma's own
// codegen fallback: lighten + color-dodge), dropped after they read as
// the *whole bar* washing out unpredictably once reported live, not just
// the intended subtle lift. Blend modes render against whatever's
// actually behind them — for a fixed element sitting over arbitrary,
// constantly-scrolling page content, that's never the one static
// backdrop Figma's own single-composition render was tuned against, so
// the same two layers that looked right in one test could (and did) blow
// out over a brighter card or a denser cluster of dots elsewhere on the
// page. `pill`'s own bg-bg-default/80 + backdrop-blur (below) already
// does the actual "translucent frosted glass" job reliably, the same way
// it does for every other floating chrome element on this site — this
// just adds the one piece that's still a real, predictable CSS technique
// on top of it: the gradient border (.glass-border, see globals.css),
// since the directional light *does* produce a genuine gradient along
// the stroke even without real refraction. Individual segments (the
// active nav item, the theme-toggle group) layer their own bg-bg-tertiary
// fill and .glass-border on top of this same shared base.

const segmentBase = "relative flex w-[66.667px] items-center justify-center px-2 py-1.5 text-[14px] leading-4 tracking-[-0.112px] transition-[background-color,color] duration-150";
const segmentActive = "rounded-[20px] bg-bg-tertiary font-medium text-text-primary shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]";
const segmentInactive = "rounded-full font-normal text-text-secondary";

export default function Nav() {
  const [showContact, setShowContact] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API unavailable (permission denied, insecure context) —
      // the address is still right there as selectable text, so this just
      // silently no-ops rather than showing an error for a non-essential
      // convenience action.
    }
  };

  // Close the contact reveal on outside click and on Escape — same
  // baseline dropdown behavior the old nav's own contact toggle had.
  useEffect(() => {
    if (!showContact) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setShowContact(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowContact(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showContact]);

  return (
    // Fixed, not sticky, for the same reason as before: nothing here has
    // spare ancestor height for `sticky` to hold position within, so it
    // would just scroll away with the first pixel of scroll.
    <div ref={rootRef} className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2">
      {/* Contact reveal (Figma 324:16254's own email-and-copy row,
          unchanged) — no design was given for how "Contact" behaves in
          this new bar, so it keeps the old nav's own answer: it isn't a
          real route (no /contact page), so tapping it reveals this panel
          in place instead of navigating. Always rendered so it can
          animate back out on close, not just vanish — pointer-events-none
          while closed keeps its reserved (invisible) space from
          intercepting a click meant for the page behind it. Anchored to
          the bar's own top edge, where the two meet. */}
      <div
        className={`rounded-m border border-border-subtle p-1.5 transition-[opacity,transform] ${EASE_OUT} ${MOTION_REDUCE} ${pill} ${
          showContact ? "translate-y-0 scale-100 opacity-100 duration-200" : "pointer-events-none translate-y-1 scale-95 opacity-0 duration-150"
        }`}
        style={{ transformOrigin: "bottom center" }}
      >
        <div className="flex items-center gap-2 whitespace-nowrap">
          <p className="font-sans text-[14px] leading-6 tracking-[-0.112px] text-text-secondary">{CONTACT_EMAIL}</p>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 rounded-sm bg-bg-tertiary px-3 py-1 font-sans text-[14px] font-medium leading-4 tracking-[-0.112px] text-text-primary transition-transform duration-100 active:scale-95"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <div className={`relative flex items-center gap-1 rounded-full p-1 ${barPill}`}>
        {/* --glass-tint: the bar's own background genuinely reads lighter
            than the page behind it in Figma, not just a translucent dark
            panel blending into it — see globals.css for how that value
            was derived and why it's a flat, predictable alpha layer
            rather than the blend-mode lift this used originally. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-full bg-[var(--glass-tint)]" />
        <div aria-hidden className="glass-border" />
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setShowContact(false)}
              className={`${segmentBase} ${active ? segmentActive : segmentInactive}`}
            >
              {active && <div aria-hidden className="glass-border" />}
              {link.label}
            </Link>
          );
        })}
        <button
          type="button"
          aria-expanded={showContact}
          onClick={() => setShowContact((s) => !s)}
          className={`${segmentBase} ${showContact ? segmentActive : segmentInactive}`}
        >
          {showContact && <div aria-hidden className="glass-border" />}
          Contact
        </button>

        {/* Theme segment: both icons always visible (not a single button
            swapping between them) — Figma's own two-state segmented
            control, matching the three route segments' own look-and-feel
            rather than reusing the single-icon-button this bar replaced.
            The *inner* icon's own bg-bg-tertiary marks whichever theme is
            *current*, not which one tapping would switch to (opposite of
            the old single-button version's own icon-picking rule, since
            both options are always on screen here — there's no "next
            state" to hint at); this *outer* group also gets its own
            bg-bg-tertiary + glass-border, the same "elevated" treatment
            as the active nav segment, confirmed on a later re-fetch of
            this control (33:9540) — an earlier pass had this group with
            no fill of its own, just the border. */}
        <div className="relative flex items-center gap-1 rounded-full bg-bg-tertiary p-0.5">
          <div aria-hidden className="glass-border" />
          <button
            type="button"
            aria-label="Switch to dark mode"
            aria-pressed={theme === "dark"}
            onClick={() => theme !== "dark" && toggleTheme()}
            className={`flex items-center justify-center rounded-full p-1 transition-colors duration-150 ${theme === "dark" ? "bg-bg-tertiary" : ""}`}
          >
            <Image src="/images/home/half-moon.svg" alt="" width={16} height={16} className={themedIcon} />
          </button>
          <button
            type="button"
            aria-label="Switch to light mode"
            aria-pressed={theme === "light"}
            onClick={() => theme !== "light" && toggleTheme()}
            className={`flex items-center justify-center rounded-full p-1 transition-colors duration-150 ${theme === "light" ? "bg-bg-tertiary" : ""}`}
          >
            <Image src="/images/home/sun-light.svg" alt="" width={16} height={16} className={themedIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}
