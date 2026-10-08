import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "FOODFLOW — AI-Powered Food Waste Prevention & Surplus Recovery Platform",
  description: "Predict. Prevent. Recover. FOODFLOW helps institutional dining halls and kitchens forecast demand, reduce avoidable overproduction, and responsibly recover eligible surplus.",
  keywords: [
    "food waste prevention",
    "surplus food recovery",
    "institutional kitchen management",
    "demand forecasting",
    "PS-44",
    "food rescue logistics"
  ],
  authors: [{ name: "FOODFLOW Design & Engineering Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FBFBFA] text-[#141618]">{children}</body>
    </html>
  );
}
