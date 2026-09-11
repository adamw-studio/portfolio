import type { CaseStudyPageConfig } from "@/components/case-study/types";
import OverviewPage from "@/components/case-study/beacon/OverviewPage";
import HowItStartedPage from "@/components/case-study/beacon/HowItStartedPage";
import FirstStepsPage from "@/components/case-study/beacon/FirstStepsPage";
import CollectingInsightsPage from "@/components/case-study/beacon/CollectingInsightsPage";
import ReflectionPage from "@/components/case-study/beacon/ReflectionPage";
import TurningPointPage from "@/components/case-study/beacon/TurningPointPage";
import SoWhereAreWeNowPage from "@/components/case-study/beacon/SoWhereAreWeNowPage";

// Building this one page at a time — every page from the original first
// pass (Context/Problem/Research/Design Direction/Product/Process/
// Outcome) beyond what's listed here is still removed, not just
// unlisted; adding the next one back is a new page component + one more
// entry in this array. CaseStudy.tsx itself doesn't care how long this
// array is — next/prev bounds and the slide transition both derive from
// its length alone.
export const BEACON_PAGES: CaseStudyPageConfig[] = [
  { id: "overview", label: "Overview", Component: OverviewPage },
  { id: "how-it-started", label: "How it started", Component: HowItStartedPage },
  { id: "first-steps", label: "First steps", Component: FirstStepsPage },
  { id: "collecting-insights", label: "Collecting insights", Component: CollectingInsightsPage },
  { id: "reflection", label: "Reflection on user’s feedback", Component: ReflectionPage },
  { id: "turning-point", label: "Turning point", Component: TurningPointPage },
  { id: "so-where-are-we-now", label: "So, where are we now?", Component: SoWhereAreWeNowPage },
];
