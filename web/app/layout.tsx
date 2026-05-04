import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "HormonaIQ — For the other weeks of the month",
  description:
    "Clinical-grade hormonal health tracking for PMDD, PCOS, perimenopause, endometriosis, and ADHD-hormone overlap. Turn what you already feel into data your doctor can't dismiss.",
  openGraph: {
    title: "HormonaIQ",
    description: "For the other weeks of the month.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-cream text-ink font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
