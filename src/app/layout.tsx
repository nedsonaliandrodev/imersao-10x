import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const accent = Cormorant_Garamond({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["italic"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "IMERSÃO 10X · O tempo, visto por dentro",
  description:
    "Alta relojoaria em ouro 18k com um calibre de grande complicação. Desça e entre na máquina.",
};

export const viewport: Viewport = {
  themeColor: "#070605",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt"
      className={`${display.variable} ${accent.variable} ${body.variable} ${mono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
