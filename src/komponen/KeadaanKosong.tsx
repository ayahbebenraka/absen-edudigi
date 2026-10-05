import type { ReactNode } from "react";
import { Ikon, type NamaIkon } from "./Ikon";

/** KOM-11 Keadaan Kosong — ikon + 1 kalimat petunjuk + tombol aksi. */
type KeadaanKosongProps = {
  teks: string;
  ikon?: NamaIkon;
  aksi?: ReactNode;
};

export function KeadaanKosong({ teks, ikon = "kotak-masuk", aksi }: KeadaanKosongProps) {
  return (
    <div className="kosong">
      <span className="kosong-ikon">
        <Ikon nama={ikon} ukuran={24} />
      </span>
      <p className="kosong-teks">{teks}</p>
      {aksi}
    </div>
  );
}