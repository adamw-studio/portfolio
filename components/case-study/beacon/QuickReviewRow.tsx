import { Eyebrow } from "@/components/case-study/primitives";
import QuickReviewCards from "@/components/case-study/beacon/QuickReviewCards";

// Figma 158:1066 — replaces this section's own earlier CardRow-based
// horizontal scroller with the home page's own scattered card-stack
// (see QuickReviewCards.tsx's own doc comment): "same logic as on the
// home page with these cards," on direct instruction, not a narrower
// visual-only port the way QualityTiles.tsx's own reuse of that same
// system deliberately left the click interaction out of.
export default function QuickReviewRow() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="w-full max-w-[512px]" style={{ marginInline: "auto" }}>
        <Eyebrow>[ Quick review ]</Eyebrow>
      </div>
      <QuickReviewCards />
    </div>
  );
}
