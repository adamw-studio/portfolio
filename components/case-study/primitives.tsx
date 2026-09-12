"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
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

// "Lead designer / 2026", "Short summary", "[01]" — small italic label
// text, always text-subtle. Figma's own "not-italic" CSS-style
// convention (see AboutCardStack.tsx's RESTING_TEXT comment) doesn't
// apply here: this really is meant to read as italic, a genuine style
// distinction from the primary copy around it, not a foundry display-
// cut trick. `style` is only there for the "[01]"-style step numbers
// (HowItStartedPage) to opt into tabular/lining/slashed-zero numerals
// (Figma's own font-feature-settings) without every plain-text Eyebrow
// use paying for a feature that only matters for digits.
export function Eyebrow({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <p className="font-sans text-[14px] italic leading-6 tracking-[-0.112px] text-text-subtle" style={style}>
      {children}
    </p>
  );
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
  // A sub-section heading inside a page's own body copy, not the page's
  // own title — "Key findings" (Figma 115:3786, CollectingInsightsPage),
  // sitting below a card's real `md` headline rather than replacing it.
  // No tracking override: unlike every other size here, this one's own
  // Figma node has no letter-spacing class at all, just the default.
  section: "text-[20px] leading-6",
  // A page whose whole composition IS the headline — "one page might be
  // primarily editorial typography" from the brief. Scales down hard on
  // narrow viewports rather than wrapping a 56px headline into a wall of
  // text on a phone.
  lg: "text-[32px] leading-[36px] tracking-[-0.32px] sm:text-[44px] sm:leading-[48px] sm:tracking-[-0.6px]",
  xl: "text-[40px] leading-[44px] tracking-[-0.6px] sm:text-[64px] sm:leading-[68px] sm:tracking-[-1px]",
} as const;

// `md` — every card's own page title (Overview/summary-card scale,
// Figma 87:1449) — is the one size Figma actually draws twice: 24px at
// this system's 440px desktop card reference (105:3001) and 20px at
// its 354px mobile one (124:5094), a real, deliberate downsize on
// mobile, not the same size just wrapping differently. Interpolated
// off the card's own width (a container query — every "md" heading
// lives inside CardBody, already inside ScrollFadeCard's own
// [container-type:inline-size] frame) using the exact same two content-
// box reference widths (352px/438px — see CardBody's own comment for
// why not the literal 354/440) CardBody's own fluid gap already solves
// from, which is why this comes out to the identical coefficients.
// leading-[28px] stays flat, not part of this interpolation: Figma's
// own mobile node has no explicit line-height of its own for this text
// (only its ambient 24px group default, which this size has never
// matched even at the existing desktop size) — changing it wasn't
// asked for and risks unpicking already-tuned vertical rhythm.
const MD_HEADING_FONT_SIZE = "clamp(20px, calc(4.651163cqw + 3.627907px), 24px)";
const MD_HEADING_TRACKING = "clamp(-0.192px, calc(-0.037209cqw - 0.02902px), -0.16px)";

type HeadingSize = keyof typeof HEADING_SIZES | "md";

export function Heading({ children, size = "md", className = "" }: { children: ReactNode; size?: HeadingSize; className?: string }) {
  if (size === "md") {
    return (
      <p
        className={`font-sans font-semibold leading-[28px] text-text-primary ${className}`}
        style={{ fontSize: MD_HEADING_FONT_SIZE, letterSpacing: MD_HEADING_TRACKING }}
      >
        {children}
      </p>
    );
  }
  return <p className={`font-sans font-semibold text-text-primary ${HEADING_SIZES[size]} ${className}`}>{children}</p>;
}

// weight: "normal" (default, unchanged for every existing use) or
// "medium" — Figma 105:3015 (HowItStartedPage's redesigned body copy)
// specifically calls for PP Neue Montreal Medium, not Regular, a
// deliberate step up from every other page's body text rather than a
// one-off worth its own component.
export function BodyCopy({
  children,
  muted = false,
  weight = "normal",
  className = "",
}: {
  children: ReactNode;
  muted?: boolean;
  weight?: "normal" | "medium";
  className?: string;
}) {
  return (
    <p
      className={`font-sans text-[14px] leading-6 tracking-[-0.112px] ${weight === "medium" ? "font-medium" : "font-normal"} ${muted ? "text-text-subtle" : "text-text-primary"} ${className}`}
    >
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
// the room it's given. This is the "there's more below" cue for exactly
// that: a soft gradient + blur fade at the bottom edge, shown only while
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
//
// `style` sizes the outer box — usually `aspectRatio` (see
// HowItStartedPage), not a flat `maxHeight`: two cards sitting side by
// side in the same filmstrip (CaseStudyStage) need to shrink by the
// *same* formula as the viewport narrows, the same one a plain
// aspect-ratio div like OverviewPage's own card already uses, or they
// drift out of sync and end up visibly different heights at anything
// but their widest width — reported live as exactly that. A bare
// max-height cap doesn't track width at all, which is what caused it.
//
// The outer box (`className`, carrying this card's border/background/
// shadow/backdrop-blur) never clips its own content — a separate inner
// layer does that. One element painting a border *and* clipping via
// overflow-hidden at the same radius is exactly the combination that
// showed a rendering seam at the rounded corner once CaseStudyStage
// started applying `transform: scale()` to the active card (reported
// live as a border/corner artifact). Splitting them means the border
// is always drawn on a plain, unclipped box — nothing about scaling it
// depends on a clip mask lining up with it pixel-for-pixel.
// Figma 105:3001 (desktop, this system's 440px-wide card reference) vs
// 122:4252 (mobile, 354px-wide) — the SAME "Where it started" card
// drawn twice, once per breakpoint. Diffing the two (exact metadata,
// not eyeballed off a screenshot) shows outer padding drops from 28px
// to 20px and the gap between a card's own sections (heading → image →
// copy) drops from 24px to 20px — real, independently-chosen design
// values, not the same spacing simply scaled down by width. Both
// interpolate linearly off the card's *own* rendered width (a
// container query, via [container-type:inline-size] on ScrollFadeCard's
// outer frame — not the viewport: a carousel lane is narrower than the
// viewport at every breakpoint, so 100vw was never the right divisor
// here) between those exact two reference widths, clamped flat outside
// that 354–440px range rather than extrapolating past values Figma
// never actually specified.
//
// clamp(20px, calc(A + Bcqw), 28px) solved from two points — 352px and
// 438px, NOT Figma's literal 354/440: cqw resolves against this
// container's own CONTENT-box width, and this particular container
// (ScrollFadeCard's outer frame) carries a 1px border, so its content
// box is 2px narrower than its border-box (confirmed live: measured
// padding landed at 27.8px, not 28px, until this correction — 9.302cqw
// of a 438px content-box, not a 440px border-box). B = 8/86 =
// 9.302326cqw (the *range* is identical either way, so the slope
// isn't affected — only the intercept is), A = 20 - 9.302326% * 352/100
// = -12.744186px.
const CARD_PADDING = "clamp(20px, calc(9.302326cqw - 12.744186px), 28px)";
// Same reasoning, the inter-section gap (352px → 20px, 438px → 24px):
// B = 4/86 = 4.651163cqw, A = 20 - 4.651163% * 352/100 = 3.627907px.
const CARD_GAP = "clamp(20px, calc(4.651163cqw + 3.627907px), 24px)";

// The padded flex-column every case-study card's own content sits in —
// pulled out of six pages that had each hand-rolled an identical
// `<div className="flex flex-col gap-6 p-7">` (a fixed 24px/28px that
// never moved off its desktop value). Centralizing it here means the
// fluid padding/gap above is defined once, not re-derived — or
// forgotten — per page.
export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col ${className}`} style={{ padding: CARD_PADDING, gap: CARD_GAP }}>
      {children}
    </div>
  );
}

// Figma 120:4168 ("agile") — a small looping-arrow glyph that flags an
// "Insights gained"-style tag. fill="currentColor" (not the exported
// SVG's own literal rgba(244,244,244,0.4)) so it inherits text-subtle
// and actually flips with the site's light/dark theme, the same reason
// every other page here maps a Figma color to a token instead of a
// fixed literal. Promoted here once a second case study (Robotics)
// needed the identical glyph — previously local to SoWhereAreWeNowPage.
export function LoopIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.35355 0.97978C8.54881 1.17504 8.54881 1.49162 8.35355 1.68689L7.51651 2.52393C10.3119 2.78429 12.5 5.13661 12.5 8C12.5 11.0376 10.0376 13.5 7 13.5H1.33333C1.05719 13.5 0.833333 13.2761 0.833333 13C0.833333 12.7239 1.05719 12.5 1.33333 12.5H7C9.48528 12.5 11.5 10.4853 11.5 8C11.5 5.71025 9.78983 3.81993 7.5771 3.53666L8.35355 4.31311C8.54881 4.50838 8.54881 4.82496 8.35355 5.02022C8.15829 5.21548 7.84171 5.21548 7.64645 5.02022L5.97978 3.35355C5.78452 3.15829 5.78452 2.84171 5.97978 2.64645L7.64645 0.97978C7.84171 0.784518 8.15829 0.784518 8.35355 0.97978ZM4.93691 3.41669C5.07497 3.65585 4.99301 3.96164 4.75386 4.09969C3.40557 4.87802 2.5 6.33355 2.5 8C2.5 9.01362 2.83453 9.94766 3.39942 10.6997C3.56526 10.9205 3.52072 11.2339 3.29992 11.3998C3.07913 11.5656 2.7657 11.5211 2.59985 11.3003C1.90936 10.381 1.5 9.23759 1.5 8C1.5 5.96183 2.6089 4.18325 4.25391 3.23364C4.49306 3.09558 4.79885 3.17754 4.93691 3.41669ZM12.6464 10.6464C12.8417 10.4512 13.1583 10.4512 13.3536 10.6464L15.0202 12.3131C15.2155 12.5084 15.2155 12.825 15.0202 13.0202L13.3536 14.6869C13.1583 14.8821 12.8417 14.8821 12.6464 14.6869C12.4512 14.4916 12.4512 14.175 12.6464 13.9798L13.4596 13.1667H11.6667C11.3905 13.1667 11.1667 12.9428 11.1667 12.6667C11.1667 12.3905 11.3905 12.1667 11.6667 12.1667H13.4596L12.6464 11.3536C12.4512 11.1583 12.4512 10.8417 12.6464 10.6464Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function InsightTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-lg bg-bg-secondary px-2.5 py-0.5 font-sans text-[14px] leading-6 text-text-secondary">
      <LoopIcon className="size-4 shrink-0 text-text-subtle" />
      {children}
    </span>
  );
}

// A labeled research finding under an "Insights gained"-style tag — a
// bold title with its own content directly beneath, no gap. Content
// stays at full text-primary opacity, never muted — CollectingInsights
// Page's own KeyFinding is the muted-description variant of this same
// shape and has no reason to merge with this one.
export function Finding({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex w-full flex-col items-start">
      <p className="font-sans text-[14px] font-semibold leading-6 text-text-primary">{title}</p>
      {children}
    </div>
  );
}

// A full-width screenshot exhibit: a 240px-tall image over a bg-tertiary
// fallback fill (in case the image is still loading), with its own small
// centered caption underneath — Figma's own repeated pattern for a
// case-study page's "what changed"/"what we're exploring" snapshots.
//
// `video`: renders a looping, autoplaying, muted <video> instead of an
// <Image> — for an exhibit whose own Figma asset is a screen recording,
// not a still (SoWhereAreWeNowPage's own doc comment has the fuller
// reasoning: autoPlay+loop+muted+playsInline is what actually satisfies
// "make sure it works and loops" with zero JS).
export function Exhibit({
  src,
  alt,
  caption,
  video = false,
  poster,
}: {
  src: string;
  alt: string;
  caption?: string;
  video?: boolean;
  poster?: string;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="relative h-[240px] w-full overflow-hidden rounded-2xl bg-bg-tertiary">
        {video ? (
          <video
            src={src}
            poster={poster}
            aria-label={alt}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 480px) 384px, 100vw" />
        )}
      </div>
      {caption && <p className="max-w-[312px] text-center font-sans text-[10px] leading-normal text-text-secondary">{caption}</p>}
    </div>
  );
}

export function ScrollFadeCard({
  children,
  style,
  className = "",
}: {
  children: ReactNode;
  style: CSSProperties;
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
    // [container-type:inline-size]: this frame's own rendered width IS
    // the card's width at every breakpoint (the carousel lane's LANE_WIDTH,
    // or a plain max-w-[440px] outside one) — establishing it as a query
    // container here is what lets CardBody's own cqw-based padding/gap
    // (and any diagram inside) respond to *this card*, not the viewport,
    // matching this system's own carousel where the card is always
    // narrower than the viewport around it.
    <div className={`flex flex-col [container-type:inline-size] ${className}`} style={style}>
      <div className="relative flex h-full w-full min-h-0 flex-1 flex-col overflow-hidden rounded-[inherit]">
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
              // bg-tertiary-solid, not bg-default — this fade blends
              // toward the *card's* own resting surface, not the page's.
              // Those two used to be close enough in practice, but now
              // that every ScrollFadeCard user has its own distinct
              // opaque bg-tertiary-solid fill (not a translucent tint
              // over bg-default any more), fading toward bg-default left
              // a visibly wrong-toned strip right at the bottom edge —
              // reported live as "a small gap on the bottom" while
              // scrolling.
              background: "linear-gradient(to top, var(--color-bg-tertiary-solid) 15%, transparent)",
            }}
          />
        )}
      </div>
    </div>
  );
}

// The rounded frame shared by every text-only case-study card ("First
// steps", "Collecting insights", "Turning point") — same bg-tertiary-
// solid/border-disabled "quiet raised panel" treatment as
// HowItStartedPage's own card (see that file's comment for why), and
// the same 440x600 aspect-ratio every card in this system sizes itself
// by. Pulled out once three pages had hand-rolled an identical div.
//
// A thin ScrollFadeCard preset, not its own plain div: this used to be
// exactly that — content at Figma's own 382-wide desktop column fits
// these pages' copy with room to spare, so it looked like nothing here
// would ever need to scroll. That's true at the card's full 440px
// width, but the card's own aspect-ratio locks its *height* to whatever
// width it's actually given, and on a narrow phone that width (and so
// the height) shrinks well past what desktop measured against, while
// the body copy's own font size doesn't shrink with it — reported live
// as a card's own text getting cut off mid-sentence on mobile, with no
// fade or any indication there was more below. Every text card gets the
// same real scroll + fade safety net now, matching what a card that
//*does* overflow at full width (HowItStartedPage, say) already had —
// "will this fit" turned out not to be a per-page constant once the
// viewport itself is part of the equation.
//
// bg-tertiary-solid (opaque), not bg-tertiary (5% alpha) + backdrop-
// blur: reported live as the page's own dot-grid background still
// showing through the card surface, just softened by the blur rather
// than actually hidden — a translucent surface can't fully block what's
// behind it no matter how much it's blurred. globals.css's own comment
// on bg-tertiary-solid has the exact blend.
export function TextCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <ScrollFadeCard
      style={{ aspectRatio: "440 / 600" }}
      className={`w-full max-w-[440px] rounded-[20px] border border-border-disabled bg-bg-tertiary-solid shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)] ${className}`}
    >
      <CardBody>{children}</CardBody>
    </ScrollFadeCard>
  );
}
