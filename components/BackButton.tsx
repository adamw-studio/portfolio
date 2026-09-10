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
// top-6, not top-[30px]: this button is now 36px tall (10px padding +
// 16px icon + 10px padding), the exact same height as Nav's own closed
// pill — so matching Nav's own `top-6` offset keeps their vertical
// centers aligned. top-[30px] was correct for the *previous* 24px-tall
// button (its center landed on the same line purely because 30 + 24/2
// happens to equal 6 + 36/2), but silently stopped being once the button
// grew — a coincidence of the old size, not a value to carry forward.
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
      className={`absolute left-0 top-6 flex items-center justify-center rounded-full px-4 py-2.5 transition-transform duration-100 active:scale-95 ${insetBorder}`}
    >
      <Image src="/images/home/work-back-arrow.svg" alt="" width={16} height={16} className={themedIcon} />
    </Link>
  );
}
