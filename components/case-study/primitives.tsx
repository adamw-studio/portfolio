"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { themedIcon } from "@/components/themedIcon";

/**
 * Small, deliberately dumb building blocks individual case-study pages
 * compose freely — not a generic "CaseStudyBlock" with a dozen props
 * trying to cover every layout. Every text color/size here is a literal
 * value (not the shared bodyText/heading tokens from components/
 * typography.ts) because this is its own presentation system with its
 * own scale — a "large editorial typography" page wants headings way
 * past what the home page's 16-24px range covers, and Eyebrow's own
 * italic treatment has no equivalent elsewhere on the site at all.
 * font-sans (Neue Montreal) throughout, matching the rest of the site's
 * post-font-swap direction; nothing here reaches for font-serif — this
 * system is its own thing, not an extension of the home page's serif
 * headings.
 */

// "Lead designer / 2026", "Short summary" — small italic label text,
// always text-subtle. Figma's own "not-italic" CSS-style convention
// (see AboutCardStack.tsx's RESTING_TEXT comment) doesn't apply here:
// this really is meant to read as italic, a genuine style distinction
// from the primary copy around it, not a foundry display-cut trick.
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-sans text-[14px] italic leading-6 tracking-[-0.112px] text-text-subtle">{children}</p>;
}

// size controls which editorial scale this heading reads at — pages are
// meant to vary in weight/pacing (brief: "some pages should be dense,
// some extremely minimal"), so one page's huge single-statement headline
// and another's modest section title share this component rather than
// each hand-rolling their own text-[Npx].
const HEADING_SIZES = {
  // A dense card reading alongside a lot of other copy (a checklist,
  // several claims) — Figma's own 87:1449 gives the Overview headline
  // 24px (`md`, below), but reported live as too tall once that card
  // also had to hold its full 8-item summary on real screen sizes; this
  // is what OverviewPage actually uses instead.
  sm: "text-[18px] leading-[22px] tracking-[-0.144px]",
  // Overview/summary-card scale (Figma 87:1449) — a heading that sits
  // alongside body copy, not a full-page statement.
  md: "text-[24px] leading-[28px] tracking-[-0.192px]",
  // A page whose whole composition IS the headline — "one page might be
  // primarily editorial typography" from the brief. Scales down hard on
  // narrow viewports rather than wrapping a 56px headline into a wall of
  // text on a phone.
  lg: "text-[32px] leading-[36px] tracking-[-0.32px] sm:text-[44px] sm:leading-[48px] sm:tracking-[-0.6px]",
  xl: "text-[40px] leading-[44px] tracking-[-0.6px] sm:text-[64px] sm:leading-[68px] sm:tracking-[-1px]",
} as const;

export function Heading({ children, size = "md", className = "" }: { children: ReactNode; size?: keyof typeof HEADING_SIZES; className?: string }) {
  return <p className={`font-sans font-semibold text-text-primary ${HEADING_SIZES[size]} ${className}`}>{children}</p>;
}

export function BodyCopy({ children, muted = false, className = "" }: { children: ReactNode; muted?: boolean; className?: string }) {
  return (
    <p className={`font-sans text-[14px] leading-6 tracking-[-0.112px] ${muted ? "text-text-subtle" : "text-text-primary"} ${className}`}>
      {children}
    </p>
  );
}

// A single "did this" line with its own small checkmark box (Figma
// 87:1455 etc.) — the Overview page's own checklist, but generic enough
// for any page that wants a scannable list of short claims rather than
// prose paragraphs. `dense`: leading-5 (20px) instead of BodyCopy's own
// leading-6 (24px) — a real card fitting several multi-line claims plus
// a headline needs to reclaim vertical rhythm somewhere once it's capped
// to a sane on-screen height (see OverviewPage's own comment), and a
// tighter line-height costs less legibility than shrinking the type
// itself would.
export function Checklist({ items, dense = false }: { items: string[]; dense?: boolean }) {
  return (
    <ul className={`flex w-full flex-col ${dense ? "gap-1.5" : "gap-2"}`}>
      {items.map((item) => (
        <li key={item} className="flex w-full items-start gap-2">
          <span className="mt-1 flex shrink-0 items-center justify-center rounded-[4px] border border-border-subtle p-0.5">
            <Image src="/images/home/work-check.svg" alt="" width={12} height={12} className={`opacity-70 ${themedIcon}`} aria-hidden />
          </span>
          <BodyCopy className={`flex-1 ${dense ? "leading-5" : ""}`}>{item}</BodyCopy>
        </li>
      ))}
    </ul>
  );
}

// A pulled statement, larger and lighter than body copy — for a page
// that's "almost entirely visual" plus one line, or breaking up a denser
// page with a single breathing moment.
export function Quote({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans text-[24px] italic leading-[32px] tracking-[-0.192px] text-text-primary sm:text-[32px] sm:leading-[40px]">
      “{children}”
    </p>
  );
}

// One big number + its label — the kind of single hard metric an
// Outcome page reaches for. `value` stays a string (not a number) since
// most real stats aren't bare integers ("3.2x", "40%", "18 mo").
export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-sans text-[40px] font-semibold leading-[44px] tracking-[-0.6px] text-text-primary sm:text-[56px] sm:leading-[60px]">
        {value}
      </p>
      <BodyCopy muted>{label}</BodyCopy>
    </div>
  );
}

// Side-by-side on desktop, stacked on mobile — the brief's own explicit
// "two columns can become one" responsive example, not left as an
// exercise for every page that wants this shape.
export function TwoColumn({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12">
      <div className="flex flex-col gap-4">{left}</div>
      <div className="flex flex-col gap-4">{right}</div>
    </div>
  );
}

// A plain image/video frame — border-subtle + bg-tertiary fallback,
// matching CaseStudyImagePlaceholder.tsx's own established look for an
// empty/placeholder slot, extended here to also render real media once
// a page has it. Not using next/image's `fill` mode by default (most
// case-study media has a real intrinsic aspect ratio worth preserving
// rather than being cropped to whatever box a page happens to give it).
export function Media({
  src,
  alt = "",
  ratio = "16/10",
  rounded = "rounded-2xl",
}: {
  src?: string;
  alt?: string;
  ratio?: string;
  rounded?: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden border border-border-subtle bg-bg-tertiary ${rounded}`} style={{ aspectRatio: ratio }}>
      {src && <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 900px, 100vw" />}
    </div>
  );
}

export function Caption({ children }: { children: ReactNode }) {
  return <p className="font-sans text-[12px] leading-4 tracking-[-0.06px] text-text-subtle">{children}</p>;
}

// A grid of research artifacts/screens — "several research artifacts"
// from the brief. Plain CSS grid, 1 column on mobile widening with the
// viewport, rather than a fixed column count that gets cramped on a
// phone.
export function ImageGrid({ items }: { items: { src?: string; alt?: string; caption?: string }[] }) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Media src={item.src} alt={item.alt} ratio="4/3" />
          {item.caption && <Caption>{item.caption}</Caption>}
        </div>
      ))}
    </div>
  );
}

// Edge-to-edge, breaking out of whatever centered column its page sits
// in — "one page should be almost entirely visual" / "an edge-to-edge
// prototype or product flow". Same full-bleed technique already
// established in SelectedWorks.tsx (relative left-1/2 w-screen
// -translate-x-1/2), reused rather than re-derived.
export function FullBleedMedia({ src, alt = "" }: { src?: string; alt?: string }) {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2">
      <div className="relative aspect-[16/9] w-full bg-bg-tertiary sm:aspect-[21/9]">
        {src && <Image src={src} alt={alt} fill className="object-cover" sizes="100vw" />}
      </div>
    </div>
  );
}

// A plain macOS-style window chrome around a product screenshot — for
// showing an actual product UI as a "browser"/app window rather than a
// bare cropped image, the recognizable device-frame convention for
// product-design portfolios.
export function BrowserFrame({ src, alt = "" }: { src?: string; alt?: string }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border-subtle bg-bg-default">
      <div className="flex items-center gap-1.5 border-b border-border-subtle px-3 py-2.5">
        <span className="size-2.5 rounded-full bg-bg-tertiary" />
        <span className="size-2.5 rounded-full bg-bg-tertiary" />
        <span className="size-2.5 rounded-full bg-bg-tertiary" />
      </div>
      <div className="relative aspect-[16/10] w-full bg-bg-tertiary">
        {src && <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 900px, 100vw" />}
      </div>
    </div>
  );
}

// A card whose body scrolls internally once its content is taller than
// the room it's given (see CaseStudyStage's own comment on why a card
// gets a max-height + internal scroll safety net at all, and
// OverviewPage's on why that's a real, not just theoretical, case for
// this system). This is the "there's more below" cue for exactly that:
// a soft gradient + blur fade at the bottom edge, shown only while
// there's real unscrolled content beneath it and gone once the user
// actually reaches the end — not a static decoration, and not shown at
// all on a card that never needed to scroll in the first place.
//
// One masked blur layer, not several stacked ones: the earlier attempt
// at a similar bottom-edge fade elsewhere on this site (a graduated
// stack of separately-blurred, separately-masked bands) let adjacent
// bands' blur radii compound where they overlapped, and that compounded
// peak was exactly what made a line of real body text underneath it
// unreadable — confirmed live, after which that whole component was
// removed outright. A single blur value faded by one continuous mask
// has no such peak to compound toward; see BottomEdgeFade.tsx for the
// fuller version of this same lesson and the same technique.
export function ScrollFadeCard({
  children,
  maxHeight,
  className = "",
}: {
  children: ReactNode;
  maxHeight: string;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showFade, setShowFade] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      // 4px threshold, not 0 — sub-pixel layout rounding can leave a
      // fraction of a px of "remaining" scroll room on a card that's
      // genuinely already at its end, which would otherwise flicker the
      // fade on for content that isn't really cut off.
      setShowFade(el.scrollHeight - el.scrollTop - el.clientHeight > 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    // Content height can change after mount (fonts finishing load,
    // viewport resize changing how many lines wrap) — not just once on
    // the initial render.
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  return (
    // flex flex-col + flex-1 min-h-0 on the scrollable child, not h-full:
    // this element only ever sets max-height, never a real height, so a
    // percentage-height child (`h-full`) has no definite parent height to
    // resolve against and just falls back to its own content size —
    // which never overflows *itself*, so overflow-y-auto on it had
    // nothing to actually scroll (reported live: the card stopped
    // scrolling entirely, just clipped past max-height instead). Flexbox
    // sizing doesn't have that pitfall; min-h-0 overrides its own default
    // min-height:auto, which otherwise refuses to let a flex child shrink
    // below its content size in the first place.
    <div className={`relative flex flex-col overflow-hidden ${className}`} style={{ maxHeight }}>
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto rounded-[inherit]">
        {children}
      </div>
      {showFade && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 backdrop-blur-[6px]"
          style={{
            maskImage: "linear-gradient(to top, black, transparent)",
            WebkitMaskImage: "linear-gradient(to top, black, transparent)",
            background: "linear-gradient(to top, var(--color-bg-default) 15%, transparent)",
          }}
        />
      )}
    </div>
  );
}
