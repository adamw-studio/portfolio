import { CaseStudy } from "@/components/case-study/CaseStudy";
import { BEACON_PAGES } from "@/components/case-study/beacon/pages";

// The actual case-study content, split out from BeaconCaseStudy.tsx so it
// can be next/dynamic-imported with ssr:false there. Beacon is
// password-gated (PasswordGate.tsx) — if this content lived directly in
// BeaconCaseStudy's own server-rendered JSX, Next.js would still have to
// serialize all of it into the page's initial HTML/flight payload for the
// client component to receive as `children`, whether or not the gate ever
// displays it — visible to anyone via "View Source" or a plain curl, no
// password or JS needed. Loading it as a separate chunk, fetched only
// after a correct submit, keeps the actual copy out of the page until
// then.
//
// Rebuilt from scratch (Figma 87:1192) as a page-by-page presentation
// instead of one long scrolling narrative — see components/case-study/
// for the reusable framework this and every future case study renders
// through. The narrative itself (BEACON_PAGES) is just data: reordering,
// adding or editing pages happens there, not in this file.
export default function BeaconCaseStudyBody() {
  return <CaseStudy pages={BEACON_PAGES} />;
}
