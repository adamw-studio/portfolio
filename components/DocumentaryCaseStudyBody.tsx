import Nav from "@/components/Nav";
import BottomEdgeFade from "@/components/BottomEdgeFade";
import DocumentaryLongForm from "@/components/case-study/documentary/DocumentaryLongForm";

// Rebuilt as one long scrolling page (Figma 165:2761) — see
// DocumentaryLongForm.tsx's own doc comment for the fuller reasoning,
// same treatment Beacon/Robotics already got this session.
//
// <Nav label="Symphony of Disorder"/> — same nav treatment as
// Beacon/Robotics' own pages (see BeaconCaseStudyBody.tsx's own doc
// comment for why this no longer also renders a separate
// <BackButton/> here — Nav owns that now). <BottomEdgeFade/> for the
// same reason every other long-scroll case-study page here has it.
export default function DocumentaryCaseStudyBody() {
  return (
    <>
      <Nav label="Symphony of Disorder" />
      <DocumentaryLongForm />
      <BottomEdgeFade />
    </>
  );
}
