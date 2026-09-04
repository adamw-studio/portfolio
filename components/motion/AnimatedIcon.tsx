import type { ReactNode } from "react";

/**
 * Shared SVG shell for every animated icon in the system (20x20, matching
 * every current usage). Individual icon components only need to declare
 * their own primitives as children — plain <path>/<circle> for anything
 * static, motion.* for anything that should respond to the parent pill's
 * hover/focus state.
 *
 * Not a client component itself (no hooks, no browser APIs) — safe to
 * import from either a server or client component.
 */
export function AnimatedIcon({ size = 20, children }: { size?: number; children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className="shrink-0" aria-hidden="true">
      {children}
    </svg>
  );
}
