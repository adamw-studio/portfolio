import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted (not next/font/google): this dev environment's sandboxed
// process silently fails to fetch Google Fonts at build time (see the Geist
// fix earlier), so the file is downloaded once into public/fonts and loaded
// locally instead — no runtime network dependency at all.
const gentiumBasic = localFont({
  src: "../public/fonts/GentiumBasic-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-gentium-basic",
  display: "swap",
});

// PP Neue Montreal (Pangram Pangram) — replaces GeistSans as the site's
// sans/body font (--font-sans, globals.css), purchased and supplied
// directly as webfont files, so self-hosted via next/font/local the same
// way Gentium Basic already is. Regular/Medium/Semibold, matching every
// weight this site's own CSS asks for (font-normal, font-medium, and the
// single font-bold in ProjectRow.tsx's case-study overlay label, mapped
// to Semibold as the closest weight this family ships since it has no
// true 700/Bold cut of its own between Semibold/600 and Extrabold/800),
// plus the plain Italic style — Figma 74:191's own project-card captions
// (SelectedWorks.tsx) use it for the "Lead designer / 2026" row — and
// Extrabold Italic, all six About-card resting titles' own literal font
// (AboutCardStack.tsx's RESTING_TEXT, Figma 76:293 etc.). The purchased
// pack also includes Light/Book/Black/Hairline and a whole second "Text"
// optical-size subfamily (plus Medium/Semibold italics), none of which
// any current class on this site reaches for — not loaded, to avoid
// shipping webfont weight nobody uses.
const neueMontreal = localFont({
  src: [
    { path: "../public/fonts/PPNeueMontreal-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/PPNeueMontreal-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/PPNeueMontreal-Semibold.woff2", weight: "600 700", style: "normal" },
    { path: "../public/fonts/PPNeueMontreal-Italic.woff2", weight: "400", style: "italic" },
    // style: "normal" here, not "italic" — even though the file itself
    // is the ExtraboldItalic cut (its glyphs are genuinely drawn
    // slanted). Figma's own node marks this text `not-italic`, i.e. its
    // *CSS* font-style is meant to read as normal (screen readers won't
    // announce it as italic, and nothing needs `italic`/font-style:
    // italic in AboutCardStack.tsx to select it) — this is a foundry-
    // supplied *display* cut used as its own distinct weight/style
    // choice, not a grammatical italic. Registering it as "italic" here
    // would mean only font-style:italic elements could ever match it;
    // registering it as "normal" is what makes plain `font-extrabold`
    // (no `italic` class) resolve to this file.
    { path: "../public/fonts/PPNeueMontreal-ExtraboldItalic.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-neue-montreal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adam Weber — Product Designer",
  description: "Portfolio of Adam Weber, senior product designer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${neueMontreal.variable} ${GeistMono.variable} ${gentiumBasic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
