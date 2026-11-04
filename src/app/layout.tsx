import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Public_Sans } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: { default: "StoryPerk — Jedan stori. Jedna nagrada.", template: "%s · StoryPerk" },
  description:
    "StoryPerk nagrađuje goste koji objave Instagram story i označe vaš lokal. Vi birate nagradu.",
};

export const viewport: Viewport = { themeColor: "#f6f4ef" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sr-Latn" className={`${bricolage.variable} ${publicSans.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
