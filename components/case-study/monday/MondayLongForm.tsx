import Image from "next/image";
import Header from "@/components/case-study/monday/Header";
import ContextSection from "@/components/case-study/monday/ContextSection";
import InsightsSection from "@/components/case-study/monday/InsightsSection";
import InsightsVideo from "@/components/case-study/monday/InsightsVideo";
import CreativeIdeaSection from "@/components/case-study/monday/CreativeIdeaSection";
import FirstRoundGallery from "@/components/case-study/monday/FirstRoundGallery";
import SecondRoundGallery from "@/components/case-study/monday/SecondRoundGallery";
import VisualLanguageSection from "@/components/case-study/monday/VisualLanguageSection";
import SystemSection from "@/components/case-study/monday/SystemSection";
import ExpressionSection from "@/components/case-study/monday/ExpressionSection";
import GalleryD from "@/components/case-study/monday/GalleryD";
import GalleryE from "@/components/case-study/monday/GalleryE";
import Footer from "@/components/case-study/monday/Footer";

// Figma 206:5217 ("Monday-Project-Page") — same one-long-scrolling-page
// shape as Beacon/Robotics (see RoboticsLongForm.tsx's own doc comment),
// a plain 512px narrative column throughout (this page has no wider
// card-fan section the way Robotics' own Quick review does, so there's
// no reason for the outer column here to go unconstrained).
//
// gap-16 (64px) between every top-level block uniformly, not a distinct
// gap value reverse-engineered per pair from Figma's own absolute
// canvas y-positions — those gaps actually vary unevenly there (380 to
// 456px at this page's real 512px column width, roughly 36-44px once
// everything is later scaled back down through Figma's own root-frame
// scale factor), which reads as organic canvas placement rather than a
// deliberately tuned rhythm worth chasing to the pixel — matching
// RoboticsLongForm's own already-established flat inter-section gap
// instead.
export default function MondayLongForm() {
  return (
    <div className="mx-auto flex w-full max-w-[512px] flex-col items-center gap-16 px-4 pb-16 pt-32 sm:pt-36">
      <Header />
      <div className="relative w-full overflow-hidden rounded-[20px] bg-bg-tertiary" style={{ aspectRatio: "512 / 300" }}>
        <Image src="/images/home/monday-hero.jpg" alt="Monday's visual identity" fill className="object-cover" sizes="512px" priority />
      </div>
      <ContextSection />
      <InsightsSection />
      <InsightsVideo />
      <CreativeIdeaSection />
      <FirstRoundGallery />
      <SecondRoundGallery />
      <VisualLanguageSection />
      <SystemSection />
      <ExpressionSection />
      <GalleryD />
      <GalleryE />
      <Footer />
    </div>
  );
}
