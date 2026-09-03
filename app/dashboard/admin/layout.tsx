import type { ReactNode } from "react";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${plexSans.variable} ${plexMono.variable} min-h-screen bg-[#F6F7F6] text-[#13232D]`}
      style={{ fontFamily: "var(--font-plex-sans)" }}
    >
      {children}
    </div>
  );
}
