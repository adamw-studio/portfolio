import { AnimatedIcon } from "@/components/motion/AnimatedIcon";
import { ICON_DURATION, ICON_DURATION_SNAPPY, EASE_POP, EASE_SMOOTH, MOTION_REDUCE } from "@/components/motion/tokens";

// Identical across all seven "epic" dot icons — the faint circular badge
// sitting behind the colored dot.
const BADGE_D = "M20 10a10 10 0 1 1-20 0 10 10 0 0 1 20 0";

// transform-box:fill-box makes percentage-based transform-origin (e.g.
// "center"/"bottom") resolve against the shape's own bounding box instead
// of the SVG viewport — needed for every animated primitive here.
const FILL_BOX = { transformBox: "fill-box" as const };

const CHOREOGRAPHY_CLASSES = {
  // research: small pulse / expansion
  pulse: `origin-center ${ICON_DURATION} ${EASE_POP} group-hover:scale-[1.28] group-focus:scale-[1.28]`,
  // system thinking: subtle orbital + scale movement
  orbit: `origin-center ${ICON_DURATION} ${EASE_SMOOTH} group-hover:translate-x-[1.4px] group-hover:-translate-y-[1.2px] group-hover:scale-[1.08] group-focus:translate-x-[1.4px] group-focus:-translate-y-[1.2px] group-focus:scale-[1.08]`,
  // design system: subtle rotation (reads clearly thanks to the dot's
  // hand-textured, slightly irregular outline)
  rotate: `origin-center ${ICON_DURATION} ${EASE_SMOOTH} group-hover:rotate-[22deg] group-focus:rotate-[22deg]`,
  // craft in canvas & code: small spring scale — a touch snappier than
  // the plain "pulse" so it reads as its own distinct feel
  springScale: `origin-center ${ICON_DURATION_SNAPPY} ${EASE_POP} group-hover:scale-[1.22] group-focus:scale-[1.22]`,
  // stakeholder management: soft pulse with slight irregularity — scale
  // paired with a small rotate so it doesn't read as a perfectly
  // symmetric/mechanical pulse
  irregularPulse: `origin-center ${ICON_DURATION} ${EASE_POP} group-hover:scale-[1.2] group-hover:-rotate-[5deg] group-focus:scale-[1.2] group-focus:-rotate-[5deg]`,
} as const;

export type DotChoreography = keyof typeof CHOREOGRAPHY_CLASSES;

/**
 * Shared primitive for the five dot icons whose choreography is a single
 * transform on the colored group (pulse/orbit/rotate/springScale/
 * irregularPulse). The solid dot circle and its hand-drawn texture outline
 * both live inside one <g> — together they read as "the dot", and
 * animating the group is what lets the badge background stay untouched.
 *
 * Driven entirely by the ancestor pill's `group` class (hover/focus) via
 * Tailwind's group-hover/group-focus variants — see Chip.tsx/Tag.tsx.
 */
export function Dot({
  color,
  dotD,
  textureD,
  choreography,
}: {
  color: string;
  dotD: string;
  textureD: string;
  choreography: DotChoreography;
}) {
  return (
    <AnimatedIcon>
      <path fill="#f4f4f4" fillOpacity=".05" d={BADGE_D} />
      <g fill={color} className={`transition-transform ${MOTION_REDUCE} ${CHOREOGRAPHY_CLASSES[choreography]}`} style={FILL_BOX}>
        <path d={dotD} />
        <path d={textureD} />
      </g>
    </AnimatedIcon>
  );
}

export { BADGE_D, FILL_BOX };
