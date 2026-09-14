"use client";

import { ThemeProvider } from "@/components/ThemeContext";
import DocumentaryCaseStudyBody from "@/components/DocumentaryCaseStudyBody";

// Rebuilt as one long scrolling page (Figma 165:2761) instead of the
// page-by-page CaseStudy carousel this used to wrap (components/
// case-study/documentary/pages.tsx and its own DOCUMENTARY_PAGES are
// gone — see DocumentaryCaseStudyBody.tsx's own doc comment). No
// Suspense boundary needed any more either: that was only ever there
// for CaseStudy's own useSearchParams() call, which this rebuild's own
// component tree doesn't make. Not password-gated (only Beacon is), so
// ThemeProvider is the only thing this wrapper still needs to supply —
// same shape as RoboticsCaseStudy.tsx.
export default function DocumentaryCaseStudy() {
  return (
    <ThemeProvider>
      <DocumentaryCaseStudyBody />
    </ThemeProvider>
  );
}
