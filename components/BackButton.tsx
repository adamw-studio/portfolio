import Image from "next/image";
import Link from "next/link";
import { themedIcon } from "@/components/themedIcon";
import { insetBorder } from "@/components/typography";

// Figma 325:241 ("Back Button") — a generously padded pill (16px
// horizontal, 10px vertical) around the single reply-arrow icon, not the
// tight 24px circle (size-6 + p-1) this used to be modeled as. Same icon
// asset as before (verified byte-identical against the Figma export), so
// only the button's own shape/padding changed here, not the glyph.
//
// Pulled into one shared component instead of the four identical copies
// this was duplicated as (Beacon, Documentary, Robotics, PasswordGate) —
// same position and same classes at every call site, so a shared
// definition removes the risk of the four quietly drifting apart instead
// of adding one.
//
// top-6, not top-[30px]: this button is 36px tall (10px padding + 16px
// icon + 10px padding), the exact same height as Nav's own closed pill —
// so matching Nav's own `top-6` offset keeps their vertical centers
// aligned. top-[30px] was correct for the *previous* 24px-tall button
// (its center landed on the same line purely because 30 + 24/2 happens
// to equal 6 + 36/2), but silently stopped being once the button grew —
// a coincidence of the old size, not a value to carry forward.
//
// fixed, not absolute: this should stay put while the page scrolls, the
// same as Nav — absolute only pinned it to its starting spot in the
// document, so it scrolled away with everything else the moment content
// got taller than one screen. Switching to `fixed` means it's no longer
// positioned relative to the case-study column's own `relative` wrapper,
// so its `left` has to reconstruct that column's own left edge by hand:
// the page wrapper carries `px-4` (see ThemeContext.tsx), inside which
// this column is `mx-auto max-w-[688px]` — max(1rem, (100vw-688px)/2) is
// exactly that column's left edge at any viewport width, wide or narrow.
//
// bg-bg-default/80 + backdrop-blur-[23px]: same frosted-glass treatment
// as Nav's own pill, added now for the same reason Nav needed it — a
// floating, fixed element over scrolling text needs its own backdrop to
// stay legible, which this never needed as long as it scrolled away with
// the text underneath it.
//
// active:scale-95 + transition-transform: same press-feedback convention
// as every other pressable control on the site (Nav's icon buttons, the
// email Copy button) — Figma's static export has no separate pressed
// state to match here, so this follows the codebase's own established
// pattern rather than shipping a dead tap.
export function BackButton() {
  return (
    <Link
      href="/"
      aria-label="Back to home"
      className={`fixed left-[max(1rem,calc((100vw-688px)/2))] top-6 z-20 flex items-center justify-center rounded-full bg-bg-default/80 px-4 py-2.5 backdrop-blur-[23px] transition-transform duration-100 active:scale-95 ${insetBorder}`}
    >
      <Image src="/images/home/work-back-arrow.svg" alt="" width={16} height={16} className={themedIcon} />
    </Link>
  );
}
