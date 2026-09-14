"use client";

import { ThemeProvider } from "@/components/ThemeContext";
import RoboticsCaseStudyBody from "@/components/RoboticsCaseStudyBody";

// Rebuilt as one long scrolling page (Figma 161:1624/164:2656) instead
// of the page-by-page CaseStudy carousel this used to wrap
// (components/case-study/robotics/pages.tsx and its own ROBOTICS_PAGES
// are gone — see RoboticsCaseStudyBody.tsx's own doc comment). No
// PasswordGate/next-dynamic ssr:false the way BeaconCaseStudy.tsx needs:
// Robotics was never behind a password gate, so there's no gated copy
// to keep out of the initial HTML/flight payload here — ThemeProvider
// is the only thing this wrapper still needs to supply.
export default function RoboticsCaseStudy() {
  return (
    <ThemeProvider>
      <RoboticsCaseStudyBody />
    </ThemeProvider>
  );
}
