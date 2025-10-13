import type { Metadata } from "next";
import { Work_Sans, Outfit } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["700"], // Bold only as per Scale guidelines
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "DeepStack Website Analysis | Scale VP",
  description: "Analyze websites with DeepStack Collector to gather comprehensive marketing and technical data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${workSans.variable} ${outfit.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
