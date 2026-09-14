import { Eyebrow } from "@/components/case-study/primitives";
import QuickReviewCards from "@/components/case-study/documentary/QuickReviewCards";

// Figma 165:2834 — same "[Quick Review]" eyebrow-over-fan shape as
// Robotics' own QuickReviewRow.tsx, text verbatim from this node.
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
