import Image from "next/image";
import Nav from "@/components/Nav";
import AboutCardStack from "@/components/AboutCardStack";
import SelectedWorks from "@/components/SelectedWorks";
import HomeFooter from "@/components/HomeFooter";
import BottomEdgeFade from "@/components/BottomEdgeFade";
import { ThemeProvider } from "@/components/ThemeContext";
import { themedIcon } from "@/components/themedIcon";
import { bodyText } from "@/components/typography";
import { Reveal } from "@/components/Reveal";
import { REVEAL_STAGGER_LOOSE } from "@/components/motion";

// Both this page's own headings ("Hey, I am Adam" and "What I do") share
// one literal style. Figma 84:1045 bumps this to 20px/tracking-[-0.8px],
// up from the 16px/tracking-[-0.32px] this had right after the font
// swap — still font-['PP_Neue_Montreal:Semibold'] at leading-6, same
// family/weight as before, just larger. font-serif (Gentium Basic) stays
// in use elsewhere on the site (case-study headings, etc.) — these two
// headings are still off of it, not the serif family being retired
// outright.
const pageHeading = "font-sans font-semibold text-[20px] leading-6 tracking-[-0.8px] text-text-primary";

// The small hand-drawn squiggle (Figma "Vector 9") that sits directly
// before both "Hey, I'm Adam" and "What I do" in 51:10930 — a *different*
// asset from hey-adam-flourish.svg (that one is the wide 75x5 divider
// line used in FlourishDivider.tsx; this one is its own small ~8x7
// mark), not a crop or reuse of it. This exact mark used to sit above
// the heading earlier this session and was explicitly removed on live
// feedback ("remove this line above the Hey I'm Adam") — re-added here
// on direct instruction after this fetch showed it's still part of the
// current design, not left removed on the assumption that instruction
// still stands.
function HeadingFlourish() {
  return (
    <Image
      src="/images/home/heading-flourish-dot.svg"
      alt=""
      width={8}
      height={7}
      className={`shrink-0 ${themedIcon}`}
    />
  );
}

// Figma 57:24399 redesigns these tags outright: a plain border-only pill
// with just the label, no icon box, no per-tag brand color, no hover-
// raise/tap animation — none of Tag.tsx's own machinery applies here
// anymore. Not a change to Tag.tsx itself: that component is still the
// right one for BeaconCaseStudyBody.tsx's own "workshop questions" row,
// an unrelated section this redesign doesn't touch, so a plain local
// span replaces it here instead of reworking (or forking) the shared
// component under it. Six labels now, not seven — "Craft in canvas &
// code" is dropped outright (confirmed live, not a truncation artifact),
// and two are renamed ("System thinking" → "System Thinking", "Product &
// design strategy" → "Design Strategy"). "Design system" and
// "Stakeholder management" capitalized to "Design System"/"Stakeholder
// Management" too, reported live — title case throughout, not just on
// the first word of a label.
const whatIDo = ["Research", "System Thinking", "Design Strategy", "Design System", "Brand Identity", "Stakeholder Management"];

function WhatIDoTag({ label }: { label: string }) {
  return (
    <div className="shrink-0 overflow-hidden rounded-sm border border-border-subtle px-1.5 py-0.5">
      <p className="whitespace-nowrap text-[14px] leading-[normal] tracking-[-0.112px] text-text-subtle">{label}</p>
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      {/* Nav is `fixed` (see Nav.tsx) — out of normal document flow, so it
          never pushes this content down on its own. Nav is back at the
          *top* of the viewport again (Figma 41:10445's own redesign,
          after a stint bottom-anchored). 124px lands the intro ~60px
          below the bar's own bottom edge (measured live: top-6 (24px) +
          the pill's own ~36px height = 64px, then +60px of real
          breathing room on top of that) — reported live as wanting the
          intro noticeably closer to the bar than the previous 180px
          (~116px of clearance) read as. Same value at every viewport:
          Nav's own height/offset don't change on mobile (no responsive
          classes on it), so there's no separate mobile figure to tune.
          Everything below the intro is normal flow under this one
          padding value, so it all shifts up together with no separate
          change needed. */}
      <Nav />

      <div className="mx-auto w-full max-w-[688px] pt-[124px]">
        {/* Figma 51:10930 — one flat 80px gap among the intro block, the
            card cluster, and "What I do", not the nested 100/120 two-
            rhythm structure (and flourish-divider elements) an earlier,
            different fetch (46:10661) had specified. 80px, not the
            100px this page carried until a fresh re-check of this same
            node's own metadata: its code export's own `gap-[100px]`
            class was trusted over two consistent direct pixel
            measurements of both internal gaps (each independently
            measuring 80px, not 100, across two different snapshots of
            this file) — that measured reality wins now rather than the
            class name, which apparently doesn't survive this node's own
            rotated-content children cleanly. */}
        <div className="flex flex-col gap-20">
          {/* Figma 51:10930 — the intro is left-aligned again (a prior,
              more specific fetch of just this paragraph, 46:10668, had it
              centered with the bio split into 3 explicit lines; this
              later full-page fetch reverts both of those, confirmed live
              rather than assumed from the fetch alone). "What shapes me"
              stays gone from this design outright, not just relocated. */}
          <div className="mx-auto flex w-full max-w-[512px] flex-col items-start gap-4">
            {/* gap-4 (16px) between the heading row and the bio text, not
                24px — tightened alongside the heading's own move off the
                24px serif treatment onto the smaller 16px sans one (see
                pageHeading), confirmed via this node's own metadata, not
                assumed to stay unchanged just because the surrounding
                layout didn't move. The small circle-"i" glyph Figma
                53:11343 shows here was purely decorative (no href,
                tooltip, or click behavior) and was removed on direct
                feedback. */}
            {/* This page's one hero: mode="load" (reveals right on page
                load, not on scroll — it's already on screen at first
                paint) and the "hero" tier (this system's own slowest,
                longest-travel reveal), the bio paragraph right behind it
                at a loose stagger step. Everything else Reveal touches
                on this page is scroll-triggered instead — see the
                "Approach" heading below. */}
            <div className="flex items-center gap-2.5">
              <HeadingFlourish />
              <Reveal as="h1" tier="hero" mode="load" className={pageHeading}>
                Hey, I am Adam
              </Reveal>
            </div>

            {/* One flowing paragraph, plain text throughout — Figma
                51:10930's own literal text node for this paragraph has
                no chip/pill styling on Beacon or Orchestro at all, just
                inline words in the same sentence. An earlier pass kept
                the Chip treatment on them (carried over from a prior,
                more detailed fetch of just this paragraph, 46:10668),
                but confirmed live that this current node really does
                drop it, not just fail to render it — so Beacon/
                Orchestro read as ordinary text now, matching this node
                exactly rather than assuming the older, chip'd version
                still applies. */}
            <Reveal as="p" tier="body" mode="load" delay={REVEAL_STAGGER_LOOSE} className={bodyText}>
              I’m a Senior Product Designer at McKinsey &amp; Company. Currently leading design for Beacon and
              co-designing Orchestro. Over the last 5+ years, I’ve gone from brand design to building products
              from scratch and working on enterprise software.
            </Reveal>

            {/* Figma 52:11143 — a new Email/LinkedIn/Instagram row
                under the bio, absent from every earlier fetch of this
                paragraph. Email is a real mailto, the same address
                PasswordGate's own contact link already uses. */}
            <div className={`flex items-center gap-6 text-text-subtle ${bodyText}`}>
              <a href="mailto:weberadam54@gmail.com" className="transition-colors duration-150 hover:text-text-primary">
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/adam-weber-b6a75616b/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-150 hover:text-text-primary"
              >
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com/awds.lab/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-150 hover:text-text-primary"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Figma 14:7194 — narrower (655px) than the 688px column it
              lives in, so it doesn't need to break out of the column as
              its own full-width section the way it once did. */}
          <AboutCardStack />

          {/* Figma 51:10930 — this section's own real nesting, re-checked
              fresh alongside the header-spacing fixes above: 16px
              between the heading and everything below it (tightened from
              24px, same heading-shrink reasoning as the bio block), then
              16px again from the paragraph pair down to the tag row
              (widened from an earlier, more specific fetch's own 12px,
              57:24399 — this later full-page re-check supersedes that),
              while the two paragraphs themselves stay 12px apart. */}
          <div className="mx-auto flex w-full max-w-[512px] flex-col items-start gap-4">
            <div className="flex items-center gap-2.5">
              <HeadingFlourish />
              {/* mode="scroll" (the default) here, unlike the hero above —
                  this section sits below the fold on most viewports, so
                  it reveals as it enters view rather than on page load. */}
              <Reveal as="h2" tier="heading" className={pageHeading}>
                Approach
              </Reveal>
            </div>
            <div className="flex w-full flex-col items-start gap-4">
              <div className="flex w-full flex-col items-start gap-3">
                {/* Only this section's own lead paragraph reveals — its
                    second paragraph stays plain, same restraint as this
                    system's own "don't animate every line of long-form
                    body copy" guidance. */}
                <Reveal as="p" tier="body" className={bodyText}>
                  I own my work end to end, from early concepts to shipped outcomes. I’ve worked on large
                  enterprise products as well as smaller, ambitious ones, but I’m most energized when I’m close to
                  the problem, shaping ideas from the ground up and seeing my work make a real difference.
                </Reveal>
                <p className={bodyText}>
                  That’s when design feels most meaningful to me: when a small team comes together around an
                  existing problem, cares deeply about solving it, and maybe, along the way, changes a little
                  piece of the world.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {whatIDo.map((label) => (
                  <WhatIDoTag key={label} label={label} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 80px — re-confirmed against a fresh re-check of Figma
            51:10930's own metadata: the intro block and the Selected
            Works row are both children of one shared wrapper frame now
            (76:344), the intro block's own height (793.54) plus this
            80px lands exactly on the cards row's own y (873.54). Not
            part of the gap-20 rhythm above them (that flex column ends
            at the intro block; this is its own margin below it, not a
            shared gap value), and it isn't a coincidence that it's the
            same 80px either — same rhythm, just expressed as a margin
            here since Selected Works itself breaks out of this column
            for its own full-bleed row. */}
        <div className="mt-20">
          <SelectedWorks />
        </div>
      </div>

      {/* HomeFooter renders as its own full-bleed <footer> outside this
          column (it does its own 688px centering + horizontal page
          padding, since Robotics/Beacon/Documentary also render it
          directly with no such column around it) — so unlike Selected
          works and everything above it, it gets none of the gap-[100px]
          flex spacing for free. Figma's own footer content (15:7443) is a
          full member of that same 100px-gapped column, so this margin
          reproduces that gap by hand instead, without changing
          HomeFooter itself and risking the spacing every other page
          using it already has tuned around its current no-top-margin
          behavior. */}
      <div className="mt-[100px]">
        <HomeFooter />
      </div>

      <BottomEdgeFade />
    </ThemeProvider>
  );
}
