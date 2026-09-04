// Shared class for every raster icon asset that's exported as a single
// near-white (#F4F4F4-based) glyph — arrows, the nav's lamp/menu icons,
// the nav dropdown's link icons, the Beacon logomark. Figma's own
// per-theme exports of these turned out unreliable (some, like the main
// logo, correctly re-export as #0D0D0D for light mode; others, like the
// nav's menu/light-bulb icons, still came back #F4F4F4 even in the
// light-mode fetch — a known Figma export quirk, not a real light-mode
// spec). Inverting is simpler and provably correct for any of these
// single-color assets: white-on-transparent becomes black-on-transparent,
// and any baked-in fill-opacity is untouched (invert only remaps RGB, not
// alpha), so dim/full icon variants stay exactly as dim/full relative to
// each other.
//
// Pure CSS via the [.theme-dark_&] ancestor variant — no theme state
// needs to be threaded into every component that renders one of these
// icons, it just tracks whichever ancestor actually carries the class.
export const themedIcon = "invert [.theme-dark_&]:invert-0";
