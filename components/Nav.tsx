"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeContext";
import { themedIcon } from "@/components/themedIcon";

// Figma 41:10445 — back to a top-pinned nav (the bottom-center pill this
// briefly shipped as is retired).
//
// Two segments now (Home/Play), not three — Figma 51:10930's own export
// of this nav drops "Works" outright, confirmed live rather than assumed
// (it could have just been an artifact of that particular frame). A
// case-study page still reads as "on Works" via its own back-link, not
// this nav; SelectedWorks.tsx's own #selected-works id is left in place
// as a legitimate target for that and any other future deep link, even
// with no nav entry pointing at it anymore.
//
// Just the segmented control now — no logo, no separate "Get in touch"
// pill either side of it (both removed on live direction). Nothing here
// was reused only by them (the contact-reveal panel, its copy-to-
// clipboard state, the logo's own solidPill wrapper) — all of it is
// gone with them rather than left dead in the file.
const links: { href: string; label: string; activeMatch: string }[] = [
  { href: "/", label: "Home", activeMatch: "/" },
  { href: "/playground", label: "Play", activeMatch: "/playground" },
];

// Generic prefix match, kept even though neither current entry actually
// needs the sub-route case now that "Works" is gone (it used to be the
// one with real sub-routes, /work/beacon etc.) — Home stays an exact
// match so it doesn't light up for every other route once it's the
// array's own "/" prefix, and this still generalizes correctly for
// whatever nav entries come next.
function isActiveHref(pathname: string, activeMatch: string) {
  if (activeMatch === "/") return pathname === "/";
  return pathname === activeMatch || pathname.startsWith(`${activeMatch}/`);
}

// Figma 57:24571 (Nav Item states) — Default carries no fill or border at
// all (just dim text-subtle); Hover adds bg-tertiary and a border that's
// a shade MORE visible (border-subtle) than the already-active segment's
// own (border-disabled) — a deliberate, subtle distinction confirmed
// against the export's own states, not a simplification down to one
// shared "elevated" look. No shadow on either state anymore — an earlier
// fetch of this same component (37:10089) had one on both Active and
// Hover; this later, more specific fetch of just the nav item drops it
// outright, confirmed live rather than assumed dropped by accident.
const navItemBase =
  "relative flex w-[66.667px] items-center justify-center gap-[3px] overflow-hidden rounded-[20px] border px-2 py-1.5 text-[14px] leading-4 tracking-[-0.112px] transition-[background-color,border-color,color] duration-150";
const navItemActive = "border-border-disabled bg-bg-tertiary font-medium text-text-primary";
const navItemInactive = "border-transparent font-normal text-text-subtle hover:border-border-subtle hover:bg-bg-tertiary hover:text-text-primary";

// The segmented-control bar is genuinely solid (bg-bg-default, this
// site's own ordinary opaque page background), matching Figma's own
// export exactly — no backdrop-blur despite the export listing a small
// 5px value: blur only has anything to reveal through an element that's
// not fully opaque, and a redundant one sitting on an already-solid
// background was the confirmed cause of a live-reported text-bleed bug
// the last time this exact mistake was made (see globals.css's own
// glass-border history). This export also drops the gradient "glass"
// border entirely in favor of a plain solid one (border-border-disabled)
// — simpler, and there's no gradient token on this node to reproduce
// even if it were wanted.
const solidPill = "border border-border-disabled bg-bg-default";

export default function Nav() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    // Fixed, not sticky — same reasoning as the bottom-nav version this
    // replaces: nothing here has spare ancestor height for `sticky` to
    // hold position within, so it would just scroll away with the first
    // pixel of scroll. top-6 mirrors the old bottom-6 offset, now at the
    // opposite edge.
    <div className="fixed inset-x-0 top-6 z-20 flex justify-center px-4">
      <div className={`relative flex items-center gap-1 overflow-hidden rounded-full p-1 ${solidPill}`}>
        {links.map((link) => {
          const active = isActiveHref(pathname, link.activeMatch);
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
    </div>
  );
}
