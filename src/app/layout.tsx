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
  title: "Steeleman: the renter’s honest legal brain",
  description:
    "Steeleman reads a renter’s evidence, grounds every answer in current law, and tells them where they really stand on a damp & mould disrepair claim. It prepares the pre-action letter when it’s worth sending, and says so honestly when it isn’t.",
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
