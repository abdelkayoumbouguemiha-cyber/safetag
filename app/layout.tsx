import type { Metadata } from "next";
import { Poppins, Inter, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import RegisterServiceWorker from "./register-sw";

const poppins = Poppins({
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SafeTag",
  description: "QR-code child safety bracelet platform",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/brand/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/brand/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <RegisterServiceWorker />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
