"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeContext";
import { themedIcon } from "@/components/themedIcon";
import { EASE_OUT, MOTION_REDUCE } from "@/components/motion/tokens";

// Figma 41:10445 — back to a top-pinned nav (the bottom-center pill this
// briefly shipped as is retired), and redesigned: three route segments
// now (Home/Works/Play, not just Home/Play) — "Works" points at the
// existing /work case-studies index, which had no nav entry at all
// before. "Contact" is no longer a segment inside this pill; "Get in
// touch" is its own separate pill entirely (Figma's own 96px gap between
// the two), explicitly reserved to become a real dropdown with options
// later — for now it keeps the old contact-reveal-panel behavior (the
// closest existing functionality) rather than shipping inert.
const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Works" },
  { href: "/playground", label: "Play" },
];

const CONTACT_EMAIL = "adamweber54@gmail.com";

// "Works" should still read as active from any case-study page
// (/work/beacon etc.), not just the exact /work index — the only entry
// here with real sub-routes. Home stays an exact match so it doesn't
// light up for every other route once it's the array's own "/" prefix.
function isActiveHref(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Figma 37:10089 (Nav Item states) — Default carries no fill or border at
// all (just dim text-subtle); Hover adds bg-tertiary, a shadow, and a
// border that's a shade MORE visible (border-subtle) than the already-
// active segment's own (border-disabled) — a deliberate, subtle
// distinction confirmed against the export's own two states, not a
// simplification down to one shared "elevated" look.
const navItemBase =
  "relative flex w-[66.667px] items-center justify-center gap-[3px] overflow-hidden rounded-[20px] border px-2 py-1.5 text-[14px] leading-4 tracking-[-0.112px] transition-[background-color,border-color,box-shadow,color] duration-150";
const navItemActive = "border-border-disabled bg-bg-tertiary font-medium text-text-primary shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]";
const navItemInactive =
  "border-transparent font-normal text-text-subtle hover:border-border-subtle hover:bg-bg-tertiary hover:text-text-primary hover:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]";

// The segmented-control bar and the "Get in touch" pill are both
// genuinely solid (bg-bg-default, this site's own ordinary opaque page
// background), matching Figma's own export exactly — no backdrop-blur
// despite the export listing a small 5px value: blur only has anything
// to reveal through an element that's not fully opaque, and a redundant
// one sitting on an already-solid background was the confirmed cause of
// a live-reported text-bleed bug the last time this exact mistake was
// made (see globals.css's own glass-border history). This export also
// drops the gradient "glass" border entirely in favor of a plain solid
// one (border-border-disabled) — simpler, and there's no gradient token
// on this node to reproduce even if it were wanted.
const solidPill = "border border-border-disabled bg-bg-default";

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
  // baseline dropdown behavior this had as a bottom-nav segment.
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
    // Fixed, not sticky — same reasoning as the bottom-nav version this
    // replaces: nothing here has spare ancestor height for `sticky` to
    // hold position within, so it would just scroll away with the first
    // pixel of scroll. top-6 mirrors the old bottom-6 offset, now at the
    // opposite edge.
    //
    // gap-24 (96px) is Figma's own literal gap between the segmented
    // control and the separate "Get in touch" pill — but that gap plus
    // both pills' own width comfortably exceeds a phone viewport, and
    // Figma gives no mobile variant of this node to follow instead.
    // inset-x-0 + justify-center + flex-wrap (rather than the previous
    // left-1/2 -translate-x-1/2 centering, which has no floor and pushed
    // both pills half off-screen once they no longer fit side by side)
    // keeps both pills fully on-screen at any width: they sit on one row
    // with a smaller gap once there's room (sm: 640px+), and wrap onto
    // their own centered row below that, rather than clipping.
    <div ref={rootRef} className="fixed inset-x-0 top-6 z-20 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 sm:gap-x-24">
      <div className={`relative flex items-center gap-1 overflow-hidden rounded-full p-1 ${solidPill}`}>
        {links.map((link) => {
          const active = isActiveHref(pathname, link.href);
          return (
            <Link key={link.href} href={link.href} className={`${navItemBase} ${active ? navItemActive : navItemInactive}`}>
              {link.label}
            </Link>
          );
        })}

        {/* Theme segment: both icons always visible (Figma's own two-
            state segmented control), the *inner* icon's own bg-bg-
            tertiary marking whichever theme is *current* — there's no
            "next state" to hint at since both options are always on
            screen. This whole group also gets bg-bg-tertiary + its own
            border, the same "elevated" treatment as an active nav
            segment. */}
        <div className={`relative flex items-center gap-1 overflow-hidden rounded-full border border-border-disabled bg-bg-tertiary p-0.5`}>
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

      {/* "Get in touch" — its own separate pill (Figma 41:10445), not a
          segment inside the bar. No dropdown spec exists yet (explicitly
          a follow-up), so this keeps the previous Contact segment's own
          click-to-reveal email/copy panel rather than shipping with no
          interaction at all in the meantime. */}
      <div className="relative">
        <button
          type="button"
          aria-expanded={showContact}
          onClick={() => setShowContact((s) => !s)}
          className={`rounded-full px-4 py-2.5 text-[14px] leading-4 tracking-[-0.112px] text-text-subtle transition-colors duration-150 hover:text-text-primary ${solidPill}`}
        >
          Get in touch
        </button>

        {/* Anchored to this pill's own bottom-right, dropping straight
            down — the mirror image of the old bottom-nav version's own
            panel, which opened upward from the bar's top edge. Always
            rendered so it can animate back out on close, not just
            vanish; pointer-events-none while closed keeps its reserved
            (invisible) space from intercepting a click meant for the
            page behind it. */}
        <div
          className={`absolute right-0 top-full mt-2 rounded-m border border-border-subtle p-1.5 transition-[opacity,transform] ${EASE_OUT} ${MOTION_REDUCE} ${solidPill} ${
            showContact ? "translate-y-0 scale-100 opacity-100 duration-200" : "pointer-events-none -translate-y-1 scale-95 opacity-0 duration-150"
          }`}
          style={{ transformOrigin: "top right" }}
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
      </div>
    </div>
  );
}
