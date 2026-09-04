import { AnimatedIcon } from "@/components/motion/AnimatedIcon";
import { useHandDrawnFilter } from "@/components/motion/HandDrawnFilter";
import { ICON_DURATION, EASE_POP, MOTION_REDUCE, STAGGER_STEP_MS } from "@/components/motion/tokens";

const COLOR = "#fff1b5";

// Bottom edge of every bar sits at y=16, right above the baseline rect —
// growing from origin-bottom (each bar's own bottom edge) keeps that
// shared baseline fixed while the bars grow upward from it.
const BARS = [
  { x: 2, y: 2, w: 2, h: 14 },
  { x: 6, y: 4, w: 2, h: 12 },
  { x: 10, y: 6, w: 2, h: 10 },
  { x: 14, y: 8, w: 2, h: 8 },
];

/** "painter" chip icon — bars grow upward sequentially from the baseline. */
export default function BarChartIcon() {
  const { filterId, filter } = useHandDrawnFilter(21);
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
            className={`origin-bottom transition-transform ${ICON_DURATION} ${EASE_POP} ${MOTION_REDUCE} group-hover:scale-y-[1.18] group-focus:scale-y-[1.18]`}
            style={{ transformBox: "fill-box", transitionDelay: `${i * STAGGER_STEP_MS}ms` }}
          />
        ))}
        <rect x={1} y={17} width={16} height={3} />
      </g>
    </AnimatedIcon>
  );
}
