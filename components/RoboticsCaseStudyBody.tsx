import Nav from "@/components/Nav";
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
// <Nav label="Revolution Robotics"/> — same Figma nav treatment as
// Beacon's own page (see BeaconCaseStudyBody.tsx's own doc comment for
// why this no longer also renders a separate <BackButton/> here — Nav
// owns that now). <BottomEdgeFade/> for the same reason Beacon's own
// page has it: a long-scrolling page reading consistently with the
// home page's own fixed bottom blur strip.
export default function RoboticsCaseStudyBody() {
  return (
    <>
      <Nav label="Revolution Robotics" />
      <RoboticsLongForm />
      <BottomEdgeFade />
    </>
  );
}
