import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import SmoothScroll from "@/components/motion/SmoothScroll";
import AskRomaLoader from "@/components/chat/AskRomaLoader";
import "./globals.css";

// DESIGN.md §C.1 — swap a family here and every token follows.
const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const sourceSerif = localFont({
  src: "./fonts/SourceSerif4-Medium.woff2",
  weight: "500",
  style: "normal",
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Roma | Stop writing off deductions",
  description:
    "Roma recovers invalid deductions across UNFI, KeHE and retailers. Every deduction pulled, matched to your invoices and promos, and invalid ones disputed. Live in 5 minutes.",
};

export const viewport: Viewport = {
  themeColor: "#1f0a08",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${sourceSerif.variable}`} suppressHydrationWarning>
      <head>
        {/* Pre-paint guard: entrance elements start hidden only when JS + motion are available (DESIGN.md §F.10). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-motion')}catch(e){}",
          }}
        />
      </head>
      <body>
        <SmoothScroll />
        {children}
        <AskRomaLoader />
      </body>
    </html>
  );
}
