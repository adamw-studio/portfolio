import { AnimatedIcon } from "@/components/motion/AnimatedIcon";
import { useHandDrawnFilter } from "@/components/motion/HandDrawnFilter";
import { ICON_DURATION, EASE_SMOOTH, MOTION_REDUCE } from "@/components/motion/tokens";

const COLOR = "#fff1b5";

/** "deep respect" chip icon — top and bottom strokes slide apart along the
 * horizontal axis in opposite directions, then settle smoothly back on
 * mouse leave/blur. */
export default function EqualsIcon() {
  const { filterId, filter } = useHandDrawnFilter(22);
  return (
    <AnimatedIcon>
      <defs>{filter}</defs>
      <g fill={COLOR} filter={`url(#${filterId})`}>
        <rect
          x={2}
          y={4}
          width={16}
          height={4}
          className={`transition-transform ${ICON_DURATION} ${EASE_SMOOTH} ${MOTION_REDUCE} group-hover:-translate-x-[2px] group-focus:-translate-x-[2px]`}
        />
        <rect
          x={2}
          y={12}
          width={16}
          height={4}
          className={`transition-transform ${ICON_DURATION} ${EASE_SMOOTH} ${MOTION_REDUCE} group-hover:translate-x-[2px] group-focus:translate-x-[2px]`}
        />
      </g>
    </AnimatedIcon>
  );
}
