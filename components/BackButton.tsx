import Image from "next/image";
import Link from "next/link";
import { themedIcon } from "@/components/themedIcon";
import { insetBorder } from "@/components/typography";

// Figma 325:241 ("Back Button") — the last remaining standalone use of
// this component is PasswordGate.tsx's own locked screen, which renders
// no Nav at all (there's nothing to navigate to until it unlocks) and so
// still needs its own independently `fixed`-positioned back button.
// Every other case-study page's own back button moved *into* Nav.tsx
// itself (a normal flex child there now, in the same row as the date
// widget — see that file's own doc comment) once its own redesign
// (Figma 177:4238/177:4203/178:4288) put the back button inside the nav
// bar rather than floating independently over the page — this file used
// to be shared by four identical call sites (Beacon/Documentary/
// Robotics/PasswordGate) for exactly that positioning math, and now only
// has the one left.
//
// top-1.5 (6px): chosen to sit at the same height Nav.tsx's own bar
// would occupy if it were rendered here too (py-3 top/bottom around a
// 28px content row, centering a 40px pill needs 6px) — PasswordGate's
// own locked screen never renders Nav at all, but keeping this button at
// the same height every *other* page's chrome sits at keeps the site's
// own top-left rhythm consistent even on the one screen with no nav bar
// to literally align against.
//
// h-10 (40px), not left to this button's own py-2.5 padding math (which
// only adds up to 36px, 10+16+10): confirmed against Nav's own segments
// — its Mode Item icons render at a real, measured 40px start-to-end
// too. Forcing this button to that same real 40px, rather than trusting
// either component's padding arithmetic on its own, is what actually
// keeps the two aligned.
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
      className={`fixed top-1.5 z-20 flex h-10 items-center justify-center rounded-full bg-bg-default/80 px-4 backdrop-blur-[23px] transition-transform duration-100 active:scale-95 ${insetBorder}`}
      style={{ left: `max(1rem, calc((100vw - ${columnWidth}px) / 2))` }}
    >
      <Image src="/images/home/work-back-arrow.svg" alt="" width={16} height={16} className={themedIcon} />
    </Link>
  );
}
