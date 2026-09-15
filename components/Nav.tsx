"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeContext";
import { themedIcon } from "@/components/themedIcon";
import { NavDateWidget } from "@/components/NavDateWidget";

// Figma 175:4031 (light) / 175:3994 (dark) — a full-bleed, edge-to-edge
// top bar now, not the floating centered pill (41:10445) this replaces:
// that pill's own solid bg-bg-default + rounded-full + inset-x px-4
// treatment is gone outright, along with the single shared border that
// used to wrap the nav items AND the theme toggle together as one
// group. This export's own three groups — a date widget, the nav items,
// the theme toggle — sit independently across the bar's own full width
// instead, each its own flex-1/shrink-0 slot (see the outer flex
// below), not one pill.
//
// New in this fetch: NavDateWidget on the left (nothing occupied this
// slot before) — see that file's own doc comment for why it shows the
// real current date rather than Figma's own literal "Monday, 14
// September" text.
const links: { href: string; label: string; activeMatch: string }[] = [
  { href: "/", label: "Home", activeMatch: "/" },
  // "Playground," not "Play" — this export's own text, a real content
  // change from the pill version's abbreviated label, not a typo left
  // uncorrected.
  { href: "/playground", label: "Playground", activeMatch: "/playground" },
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

// rounded-full — re-confirmed against a fresh re-fetch of this same
// node: an earlier fetch had these at rounded-sm (this project's own
// --radius-sm, 8px), corrected live ("corners should be rounded") once
// the file itself changed back to a full pill, the same corner
// treatment the old floating-pill nav always used.
//
// px-3.5 (14px) on the active state, not the inactive state's own
// px-2 (8px) — Figma's own export gives the *active* "Home" instance an
// explicit 66.667px width, wider than "Home" actually needs at 8px
// padding (confirmed live: it measures 54px at 8px padding, not
// 66.667). A first pass here tried reproducing that gap as a bare
// min-w-[66.667px] instead of real padding, which happened to fix
// "Home" (its own text is short enough to hit that floor) but did
// nothing for "Playground" once *it* was the active item — its own
// text is already wider than 66.667px at 8px padding, so the min-width
// floor never engaged and it kept rendering at the plain inactive
// padding, reported live as still wrong. The fix is the padding itself,
// not a width floor that only happens to help short labels: solving
// 54px-wide "Home" at 8px padding for the padding that actually
// produces Figma's own 66.667px (66.667 = "Home"'s own 38.43px-wide
// text + 2×padding) gives ~14px — Tailwind's px-3.5 — a real, symmetric
// boost that widens *either* item's own active pill by the same
// amount, "Playground" included, rather than a floor only "Home" ever
// reaches.
const navItemBase =
  "relative flex items-center justify-center gap-[3px] overflow-hidden rounded-full border py-1.5 text-[14px] leading-4 tracking-[-0.112px] transition-[background-color,border-color,padding,color] duration-150";
const navItemActive = "px-3.5 border-border-disabled bg-bg-tertiary font-medium text-text-primary";
const navItemInactive = "px-2 border-transparent font-normal text-text-subtle hover:border-border-subtle hover:bg-bg-tertiary hover:text-text-primary";

// Figma 177:4238 (light) / 177:4203 (dark) / 178:4288 (mobile) — a fresh
// re-fetch of the case-study variant of this same component, superseding
// an earlier one (164:2274) this project name label was first built
// from: that export had this rendered like an (unstyled) active segment
// — text-primary, regular weight, no background. All three of this
// newer fetch agree on something different: text-subtle (dimmed) at
// Medium weight, and no pill/border/background at all in any of the
// three — a plain, quiet label now, closer to a breadcrumb than a nav
// segment (which tracks: unlike Home/Playground, this was never really
// a toggleable "active" state — the current page always *is* this
// project). px-2 py-1.5 kept even though nothing paints on it — the
// light fetch's own node still reserves that same padding as an
// (invisible) box, which keeps this label's own line vertically
// centered against Home/Playground's real padded boxes instead of
// sitting a few px off from them.
const projectLabel = "flex items-center justify-center gap-[3px] rounded-full px-2 py-1.5 text-[14px] font-medium leading-4 tracking-[-0.112px] text-text-subtle";

// Figma 325:241 ("Back Button"), now folded directly into Nav.tsx rather
// than staying its own always-`fixed`, independently-positioned
// component (components/BackButton.tsx, deleted) — this same re-fetch
// (177:4238/177:4203/178:4288) moves the back button *into* the nav bar
// itself, sitting in the same flex row as the date widget rather than
// floating over the page on its own. That's a real layout change, not
// just a restyle: the old component had to reconstruct the content
// column's own left edge by hand (`columnWidth` prop, a `left: max(...)`
// formula) purely because it was positioned independently of
// everything else on the bar; once it's a normal flex child here, the
// bar's own flex layout places it for free and none of that math is
// needed anymore.
const backButtonClasses =
  "flex shrink-0 items-center justify-center rounded-full border border-border-subtle px-2.5 py-1.5 transition-transform duration-100 active:scale-95";

export default function Nav({ label }: { label?: string } = {}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    // Fixed, not sticky — same reasoning as before: nothing here has
    // spare ancestor height for `sticky` to hold position within.
    // top-0/inset-x-0, not top-6/px-4: this bar now runs flush to the
    // viewport's own top edge and both side edges, not inset from them
    // the way the floating pill was. bg-bg-default/60 — re-confirmed
    // against a fresh re-fetch of the dark variant: its own literal
    // background moved from an earlier rgba(21,21,21,0.6) (a genuinely
    // distinct nav-only surface, which is why this originally lived as
    // its own --nav-bg custom property) to rgba(13,13,13,0.6), which
    // *does* exactly match --color-bg-default here — and light's own
    // rgba(244,244,244,0.6) always did too. Both themes now cleanly
    // reduce to this token at 60% opacity, so the one-off --nav-bg
    // variable is gone rather than kept as a second, now-redundant
    // source of truth alongside it.
    // backdrop-blur-[4px], not the bare backdrop-blur-sm utility —
    // Tailwind v4's own backdrop-blur scale starts at 8px for "sm" (no
    // smaller named step below it), confirmed live against the computed
    // style rather than assumed from memory of v3's scale, which had a
    // 4px "sm". An arbitrary value is what actually matches Figma's own
    // literal backdrop-blur-[4px] here.
    <div className="fixed inset-x-0 top-0 z-20 flex items-center gap-4 bg-bg-default/60 px-6 py-3 backdrop-blur-[4px]">
      {/* Left slot: flex-1 so it grows/shrinks to fill exactly as much
          space as the mirrored right slot, which is what actually keeps
          the center nav-items group sitting at the bar's true horizontal
          center regardless of how wide the date widget or theme toggle
          naturally render — the same flex-[1_0_0]-on-both-ends technique
          Figma's own export uses, rather than a fixed pixel gap that
          only happened to work at one specific canvas width.
          gap-3 (12px): the back button's own gap from the date widget
          next to it, matching this fetch's own Frame 2147204721.
          NavDateWidget itself is `hidden sm:flex` when `label` is set
          (case-study pages only), not the earlier `invisible lg:visible`
          this file used before the back button moved into this same
          flex row: that older trick was working around the OLD back
          button's own `fixed` position colliding with this widget below
          a certain width; now that both live in one normal flex row
          there's nothing left to collide with — this hides the widget
          below `sm` because Figma's own mobile export (178:4288) drops
          it outright at that width, leaving only the back button in
          this slot, not because of any remaining overlap risk. The home
          page's own Nav (no `label`, no back button competing for this
          slot) keeps its widget visible at every width — Figma's own
          mobile export is specifically the *case-study* variant, not
          the site index nav, so there's no reason to shrink that one
          too. */}
      <div className="flex flex-1 items-center gap-3">
        {label && (
          <Link href="/" aria-label="Back to home" className={backButtonClasses}>
            <Image src="/images/home/work-back-arrow.svg" alt="" width={16} height={16} className={themedIcon} />
          </Link>
        )}
        <div className={label ? "hidden sm:flex" : "flex"}>
          <NavDateWidget />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {label ? (
          <span className={projectLabel}>{label}</span>
        ) : (
          links.map((link) => {
            const active = isActiveHref(pathname, link.activeMatch);
            return (
              <Link key={link.href} href={link.href} className={`${navItemBase} ${active ? navItemActive : navItemInactive}`}>
                {link.label}
              </Link>
            );
          })
        )}
      </div>

      <div className="flex flex-1 items-center justify-end">
        {/* Theme segment: both icons always visible (Figma's own two-
            state segmented control), the *inner* icon's own bg-bg-
            tertiary marking whichever theme is *current*. border-subtle
            on the outer wrapper now, not border-disabled — this export's
            own value, a shade more visible than the pill version's —
            and no bg-bg-tertiary on the outer wrapper itself either
            (only the active inner Mode Item carries that, unchanged). */}
        <div className="relative flex items-center gap-1 overflow-hidden rounded-full border border-border-subtle p-0.5">
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
