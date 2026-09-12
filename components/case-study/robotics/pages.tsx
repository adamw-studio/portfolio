import type { CaseStudyPageConfig } from "@/components/case-study/types";
import OverviewPage from "@/components/case-study/robotics/OverviewPage";
import ContextPage from "@/components/case-study/robotics/ContextPage";
import DiscoveryPage from "@/components/case-study/robotics/DiscoveryPage";
import IterationsPage from "@/components/case-study/robotics/IterationsPage";
import OutcomePage from "@/components/case-study/robotics/OutcomePage";

// Same page-by-page presentation as Beacon (see components/case-study/
// beacon/pages.tsx for the fuller reasoning) — Figma 122:4341/4354/
// 4371/4552/4576, in that order.
export const ROBOTICS_PAGES: CaseStudyPageConfig[] = [
  { id: "overview", label: "Overview", Component: OverviewPage },
  { id: "context", label: "Context", Component: ContextPage },
  { id: "discovery", label: "Discovery", Component: DiscoveryPage },
  { id: "iterations", label: "Iterations", Component: IterationsPage },
  { id: "outcome", label: "Outcome", Component: OutcomePage },
];
