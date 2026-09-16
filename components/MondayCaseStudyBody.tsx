import Nav from "@/components/Nav";
import BottomEdgeFade from "@/components/BottomEdgeFade";
import MondayLongForm from "@/components/case-study/monday/MondayLongForm";

// Figma 206:5217 — same shape as RoboticsCaseStudyBody.tsx (see that
// file's own doc comment): Nav owns the back button/project label,
// BottomEdgeFade matches the home page's own fixed bottom blur strip.
// Never password-gated, like Robotics — no PasswordGate/next-dynamic
// ssr:false wrapper needed here either.
export default function MondayCaseStudyBody() {
  return (
    <>
      <Nav label="Monday" />
      <MondayLongForm />
      <BottomEdgeFade />
    </>
  );
}
