import Nav from "@/components/Nav";
import { BackButton } from "@/components/BackButton";
import BottomEdgeFade from "@/components/BottomEdgeFade";
import DocumentaryLongForm from "@/components/case-study/documentary/DocumentaryLongForm";

// Rebuilt as one long scrolling page (Figma 165:2761) — see
// DocumentaryLongForm.tsx's own doc comment for the fuller reasoning,
// same treatment Beacon/Robotics already got this session.
//
// <Nav label="Symphony of Disorder"/> + <BackButton columnWidth={512}/>
// — same nav treatment as Beacon/Robotics' own pages, this project's
// own name in the pill instead. <BottomEdgeFade/> for the same reason
// every other long-scroll case-study page here has it.
export default function DocumentaryCaseStudyBody() {
  return (
    <>
      <Nav label="Symphony of Disorder" />
      <BackButton columnWidth={512} />
      <DocumentaryLongForm />
      <BottomEdgeFade />
    </>
  );
}
