// Shared text/style tokens used across the home page's sections. Pulled out
// so multiple section components (page.tsx, SelectedWorks.tsx, …) can share
// one definition instead of redeclaring the same classes.

// Body copy shares one style throughout: 14px/24px line-height, tracking
// -0.128px, in Geist.
export const bodyText = "font-sans text-[14px] leading-6 tracking-[-0.128px] text-text-primary";

// Headings use Gentium Basic (serif) at 16px — kept at the size requested
// earlier rather than reverting to Figma's own 20px, and no font-medium
// since Gentium Basic has no medium weight (Figma doesn't call for one here
// either).
export const heading = "font-serif text-[16px] leading-6 tracking-[-0.8px] text-text-primary";

// Inset shadow instead of a real border: Figma's stroke doesn't consume
// layout space, but a CSS border always would on an explicitly-sized box.
export const insetBorder = "shadow-[inset_0_0_0_1px_var(--color-border-subtle)]";
