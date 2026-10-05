import type { ReactNode } from "react";

/**
 * Satu set ikon outline (PK-C4). Ikon 20 px di dalam teks, 24 px di menu.
 * Nama ikon memakai bahasa Indonesia; jalur SVG mengikuti gaya garis lurus
 * dengan tebal seragam.
 */
export type NamaIkon =
  | "periksa"
  | "jam"
  | "berkas"
  | "jantung"
  | "tas"
  | "silang"
  | "info"
  | "mata"
  | "mata-tutup"
  | "kotak-masuk"
  | "keluar"
  | "tanda"
  | "gembok"
  | "pengguna";

const isi: Record<NamaIkon, ReactNode> = {
  periksa: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </>
  ),
  jam: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 1.8" />
    </>
  ),
  berkas: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h6" />
    </>
  ),
  jantung: (
    <>
      <path d="M12 20s-7-4.7-7-9.5A4 4 0 0 1 12 7a4 4 0 0 1 7 3.5C19 15.3 12 20 12 20Z" />
      <path d="M5.5 11.5h2.8L9.6 9.5l1.8 4 1.5-2h3.6" />
    </>
  ),
  tas: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path d="M3 12h18" />
    </>
  ),
  silang: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 7.75h.01" />
    </>
  ),
  mata: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  "mata-tutup": (
    <>
      <path d="M4 4l16 16" />
      <path d="M9.9 5.9A9.7 9.7 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3 4" />
      <path d="M6.3 7.8A17.4 17.4 0 0 0 2.5 12S6 18.5 12 18.5a9.4 9.4 0 0 0 3.4-.6" />
      <path d="M10.2 10.2a2.4 2.4 0 0 0 3.4 3.4" />
    </>
  ),
  "kotak-masuk": (
    <>
      <path d="M4 13h4l1.5 3h5L16 13h4" />
      <path d="M4 13 6.2 5.2A2 2 0 0 1 8.1 4h7.8a2 2 0 0 1 1.9 1.2L20 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    </>
  ),
  keluar: (
    <>
      <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
      <path d="m10 8-4 4 4 4" />
      <path d="M6 12h9" />
    </>
  ),
  tanda: (
    <>
      <path d="M12 21s7-5.8 7-11a7 7 0 1 0-14 0c0 5.2 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  gembok: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  pengguna: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c0-4 3.5-6.5 7.5-6.5s7.5 2.5 7.5 6.5" />
    </>
  ),
};

type IkonProps = {
  nama: NamaIkon;
  ukuran?: number;
  label?: string;
  className?: string;
};

export function Ikon({ nama, ukuran = 20, label, className }: IkonProps) {
  return (
    <svg
      width={ukuran}
      height={ukuran}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {isi[nama]}
    </svg>
  );
}