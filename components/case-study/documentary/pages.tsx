import type { CaseStudyPageConfig } from "@/components/case-study/types";
import { ImageCard } from "@/components/case-study/primitives";
import OverviewPage from "@/components/case-study/documentary/OverviewPage";
import ContextPage from "@/components/case-study/documentary/ContextPage";
import SixMonthsEarlierPage from "@/components/case-study/documentary/SixMonthsEarlierPage";
import ContributionPage from "@/components/case-study/documentary/ContributionPage";
import CreditsCollagePage from "@/components/case-study/documentary/CreditsCollagePage";
import WatchTeaserPage from "@/components/case-study/documentary/WatchTeaserPage";

// Same page-by-page presentation as Beacon/Robotics (see components/
// case-study/beacon/pages.tsx for the fuller reasoning) — Figma
// 126:5238/122:4939/126:5248/126:5268/126:5292/126:5318/126:5290/
// 126:5316/126:5288/126:5280/126:5312/126:5254.
//
// The 12 Figma URLs this was built from came in Figma's own selection
// order, not reading order — none of the 7 plain photo cards carry a
// step number of their own (they're wordless gallery interludes, not
// numbered narrative beats), and the 4 that do ([01], [02], [04], [11])
// only pin down *their own* position, not where the photos go.
//
// Order (per the live site's own reference screenshot): Overview,
// Context, "6 months earlier", the film's own end credits, the seven
// gallery photos, THEN "[04] Contribution to the project", and finally
// "[11] Watch teaser" as the closing card — Contribution reads as a
// wrap-up of everything just shown (the poster, the premiere) rather
// than a setup for it, so it sits right before the teaser instead of
// before the gallery. Same numbering gap as ever (no [03]/[05]-[10]
// exist in this Figma file either — not a card missing from this list,
// Figma's own numbering simply isn't contiguous here).
const GALLERY_IMAGES: { id: string; src: string; alt: string }[] = [
  {
    id: "poster-window",
    src: "/images/home/documentary-poster-window.jpg",
    alt: "The film poster held up against a window, reflecting Éva Köves's own face behind it",
  },
  {
    id: "poster-blurry",
    src: "/images/home/documentary-poster-blurry.jpg",
    alt: "The film poster held up against an out-of-focus glass jar in the background",
  },
  {
    id: "poster-closeup",
    src: "/images/home/documentary-poster-closeup2.jpg",
    alt: "A close-up of the film poster held against a window, a face faintly visible behind it",
  },
  {
    id: "bts-monitor",
    src: "/images/home/documentary-bts-monitor.jpg",
    alt: "Two crew members reviewing footage on a TV monitor during production",
  },
  {
    id: "bts-editing-credits",
    src: "/images/home/documentary-bts-editing-credits.jpg",
    alt: "A photo of an editing timeline on screen while assembling the film's own end credits",
  },
  {
    id: "bts-outdoor",
    src: "/images/home/documentary-bts-outdoor.jpg",
    alt: "The crew filming Éva Köves on a residential street during production",
  },
];

export const DOCUMENTARY_PAGES: CaseStudyPageConfig[] = [
  { id: "overview", label: "Overview", Component: OverviewPage },
  { id: "context", label: "Context", Component: ContextPage },
  { id: "six-months-earlier", label: "6 months earlier", Component: SixMonthsEarlierPage },
  { id: "credits-collage", label: "Credits", Component: CreditsCollagePage },
  ...GALLERY_IMAGES.map(({ id, src, alt }) => ({
    id,
    label: alt,
    Component: () => <ImageCard src={src} alt={alt} />,
  })),
  { id: "contribution", label: "Contribution to the project", Component: ContributionPage },
  { id: "watch-teaser", label: "Watch teaser", Component: WatchTeaserPage },
];
