"use client";

import { useId, useState } from "react";
import { Ikon } from "./Ikon";

/** KOM-03 Isian — label di atas, tinggi 48 px, galat inline. */
type TipeIsian = "email" | "password" | "teks" | "nomor";

type IsianProps = {
  id: string;
  label: string;
  nilai: string;
  onChange: (nilai: string) => void;
  tipe?: TipeIsian;
  galat?: string;
  bantuan?: string;
  placeholder?: string;
  autoComplete?: "username" | "current-password" | "new-password" | "off";
  bolehLihat?: boolean;
};

const native: Record<TipeIsian, string> = {
  email: "email",
  password: "password",
  teks: "text",
  nomor: "text",
};

export function Isian({
  id,
  label,
  nilai,
  onChange,
  tipe = "teks",
  galat,
  bantuan,
  placeholder,
  autoComplete = "off",
  bolehLihat = false,
}: IsianProps) {
  const idGalat = useId();
  const idBantuan = useId();
  const [lihat, setLihat] = useState(false);

  const tipeNative = tipe === "password" && lihat ? "text" : native[tipe];
  const deskripsi = galat ? idGalat : bantuan ? idBantuan : undefined;

  return (
    <span className="isian-satuan">
      <label className="isian-label" htmlFor={id}>
        {label}
      </label>
      <span className={galat ? "isian isian-salah" : "isian"}>
        <input
          id={id}
          type={tipeNative}
          value={nilai}
          onChange={(perubahan) => onChange(perubahan.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={tipe === "nomor" ? "numeric" : undefined}
          aria-invalid={galat ? true : undefined}
          aria-describedby={deskripsi}
        />
        {bolehLihat && tipe === "password" ? (
          <button
            type="button"
            className="isian-tombol"
            onClick={() => setLihat((tampil) => !tampil)}
            aria-pressed={lihat}
          >
            {lihat ? "Sembunyikan" : "Tampilkan"}
          </button>
        ) : null}
      </span>
      {galat ? (
        <span className="isian-keterangan isian-galat" id={idGalat}>
          <Ikon nama="silang" ukuran={16} />
          <span>{galat}</span>
        </span>
      ) : null}
      {!galat && bantuan ? (
        <span className="isian-keterangan isian-bantuan" id={idBantuan}>
          {bantuan}
        </span>
      ) : null}
    </span>
  );
}