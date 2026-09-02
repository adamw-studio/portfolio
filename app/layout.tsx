import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted (not next/font/google): this dev environment's sandboxed
// process silently fails to fetch Google Fonts at build time (see the Geist
// fix earlier), so files are downloaded once into public/fonts and loaded
// locally instead — no runtime network dependency at all.
const texGyreHeros = localFont({
  src: [
    { path: "../public/fonts/texgyreheros-regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/texgyreheros-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-tex-gyre-heros",
  display: "swap",
});

const texGyreHerosCn = localFont({
  src: [
    { path: "../public/fonts/texgyreheroscn-regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/texgyreheroscn-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-tex-gyre-heros-cn",
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
      className={`${GeistSans.variable} ${GeistMono.variable} ${texGyreHeros.variable} ${texGyreHerosCn.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
