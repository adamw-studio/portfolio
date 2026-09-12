"use client";

import { Suspense } from "react";
import { ThemeProvider } from "@/components/ThemeContext";
import { CaseStudy } from "@/components/case-study/CaseStudy";
import { ROBOTICS_PAGES } from "@/components/case-study/robotics/pages";

// Rebuilt from scratch (Figma 122:4341 etc.) as the same page-by-page
// presentation Beacon uses, instead of the one long scrolling narrative
// this page used to be — see components/case-study/ for the reusable
// framework this renders through. Robotics isn't password-gated (only
// Beacon is), so unlike BeaconCaseStudy this doesn't need the
// dynamic-import/ssr:false split that keeps gated copy out of the
// initial HTML.
//
// "use client" is still required here even so: ROBOTICS_PAGES carries
// raw component *function references* (CaseStudyPageConfig's own
// Component field) as a prop into CaseStudy (itself a Client Component
// for its own navigation state) — passing a function from a Server
// Component into a Client Component isn't serializable across that
// boundary and fails the build outright ("Functions cannot be passed
// directly to Client Components"), confirmed live. Marking this file
// client too keeps the whole hand-off on one side of that boundary.
//
// <Suspense>, also confirmed live as needed: without Beacon's own
// ssr:false escape hatch, this page actually gets statically
// prerendered, and CaseStudy internally calls useSearchParams() (to
// sync ?casePage= — see its own comment) — Next.js requires any
// useSearchParams() call reachable during static rendering to sit
// under a Suspense boundary, or the build fails outright. No visible
// fallback needed: the very first paint already has real content
// (index 0) the instant hydration finishes, so a loading skeleton
// here would only ever flash for a server-rendered class of client
// that doesn't apply to a statically-generated page anyway.
export default function RoboticsCaseStudy() {
  return (
    <ThemeProvider>
      <Suspense>
        <CaseStudy pages={ROBOTICS_PAGES} />
      </Suspense>
    </ThemeProvider>
  );
}
