import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { EnvBanner } from "@/components/debug/EnvBanner";
import { logEnvironmentStatus } from "@/lib/firebase/env-logger";

// Chunk B: Server-side log on startup
logEnvironmentStatus();

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://million-chances.vercel.app"),
  title: "Million Chances - Work Memory App",
  description: "Image-clustered work memory app",
  openGraph: {
    title: "Million Chances",
    description: "Image-clustered work memory app",
    url: "https://million-chances.vercel.app",
    siteName: "Million Chances",
    images: [
      {
        url: "/opengraph-image.webp?v=1",
        width: 1200,
        height: 630,
        alt: "Million Chances Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${geistMono.variable} antialiased`}
      >
        <EnvBanner />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
