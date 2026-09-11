import type { CaseStudyPageConfig } from "@/components/case-study/types";
import OverviewPage from "@/components/case-study/beacon/OverviewPage";

// Building this one page at a time — every other page from the original
// pass (Context/Problem/Research/Design Direction/Product/Process/
// Outcome) is removed for now, not just unlisted; adding the next one
// back is a new page component + one more entry here. CaseStudy.tsx
// itself doesn't care how long this array is — Prev/Next simply both
// stay disabled while there's only one page.
export const BEACON_PAGES: CaseStudyPageConfig[] = [{ id: "overview", label: "Overview", Component: OverviewPage, peek: true }];
