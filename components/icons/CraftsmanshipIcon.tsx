import { AnimatedIcon } from "@/components/motion/AnimatedIcon";
import { useHandDrawnFilter } from "@/components/motion/HandDrawnFilter";
import { ICON_DURATION, EASE_POP, MOTION_REDUCE, STAGGER_STEP_MS } from "@/components/motion/tokens";

const COLOR = "#00a2c2";

const BARS = [
  { x: 3, y: 0, w: 4, h: 14 },
  { x: 12, y: 6, w: 4, h: 14 },
];

/** "craftsmanship" chip icon — bars rise from the bottom with a slight
 * stagger. Each grows from its own bottom edge (origin-bottom), independent
 * of the other bar's vertical position. */
export default function CraftsmanshipIcon() {
  const { filterId, filter } = useHandDrawnFilter(24);
  return (
    <AnimatedIcon>
      <defs>{filter}</defs>
      <g fill={COLOR} filter={`url(#${filterId})`}>
        {BARS.map((bar, i) => (
          <rect
            key={i}
            x={bar.x}
            y={bar.y}
            width={bar.w}
            height={bar.h}
            className={`origin-bottom transition-transform ${ICON_DURATION} ${EASE_POP} ${MOTION_REDUCE} group-hover:scale-y-[1.15] group-focus:scale-y-[1.15]`}
            style={{ transformBox: "fill-box", transitionDelay: `${i * STAGGER_STEP_MS}ms` }}
          />
        ))}
      </g>
    </AnimatedIcon>
  );
}
