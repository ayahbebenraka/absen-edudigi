import { Ikon, type NamaIkon } from "./Ikon";

/** KOM-05 Lencana Status — pil berisi ikon + label teks (PK-C1). */
type StatusAbsen = "hadir" | "terlambat" | "izin" | "sakit" | "dinas_luar" | "alpa";

type Penanda = "Pulang Awal" | "Tidak Lengkap" | "Dikoreksi";

type LencanaProps = {
  status: StatusAbsen;
  penanda?: Penanda;
};

const gaya: Record<StatusAbsen, { kelas: string; label: string; ikon: NamaIkon }> = {
  hadir: { kelas: "pil-hadir", label: "Hadir", ikon: "periksa" },
  terlambat: { kelas: "pil-terlambat", label: "Terlambat", ikon: "jam" },
  izin: { kelas: "pil-izin", label: "Izin", ikon: "berkas" },
  sakit: { kelas: "pil-izin", label: "Sakit", ikon: "jantung" },
  dinas_luar: { kelas: "pil-izin", label: "Dinas Luar", ikon: "tas" },
  alpa: { kelas: "pil-alpa", label: "Alpa", ikon: "silang" },
};

export function Lencana({ status, penanda }: LencanaProps) {
  const statusGaya = gaya[status];
  return (
    <span className="pil-berbaris">
      <span className={`pil ${statusGaya.kelas}`}>
        <Ikon nama={statusGaya.ikon} ukuran={16} label={statusGaya.label} />
        <span>{statusGaya.label}</span>
      </span>
      {penanda ? (
        <span className="pil pil-penanda">
          <span>{penanda}</span>
        </span>
      ) : null}
    </span>
  );
}