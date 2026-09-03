import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted (not next/font/google): this dev environment's sandboxed
// process silently fails to fetch Google Fonts at build time (see the Geist
// fix earlier), so files are downloaded once into public/fonts and loaded
// locally instead — no runtime network dependency at all.
// Variable font, single file — Google's own weight-range endpoint only
// serves 400 and 500 for this family (a 100-900 request 400s), and both
// point at the same physical woff2, confirming that's the actual instance
// range. Declaring "400 500" lets the browser interpolate within the file.
const zalandoSans = localFont({
  src: "../public/fonts/ZalandoSans-Variable.woff2",
  weight: "400 500",
  style: "normal",
  variable: "--font-zalando-sans",
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
      className={`${GeistSans.variable} ${GeistMono.variable} ${zalandoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
