import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Outfit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat-font",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit-font",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Predicting AQI from Census Data",
  description: "Leveraging machine learning and demographic insights to forecast air quality across communities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${outfit.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
