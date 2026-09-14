import Header from "@/components/case-study/documentary/Header";
import QuickReviewRow from "@/components/case-study/documentary/QuickReviewRow";
import ContextSection from "@/components/case-study/documentary/ContextSection";
import SixMonthsEarlierSection from "@/components/case-study/documentary/SixMonthsEarlierSection";
import WorkInProgressRow from "@/components/case-study/documentary/WorkInProgressRow";
import ContributionSection from "@/components/case-study/documentary/ContributionSection";
import ContributionsRow from "@/components/case-study/documentary/ContributionsRow";
import WatchTeaserSection from "@/components/case-study/documentary/WatchTeaserSection";
import Footer from "@/components/case-study/documentary/Footer";

// Figma 165:2761 ("Symphony of Disorder-Project-Page") — rebuilt as one
// long scrolling page, the same treatment Beacon and Robotics got
// earlier this session (see BeaconLongForm.tsx/RoboticsLongForm.tsx for
// the fuller reasoning this mirrors). pages.tsx and every "*Page.tsx"
// component it pointed at (Overview, Context, SixMonthsEarlier,
// Contribution, CreditsCollage, WatchTeaser) are gone here too, not
// just unlisted — their copy/assets live on inside this file's own
// section components instead.
//
// Two CardRow galleries this time, not Beacon's one (or Robotics' zero)
// — "Some work in-progress images" and "Contributions" — each its own
// max-w-[1240px]-equivalent full-bleed row (CardRow's own breakout),
// same split as Beacon's own page between the narrow 512px narrative
// column and its wider embedded rows. The Quick review fan here stays
// under 512px at rest (CONTAINER_W 436), unlike Robotics' own 568px
// fan, so it doesn't need its own wider wrapper the way Robotics'
// LongForm gives its fan.
//
// gap-11 (44px) between top-level groups; gap-16 (64px) within each
// multi-section block (Context+6 months earlier; Work-in-progress
// gallery+Contribution+Contributions gallery+Watch teaser) — same
// top-level/inner rhythm as Beacon and Robotics.
export default function DocumentaryLongForm() {
  return (
    <div className="mx-auto flex w-full flex-col items-center gap-11 px-4 pb-16 pt-32 sm:pt-36">
      <div className="w-full max-w-[512px]">
        <Header />
      </div>
      <QuickReviewRow />
      <div className="flex w-full max-w-[512px] flex-col gap-16">
        <ContextSection />
        <SixMonthsEarlierSection />
      </div>
      <div className="flex w-full flex-col items-center gap-16">
        <WorkInProgressRow />
        <div className="w-full max-w-[512px]">
          <ContributionSection />
        </div>
        <ContributionsRow />
        <div className="w-full max-w-[512px]">
          <WatchTeaserSection />
        </div>
      </div>
      <div className="w-full max-w-[512px]">
        <Footer />
      </div>
    </div>
  );
}
