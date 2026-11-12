import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Lilita_One, Public_Sans, Urbanist } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin", "latin-ext"],
});

// Dizajn sistem K: Urbanist za tekst, Lilita One za logotip STORYPERK.
const urbanist = Urbanist({
  variable: "--font-urbanist-src",
  subsets: ["latin", "latin-ext"],
});

const logoFont = Lilita_One({
  variable: "--font-logo-src",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "StoryPerk — Jedan stori. Jedna nagrada.", template: "%s · StoryPerk" },
  description:
    "StoryPerk nagrađuje goste koji objave Instagram story i označe vaš lokal. Vi birate nagradu.",
};

export const viewport: Viewport = { themeColor: "#f6f4ef" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sr-Latn" className={`${bricolage.variable} ${publicSans.variable} ${urbanist.variable} ${logoFont.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
