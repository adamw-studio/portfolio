// Figma 122:4590 ("Overview") — this project's own cover card: a
// gradient-backed panel (this project's own brown/orange wash, not
// Beacon's teal) holding the project statement and a Project/Year/Team
// meta block, pushed to the top and bottom of the card (justify-between)
// with the gradient itself filling the empty space between them — no
// photo on this card at all. An earlier fetch of this same card
// (122:4341) had one; this later, more specific fetch drops it
// outright, confirmed live rather than assumed dropped by accident (its
// own metadata has no image node anywhere in the tree, and the
// screenshot shows plain gradient where that photo used to sit).
//
// Every color here is a fixed literal, not this system's own theme-
// flipping tokens — same reasoning as Beacon's own OverviewPage: a
// gradient cover card needs to read exactly the same regardless of the
// site's light/dark theme, not flip with it.
//
// rounded-24/padding-24/border-subtle, not Beacon's own rounded-20/
// padding-28: this card's own Figma node specifies those values
// directly — literal Figma data wins over copying a sibling
// implementation's numbers just because the two cards look similar.
//
// The outer frame (border/gradient background/shadow) never clips its
// own content — a separate inner layer does that, same fix Beacon's
// own OverviewPage needed once CaseStudyStage started scaling the
// active card (see that file's own comment for the fuller reasoning).
const FRAME =
  "w-full max-w-[440px] rounded-[24px] border border-[rgba(244,244,244,0.1)] shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)]";

const META = [
  { label: "Project", value: "Revolution Robotics" },
  { label: "Year", value: "2021-22" },
  { label: "Team", value: "Borbala German (UX Researcher) / Adam Weber (UX Lead)" },
] as const;

export default function OverviewPage() {
  return (
    <div
      className={FRAME}
      style={{
        aspectRatio: "440 / 600",
        backgroundImage: "linear-gradient(215.82deg, rgb(170, 109, 63) 0.899%, rgb(55, 19, 4) 99.528%)",
      }}
    >
      <div className="flex h-full w-full flex-col justify-between overflow-hidden rounded-[inherit] p-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5 font-sans text-[14px] italic leading-6 tracking-[-0.112px] text-[rgba(244,244,244,0.4)]">
            <p>UX Lead, UI Designer</p>
            <p>/</p>
            <p>2021-2022</p>
          </div>
          {/* text-[18px] below sm: — same reasoning as Beacon's own
              OverviewPage headline: Figma's own literal 24px reads
              oversized once a real narrow phone wraps this 3-line
              statement, since the card's own width already scales
              down below 472px viewports (CaseStudyStage's own
              LANE_WIDTH). 18/22 matches this system's Heading "sm"
              scale; sm: (Tailwind's 640px) sits comfortably past
              that 472px crossover. */}
          <p className="font-sans text-[18px] font-semibold leading-[22px] tracking-[-0.144px] text-[#f4f4f4] sm:text-[24px] sm:leading-[28px] sm:tracking-[-0.192px]">
            Making kids robotics programs affordable, accessible, educational, fair and fun
          </p>
        </div>
        <div className="flex flex-col gap-1.5 font-sans text-[14px] tracking-[-0.112px]">
          {META.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <p className="shrink-0 text-[rgba(244,244,244,0.4)]">{label}</p>
              <p className="text-right text-[#f4f4f4]">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
