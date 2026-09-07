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
// The seven "Beyond The Box" cards below are Figma 319:16093 - 319:16164's
// own absolute canvas positions, translated by one fixed offset
// (-765, +16) so the cluster's own bounding box starts near world (43,60)
// — matching where the very first composition happened to sit — rather
// than wherever it happened to be drawn on Figma's actual canvas. Every
// card keeps its position *relative to the others* exactly as designed;
// only the whole group's origin moved.

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
   * by a real border rather than a text block under the image. The two
   * are visually distinct enough that forcing one card component to fake
   * both via a pile of conditional props would be harder to read than
   * branching once on this. */
  variant?: "framed";
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
  // --- "Beyond The Box" (Nike x PSG packaging/AR project), Figma
  // 319:16093 - 319:16164, translated by (-765, +16) — see file header. ---
  {
    id: "btb-3d-hoodie",
    title: "Beyond The Box",
    subtitle: "Beyond The Box",
    variant: "framed",
    kicker: "Beyond The Box",
    x: 43,
    y: 149,
    width: 336,
    height: 330,
    image: "/images/playground/btb-3d-hoodie.png",
    imageAlt: "",
  },
  {
    id: "btb-3d-tag",
    title: "Beyond The Box",
    subtitle: "Beyond The Box",
    variant: "framed",
    kicker: "Beyond The Box",
    x: 395,
    y: 410,
    width: 336,
    height: 330,
    image: "/images/playground/btb-3d-tag.png",
    imageAlt: "",
  },
  {
    id: "btb-hangtags",
    title: "Beyond The Box",
    subtitle: "Beyond The Box",
    variant: "framed",
    kicker: "Beyond The Box",
    x: 764,
    y: 60,
    width: 336,
    height: 330,
    image: "/images/playground/btb-hangtags.png",
    imageAlt: "",
  },
  {
    id: "btb-icons",
    title: "Beyond The Box",
    subtitle: "Beyond The Box",
    variant: "framed",
    kicker: "Beyond The Box",
    x: 847,
    y: 465,
    width: 336,
    height: 256,
    image: "/images/playground/btb-icons.png",
    imageAlt: "",
  },
  {
    id: "btb-techpack",
    title: "Beyond The Box",
    subtitle: "Beyond The Box",
    variant: "framed",
    kicker: "Beyond The Box",
    x: 604,
    y: 886,
    width: 336,
    height: 274,
    image: "/images/playground/btb-techpack.png",
    imageAlt: "",
  },
  {
    id: "btb-box-render",
    title: "Beyond The Box",
    subtitle: "Beyond The Box",
    variant: "framed",
    kicker: "Beyond The Box",
    x: 1228,
    y: 128,
    width: 336,
    height: 330,
    image: "/images/playground/btb-box-render.png",
    imageAlt: "",
  },
  {
    id: "btb-box-photo",
    title: "Beyond The Box",
    subtitle: "Beyond The Box",
    variant: "framed",
    kicker: "Beyond The Box",
    description:
      "A new digital experience using AR technology and the product’s package that will help users to move closer to their brands.",
    x: 1298,
    y: 556,
    width: 336,
    height: 330,
    image: "/images/playground/btb-box-photo.jpg",
    imageAlt: "",
  },
  {
    // Same "framed" card style as the rest of the Beyond The Box set, just
    // with a video in the content area instead of a still image — sits
    // just right of btb-box-render/btb-box-photo, clear of both.
    id: "btb-video",
    title: "Beyond The Box",
    subtitle: "Beyond The Box",
    variant: "framed",
    kicker: "Beyond The Box",
    x: 1674,
    y: 340,
    width: 336,
    height: 330,
    youtubeId: "Yndx-hO9g2o",
  },
  {
    // A different project (Figma 322:16189), not part of the Beyond The
    // Box set — same "framed" style and the same (-765, +16) translation
    // convention (see file header), continuing the cluster rightward past
    // btb-video with a clear gap on both sides.
    id: "portal-net-zero",
    title: "Portal Net Zero - Digital Installation",
    subtitle: "Portal Net Zero - Digital Installation",
    variant: "framed",
    kicker: "Portal Net Zero - Digital Installation",
    x: 2178,
    y: 207,
    width: 336,
    height: 330,
    image: "/images/playground/portal-net-zero.png",
    imageAlt: "",
  },
  {
    // Figma 322:16197 — the "framed" treatment of the same Anoma tote-bag
    // photo the very first card (id "anoma", above) already uses; same
    // underlying asset (confirmed byte-for-byte against a fresh download
    // of this node's own image), reused rather than duplicated on disk.
    // Same (-765, +16) translation convention, placed clear of every
    // other card's bounds.
    id: "anoma-logo",
    title: "Anoma - Logo",
    subtitle: "Anoma - Logo",
    variant: "framed",
    kicker: "Anoma - Logo",
    x: 2483,
    y: 715,
    width: 336,
    height: 330,
    image: "/images/playground/anoma.jpg",
    imageAlt: "",
  },
  // Figma 322:16207 / 322:16213 / 322:16219 — three "Widget-Exploration"
  // cards, same (-765, +16) translation convention as the rest of this
  // cluster. The third is wider (468 vs the usual 336) — Figma's own
  // frame width for that one, not a typo.
  {
    id: "widget-clock-blue",
    title: "Widget-Exploration",
    subtitle: "Widget-Exploration",
    variant: "framed",
    kicker: "Widget-Exploration",
    x: 2720,
    y: 170,
    width: 336,
    height: 330,
    image: "/images/playground/widget-clock-blue.png",
    imageAlt: "",
  },
  {
    id: "widget-clock-green",
    title: "Widget-Exploration",
    subtitle: "Widget-Exploration",
    variant: "framed",
    kicker: "Widget-Exploration",
    x: 3085,
    y: 641,
    width: 336,
    height: 330,
    image: "/images/playground/widget-clock-green.png",
    imageAlt: "",
  },
  {
    id: "widget-transit",
    title: "Widget-Exploration",
    subtitle: "Widget-Exploration",
    variant: "framed",
    kicker: "Widget-Exploration",
    x: 3154,
    y: 239,
    width: 468,
    height: 330,
    image: "/images/playground/widget-transit.png",
    imageAlt: "",
  },
];
