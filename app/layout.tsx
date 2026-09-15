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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? `https://${process.env.NEXT_PUBLIC_SITE_URL}`
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "AurenzaMUN — Model United Nations · SVIS Kandivali",
  description:
    "AurenzaMUN is a Premier Model United Nations Conference Bringing Together Student Diplomats From Across Mumbai. 10 & 11 October 2026 · SVIS Kandivali. Debate, collaborate, and resolve the world's toughest challenges.",
  openGraph: {
    title: "AurenzaMUN — Model United Nations",
    description:
      "A Premier Model United Nations Conference For Student Diplomats Across Mumbai. 10 & 11 October 2026 · SVIS Kandivali.",
    type: "website",
    images: [{ url: "/logo.png", width: 685, height: 685, alt: "AurenzaMUN" }],
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
