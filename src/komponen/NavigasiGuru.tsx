import Link from "next/link";
import { kelas, lembaga } from "../data/contoh";
import { Ikon, type NamaIkon } from "./Ikon";

type Tujuan = "beranda" | "absen" | "kelas" | "akun";

const ikonTujuan: Record<Tujuan, NamaIkon> = {
  beranda: "kotak-masuk",
  absen: "pengguna",
  kelas: "berkas",
  akun: "info",
};

const labelTujuan: Record<Tujuan, string> = {
  beranda: "Beranda",
  absen: "Absen Siswa",
  kelas: "Kelas Saya",
  akun: "Akun",
};

export function NavigasiGuru({ userId, aktif }: { userId: string; aktif: Tujuan }) {
  const waliKelas = kelas.some(
    (baris) =>
      baris.wali_user_id === userId &&
      baris.tahun_ajaran === lembaga[0].tahun_ajaran_aktif
  );
  const tujuan: { id: Tujuan; href: string }[] = [
    { id: "beranda", href: "/beranda" },
    { id: "absen", href: "/absen-siswa" },
  ];
  if (waliKelas) tujuan.push({ id: "kelas", href: "/kelas-saya" });
  tujuan.push({ id: "akun", href: "/akun" });

  return (
    <nav className="navigasi-peran" aria-label="Menu Guru">
      {tujuan.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`navigasi-peran-link${aktif === item.id ? " aktif" : ""}`}
          aria-current={aktif === item.id ? "page" : undefined}
        >
          <Ikon nama={ikonTujuan[item.id]} ukuran={20} />
          <span>{labelTujuan[item.id]}</span>
        </Link>
      ))}
    </nav>
  );
}