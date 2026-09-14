import { Eyebrow } from "@/components/case-study/primitives";
import QuickReviewCards from "@/components/case-study/robotics/QuickReviewCards";

// Figma 164:2655 — same "[Quick Review]" eyebrow-over-fan shape as
// Beacon's own QuickReviewRow.tsx (158:1066 there), text verbatim from
// this node instead of assumed to match Beacon's own spacing/casing.
export default function QuickReviewRow() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="w-full max-w-[512px]" style={{ marginInline: "auto" }}>
        <Eyebrow>[Quick Review]</Eyebrow>
      </div>
      <QuickReviewCards />
    </div>
  );
}
