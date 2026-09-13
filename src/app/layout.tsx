import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoTrack – Carbon Footprint Tracker",
  description:
    "Monitor your daily environmental impact and reduce your carbon footprint with EcoTrack.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
