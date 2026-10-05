"use client";

import type { ReactNode } from "react";

/** KOM-01 Tombol — gaya Utama, Sekunder, Bahaya, Teks. */
type VarianTombol = "utama" | "sekunder" | "bahaya" | "teks";

type TombolProps = {
  label: string;
  onClick?: () => void;
  varian?: VarianTombol;
  tipe?: "button" | "submit";
  muatan?: ReactNode;
  memproses?: boolean;
  nonaktif?: boolean;
  alasan?: string;
  lebar?: boolean;
};

export function Tombol({
  label,
  onClick,
  varian = "sekunder",
  tipe = "button",
  muatan,
  memproses = false,
  nonaktif = false,
  alasan,
  lebar = false,
}: TombolProps) {
  const kelas = ["btn", `btn-${varian}`];
  if (lebar) kelas.push("btn-lebar");
  if (nonaktif || memproses) kelas.push("btn-nonaktif");

  const tombol = (
    <button
      type={tipe}
      className={kelas.join(" ")}
      onClick={onClick}
      disabled={nonaktif || memproses}
      aria-busy={memproses || undefined}
    >
      {memproses ? (
        <span className="btn-muatan berputar" aria-hidden="true" />
      ) : muatan ? (
        <span className="btn-muatan" aria-hidden="true">
          {muatan}
        </span>
      ) : null}
      <span>{label}</span>
    </button>
  );

  if (!alasan) return tombol;

  return (
    <span className="satuan">
      {tombol}
      <span className="ket btn-alasan">{alasan}</span>
    </span>
  );
}