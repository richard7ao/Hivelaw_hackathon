import type { Metadata } from "next";
import { Spectral, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

// Serif display voice — Spectral reads like a well-set statute/document.
const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Sans for UI, labels, body — Hanken Grotesk: plain-spoken, clear, civic.
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Steelman — Every legal AI tells you you’re right. We tell you how you’ll lose.",
  description:
    "The Steelman argues the opponent’s best case against you, grounded in your own documents. Access to justice for everyone — 5.1 billion people have an unmet justice need.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      data-scroll-behavior="smooth"
      className={`${spectral.variable} ${hanken.variable}`}
    >
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
