import type { Metadata } from "next";
import { Fredoka, Geist, Geist_Mono } from "next/font/google"; // Keeping Geist just in case, but Fredoka is primary
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["300", "400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Survival Electronics - Best Electronics Store in Lagos | TVs, Generators & More",
  description: "Shop genuine electronics in Lagos at Survival Electronics. Best prices for TVs, generators, fans, and home appliances. Fast delivery & trusted service. Call us today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
