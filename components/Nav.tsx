"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeContext";
import { themedIcon } from "@/components/themedIcon";
import { EASE_OUT, EASE_IN_OUT, MOTION_REDUCE } from "@/components/motion/tokens";

// MenuItemV2 (Figma 239:13579, the real "Opened" nav) — revised since the
// version this originally replaced (239:12785): a single row of 3 links,
// each with its own real icon, not the 2x2 grid of 4 generic dot+bar
// cells this shipped with before. "Selected works" is dropped from this
// row entirely — Figma's own node tree only ever defines 3 Menu Item V2
// instances here, not a cropped 4th, so that's an intentional design
// change, not an oversight to correct for.
//
// "Get in touch" isn't a real route (no /contact page exists — Figma
// 324:16254 shows exactly what it's for instead: clicking it reveals the
// email-and-copy row below these three, in place, rather than navigating
// anywhere). Kept in this same array/shape as Home and Playground since
// visually it's still one of the three equal cells in that row; Nav's
// render logic below branches it to a toggle button instead of a Link.
const links = [
  { href: "/", label: "Home", icon: "/images/home/nav-home.svg" },
  { href: "/playground", label: "Playground", icon: "/images/home/nav-playground.svg" },
  { href: "/contact", label: "Get in touch", icon: "/images/home/nav-contact.svg" },
];

const CONTACT_EMAIL = "adamweber54@gmail.com";

// Inset shadow instead of a real border: Figma's stroke doesn't consume
// layout space, but a CSS border always would on an explicitly-sized box
// (see typography.ts's insetBorder for the same fix applied elsewhere).
// Explicit size-6 (24px) matches Figma's icon-button frame exactly:
// p-1 (4px) + the 16px icon + p-1 (4px) = 24px, with zero extra from the
// border since it's inset.
//
// active:scale-95: these buttons had zero press feedback — a tap just sat
// there until its click handler's side effect (theme swap, menu open)
// showed up, with nothing confirming the interface felt the press itself.
// transform + a 100ms transition keeps it on the cheap, GPU-only path.
const iconButton =
  "flex size-6 items-center justify-center rounded-full p-1 shadow-[inset_0_0_0_1px_var(--color-border-subtle)] transition-transform duration-100 active:scale-95";

export default function Nav() {
  const [open, setOpen] = useState(false);
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

  // The contact row shouldn't still be expanded the next time the nav
  // reopens — reset it (and any pending "Copied!" state) wherever the
  // menu actually closes, rather than reacting to `open` after the fact
  // in an effect (which would just be routing a state change that's
  // already known at the moment it happens through an extra render).
  const closeNav = () => {
    setOpen(false);
    setShowContact(false);
    setCopied(false);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
  };

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

  // Close on outside click and on Escape — baseline behavior for any
  // dropdown menu, not just decoration.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) closeNav();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNav();
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    // Nav is a small, self-sized pill — not a full-width bar. Figma
    // centers it on the *page* (not the 688px content column) but the two
    // coincide at the viewport's own center, which is what left-1/2
    // -translate-x-1/2 self-centers against here.
    //
    // Fixed, not sticky: `position: sticky` only sticks for as long as
    // its own containing block still has height left to give — and this
    // component's wrapper in page.tsx exists *just* to hold the nav (24px
    // padding + this pill's own height, nothing else), so there's no
    // extra room for it to occupy and it would immediately scroll away
    // with the very first pixel of scroll instead of staying put. Fixed
    // anchors to the viewport instead, sidestepping that entirely — see
    // page.tsx for the compensating top padding this needs now that the
    // nav no longer takes up any space in normal document flow.
    <div
      ref={rootRef}
      // One bordered/rounded container for the whole thing, not two
      // separately-bordered pieces stacked with a gap between them (an
      // earlier revision of this file did that — a box-shadow inset
      // border on the top pill meeting a real border on a separate
      // dropdown box below it, which never quite lines up pixel-for-pixel
      // at the seam and reads as a small gap in the border there). Figma's
      // own node tree confirms this: a single outer frame with one
      // border, containing the icon row and the menu row as plain
      // children with no border of their own — matched here by putting
      // width/radius AND the menu's height reveal on this one element via
      // nested grid-rows (first row a fixed auto height for the icon row,
      // second row 0fr/1fr for the collapsible menu), instead of splitting
      // that across two elements.
      //
      // No base `w-fit` here — it was left over from when this element's
      // only job was centering, before it also carried the width itself.
      // With an explicit w-[160px]/w-[336px] always present, a `w-fit`
      // class card sitting alongside it is a genuine conflict, not a
      // harmless default: both set the same `width` property, so whichever
      // Tailwind happens to emit later in its generated stylesheet wins
      // regardless of source order in this string — and w-fit won,
      // sizing the closed pill to fit its *content* instead of 160px,
      // which includes the still-mounted (just 0-height) menu row's much
      // wider natural width, since fit-content sizing considers every grid
      // row's preferred width regardless of that row's own height.
      //
      // EASE_IN_OUT, not EASE_OUT — this pill isn't entering or exiting,
      // it's reshaping in place (staying put, changing width/radius), and
      // ease-out's fast-start/slow-finish made that read as a "jump" right
      // at the start of the open animation followed by a barely-visible
      // crawl, not a natural, even morph. ease-in-out ramps up and back
      // down instead, which is the correct curve for on-screen morphing
      // per the same entering-vs-morphing distinction that gives the
      // content fade below (a genuine entrance) its own EASE_OUT.
      //
      // duration-300 opening / duration-200 closing — not the same speed
      // both ways. Deliberate asymmetry ("release should always be
      // snappy"): opening is the reveal the user is deciding to look at,
      // closing is just getting out of the way, so it resolves faster.
      // Duration lives entirely inside the open/closed branches below,
      // never as a shared base class next to it — the same reason
      // width/rounded aren't split into a base+override pair elsewhere in
      // this file: two classes setting the same property, and whichever
      // Tailwind emits later in its stylesheet wins, not this ternary.
      //
      // rounded-[18px], not rounded-full, at rest: Tailwind's rounded-full
      // is border-radius:9999px, not 50% — and animating border-radius
      // from 9999px down to the open state's 16px interpolates that raw
      // number linearly, while the *rendered* corner stays clamped at the
      // pill's actual max radius (18px, half its 36px height) for over
      // 99.9% of that numeric range. Nothing visibly moves for nearly the
      // whole transition, then the interpolated value finally dips below
      // 18px in its last fraction of a percent and the corner snaps to
      // its final shape almost instantly — the exact "border jumps at the
      // end" this was. 18px *is* fully rounded on a 36px-tall pill, so
      // this looks identical at rest and now interpolates smoothly and
      // proportionally down to 16px instead.
      //
      // w-[400px], rounded-[16px]: Figma 346:1573 ("Navigation / Opened",
      // the current canonical spec — supersedes the 336px/12px this was
      // first built against from an older/looser reference). rounded-[16px]
      // as a literal value, not rounded-lg/--radius-lg (12px) — this one
      // genuinely is a flat 16px in that node, not the same design token
      // the menu items below reuse at a smaller size.
      className={`fixed left-1/2 top-6 z-20 grid -translate-x-1/2 overflow-hidden border border-border-subtle bg-bg-default/80 backdrop-blur-[23px] transition-[width,border-radius,grid-template-rows] ${EASE_IN_OUT} ${MOTION_REDUCE} ${
          open ? "w-[400px] max-w-[calc(100vw-32px)] grid-rows-[auto_1fr] rounded-[16px] duration-300" : "w-[160px] grid-rows-[auto_0fr] rounded-[18px] duration-200"
      }`}
    >
      <div className="flex max-w-full items-center justify-between p-1.5">
        {/* Icon shows what you'll switch *to*, not the current theme (Figma
            239:13579 shows sun-light on the dark-theme nav; the real light
            page, 239:12856, shows half-moon) — opposite of this button's
            first guess before the real designs were fetched. themedIcon
            inverts these single-color #F4F4F4 exports to #0D0D0D-ish in
            light mode — see themedIcon.ts for why that's more reliable
            than Figma's own per-theme icon exports here. */}
        <button
          type="button"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          onClick={toggleTheme}
          className={iconButton}
        >
          <Image
            src={theme === "dark" ? "/images/home/sun-light.svg" : "/images/home/half-moon.svg"}
            alt=""
            width={16}
            height={16}
            className={themedIcon}
          />
        </button>
        <Image src="/images/home/logo-mark-small.svg" alt="Adam Weber" width={36} height={12} className={themedIcon} />
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => (open ? closeNav() : setOpen(true))}
          className={iconButton}
        >
          <Image src="/images/home/menu.svg" alt="" width={16} height={16} className={themedIcon} />
        </button>
      </div>

      {/* The 0fr/1fr row above (not this div's own height) is what
          animates open/closed — this only needs its own overflow-hidden
          so its content doesn't paint outside a still-collapsing 0fr row. */}
      <div className="overflow-hidden">
        <nav
          // The container's own height/width reveal, alone, still read as
          // a little mechanical: the links were simply *there* the instant
          // there was room, no transition of their own. Fading + easing
          // them up slightly gives the two a visible lead-follow
          // relationship — panel resolves, then content settles in —
          // instead of both happening identically in lockstep.
          //
          // The delay+duration pair is tuned to *finish* alongside the
          // container, not just start after it: opening, delay-100 +
          // duration-200 lands at 300ms, exactly the container's own
          // open duration above — content used to keep fading for 50ms
          // after the shape had already stopped moving, which read as two
          // uncoordinated animations instead of one. Closing has no
          // delay and a quick 100ms fade — content should be out of the
          // way well before the (already-snappier, 200ms) container
          // finishes shrinking, not still visible while it narrows around it.
          //
          // Every open/closed pair below is fully conditional, never a
          // base class plus an override for the same property (translate,
          // opacity, duration, delay) — that's the exact w-fit-vs-w-[160px]
          // trap fixed elsewhere in this file: two classes setting the
          // same property both present at once leaves the winner up to
          // Tailwind's generated stylesheet order, not this ternary.
          className={`flex w-full items-center gap-1 overflow-hidden p-2 max-[359px]:gap-0.5 max-[359px]:p-1 transition-[opacity,translate] ${EASE_OUT} ${MOTION_REDUCE} ${
            open ? "translate-y-0 opacity-100 duration-200 delay-100" : "translate-y-[-4px] opacity-0 duration-100"
          }`}
        >
          {links.map((link) => {
            const isContact = link.href === "/contact";
            // Home/Playground are "active" by route; the contact toggle
            // has no route of its own, so it borrows the same highlight
            // for its own open/closed state instead — visually it's still
            // just "is this item currently the one in effect".
            const active = isContact ? showContact : pathname === link.href;
            // Same classes either way — Home/Playground render as a real
            // Link (they navigate), "Get in touch" as a toggle button (it
            // reveals the row below instead, see the links array's own
            // comment on why). Kept as one shared string rather than two
            // near-duplicates that could quietly drift apart.
            //
            // backdrop-blur-[12px] on every item (not just the active
            // one) matches Figma's own markup exactly — a no-op on the
            // inactive, bg-less items (nothing behind them to blur),
            // same harmless-when-unused pattern as elsewhere on this
            // site rather than a special case to carve out here.
            //
            // active:scale-[0.97] + transition-transform alongside the
            // existing transition-colors: same press-feedback rule as
            // iconButton above — every pressable element here should
            // confirm a tap, not just the two icon buttons.
            // gap-2/px-2 is the Figma-accurate spacing (checked, comfortably
            // fits down to ~360px-wide phones). Below that — the narrowest
            // real devices still in use — "Get in touch" is long enough
            // that the 3 equal flex-1 cells no longer have room for it
            // without clipping the label past the pill's own edge; the
            // max-[359px]: pair tightens spacing just enough to keep all
            // 3 labels on one line and fully visible at 320px, without
            // touching the roomier spacing everywhere else.
            //
            // rounded-m (10px), not rounded-sm — Figma 249:14311's Menu
            // Item V2 states use --radius-m specifically, a size up from
            // what this shipped with. `group` is what lets the icon/label
            // below react to hovering the item as a whole, not just the
            // background: Figma's own Hover state isn't just a tertiary
            // fill, the icon and label both go full-strength text-primary
            // too, exactly matching Selected — this item only ever looks
            // "different" between those two states in *which* trigger is
            // holding it there (a real hover vs. being the current route),
            // never in appearance.
            //
            // backdrop-blur only travels together with an actual
            // background, never applied unconditionally — bg-tertiary is
            // a near-invisible 5% tint (see globals.css), so blurring
            // *something* behind it is how that tint reads as a frosted
            // highlight instead of nothing at all. But blur has a visible
            // effect of its own even with zero background color: it still
            // samples and softens whatever's behind it (this page's dotted
            // backdrop), which read as a hazy rounded-rect "background" on
            // every inactive item, all the time — exactly the bug this was
            // meant to avoid, just via a different property than the one
            // being watched. Gating it onto the same branch as the
            // background it exists to serve fixes both at once.
            const itemClassName = `group flex flex-1 items-center justify-center gap-2 rounded-m px-2 py-1.5 max-[359px]:gap-1 max-[359px]:px-1 transition-[background-color,transform] duration-150 active:scale-[0.97] ${
              active ? "bg-bg-tertiary backdrop-blur-[12px]" : "hover:bg-bg-tertiary hover:backdrop-blur-[12px]"
            }`;
            const content = (
              <>
                <Image
                  src={link.icon}
                  alt=""
                  width={16}
                  height={16}
                  className={`shrink-0 ${themedIcon} ${active ? "" : "opacity-70 group-hover:opacity-100"}`}
                />
                <span
                  className={`whitespace-nowrap text-[14px] leading-4 tracking-[-0.112px] ${
                    active ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary"
                  }`}
                >
                  {link.label}
                </span>
              </>
            );

            if (isContact) {
              return (
                <button
                  key={link.href}
                  type="button"
                  aria-expanded={showContact}
                  onClick={() => setShowContact((s) => !s)}
                  className={itemClassName}
                >
                  {content}
                </button>
              );
            }
            return (
              <Link key={link.href} href={link.href} onClick={closeNav} className={itemClassName}>
                {content}
              </Link>
            );
          })}
        </nav>

        {/* Figma 324:16254 — revealed by the "Get in touch" toggle above,
            independent of (nested inside, but not driven by) the menu
            row's own 0fr/1fr reveal: `open` alone already fully expands
            this wrapper, so this needs its own grid-rows pair keyed off
            showContact instead, or it would just pop open/closed with no
            transition of its own. EASE_IN_OUT for the same reason the
            outer pill's own width/radius morph uses it (a shape resizing
            in place); the row's own content still gets an EASE_OUT
            fade+translate, same as the menu row above — this is a genuine
            entrance, not a reshape. */}
        <div
          className={`grid transition-[grid-template-rows] ${EASE_IN_OUT} ${MOTION_REDUCE} ${
            showContact ? "grid-rows-[1fr] duration-200" : "grid-rows-[0fr] duration-150"
          }`}
        >
          {/* px-2 pb-2 lives two levels down from the grid-rows wrapper,
              not on the overflow-hidden div directly below it — padding is
              unconditional box-model space on whatever element carries it,
              so even *inside* overflow-hidden, an element the 0fr track is
              actively squeezing still renders its own padding at full size
              (only its content-box shrinks, not its padding box). That's
              exactly the same bug this fixed once already, just one level
              deeper: putting the padding on the overflow-hidden div itself
              (the grid item the track resizes) still left a constant 8px
              behind at showContact=false. It has to sit on a *descendant*
              of that div instead, mirroring the pill's own icon-row/menu-
              row split above — overflow-hidden div (no padding, IS the
              grid item) → this div (the padding) → the visible card. */}
          <div className="overflow-hidden">
            <div className="px-2 pb-2">
              <div
                className={`flex items-center justify-between gap-2 rounded-m border border-border-subtle bg-bg-default py-1.5 pl-2 pr-1.5 transition-[opacity,translate] ${EASE_OUT} ${MOTION_REDUCE} ${
                  showContact ? "translate-y-0 opacity-100 duration-150 delay-75" : "translate-y-[-4px] opacity-0 duration-100"
                }`}
              >
                <p className="whitespace-nowrap font-sans text-[14px] leading-6 tracking-[-0.112px] text-text-secondary">
                  {CONTACT_EMAIL}
                </p>
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
      </div>
    </div>
  );
}
