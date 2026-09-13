import { Exhibit } from "@/components/case-study/primitives";

// Figma 158:1062 — replaces QualityTiles.tsx's own interactive sticky-
// note fan (the five "questions that drove the workshop" as separate
// draggable-feeling cards) with a single flat recap graphic, on direct
// instruction: "remove the cards and replace it by an image
// placeholder." Same five questions, same five brand colors, now hand-
// drawn as one illustration instead of five DOM cards — so the whole
// stagger-reveal/hover-lift interaction QualityTiles ported from
// AboutCardStack goes with it; there's nothing left to hover or drag.
//
// Two real theme-specific exports (both transparent PNGs — dark ink on
// nothing for light, light ink on nothing for dark — not one asset plus
// a CSS invert filter): invert works for the monochrome connector-arrow
// SVGs elsewhere on this page (a single black stroke flips cleanly to
// white), but this graphic's five brand colors (gold/teal/orange/blue/
// red) would all shift to wrong, unintended hues under invert, not just
// its black-or-white text.
export default function WorkshopQuestionsExhibit() {
  return (
    <Exhibit
      src="/images/home/beacon-workshop-questions-light.png"
      darkSrc="/images/home/beacon-workshop-questions-dark.png"
      alt="Five hand-drawn workshop questions that framed the discussion: What is quality? Why are we drawn to things that are quality? What would be your 11-star experience? What makes a great product? Treasure Island."
      height={240}
      frame={false}
    />
  );
}
