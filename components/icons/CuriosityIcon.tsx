import { AnimatedIcon } from "@/components/motion/AnimatedIcon";
import { useHandDrawnFilter } from "@/components/motion/HandDrawnFilter";
import { ICON_DURATION, EASE_POP, MOTION_REDUCE, STAGGER_STEP_MS } from "@/components/motion/tokens";

const COLOR = "#fff1b5";

const SQUARES = [
  { x: 4, y: 4, w: 4, h: 4 },
  { x: 12, y: 4, w: 4, h: 4 },
  { x: 4, y: 12, w: 4, h: 4 },
  { x: 12, y: 12, w: 4, h: 4 },
];

/** "curiosity" chip icon — four squares pop/scale in with a subtle
 * stagger. Each scales from its own center (origin-center + fill-box
 * transform-box), so the 2x2 grid position never shifts. */
export default function CuriosityIcon() {
  const { filterId, filter } = useHandDrawnFilter(23);
  return (
    <AnimatedIcon>
      <defs>{filter}</defs>
      <g fill={COLOR} filter={`url(#${filterId})`}>
        {SQUARES.map((sq, i) => (
          <rect
            key={i}
            x={sq.x}
            y={sq.y}
            width={sq.w}
            height={sq.h}
            className={`origin-center transition-transform ${ICON_DURATION} ${EASE_POP} ${MOTION_REDUCE} group-hover:scale-[1.15] group-focus:scale-[1.15]`}
            style={{ transformBox: "fill-box", transitionDelay: `${i * STAGGER_STEP_MS}ms` }}
          />
        ))}
      </g>
    </AnimatedIcon>
  );
}
