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

// Same pill treatment the old top nav used (border-subtle + bg-default/80
// + heavy blur) for the bar itself — still the site's one "floats above
// the page" language, just carried by a single element again now that
// everything lives in one row.
const pill = "border border-border-subtle bg-bg-default/80 backdrop-blur-[23px]";

// Figma's own active-segment treatment: a 0.5px near-white border, a soft
// drop shadow, and two full-bleed overlays in different blend modes
// (lighten + color-dodge) layered on top of whatever's behind the segment
// — together they read as a glassy, catching-the-light highlight rather
// than a flat fill. Kept as the literal fixed rgba/blend values Figma
// exports (not mapped to this site's light/dark border-subtle token the
// way the outer pill is): unlike a plain border or background tint, this
// specific "glass catching light" effect isn't the kind of thing that's
// supposed to invert for a light background — it's material, not content
// color. Text itself *is* a real token either way (text-text-primary),
// same in both states — Figma only differentiates active/inactive here by
// weight and this glass treatment, not by dimming the inactive label.
function ActiveSegmentGlass() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[20px]">
      <div className="absolute inset-0 rounded-[20px] bg-[rgba(255,255,255,0.06)] mix-blend-lighten" />
      <div className="absolute inset-0 rounded-[20px] bg-[rgba(94,94,94,0.18)] mix-blend-color-dodge" />
    </div>
  );
}

const segmentBase = "relative flex w-[66.667px] items-center justify-center px-2 py-1.5 text-[14px] leading-4 tracking-[-0.112px] text-text-primary transition-[background-color] duration-150";
const segmentActive = "rounded-[20px] border-[0.5px] border-white/40 font-medium shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]";
const segmentInactive = "rounded-full font-normal";

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
        className={`rounded-m p-1.5 transition-[opacity,transform] ${EASE_OUT} ${MOTION_REDUCE} ${pill} ${
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

      <div className={`flex items-center gap-1 rounded-full p-1 ${pill}`}>
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setShowContact(false)}
              className={`${segmentBase} ${active ? segmentActive : segmentInactive}`}
            >
              {active && <ActiveSegmentGlass />}
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
          {showContact && <ActiveSegmentGlass />}
          Contact
        </button>

        {/* Theme segment: both icons always visible (not a single button
            swapping between them) — Figma's own two-state segmented
            control, matching the three route segments' own look-and-feel
            rather than reusing the single-icon-button this bar replaced.
            bg-bg-tertiary marks whichever theme is *current*, not which
            one tapping would switch to (opposite of the old single-button
            version's own icon-picking rule, since both options are always
            on screen here — there's no "next state" to hint at). */}
        <div className="flex items-center gap-1 rounded-full border border-border-subtle p-0.5">
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
