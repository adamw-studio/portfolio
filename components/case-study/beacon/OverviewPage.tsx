import Image from "next/image";

// Figma 87:1442 ("Frame 2147204695") — the case study's own literal cover
// card, 440x600, nested directly under the case-study frame (87:1192).
// That width happens to match the number this page's card was already
// resized to earlier by feel (see this file's git history) — a nice
// confirmation, not a coincidence to re-derive.
//
// Every color here is a fixed literal, not this system's own
// --color-text-primary/border-subtle tokens (primitives.tsx's Eyebrow/
// Heading): same reasoning as BeaconComposer's own glass panel — a
// photo-backed gradient card needs to read exactly the same regardless
// of the site's light/dark theme, not flip with it. That's also why this
// page reaches for its own markup instead of those shared primitives,
// which bake the theme-flipping text-text-primary/text-subtle tokens in.
//
// The outer frame (border/gradient background/shadow) never clips its
// own content — a separate inner layer does that. One element painting
// a border *and* clipping via overflow-hidden at the same radius is
// exactly the combination that showed a rendering seam at the rounded
// corner once CaseStudyStage started applying `transform: scale()` to
// the active card (reported live as a border/corner artifact); see
// ScrollFadeCard's own doc comment (primitives.tsx) for the fuller
// version of this same fix, applied here by hand since this card
// doesn't use that component.
const FRAME = "w-full max-w-[440px] rounded-[20px] border border-[rgba(244,244,244,0.1)] shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)]";

export default function OverviewPage() {
  return (
    <div
      className={FRAME}
      style={{
        aspectRatio: "440 / 600",
        backgroundImage: "linear-gradient(215.82deg, rgb(0, 162, 194) 0.899%, rgb(3, 123, 147) 99.528%)",
      }}
    >
      <div className="flex h-full w-full flex-col justify-between overflow-hidden rounded-[inherit] p-7">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5 font-sans text-[14px] italic leading-6 tracking-[-0.112px] text-[rgba(244,244,244,0.4)]">
            <p>Lead designer</p>
            <p>/</p>
            <p>2026</p>
          </div>
          {/* text-[18px] below sm: — literal Figma 24px, but reported live
              as reading oversized once a real narrow phone (not just a
              shrunk desktop window) wraps this headline to 4 lines: the
              card's own width already scales down below 472px viewports
              (CaseStudyStage's own LANE_WIDTH), so the type has to shrink
              with it instead of staying pinned at the widest-card size.
              18/22 matches this system's own Heading "sm" scale — sm:
              (Tailwind's 640px) is comfortably past that 472px crossover,
              so the switch only ever happens once the card is genuinely
              back to its full 440px width. */}
          <p className="font-sans text-[18px] font-semibold leading-[22px] tracking-[-0.144px] text-[#f4f4f4] sm:text-[24px] sm:leading-[28px] sm:tracking-[-0.192px]">
            Designing how agentic AI helps founders research, validate and turn ideas into ventures.
          </p>
        </div>

        {/* Figma 97:2107 — a cropped product-screenshot preview: the real
            screenshot sits taller and wider than the window that clips it
            (530x358 inside a 382x242 frame), so only its top-left corner
            peeks through over a photo backdrop. Percentages, not Figma's
            literal px, place it inside this block: the block itself scales
            with the card's own width below 440px (the card's aspect-ratio
            above), and a fixed px offset would drift out of place the
            moment it does. */}
        <div className="relative aspect-[382/242] w-full overflow-hidden rounded-xl">
          <Image
            src="/images/home/beacon-thumb-backdrop.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 480px) 384px, 100vw"
          />
          <div className="absolute left-[6.3%] top-[11.6%] h-[147.9%] w-[138.7%] overflow-hidden rounded-xl">
            <Image
              src="/images/home/beacon-thumb-screen.jpg"
              alt="Screenshot of the Beacon workspace: a list of AI-generated venture ideas alongside a detail panel"
              fill
              className="object-cover"
              sizes="(min-width: 480px) 533px, 139vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
