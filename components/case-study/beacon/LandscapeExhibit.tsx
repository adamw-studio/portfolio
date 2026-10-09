import Image from "next/image";

// Figma 239:549's own repeated exhibit shape: a product screenshot
// floating, inset and rounded, over a much larger crop of the same
// painterly landscape illustration Beacon's own onboarding flow already
// uses as half of its split-screen UI (the screenshots themselves —
// "Create new workspace" etc. — literally have this art baked into
// their own right half already; the oversized background behind them
// here is the same illustration, just cropped wider, so the screenshot
// reads as floating in front of more of the same scene rather than a
// plain card).
//
// Figma composites this by hand per exhibit — the inset screenshot is a
// FIXED 488x329px, positioned (and clipped) differently in each of the
// five cards this node has, including the two 336px-wide ones where
// that fixed size is deliberately wider than its own card and gets
// cropped by the card's own overflow-hidden. That's one-off art
// direction for one specific 1440px canvas, not a layout rule — it has
// no responsive equivalent (a 488px fixed inset would blow out a phone-
// width card entirely). This keeps the same two-layer idea (bleeding
// background + inset screenshot) but sizes the inset proportionally
// (92% width, vertically centered) so it scales down the same way
// every other exhibit on this page already does, rather than copying
// one canvas's own fixed pixel offsets.
export default function LandscapeExhibit({
  bg,
  bgAlt = "",
  src,
  alt,
  height = 400,
  width = 512,
}: {
  bg: string;
  bgAlt?: string;
  src: string;
  alt: string;
  height?: number;
  width?: number;
}) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-lg bg-black"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <Image src={bg} alt={bgAlt} fill className="object-cover" sizes="(min-width: 688px) 688px, 100vw" />
      <div className="absolute inset-0 flex items-center justify-center p-[4%]">
        <div className="relative h-[82%] w-[92%] overflow-hidden rounded-sm shadow-[0px_8px_24px_0px_rgba(0,0,0,0.35)]">
          <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 688px) 633px, 92vw" />
        </div>
      </div>
    </div>
  );
}
