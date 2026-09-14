"use client";

import dynamic from "next/dynamic";
import { PasswordGate } from "@/components/PasswordGate";
import { ThemeProvider } from "@/components/ThemeContext";

// Figma 304:9017/304:12070/304:12160 — Beacon is the one project behind a
// password gate (client-side only; see PasswordGate's own doc comment for
// what that does and doesn't protect against).
const BEACON_PASSWORD = "PrEtZelDay2_0_2_6";

// ssr:false is the point, not an optimization: it's what keeps the actual
// case-study copy (BeaconCaseStudyBody) out of the server-rendered HTML
// and the RSC flight payload entirely while locked, instead of shipping it
// to the client already and merely choosing not to display it — see that
// file's own doc comment. This is also *why* this file itself has to be
// "use client": ssr:false only works from inside a Client Component.
const BeaconCaseStudyBody = dynamic(() => import("@/components/BeaconCaseStudyBody"), { ssr: false });

// <Nav label="Beacon"/> and <BackButton/> are rendered by
// BeaconCaseStudyBody itself (unlike the sitewide Home/Play <Nav/> plus
// bottom-center Prev/Next chrome CaseStudy.tsx renders for the other,
// page-by-page case studies) — this one has no page-level Prev/Next of
// its own. PasswordGate keeps rendering its own BackButton while locked
// either way, independent of this.
export default function BeaconCaseStudy() {
  return (
    <ThemeProvider>
      <PasswordGate password={BEACON_PASSWORD} storageKey="beacon-unlocked">
        <BeaconCaseStudyBody />
      </PasswordGate>
    </ThemeProvider>
  );
}
