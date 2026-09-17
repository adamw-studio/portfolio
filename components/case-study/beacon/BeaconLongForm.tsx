import Hero from "@/components/case-study/beacon/Hero";
import QuickReviewRow from "@/components/case-study/beacon/QuickReviewRow";
import HowItStarted from "@/components/case-study/beacon/HowItStarted";
import FragmentedProduct from "@/components/case-study/beacon/FragmentedProduct";
import CollectingInsights from "@/components/case-study/beacon/CollectingInsights";
import KeyFindingsRow from "@/components/case-study/beacon/KeyFindingsRow";
import Reflection from "@/components/case-study/beacon/Reflection";
import WorkshopQuestionsExhibit from "@/components/case-study/beacon/WorkshopQuestionsExhibit";
import TurningPoint from "@/components/case-study/beacon/TurningPoint";
import SoWhereAreWeNow from "@/components/case-study/beacon/SoWhereAreWeNow";
import Footer from "@/components/case-study/beacon/Footer";

// Figma 136:5703 ("Beacon-Project-Page") — rebuilt as one long scrolling
// page again, not the page-by-page card carousel Beacon shipped with
// before (see components/case-study/beacon/pages.tsx's own git history —
// that file and every "*Page.tsx" component it pointed at are removed,
// not just unlisted, along with this rebuild). Every section here shares
// one left edge at max-w-[512px] (Figma's own narrative column), except
// the two horizontal card rows (Quick review / Key findings), which
// break out to this page's own full max-w-[1240px] — the widest
// element in Figma's own frame, so this page's outer container matches
// it rather than the narrower 688px column the rest of the site's pages
// use.
//
// Two genuinely new components exist because of this rebuild:
// - CardRow (components/case-study/): a lighter sibling of
//   CaseStudyStage carrying the SAME scroll/scale/drag/Prev-Next feel,
//   for a card row embedded *in* a page rather than a page-level stage.
//   Reused by both QuickReviewRow and KeyFindingsRow below — exactly the
//   "reuse this animation wherever cards need to scroll horizontally"
//   this rebuild was asked for.
// - SummaryCard (components/case-study/primitives.tsx): the "Card /
//   Default" tile both of those rows render.
//
// Every section's own doc comment covers what carried over from the old
// carousel's components (most copy/diagrams did, verbatim) vs. what's
// genuinely new in this fetch (the Quick review/Key findings rows
// themselves, and four re-sourced images in SoWhereAreWeNow).
// WorkshopQuestionsExhibit replaces this section's own earlier
// QualityTiles.tsx (an interactive sticky-note fan) with a single flat
// recap image, on direct instruction — see that file's own doc comment.
export default function BeaconLongForm() {
  return (
    // items-center, not a single shared max-w-[1240px] column with every
    // section left-aligned inside it: Figma's own layout has the narrow
    // 512px text column sitting at EQUAL margins on both sides of the
    // 1440px canvas (464px left, 464px right — it only reads as
    // "left-aligned" because the wide card rows share that same left
    // edge, not because the text itself is). Each section centers on the
    // page independently instead, at its own natural width — the 512px
    // narrow ones true-centered, the two CardRow sections breaking out
    // wider (their own max-w-[1240px]) the same way SelectedWorks.tsx's
    // own row already breaks out past the home page's narrower column.
    // gap-11 (44px) between top-level sections, gap-16 (64px) within the
    // two multi-section groups (the narrative block below, and Turning
    // point + So where are we now) — measured directly off Figma's own
    // re-fetch (148:7432) after it flagged this whole page's spacing as
    // having been *increased* there since this was first built: every
    // top-level gap in that frame reads 44px (Hero→Quick review's own
    // block end at 732 to the narrative block's start at 776, that block's
    // own end at 2272 to Key findings at 2316, and on through Reflection
    // and Quality tiles), while both of Figma's own multi-section GROUPS
    // (the narrative block, and Turning point/So where are we now) use
    // 64px between their own children specifically. This file's first
    // pass had the two swapped (64 outer, 44 inner) — backwards from
    // what the file actually specifies once measured, not just visually
    // close. Ideation flow is no longer a sibling here — a later fetch
    // (158:1354) folded it back into SoWhereAreWeNow.tsx as that
    // section's own final subsection; see that file's own doc comment.
    // pb-16, not the pb-32 this carried while Footer didn't exist yet —
    // every other case study with a real Footer (Robotics/Documentary/
    // Monday) uses pb-16 below it; the extra 64px here was standing in
    // for a missing "end of page" cue, not a deliberate value of its
    // own, and doubling up now that Footer is real would just leave it
    // floating with an oversized gap under it.
    <div className="mx-auto flex w-full flex-col items-center gap-11 pb-16 pt-32 sm:pt-36">
      <Hero />
      <QuickReviewRow />
      <div className="flex w-full max-w-[512px] flex-col gap-16">
        <HowItStarted />
        <FragmentedProduct />
        <CollectingInsights />
      </div>
      <KeyFindingsRow />
      <Reflection />
      <div className="w-full max-w-[512px]">
        <WorkshopQuestionsExhibit />
      </div>
      <div className="flex w-full max-w-[512px] flex-col gap-16">
        <TurningPoint />
        <SoWhereAreWeNow />
      </div>
      {/* Beacon was the one case study with no Footer at all — reported
          live ("the footer should always be displayed across the
          website, except the Playground"). Same local Footer pattern
          every other case study already uses (its own file, not the
          shared HomeFooter — see that component's own doc comment for
          why), wrapped at this page's own 512px narrative width like
          Robotics'/Documentary's/Monday's own. */}
      <div className="w-full max-w-[512px]">
        <Footer />
      </div>
    </div>
  );
}
