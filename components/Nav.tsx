"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home", icon: "/images/home/home-simple.svg" },
  { href: "/work", label: "Selected works", icon: "/images/home/sparks.svg" },
  { href: "/playground", label: "Playground", icon: "/images/home/bounce-right.svg" },
  { href: "/contact", label: "Get in touch", icon: "/images/home/edit.svg" },
];

// Border stays a constant 1px all the way around at all times — only its
// *color* animates (transparent when open, revealing the 1px gap to the
// menu panel below) — so opening/closing never shifts layout the way
// actually adding/removing a border would.
const iconButton = "flex items-center justify-center rounded-full border border-border-subtle p-1";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);

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
    <div ref={rootRef} className="relative flex w-full flex-col gap-px">
      <div
        className={`flex w-full items-center justify-between border border-border-subtle bg-bg-default p-1.5 transition-[border-radius,border-bottom-color] duration-300 ease-out ${
          open ? "rounded-t-lg border-b-transparent" : "rounded-full"
        }`}
      >
        {/* Purely visual for now — no theme-switching wired up yet. */}
        <button type="button" aria-label="Toggle theme" className={iconButton}>
          <Image src="/images/home/small-lamp.svg" alt="" width={16} height={16} />
        </button>
        <Image src="/images/home/logo-mark-small.svg" alt="Adam Weber" width={36} height={12} />
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={iconButton}
        >
          <Image src="/images/home/menu.svg" alt="" width={16} height={16} />
        </button>
      </div>

      {/* grid-rows 0fr/1fr is what makes this animate smoothly to its
          natural height instead of needing a JS-measured max-height. */}
      <div
        className={`grid w-full overflow-hidden rounded-b-lg border-x border-b border-border-subtle bg-bg-tertiary backdrop-blur-[23px] transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
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
                className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-[14px] leading-4 tracking-[-0.112px] ${
                  active ? "bg-bg-tertiary text-text-primary" : "text-text-subtle"
                }`}
              >
                {/* Inactive icons already carry fill-opacity:0.4 baked into
                    the SVG itself (matches Figma's icon/icon-subtle token)
                    — no extra CSS opacity needed, that would double-dim them. */}
                <Image src={link.icon} alt="" width={16} height={16} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
