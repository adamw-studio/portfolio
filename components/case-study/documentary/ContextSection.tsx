import { Heading, BodyCopy, Eyebrow } from "@/components/case-study/primitives";

const TEAM = [
  { role: "Director -", name: "Bíró Danijar" },
  { role: "Photography -", name: "Czeglédi Mátyás" },
  { role: "Camera -", name: "Teleki Mihály" },
  { role: "Editor -", name: "Kozma G. Leó" },
  { role: "Sound & Music -", name: "Lőrinczi Áron" },
  { role: "Executive Producer -", name: "Wéber Ádám" },
] as const;

const STARRING = [
  "Köves Éva",
  "Sztojánovits Andrea",
  "Laudancsek Katalin",
  "Szipőcs Krisztina",
  "Alföldi Róbert",
  "Kaszás Gábor",
  "Petrányi Zsolt",
  "Gál András",
] as const;

// Figma 165:2768 — copy, Team list, and Starring list all carried over
// verbatim from the old page-by-page ContextPage.tsx (already confirmed
// against this exact node before this rebuild started). No gap between
// the two intro paragraphs, matching that file's own established
// reasoning: they're adjacent <p> tags in Figma's own text node, not
// separated by a blank-line paragraph the way Team/Starring are from
// everything around them.
export default function ContextSection() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Heading size="section">Context</Heading>
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col">
          <BodyCopy>
            Both of my parents are accomplished artists, my mother is a painter and my father is a sculptor.
            Creativity has always been at the heart of our family life, shaping the way we think, work and connect
            with one another.
          </BodyCopy>
          <BodyCopy>
            Last year, we celebrated my mother’s 60th birthday by creating a special tribute that honors her artistic
            journey.
          </BodyCopy>
        </div>
        <div className="flex w-full flex-col items-start gap-2">
          <Eyebrow>Team</Eyebrow>
          <div className="flex flex-col items-start font-sans text-[14px] tracking-[-0.112px]">
            {TEAM.map(({ role, name }) => (
              <div key={role} className="flex items-center gap-2">
                <p className="text-text-primary">{role}</p>
                <p className="leading-6 text-text-subtle">{name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-2">
          <Eyebrow>Starring</Eyebrow>
          <div className="flex flex-col items-start font-sans text-[14px] tracking-[-0.112px] text-text-primary">
            {STARRING.map((name) => (
              <p key={name} className="leading-6">
                {name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
