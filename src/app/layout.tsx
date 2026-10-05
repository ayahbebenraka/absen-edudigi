import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../token.css";
import "../komponen/komponen.css";

export const metadata: Metadata = {
  title: "Absensi Madrasah",
  description: "Aplikasi absensi guru dan siswa berbasis geo tagging.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}