import { CardBody, Eyebrow, Heading, BodyCopy, ScrollFadeCard } from "@/components/case-study/primitives";

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

// Figma 122:4939 — a "[01]" step number, two paragraphs (no gap between
// them — see below), and a later addition to this same node: a "Team"
// list (role in text-primary, name in text-subtle, matching this
// system's own established key/value row shape) and a "Starring" list
// underneath. Confirmed via a fresh re-fetch of this exact node, not
// assumed from the original build — this card didn't carry either
// section the first time it was implemented.
//
// ScrollFadeCard directly, not TextCard: the two paragraphs alone fit
// the card's 600px budget, but Team + Starring together push this well
// past it at every width.
//
// No gap between the two intro paragraphs, unlike Team/Starring's own
// gap-6 separation from each other and from the intro: those two
// paragraphs are adjacent <p> tags in Figma's own text node (no blank-
// line paragraph between them), so they read as one tight flow with
// only their own 24px line-height between them — see this file's git
// history for the fuller reasoning, unchanged from the original build.
export default function ContextPage() {
  return (
    <ScrollFadeCard
      style={{ aspectRatio: "440 / 600" }}
      className="w-full max-w-[440px] rounded-[20px] border border-border-disabled bg-bg-tertiary-solid shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)]"
    >
      <CardBody>
        <div className="flex flex-col gap-1">
          <Eyebrow style={{ fontFeatureSettings: '"zero" 1, "lnum" 1, "tnum" 1' }}>[01]</Eyebrow>
          <Heading size="md">Context</Heading>
        </div>
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
      </CardBody>
    </ScrollFadeCard>
  );
}
