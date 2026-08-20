import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AurenzaMUN — Model United Nations · SVIS Kandivali",
  description:
    "AurenzaMUN is a premier Model United Nations conference bringing together student diplomats from across Mumbai. 10 & 11 October 2026 · SVIS Kandivali. Debate, collaborate, and resolve the world's toughest challenges.",
  openGraph: {
    title: "AurenzaMUN — Model United Nations",
    description:
      "A premier Model United Nations conference for student diplomats across Mumbai. 10 & 11 October 2026 · SVIS Kandivali.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0806",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
