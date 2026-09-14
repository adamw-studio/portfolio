import { Heading, BodyCopy } from "@/components/case-study/primitives";
import { YouTubeFacade } from "@/components/YouTubeFacade";

// Figma 166:3114 — the synopsis copy carried over verbatim from the old
// page-by-page WatchTeaserPage.tsx, and the same reasoning for reusing
// YouTubeFacade instead of reproducing Figma's own static play-button
// placeholder as a dead image: the facade already shows a real
// thumbnail with an identical play affordance at rest and swaps in the
// actual trailer embed on click, for a video this project already has
// wired up. h-[360px], not that file's own h-[301px] default — this
// fetch's own video box (166:3119) is taller than the old page-by-page
// card's slot was.
export default function WatchTeaserSection() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Heading size="section">Watch teaser</Heading>
      <div className="flex flex-col gap-6">
        <BodyCopy>
          Symphony of Disorder is a retrospective cinematic journey through the life and work of sensitive painter
          Éva Köves, reflecting the cultural and social transformations of post-socialist Hungary.
        </BodyCopy>
        <BodyCopy>
          After graduating in 1989, she entered a new chapter in her life, a personal turning point that coincided
          with the beginning of a profound transformation in the country’s social structures.
        </BodyCopy>
        <BodyCopy>
          Through her art and career, the hopes, illusions, and dilemmas of the 1990s come into focus, evoking the
          fragile balance between historical change and personal transformation.
        </BodyCopy>
      </div>
      <YouTubeFacade videoId="0xcBtP-4AYY" title="Symphony of Disorder — trailer" wrapperClassName="h-[360px] w-full rounded-xl" />
    </div>
  );
}
