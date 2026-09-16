// Data for the Playground's spatial canvas (components/PlaygroundCanvas.tsx).
// Kept separate from the canvas/card components on purpose — adding,
// removing or repositioning a project should mean editing one array here,
// never touching the engine that renders/pans/zooms it.
//
// Coordinates are in "world" pixels, all relative to one shared origin
// (0,0) — not tied to any one visitor's viewport. PlaygroundCanvas centers
// a 1440x1080 rectangle (REFERENCE_W/H there), whose top-left is world
// (0,0), in whatever viewport actually loads it — so whichever cards sit
// roughly inside that rectangle form the opening composition, and anything
// placed outside it sits off the first screenful, reachable by dragging.
//
// PLAYGROUND_PROJECTS held every real project card until a later
// instruction cleared it ("remove the cards from the Playground
// canvas") — the canvas itself (pan/zoom/inertia/reset-view/dot-grid)
// stayed untouched and fully functional with nothing on it;
// computeContentBounds in PlaygroundCanvas.tsx already had an explicit
// fallback for exactly that empty-array case. The one entry below
// (Figma 202:5118, "Add this in the center") is the first thing back
// in it — a fixed signpost, not a real project, hence variant
// "archive" and no href.

export type PlaygroundProject = {
  id: string;
  /** Primary line — usually the project/piece title, but the one long-form
   * card (sporting-chance) puts a short description here instead, same as
   * Figma's own node does. "framed" cards (see `variant` below) don't
   * render this text visibly anywhere — Figma draws only a kicker bar and
   * the image there, no separate title — so it's just set equal to
   * `kicker` for those rather than inventing descriptive copy Figma never
   * specified. */
  title: string;
  /** Secondary line, dimmed — client/category name. */
  subtitle: string;
  x: number;
  y: number;
  width: number;
  height: number;
  /** Omitted projects render fully interactive-looking but don't link
   * anywhere — until a real destination exists for one, leave this unset
   * rather than pointing it somewhere fake. */
  href?: string;
  image?: string;
  imageAlt?: string;
  /** Figma's "zoomed-in crop" technique: an image rendered larger than its
   * clipping box and offset, rather than a plain full-bleed fill. Omit for
   * a plain object-cover fill (anoma) or to center a smaller image inside
   * a tertiary-bg panel (sporting-chance uses the same field for that). */
  imageOffset?: { left: number; top: number; width: number; height: number };
  /** Fixes the image panel's background to one color in both themes,
   * instead of following the site's usual light/dark bg-tertiary token —
   * for artwork with its own white-on-dark design that would wash out if
   * the panel went pale in light mode. */
  imageBg?: string;
  /** A card with no photo yet can get a flat accent fill instead — one of
   * the site's existing fixed tag colors (Tag.tsx), not a new one-off hex. */
  accent?: string;
  year?: string;
  tag?: string;
  /** "default" (or omitted): the original Figma 306:12162 card — padded,
   * rounded-2xl, image then a plain title/subtitle text block below it.
   * "framed": Figma 319:xxxx's card — no padding, edge-to-edge sections
   * (a kicker bar, the image, optionally a description bar) each divided
   * by a real border rather than a text block under the image. "archive":
   * Figma 202:5118's fixed "Archive <Coming Soon>" signpost — a dark
   * speaker-orb graphic (its own gradient/inner-shadow SVGs, not a photo)
   * above title/subtitle styled as extrabold-italic/italic rather than
   * the default variant's plain pair. Three genuinely distinct enough
   * layouts that forcing one card component to fake all three via a pile
   * of conditional props would be harder to read than branching once on
   * this. */
  variant?: "framed" | "archive";
  /** "framed" only — the small label bar's text (every current card says
   * "Beyond The Box", but a future project's cards won't). */
  kicker?: string;
  /** "framed" only — an optional description bar under the image (only
   * one of these seven cards has one; the rest omit it). */
  description?: string;
  /** "framed" only — a YouTube video id, rendered via the same
   * click-to-play YouTubeFacade the case studies use (see there) instead
   * of `image` filling the content area. Set at most one of `image` /
   * `youtubeId` per card; if both are set, the video wins. */
  youtubeId?: string;
};

export const KICKER_ICON = "/images/playground/btb-wordmark.svg";

export const PLAYGROUND_PROJECTS: PlaygroundProject[] = [
  {
    // Figma 202:5118 — x/y are that node's own absolute canvas position
    // (614, 434), used directly rather than translated: unlike the
    // Beyond The Box cluster (translated because it was drawn elsewhere
    // on Figma's own infinite canvas), this node's own position already
    // centers it exactly inside the 1440x1080 reference rectangle
    // PlaygroundCanvas.tsx's own REFERENCE_W/H opens on — 614 + 212/2 =
    // 720 = 1440/2, 434 + 212/2 = 540 = 1080/2 — which is what "add this
    // in the center" asked for.
    id: "archive-coming-soon",
    title: "Archive",
    subtitle: "<Coming Soon>",
    variant: "archive",
    x: 614,
    y: 434,
    width: 212,
    height: 212,
  },
];
