import Image from "next/image";

// Figma 122:4341 ("Overview") — this project's own cover card: a
// gradient-backed panel (this project's own brown/orange wash, not
// Beacon's teal) holding the project statement, a Project/Year/Team
// meta block, and a single photo. Every color here is a fixed literal,
// not this system's own theme-flipping tokens — same reasoning as
// Beacon's own OverviewPage: a photo-backed gradient card needs to read
// exactly the same regardless of the site's light/dark theme, not flip
// with it.
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
      <div className="flex h-full w-full flex-col gap-4 overflow-hidden rounded-[inherit] p-6">
        <div className="flex flex-col gap-4">
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
        {/* aspect-[392/242]: Figma's own literal h-242 against this
            card's own 392px content width (440 minus this card's own
            24px padding on each side) — same "convert a fixed height
            at a reference width into a ratio" technique every other
            image block in this system uses, so it scales with the
            card's own width instead of clipping or leaving a gap once
            it isn't exactly 440px wide. */}
        <div className="relative w-full overflow-hidden rounded-2xl bg-[rgba(244,244,244,0.05)]" style={{ aspectRatio: "392 / 242" }}>
          <Image
            src="/images/home/robotics-cover-phone.jpg"
            alt="A phone showing the Revolution Robotics app's robot-configuration screen, resting on a table beside an orange carpet"
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
