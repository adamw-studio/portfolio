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
// top-6, not top-[30px]: matches Nav's own `top-6` offset, so as long
// as the two are also the same real height, their vertical centers
// align. top-[30px] was correct for the *previous* 24px-tall button
// (its center landed on the same line purely because 30 + 24/2 happens
// to equal 6 + 36/2), but silently stopped being once the button grew —
// a coincidence of the old size, not a value to carry forward.
//
// h-10 (40px), not left to this button's own py-2.5 padding math (which
// only adds up to 36px, 10+16+10): reported live as visibly sitting
// higher than Nav's own pill despite that hand-calculation — Nav's pill
// actually renders at 40px, 4px taller than its own padding math also
// suggests (a flex sub-pixel rounding quirk in its theme-toggle segment,
// confirmed by measuring the live DOM rather than trusting either
// component's padding arithmetic a second time). Forcing this button to
// that same real, measured 40px — instead of chasing the exact source
// of Nav's own 4px — is what actually keeps the two aligned regardless
// of which one's math was "supposed" to be right.
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
// `columnWidth` makes that 688 a prop instead of a hardcoded literal —
// Beacon's own long-scroll rebuild uses a narrower 512px narrative
// column (same figure QuickReviewRow/KeyFindingsRow's own ALIGN_INSET
// already aligns their Eyebrow labels against), not the 688px column
// every other case-study page still uses, so its own back button needs
// this same formula solved against 512 instead to land on that
// column's real left edge rather than one that doesn't exist there.
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
export function BackButton({ columnWidth = 688 }: { columnWidth?: number } = {}) {
  return (
    <Link
      href="/"
      aria-label="Back to home"
      className={`fixed top-6 z-20 flex h-10 items-center justify-center rounded-full bg-bg-default/80 px-4 backdrop-blur-[23px] transition-transform duration-100 active:scale-95 ${insetBorder}`}
      style={{ left: `max(1rem, calc((100vw - ${columnWidth}px) / 2))` }}
    >
      <Image src="/images/home/work-back-arrow.svg" alt="" width={16} height={16} className={themedIcon} />
    </Link>
  );
}
