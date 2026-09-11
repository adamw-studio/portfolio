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

// No sitewide <Nav /> here anymore — the case-study presentation (Figma
// 87:1192, components/case-study/) replaces it with its own dedicated
// "Back to Home" + Prev/Next chrome (CaseStudyBackButton/CaseStudyNav),
// deliberately: the brief calls for "minimal interface chrome" and a
// full-viewport presentation, and the Home/Play segmented control has no
// role once a case study takes over the whole screen. PasswordGate keeps
// rendering its own BackButton while locked either way, independent of
// this.
export default function BeaconCaseStudy() {
  return (
    <ThemeProvider>
      <PasswordGate password={BEACON_PASSWORD} storageKey="beacon-unlocked">
        <BeaconCaseStudyBody />
      </PasswordGate>
    </ThemeProvider>
  );
}
