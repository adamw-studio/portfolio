import type { ComponentType } from "react";

/**
 * One entry in a case study's ordered page sequence. Deliberately just
 * data — id/label/Component/metadata — so CaseStudy.tsx's own navigation
 * (next/prev bounds, the "03 / 08" counter, ?casePage= sync) can derive
 * entirely from array position instead of any hardcoded "if page === 3"
 * logic. Adding, removing or reordering a case study's pages is just
 * editing this array; nothing else needs to change.
 */
export type CaseStudyPageConfig = {
  /** Stable per-page id — used in the URL's own ?casePage= value (1-based
   * page NUMBER is what actually goes in the URL; this id is just for
   * React keys and any future deep-linking by name instead of number). */
  id: string;
  /** Short label for the page, e.g. "Overview" — not rendered anywhere
   * prominent yet (the shared nav keeps the count secondary, per brief),
   * but useful for a future page-list/jump menu and for aria-labels. */
  label: string;
  Component: ComponentType;
  /** Opts this page into the layered "stack of cards peeking behind the
   * active one" depth cue from the Figma reference (87:1440/87:1510) —
   * appropriate for a single centered card composition (Overview), not
   * for a page that uses the full canvas edge-to-edge. Off by default. */
  peek?: boolean;
};
