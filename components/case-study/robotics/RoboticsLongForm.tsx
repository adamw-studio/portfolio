import Header from "@/components/case-study/robotics/Header";
import QuickReviewRow from "@/components/case-study/robotics/QuickReviewRow";
import ContextSection from "@/components/case-study/robotics/ContextSection";
import DiscoverySection from "@/components/case-study/robotics/DiscoverySection";
import IterationsSection from "@/components/case-study/robotics/IterationsSection";
import OutcomeSection from "@/components/case-study/robotics/OutcomeSection";
import Footer from "@/components/case-study/robotics/Footer";

// Figma 161:1624 ("Revolution Robotics-Project-Page", light) / 164:2656
// (dark) — rebuilt as one long scrolling page, mirroring Beacon's own
// rebuild (components/case-study/beacon/BeaconLongForm.tsx) rather than
// the page-by-page carousel this shipped as before (pages.tsx and every
// "*Page.tsx" it pointed at are removed here too, not just unlisted).
//
// Unlike Beacon, this page has no horizontal CardRow browser — the
// Quick review fan is this project's only departure from the plain
// 512px narrative column, and it's a scattered card stack
// (QuickReviewCards.tsx), not a scrolling row. But its own reference
// frame (CONTAINER_W = 568) is still WIDER than that 512px column, the
// same reason Beacon's own QuickReviewRow isn't nested inside its
// 512px-capped narrative block either — capping this section's own
// wrapper to 512px would force QuickReviewCards' own responsive
// scale-to-fit below 1 even at rest on a full-width desktop viewport,
// not just on genuinely narrow ones. So the outer column here carries
// no max-width of its own; every section sets its own (512px for the
// narrative ones, unconstrained up to its own CONTAINER_W for the fan),
// same split Beacon's own page uses for its wider CardRow sections.
//
// gap-11 (44px) between top-level groups (Header, Quick review, the
// four narrative sections as one block, Footer) — same top-level rhythm
// as Beacon's own page; gap-16 (64px) between the four narrative
// sections themselves, matching 161:1631's own explicit gap-[64px]
// class exactly (this page's own content column is one flat group with
// four children, not Beacon's nested nested nested pairing).
export default function RoboticsLongForm() {
  return (
    <div className="mx-auto flex w-full flex-col items-center gap-11 px-4 pb-16 pt-32 sm:pt-36">
      <div className="w-full max-w-[512px]">
        <Header />
      </div>
      <div className="w-full max-w-[568px]">
        <QuickReviewRow />
      </div>
      <div className="flex w-full max-w-[512px] flex-col gap-16">
        <ContextSection />
        <DiscoverySection />
        <IterationsSection />
        <OutcomeSection />
      </div>
      <div className="w-full max-w-[512px]">
        <Footer />
      </div>
    </div>
  );
}
