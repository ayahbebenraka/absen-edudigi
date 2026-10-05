"use client";

import { users, type Peran } from "./contoh";

/**
 * sesi.ts — satu-satunya implementasi sesi mock (FR-AK-01, FR-AK-02).
 *
 * Fase frontend memakai `localStorage`; diganti penuh oleh Supabase Auth pada
 * Fase Backend (D-09). Password **tidak** ada di tabel `users` (DM-D1).
 */

const KUNCI_SESI = "sesi-absen-edudigi";

/** Password awal per peran. Hanya untuk mock Fase Frontend. */
const sandiPeran: Record<Peran, string> = {
  admin: "admin123",
  kepala: "kepala123",
  guru: "guru123",
  siswa: "siswa123",
};

export type Sesi = {
  userId: string;
  email: string;
  role: Peran;
  nama: string;
  nomor_induk: string;
  masukPada: string;
};

/**
 * Tujuan setelah login berhasil (FR-AK-01). Pada Milestone 1 semua peran
 * diarahkan ke placeholder yang sama; modul berikutnya memisahkannya.
 */
export const tujuanSesudahMasuk: Record<Peran, string> = {
  guru: "/beranda",
  kepala: "/beranda",
  admin: "/beranda",
  siswa: "/beranda",
};

/** Nama peran untuk ditampilkan, mengikuti glosarium baku (PK-D1). */
export const namaPeran: Record<Peran, string> = {
  admin: "Admin",
  kepala: "Kepala Madrasah",
  guru: "Guru",
  siswa: "Siswa",
};

export type HasilMasuk = { berhasil: true; sesi: Sesi } | { berhasil: false };

/** Jeda pendek agar keadaan "Memproses…" pada tombol terlihat (PK-B9). */
const JEDA_MOCK = 450;

function jeda(ms: number) {
  return new Promise((selesai) => setTimeout(selesai, ms));
}

function bacaPenyimpanan(): Sesi | null {
  try {
    const teks = window.localStorage.getItem(KUNCI_SESI);
    if (!teks) return null;
    return JSON.parse(teks) as Sesi;
  } catch {
    return null;
  }
}

/**
 * `undefined` berarti "belum diketahui" dan hanya muncul pada snapshot sisi
 * server. Penyimpanan dibaca sekali lalu disimpan di cache supaya snapshot
 * `useSyncExternalStore` tetap sama (dibutuhkan agar React tidak melakukan
 * render ulang terus-menerus).
 */
let cache: Sesi | null | undefined;

export function ambilSesi(): Sesi | null {
  if (cache === undefined) cache = bacaPenyimpanan();
  return cache;
}

export function ambilSesiServer(): undefined {
  return undefined;
}

export function dengarSesi(panggil: () => void) {
  window.addEventListener("storage", panggil);
  return () => window.removeEventListener("storage", panggil);
}

export function ambilKoneksi(): boolean {
  return navigator.onLine !== false;
}

export function ambilKoneksiServer(): boolean {
  return true;
}

export function dengarKoneksi(panggil: () => void) {
  window.addEventListener("online", panggil);
  window.addEventListener("offline", panggil);
  return () => {
    window.removeEventListener("online", panggil);
    window.removeEventListener("offline", panggil);
  };
}

export function simpanSesi(sesi: Sesi) {
  window.localStorage.setItem(KUNCI_SESI, JSON.stringify(sesi));
  cache = sesi;
}

export function keluar() {
  window.localStorage.removeItem(KUNCI_SESI);
  cache = null;
}

/**
 * Memeriksa email dan password mock. Keberhasilan maupun kegagalan
 * disengaja tidak membocorkan mana yang salah (FS Lampiran A MSG-15).
 */
export async function masuk(email: string, sandi: string): Promise<HasilMasuk> {
  await jeda(JEDA_MOCK);
  if (!ambilKoneksi()) return { berhasil: false };

  const cari = users.find((user) => user.email === email.trim().toLowerCase());
  if (!cari || !cari.aktif) return { berhasil: false };
  if (sandi !== sandiPeran[cari.role]) return { berhasil: false };

  const sesi: Sesi = {
    userId: cari.id,
    email: cari.email,
    role: cari.role,
    nama: cari.nama,
    nomor_induk: cari.nomor_induk,
    masukPada: new Date().toISOString(),
  };
  simpanSesi(sesi);
  return { berhasil: true, sesi };
}

/* ------------------------------------------------------------------ */
/* SCR-26: ganti password dan profil (FR-AK-02, FR-AK-04, FR-AK-05).   */
/* Fase frontend menyimpan di localStorage; diganti Supabase di M10.   */

const KUNCI_SANDI = "sandi-absen-edudigi";
const KUNCI_PROFIL = "profil-absen-edudigi";

export type ProfilTersimpan = {
  nama?: string;
  kontak?: string;
  foto_path?: string;
};

function bacaJson<T>(kunci: string): T {
  try {
    const teks = window.localStorage.getItem(kunci);
    return teks ? (JSON.parse(teks) as T) : ({} as T);
  } catch {
    return {} as T;
  }
}

/** Password efektif: yang pernah diubah, atau password awal peran (D-05). */
export function sandiEfektif(userId: string, role: Peran): string {
  return bacaJson<Record<string, string>>(KUNCI_SANDI)[userId] ?? sandiPeran[role];
}

export type HasilGantiSandi =
  | { berhasil: true }
  | { berhasil: false; sebab: "koneksi" | "lama-salah" };

export async function gantiPassword(
  userId: string,
  role: Peran,
  lama: string,
  baru: string
): Promise<HasilGantiSandi> {
  await jeda(JEDA_MOCK);
  if (!ambilKoneksi()) return { berhasil: false, sebab: "koneksi" };
  if (sandiEfektif(userId, role) !== lama) {
    return { berhasil: false, sebab: "lama-salah" };
  }

  const ubahan = bacaJson<Record<string, string>>(KUNCI_SANDI);
  ubahan[userId] = baru;
  window.localStorage.setItem(KUNCI_SANDI, JSON.stringify(ubahan));
  return { berhasil: true };
}

export function ambilProfil(userId: string): ProfilTersimpan {
  return bacaJson<Record<string, ProfilTersimpan>>(KUNCI_PROFIL)[userId] ?? {};
}

export function simpanProfil(userId: string, profil: ProfilTersimpan) {
  const semua = bacaJson<Record<string, ProfilTersimpan>>(KUNCI_PROFIL);
  semua[userId] = profil;
  window.localStorage.setItem(KUNCI_PROFIL, JSON.stringify(semua));
}