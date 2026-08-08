import Image from "next/image";

const columns = [
  { lines: ["Adam Weber", "©2026 All Rights reserved"] },
  { lines: ["Instagram", "LinkedIn"], links: true },
  { lines: ["Budapest", "Hungary"] },
  { lines: ["Email", "weberadam54@gmail.com"] },
];

export default function Footer() {
  return (
    <footer className="flex w-full flex-col items-start gap-11 px-6 pb-0 pt-24">
      <div className="flex w-full flex-wrap items-center gap-12 text-[12px] font-medium leading-4 tracking-[-0.048px] text-text-primary sm:gap-24 md:gap-48">
        {columns.map((col, i) => (
          <div key={i} className="flex w-40 flex-col items-start gap-1">
            {col.lines.map((line) =>
              col.links ? (
                <a key={line} href="#" className="w-full hover:underline">
                  {line}
                </a>
              ) : (
                <p key={line} className="w-full">
                  {line}
                </p>
              )
            )}
          </div>
        ))}
      </div>
      <div className="relative h-[180px] w-full sm:h-[300px] md:h-[464px]">
        <Image src="/images/footer-mark.svg" alt="" fill className="object-contain object-bottom" />
      </div>
    </footer>
  );
}
