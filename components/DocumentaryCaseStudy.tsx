"use client";

import { Suspense } from "react";
import { ThemeProvider } from "@/components/ThemeContext";
import { CaseStudy } from "@/components/case-study/CaseStudy";
import { DOCUMENTARY_PAGES } from "@/components/case-study/documentary/pages";

// Rebuilt from scratch (Figma 126:5238 etc.) as the same page-by-page
// presentation Beacon/Robotics use, instead of the one long scrolling
// narrative this page used to be — see components/case-study/ for the
// reusable framework this renders through. Not password-gated (only
// Beacon is), so this renders CaseStudy directly rather than Beacon's
// own dynamic-import/ssr:false split (that split exists specifically to
// keep gated copy out of the initial HTML; there's no gate here for it
// to matter to).
//
// "use client" + <Suspense>: both required for the exact same reasons
// Robotics' own rewrite needed them (see that file's own doc comment
// for the full explanation, confirmed live for both there) —
// DOCUMENTARY_PAGES carries raw component function references into
// CaseStudy (a Client Component), which isn't serializable across a
// Server→Client boundary, and this page now actually gets statically
// prerendered without Beacon's own ssr:false escape hatch, so
// CaseStudy's own useSearchParams() call needs a Suspense boundary or
// the build fails outright.
export default function DocumentaryCaseStudy() {
  return (
    <ThemeProvider>
      <Suspense>
        <CaseStudy pages={DOCUMENTARY_PAGES} />
      </Suspense>
    </ThemeProvider>
  );
}
