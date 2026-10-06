import Link from "next/link";
import { Ikon, type NamaIkon } from "./Ikon";

type PeranPengelola = "kepala" | "admin";
type TujuanPengelola = "dashboard" | "akun";

const tujuan: { id: TujuanPengelola; href: string; label: string; ikon: NamaIkon }[] = [
  { id: "dashboard", href: "/beranda", label: "Dashboard", ikon: "kotak-masuk" },
  { id: "akun", href: "/akun", label: "Akun", ikon: "info" },
];

export function NavigasiPeran({ role, aktif }: { role: PeranPengelola; aktif: TujuanPengelola }) {
  return (
    <nav className="navigasi-peran" aria-label={role === "kepala" ? "Menu Kepala" : "Menu Admin"}>
      {tujuan.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`navigasi-peran-link${aktif === item.id ? " aktif" : ""}`}
          aria-current={aktif === item.id ? "page" : undefined}
        >
          <Ikon nama={item.ikon} ukuran={20} />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}