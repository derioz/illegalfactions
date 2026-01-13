import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Illegal Factions | Los Santos Underground",
  description: "The premier illegal faction roleplay experience on FiveM. Explore the underground world of Los Santos with 12 unique factions.",
  keywords: ["FiveM", "roleplay", "factions", "illegal", "GTA", "Los Santos"],
  openGraph: {
    title: "Illegal Factions | Los Santos Underground",
    description: "Where loyalty is earned in blood, and respect is the only currency that matters.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Noise texture overlay */}
        <div className="noise-overlay" />

        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
