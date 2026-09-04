"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeContext";
import { themedIcon } from "@/components/themedIcon";

// Menu Items component (Figma 239:12785) has three states — Default,
// Hover and Selected — where Hover and Selected are visually identical
// (bg-tertiary pill, full-opacity everything) and only Default is dim.
// Figma ships that dimming as two separate icon exports (not one icon
// dimmed via CSS opacity), so each link carries both variants here.
const links = [
  { href: "/", label: "Home", icon: "/images/home/home-simple.svg", activeIcon: "/images/home/home-simple-active.svg" },
  { href: "/work", label: "Selected works", icon: "/images/home/sparks.svg", activeIcon: "/images/home/sparks-active.svg" },
  {
    href: "/playground",
    label: "Playground",
    icon: "/images/home/bounce-right.svg",
    activeIcon: "/images/home/bounce-right-active.svg",
  },
  { href: "/contact", label: "Get in touch", icon: "/images/home/edit.svg", activeIcon: "/images/home/edit-active.svg" },
];

// Inset shadow instead of a real border: Figma's stroke doesn't consume
// layout space, but a CSS border always would on an explicitly-sized box
// (see typography.ts's insetBorder for the same fix applied elsewhere).
// Explicit size-6 (24px) matches Figma's icon-button frame exactly:
// p-1 (4px) + the 16px icon + p-1 (4px) = 24px, with zero extra from the
// border since it's inset.
const iconButton =
  "flex size-6 items-center justify-center rounded-full p-1 shadow-[inset_0_0_0_1px_var(--color-border-subtle)]";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  // Close on outside click and on Escape — baseline behavior for any
  // dropdown menu, not just decoration.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
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
    // centers coincide, so mx-auto within the 688px wrapper lands it in
    // the same place. relative + z-20: the panel below is absolutely
    // positioned and floats over whatever content follows the nav, rather
    // than pushing it down — opening/closing the menu never reflows the
    // rest of the page.
    <div ref={rootRef} className="relative z-20 mx-auto w-fit">
      <div
        className={`flex max-w-full items-center justify-between border-b border-b-border-subtle bg-bg-default p-1.5 shadow-[inset_0_1px_0_0_var(--color-border-subtle),inset_1px_0_0_0_var(--color-border-subtle),inset_-1px_0_0_0_var(--color-border-subtle)] transition-[width,border-radius,border-bottom-color] duration-300 ease-out ${
          open ? "w-[336px] rounded-t-lg border-b-transparent" : "w-[160px] rounded-full"
        }`}
      >
        {/* Icon reflects the *current* theme (lamp = dark, bulb = light),
            matching Figma's two states, rather than "what you'll switch
            to". themedIcon inverts these single-color #F4F4F4 exports to
            #0D0D0D-ish in light mode — see themedIcon.ts for why that's
            more reliable than Figma's own per-theme icon exports here. */}
        <button
          type="button"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          onClick={toggleTheme}
          className={iconButton}
        >
          <Image
            src={theme === "dark" ? "/images/home/small-lamp.svg" : "/images/home/light-bulb.svg"}
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
          onClick={() => setOpen((o) => !o)}
          className={iconButton}
        >
          <Image src="/images/home/menu.svg" alt="" width={16} height={16} className={themedIcon} />
        </button>
      </div>

      {/* Absolutely positioned, 1px below the pill (matches Figma's gap-px
          between the two boxes) so it floats over page content instead of
          pushing it down. grid-rows 0fr/1fr is what makes it animate
          smoothly to its natural height instead of needing a JS-measured
          max-height. */}
      <div
        className={`absolute left-0 right-0 top-[calc(100%+1px)] grid overflow-hidden rounded-b-lg border-x border-b border-border-subtle bg-bg-tertiary backdrop-blur-[23px] transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-2 overflow-hidden p-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`group flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-[14px] leading-4 tracking-[-0.112px] transition-colors duration-150 ${
                  active ? "bg-bg-tertiary text-text-primary" : "text-text-subtle hover:bg-bg-tertiary hover:text-text-primary"
                }`}
              >
                {/* Two stacked icons crossfade on hover rather than one
                    icon whose opacity is toggled — the dim/full looks are
                    separate Figma exports, not the same art at two
                    opacities (see the `links` comment above). */}
                <span className="relative size-4 shrink-0">
                  <Image
                    src={link.icon}
                    alt=""
                    fill
                    className={`${themedIcon} transition-opacity duration-150 ${active ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}
                  />
                  <Image
                    src={link.activeIcon}
                    alt=""
                    fill
                    className={`${themedIcon} transition-opacity duration-150 ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                  />
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
