import Nav from "@/components/Nav";
import BottomEdgeFade from "@/components/BottomEdgeFade";
import BeaconLongForm from "@/components/case-study/beacon/BeaconLongForm";

// The actual case-study content, split out from BeaconCaseStudy.tsx so it
// can be next/dynamic-imported with ssr:false there (see that file's own
// doc comment for why — Beacon is password-gated and this keeps the copy
// out of the initial HTML/flight payload until unlocked).
//
// Rebuilt a second time (Figma 136:5703) — back to one long scrolling
// page instead of the page-by-page presentation this shipped as most
// recently (components/case-study/beacon/pages.tsx and its own
// "*Page.tsx" components are gone, not just unlisted). <Nav/> is
// rendered directly here now rather than by CaseStudy.tsx (which owned
// it for the page-by-page version, alongside its own bottom Prev/Next
// chrome) — this rebuild has no page-level Prev/Next of its own, only
// the two in-page CardRow browsers BeaconLongForm's own sections render.
//
// <BottomEdgeFade/> — the same fixed bottom-of-viewport blur/gradient
// strip the home page uses (app/page.tsx), added here on direct
// instruction so a long-scrolling page reads consistently across the
// site rather than the home page being the only one with it. Same
// reasoning as there: fixed and pointer-events-none, so it sits above
// this page's own content without ever intercepting a click meant for
// it, and it needs no props — it already reads the page's own bg-default/
// bg-tertiary tokens directly, which flip correctly with this page's own
// ThemeProvider exactly like Home's.
export default function BeaconCaseStudyBody() {
  return (
    <>
      <Nav />
      <BeaconLongForm />
      <BottomEdgeFade />
    </>
  );
}
