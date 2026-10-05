import type { ReactNode } from "react";

/**
 * KOM-17 Header Halaman — judul + satu tombol aksi utama.
 * Aksi di kanan (desktop) atau di bawah judul (HP).
 */
type HeaderProps = {
  judul: string;
  tanggal?: string;
  aksi?: ReactNode;
};

export function Header({ judul, tanggal, aksi }: HeaderProps) {
  return (
    <header className="header">
      <span>
        <h1>{judul}</h1>
        {tanggal ? <p className="ket">{tanggal}</p> : null}
      </span>
      {aksi ? <span className="header-aksi">{aksi}</span> : null}
    </header>
  );
}