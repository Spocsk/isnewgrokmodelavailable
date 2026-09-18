import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Big_Shoulders, Public_Sans } from "next/font/google";
import "./globals.css";

const display = Big_Shoulders({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800"],
});

const sans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Grok 4.7 — available?",
  description: "Is Grok 4.7 on the xAI catalogue?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
