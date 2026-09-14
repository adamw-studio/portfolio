import Nav from "@/components/Nav";
import { BackButton } from "@/components/BackButton";
import BottomEdgeFade from "@/components/BottomEdgeFade";
import RoboticsLongForm from "@/components/case-study/robotics/RoboticsLongForm";

// Rebuilt as one long scrolling page (Figma 161:1624/164:2656), the same
// treatment Beacon's own case study got — see BeaconCaseStudyBody.tsx's
// own doc comment for the fuller reasoning this mirrors. pages.tsx and
// every "*Page.tsx" component it pointed at (OverviewPage, ContextPage,
// DiscoveryPage, IterationsPage, OutcomePage) are gone, not just
// unlisted — their copy/assets live on inside RoboticsLongForm's own
// section components instead.
//
// Unlike Beacon, Robotics was never password-gated, so this renders
// directly (no PasswordGate, no next/dynamic ssr:false wrapper) — see
// RoboticsCaseStudy.tsx's own doc comment for what that simplifies.
//
// <Nav label="Revolution Robotics"/> + <BackButton columnWidth={512}/> —
// same Figma 164:2274/164:2279 nav treatment as Beacon's own page, this
// project's own name in the pill instead. <BottomEdgeFade/> for the same
// reason Beacon's own page has it: a long-scrolling page reading
// consistently with the home page's own fixed bottom blur strip.
export default function RoboticsCaseStudyBody() {
  return (
    <>
      <Nav label="Revolution Robotics" />
      <BackButton columnWidth={512} />
      <RoboticsLongForm />
      <BottomEdgeFade />
    </>
  );
}
