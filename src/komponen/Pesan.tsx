"use client";

import { useEffect, useId } from "react";
import { Ikon, type NamaIkon } from "./Ikon";

/**
 * KOM-10 Pesan Singkat — muncul di atas (HP) / pojok kanan atas (desktop).
 * Galat bertahan sampai ditutup; sukses dan info menutup sendiri 4 detik.
 */
type JenisPesan = "sukses" | "galat" | "info";

type PesanProps = {
  jenis: JenisPesan;
  teks: string;
  onTutup?: () => void;
};

const DURASI_SENJA = 4000;

const gaya: Record<JenisPesan, { kelas: string; ikon: NamaIkon }> = {
  sukses: { kelas: "pesan-sukses", ikon: "periksa" },
  galat: { kelas: "pesan-galat", ikon: "silang" },
  info: { kelas: "pesan-info", ikon: "info" },
};

export function Pesan({ jenis, teks, onTutup }: PesanProps) {
  const id = useId();
  const gayaPesan = gaya[jenis];

  useEffect(() => {
    if (jenis === "galat") return;
    const timer = setTimeout(() => onTutup?.(), DURASI_SENJA);
    return () => clearTimeout(timer);
  }, [jenis, onTutup]);

  return (
    <div
      className={`pesan ${gayaPesan.kelas}`}
      role={jenis === "galat" ? "alert" : "status"}
      aria-live="polite"
      id={id}
    >
      <span className="pesan-ikon">
        <Ikon nama={gayaPesan.ikon} ukuran={20} />
      </span>
      <span className="pesan-teks">{teks}</span>
      <button type="button" className="pesan-tutup" onClick={() => onTutup?.()} aria-label="Tutup pesan">
        <Ikon nama="silang" ukuran={20} />
      </button>
    </div>
  );
}