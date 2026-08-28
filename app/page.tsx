import Image from "next/image";
import HomeNav from "@/components/HomeNav";
import { Pill } from "@/components/Pill";

const shapesMe = [
  { icon: "/images/icons/light-bulb.svg", label: "Research" },
  { icon: "/images/icons/map-xmark.svg", label: "Product & Design strategy" },
  { icon: "/images/icons/network-right.svg", label: "Design Systems" },
  { icon: "/images/icons/cursor-pointer.svg", label: "Craft in canvas + code" },
];

// Body copy shares one style throughout: 14px/24px line-height so inline
// Pill chips (24px tall) sit flush within the text. Figma breaks each
// paragraph into manually-positioned lines at its fixed 688px frame width;
// here they're real wrapping <p> tags instead, so line breaks reflow
// naturally rather than being hard-coded to one viewport width.
const bodyText = "text-[14px] font-normal leading-6 tracking-[-0.056px] text-text-secondary";

export default function Home() {
  return (
    <div className="theme-dark flex flex-1 flex-col bg-bg-default px-4">
      {/* max-w-[688px] with no padding of its own: Figma's content column is
          exactly 688px wide with no additional inset. The px-4 above is a
          safety margin for viewports narrower than ~720px only — it doesn't
          shrink the column itself at desktop widths. */}
      <div className="mx-auto flex w-full max-w-[688px] flex-col">
        <div className="pt-6">
          <HomeNav />
        </div>

        <h1 className="mt-[104px] font-serif text-[20px] leading-6 tracking-[-0.28px] text-text-primary">
          Hey, I&rsquo;m Adam,
        </h1>

        <p className={`mt-3 ${bodyText}`}>
          A Senior Product Designer with <Pill className="text-text-link">5 years - 4 months</Pill> of experience
          across banking, education and enterprise tech at McKinsey &amp; Company, and now building 0 → 1 B2B
          products.
        </p>

        <p className={`mt-5 ${bodyText}`}>
          I currently lead design for <Pill className="text-text-primary">Beacon</Pill>, a B2B SaaS that helps
          businesses ideate and validate new business ventures with the power of agentic AI. I also co-design{" "}
          <Pill className="text-text-primary">Orchestro</Pill>, an AI organisational tracking tool for agile teams
          that turns messy inputs into alignment.
        </p>

        <p className={`mt-8 ${bodyText}`}>I own my work from concept to shipped product outcomes:</p>

        <div className="mt-3 flex w-full flex-col items-start rounded-lg border border-border-disabled bg-bg-default p-3">
          <div className="flex w-full items-center justify-between">
            {shapesMe.map((item) => (
              <div
                key={item.label}
                className="group flex items-center gap-1 rounded-sm bg-bg-secondary px-2 py-1 text-[14px] font-medium leading-4 tracking-[-0.056px] text-text-primary transition-[background-color,transform] duration-150 ease-out hover:bg-bg-tertiary hover:[transform:scale(1.02)]"
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={16}
                  height={16}
                  className="transition-transform duration-150 ease-out group-hover:[transform:scale(1.15)]"
                />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <h2 className="mt-11 font-serif text-[20px] leading-6 tracking-[-0.16px] text-text-primary">
          What shapes me
        </h2>

        <p className={`mt-3 ${bodyText}`}>
          I was raised by a <Pill className="text-text-primary">painter</Pill> and a{" "}
          <Pill className="text-text-primary">sculptor</Pill>, I learned that craft matters. My first
          design education didn&rsquo;t come from software, it came from watching a painter and a sculptor at work.
          That foundation continues to shape how I approach designing today: <Pill className="text-[#0a6c64]">curiosity</Pill>,{" "}
          <Pill className="text-[#a44e15]">craftsmanship</Pill> and a <Pill className="text-[#c90a60]">deep respect</Pill> for
          the people who touch, feel or use the things I design.
        </p>

        <p className={`mt-8 ${bodyText}`}>
          As technology evolves, I believe the role of design is not just to build faster, but to create products
          that feel thoughtful, useful and distinctly human.
        </p>
      </div>
    </div>
  );
}
