import type { Metadata } from "next";
import { Oswald, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const display = Oswald({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Quick Hishab — Upload a file. Get an accurate total.",
  description:
    "Upload Excel, CSV, images, or screenshots. Quick Hishab extracts every line, catches errors, and totals it for you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-brand-bg text-brand-ink font-body antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
