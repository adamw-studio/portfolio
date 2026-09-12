import Image from "next/image";

// Figma 126:5238 ("Overview") — this project's own cover card: a
// gradient-backed panel (this project's own deep red wash, distinct
// from Beacon's teal and Robotics' brown), the project statement, and
// a single photo — no Project/Year/Team meta block on this one (unlike
// Robotics' own cover), matching this node's own literal content
// exactly rather than copying a sibling card's shape.
//
// Every color here is a fixed literal, not this system's own theme-
// flipping tokens — same reasoning as every other cover card in this
// system: a gradient/photo cover needs to read exactly the same
// regardless of the site's light/dark theme, not flip with it.
//
// rounded-24/padding-24/border-subtle: this card's own Figma node
// specifies those values directly, same as Robotics' own cover.
//
// The outer frame (border/gradient background/shadow) never clips its
// own content — a separate inner layer does that, same fix every other
// cover card in this system needed once CaseStudyStage started scaling
// the active card.
const FRAME =
  "w-full max-w-[440px] rounded-[24px] border border-[rgba(244,244,244,0.1)] shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)]";

export default function OverviewPage() {
  return (
    <div
      className={FRAME}
      style={{
        aspectRatio: "440 / 600",
        backgroundImage: "linear-gradient(215.82deg, rgb(170, 63, 63) 0.899%, rgb(92, 4, 4) 99.528%)",
      }}
    >
      {/* justify-between, not gap-4: Figma's own screenshot shows the
          text block pinned to the top and the image pinned to the
          bottom, with the gradient filling the real empty space between
          them — reported live as the image sitting right under the
          heading instead, which is what a plain gap (rather than
          pushing the two children to opposite ends) actually produces. */}
      <div className="flex h-full w-full flex-col justify-between overflow-hidden rounded-[inherit] p-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5 font-sans text-[14px] italic leading-6 tracking-[-0.112px] text-[rgba(244,244,244,0.4)]">
            <p>Graphic Designer, Executive Producer</p>
            <p>/</p>
            <p>2025</p>
          </div>
          {/* text-[18px] below sm: — same reasoning as every other cover
              card's own headline in this system: Figma's own literal
              24px reads oversized once a real narrow phone wraps this
              multi-line statement, since the card's own width already
              scales down below 472px viewports (CaseStudyStage's own
              LANE_WIDTH). */}
          <p className="font-sans text-[18px] font-semibold leading-[22px] tracking-[-0.144px] text-[#f4f4f4] sm:text-[24px] sm:leading-[28px] sm:tracking-[-0.192px]">
            Designing the poster and typography system for a documentary.
          </p>
        </div>
        {/* aspect-[392/242]: Figma's own literal h-242 against this
            card's own 392px content width (440 minus this card's own
            24px padding on each side) — same "convert a fixed height
            at a reference width into a ratio" technique every other
            image block in this system uses. */}
        <div className="relative w-full overflow-hidden rounded-2xl bg-[rgba(244,244,244,0.05)]" style={{ aspectRatio: "392 / 242" }}>
          <Image
            src="/images/home/documentary-cover-studio.jpg"
            alt="A woman in a yellow jacket stepping into an art studio, sunlight streaming through the doorway"
            fill
            className="object-cover"
            sizes="(min-width: 480px) 384px, 100vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}
