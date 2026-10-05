"use client";

import { useRef } from "react";
import { Ikon } from "./Ikon";
import { Tombol } from "./Tombol";

/**
 * KOM-16 Unggah File — tombol `Pilih berkas` + keterangan format dan
 * ukuran; pratinjau nama berkas. Validasi tipe dan ukuran (mis. T-06:
 * JPG/PNG ≤ 1 MB) dilakukan pemanggil lewat `onPilih`.
 */
type UnggahProps = {
  id: string;
  label: string;
  terima: string;
  keterangan: string;
  namaBerkas?: string | null;
  onPilih: (berkas: File) => void;
  galat?: string;
};

export function Unggah({
  id,
  label,
  terima,
  keterangan,
  namaBerkas,
  onPilih,
  galat,
}: UnggahProps) {
  const rujukan = useRef<HTMLInputElement>(null);

  return (
    <span className="isian-satuan">
      <span className="isian-label">{label}</span>
      <span className="unggah">
        <input
          ref={rujukan}
          id={id}
          type="file"
          accept={terima}
          className="unggah-input"
          onChange={(kejadian) => {
            const berkas = kejadian.target.files?.[0];
            if (berkas) onPilih(berkas);
          }}
        />
        <Tombol
          label="Pilih berkas"
          varian="sekunder"
          onClick={() => rujukan.current?.click()}
        />
        {namaBerkas ? (
          <span className="unggah-nama">{namaBerkas}</span>
        ) : (
          <span className="ket">{keterangan}</span>
        )}
      </span>
      {galat ? (
        <span className="isian-keterangan isian-galat">
          <Ikon nama="silang" ukuran={16} />
          <span>{galat}</span>
        </span>
      ) : null}
    </span>
  );
}
