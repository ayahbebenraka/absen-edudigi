# Plan — Milestone 1: Fondasi Frontend + SCR-01 Login (mock)

Aplikasi Absensi Guru dan Siswa Berbasis Geo Tagging · Fase Frontend (BRD 18.2 Tahap 3)
Target: fondasi yang dapat dijalankan, diperiksa di 375 px & 1280 px, dan tidak melanggar PK-A..PK-F.

---

## 1. Keputusan yang Sudah Dikunci (disetujui pengguna)

| # | Keputusan | Nilai | Sumber |
|---|---|---|---|
| K1 | Fondasi | **Next.js App Router (TypeScript) + Supabase**. Semua baca/tulis lewat route handler server (`/api/*`) memakai `SERVICE_ROLE_KEY` dari env; RLS tanpa kebijakan klien | DM-P9, DM 8.1 |
| K2 | Cakupan plan | **Hanya fondasi + SCR-01 Login**. Modul lain = roadmap | PK-E5, FS 11.1 |
| K3 | Token visual | **FS 2.5 = acuan**. `DESIGN.md` = referensi saja, **nilai tidak diambil** | FS 2.5, PK-C2/C3/C7 |
| K4 | Dark mode | **Ada**, mengikuti `prefers-color-scheme` seperti wireframe. Tanpa tombol pengalih (out of scope) | Persetujuan pengguna |
| K5 | Password awal (mock) | `admin123` / `kepala123` / `guru123` / `siswa123` — dipakai mock saja di Fase Frontend | D-05 (dok. §4.1 hilang) |
| K6 | Bahasa route | kebab-case Indonesia (`/masuk`, `/beranda`, nanti `/absen-siswa`) | PK-D1 |
| K7 | Tanpa Tailwind | CSS variable + 1 file komponen global (meniru kelas wireframe: `.btn`, `.kartu`, `.pil`) | PK-F2 |
| K8 | Tanpa import alias | import relatif, grep-able | PK-B (pemula) |

## 2. Sumber Kebenaran (baca sebelum menulis kode)

- `blueprint/002_FS_..._v1.2.md` **Bagian 2** (mengikat): 2.2 responsif, 2.3 navigasi, 2.5 token, 2.6 KOM, 2.7 glosarium, 2.8 5 keadaan, 2.10 Daftar Periksa
- `blueprint/002_FS_..._v1.2.md` FR-AK-01, Lampiran A (MSG-15, MSG-21, ES-01)
- `blueprint/003_DataModel_..._v1.0.md` **Lampiran B** (mock 13 tabel), 5.1 (`lembaga`)
- `blueprint/004_01_... Modul 1–3.html` ( SCR-01 & komponen) — acuan visual
- BRD Bagian 3 (PK-A..F), 16.3 (Daftar Periksa)

## 3. Cakupan

**Dalam cakupan**
1. Perbaiki `.gitignore` (buang pagar markdown yang rusak).
2. Scaffold Next.js App Router + TypeScript di root repo.
3. `token.css`: token FS 2.5 + blok dark + reset + base.
4. Komponen dasar seperlunya: `KOM-01, 03, 05, 08, 10, 11, 12, 17`.
5. Layout responsif + navigasi sesuai FS 2.3 (shell, tanpa isi modul).
6. `src/data/contoh.ts` — mock **13 tabel** sesuai Data Model.
7. `src/data/sesi.ts` — mock masuk/keluar (satu-satunya implementasi sesi mock).
8. `SCR-01 Login` + `SCR-00 placeholder` hasil redirect.

**Di luar cakupan (jangan dibuat)**
Supabase/Auth, SQL, 26 layar lain, Tailwind, dark-mode toggle, i18n, test framework, eslint config custom, `.env.example`, deploy.

## 4. Struktur Proyek Target (dangkal)

```
absen-edudigi/
├─ blueprint/            (tetap)
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx      root: <html lang="id">, memuat token.css + komponen.css
│  │  ├─ globals.css?    ❌ tidak perlu — token.css menggantikan
│  │  ├─ page.tsx        SCR-01 Login (route "/")
│  │  └─ beranda/page.tsx  placeholder sementara hasil redirect
│  ├─ komponen/
│  │  ├─ Tombol.tsx      KOM-01
│  │  ├─ Isian.tsx       KOM-03
│  │  ├─ Lencana.tsx     KOM-05
│  │  ├─ Kartu.tsx       KOM-08
│  │  ├─ Pesan.tsx       KOM-10
│  │  ├─ KeadaanKosong.tsx KOM-11
│  │  ├─ Pemuat.tsx      KOM-12
│  │  ├─ Header.tsx      KOM-17
│  │  └─ komponen.css    kelas baku bersama
│  ├─ data/
│  │  ├─ contoh.ts       mock 13 tabel
│  │  └─ sesi.ts         mock sesi (masuk/keluar/sesiAktif)
│  └─ token.css
├─ package.json  tsconfig.json  next.config.ts  eslint.config.mjs
└─ README.md            (tambah 5 baris cara menjalankan)
```

Tidak ada `services/`, `hooks/`, `store/`, `lib/`, `types/` (PK-F).

## 5. Langkah Implementasi (berurutan)

| # | Langkah | Perintah / hasil |
|---|---|---|
| L0 | Prasyarat: **Node.js 20 LTS** + npm. Cek `node -v`. Bila < 20, hentikan dan minta pengguna perbarui. | `node -v` |
| L1 | Perbaiki `.gitignore`: hapus baris 1 ``` dan baris terakhir ```; isi tetap `node_modules/`, `.next/`, `.env`, `.env.local`, `dist/`, `build/` | edit |
| L2 | Scaffold di folder sementara agar repo tidak bentrok dengan `blueprint/` | `npx create-next-app@latest tmp-scaffold --ts --eslint --app --no-tailwind --src-dir --no-import-alias --use-npm --yes` |
| L3 | Pindahkan hasil scaffold ke root: `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `next-env.d.ts`, `.gitignore`( gabung, jangan timpa L1), `public/`, `src/` | `mv tmp-scaffold/* .` lalu hapus `tmp-scaffold/` |
| L4 | `npm install` di root | `npm install` |
| L5 | Bersihkan file contoh bawaan Next (`src/app/page.tsx`, globals.css, layout bawaan) | edit |
| L6 | Tulis `src/token.css` (Bagian 6) | tulis |
| L7 | Tulis `src/komponen/komponen.css` + 8 komponen (Bagian 7) | tulis |
| L8 | Tulis `src/data/contoh.ts` (Bagian 8) | tulis |
| L9 | Tulis `src/data/sesi.ts` | tulis |
| L10 | `src/app/layout.tsx` + `src/app/page.tsx` (SCR-01) + `src/app/beranda/page.tsx` (Bagian 9) | tulis |
| L11 | Verifikasi (Bagian 11) | `npm run build`, cek visual |
| L12 | Commit + **ingatkan pengguna push manual** | `git add`/`git commit` |
| L13 | Dokumentasi penyimpangan dark mode → FS **v1.2** (Bagian 10) | edit FS |

> Jika `npx`/`npm` ditolak oleh aturan izin sesi, jalankan manual di terminal VS Code.

## 6. `src/token.css` — Nilai Baku (dari FS 2.5 + wireframe)

```css
:root{                                  /* terang — nilai FS 2.5 */
  --utama:#1F5C4A; --lembut:#EEF5F2; --teks:#1F2933; --redup:#52606D;
  --garis:#E4E7EB;  --latar:#F7F9FA;  --perm:#FFFFFF;  --abu:#EDF0F2;
  --s-hadir:#1B5E20; --s-hadir-bg:#E8F5E9;
  --s-terlambat:#8A5300; --s-terlambat-bg:#FFF4E0;
  --s-izin:#0D47A1; --s-izin-bg:#E3F2FD;
  --s-alpa:#B71C1C; --s-alpa-bg:#FDECEA;
}
@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]){
  --utama:#6FC2A5; --lembut:#1B2B26; --teks:#E8ECEF; --redup:#9AA5B1;
  --garis:#323B44; --latar:#12171B;  --perm:#1A2026;  --abu:#262E35;
} }
```

Aturan lain (dari FS 2.5, wajib):
- Font: `Inter, system-ui, "Segoe UI", Roboto, sans-serif` — **satu keluarga**.
- Ukuran: Judul 20 px (HP) / 24 px (desktop), semibold · Isi 16 px · Keterangan 14 px `--redup`. **Tidak boleh ada ukuran lain.**
- Spasi: 4/8/12/16/24/32. Padding halaman 16 px (HP) / 24 px (desktop). Radius: kartu 12 px, isian & tombol 10 px, pil `9999px`.
- Kartu: `border:1px solid var(--garis)`, **tanpa bayangan**. Bayangan hanya untuk dialog/mengambang (KOM-09, belum dipakai di M1).
- Breakpoint: HP `<768px` · Tablet `768–1023px` · Desktop `≥1024px`. Konten maks 1200 px, form maks 640 px.
- Teks isi ≥ 16 px di HP, target sentuh ≥ 44 px (jarak antar target ≥ 8 px).
- Angka memakai tabular numerals (`font-variant-numeric: tabular-nums`).
- Status selalu berwarna **lengkap dengan teks** (PK-C1) — tidak pernah warna saja.
- `html{ color-scheme: light dark }`.

## 7. Komponen yang Dibangun

| Komponen | API minimal | Catatan wajib |
|---|---|---|
| `Tombol` (KOM-01) | `varian: 'utama'\|'sekunder'\|'bahaya'\|'teks'`, `muatan?`, `onClick` | tinggi ≥ 48 px (HP) / 44 px (desktop); `disabled` menampilkan teks alasan |
| `Isian` (KOM-03) | `label`, `id`, `tipe`, `nilai`, `onChange`, `galat?`, `bantuan?` | label di atas, tinggi 48 px, galat inline merah + ikon, `inputMode` untuk angka |
| `Lencana` (KOM-05) | `status: 'hadir'\|'terlambat'\|'izin'\|'sakit'\|'dinas_luar'\|'alpa'`, `penanda?` | pil: ikon outline + label teks; warna dari `token.css` |
| `Kartu` (KOM-08) | `judul?`, `children` | 1 topik/kartu |
| `Pesan` (KOM-10) | `jenis: 'sukses'\|'galat'\|'info'`, `teks` | galat bertahan sampai ditutup; sukses/info 4 detik |
| `KeadaanKosong` (KOM-11) | `ikon?`, `teks`, `aksi?` | 1 kalimat petunjuk + tombol aksi |
| `Pemuat` (KOM-12) | `teks?` | skeleton, bukan layar kosong |
| `Header` (KOM-17) | `judul`, `tanggal?`, `aksi?` | 1 aksi utama saja |

**Sengaja belum dibuat** (built when first needed — PK-F2): `KOM-02, 04, 06, 07, 09, 13, 14, 15, 16, 18`.

## 8. `src/data/contoh.ts` — Mock 13 Tabel

- Satu file, **tanpa放 logika bisnis**, hanya data (PK-F1: angka bisnis di data `lembaga`, bukan di kode).
- Salin **Lampiran B Data Model** apa adanya: `users` (7 baris), `kelas` (2), `siswa` (2), `jadwal_override_guru` (2), `kalender` (2), `absensi_guru` (6), `absensi_siswa` (4), `izin_guru` (2), `izin_siswa` (1), `pengajuan_koreksi` (1).
- `jadwal_default`: 14 baris (Sabtu–Rabu 07:00–14:00, Kamis 07:00–12:00, Jumat tidak aktif) — dua set guru & siswa.
- `lembaga`: 1 baris lengkap memakai bawaan Data Model 5.1 (`radius_m` 200, `akurasi_maks_m` 50, `buka_masuk_menit` 30, `toleransi_menit` 10, `tutup_masuk_menit` 180, `buka_pulang_menit` 60, `domain_email` `akademik.sch.id`, `tahun_ajaran_aktif` `2026/2027`, `tutup_hari_terakhir` `2026-10-04`).
- `log_aktivitas`: boleh kosong (tidak dipakai di Fase Frontend) — sertai agar 13 tabel lengkap.
- Tipe: `type Tabel = 'lembaga' | 'users' | ...`; **`id` boleh teks pendek** (`u-g1`, `k-7a`) sesuai Lampiran B.
- Password **tidak** ada di tabel `users` (DM-D1). Nilai K5 disimpan sebagai konstanta di `sesi.ts`.

## 9. Perilaku SCR-01 Login (FS FR-AK-01, Lampiran A)

| Aspek | Specifikasi |
|---|---|
| Route | `/` (jika sudah ada sesi mock → redirect `/beranda`) |
| Isian | `Email` (KOM-03, `type="email"`, `autoComplete="username"`) + `Password` (`type="password"`, `autoComplete="current-password"`, tombol tampil/sembunyikan) |
| Label | Persis: **Email**, **Password**, tombol **`Masuk`** (PK-D6) |
| Aksi utama | `Masuk` (KOM-01 varian utama) — **hanya satu** |
| Validasi | Kosong → `Isian Email wajib diisi` / `Isian Password wajib diisi`; format email salah → `Format email belum benar. Contoh: nama@akademik.sch.id` |
| Gagal login | **MSG-15** verbatim: "Email atau password salah. Periksa lalu coba lagi." — jangan sebut mana yang salah |
| Sukses | Simpan sesi mock → redirect sesuai peran (peta di `sesi.ts`): guru/kepala/admin/siswa → `/beranda` (semua placeholder di M1) |
| processing | Tombol → "Memproses…" + indikator, dinonaktifkan sementara (anti klik ganda) |
| 5 keadaan (FS 2.8) | Normal (form) · Memuat (cek sesi → `Pemuat`) · Kosong (form siap, teks bantu "Masukkan email dan password Anda") · Galat (MSG-15) · Tanpa koneksi (MSG-21 verbatim + data tetap tampil) |
| Desktop |_sidebar_ tidak dipakai di Login;form maks 640 px, rata tengah |
| HP | Bilah menu bawah **tidak** muncul di Login; padding 16 px, teks 16 px |
| Akses | Halaman dapat dibuka tanpa sesi; `/beranda` **menampilkan "Halaman tidak tersedia untuk Anda" (MSG-23) + tombol `Kembali`** bila tanpa sesi — sudah ada mock sesi, cukup cek di memori/localStorage |
| `beranda/page.tsx` | Placeholder **sengaja minimal**: nama peran, "Modul berikutnya: …", tombol `Keluar` (FR-AK-02). Tanpa navigasi final — navigasi per peran dibangun bersama modulnya |

## 10. Penyimpangan dari FS yang Disetujui + Dokumentasi

| Penyimpangan | Status |
|---|---|
| Dark mode ada, padahal BRD/FS tidak menyebutnya | **Disetujui pengguna.** Semua warna tetap via CSS variable → nol perubahan komponen bila dihapus nanti |
| Tanpa tombol pengalih tema | Out of scope; bisa ditambahkan sebagai komponen terpisah |
| `KOM-02, 04, 06, 07, 09, 13–16, 18` belum dibuat | Sesuai PK-F2 (dibuat saat pertama dipakai) |
| Mock session di `localStorage`, bukan Supabase Auth | Sesuai D-09 (frontend dulu); diganti penuh di Fase Backend |

**Tugas L13 (dokumentasi, wajib — Master §20 & PK-E3):** naikkan FS ke **v1.2** dengan 3 edit kecil:
1. Tabel 1.4 Riwayat Revisi → baris `1.2 | <tanggal> | Dark mode (prefers-color-scheme) disetujui; token.css mengikuti FS 2.5; H-08 dicatat`.
2. Bagian 13 → baris **H-08**: "Mode gelap — **Aktif** mengikuti `prefers-color-scheme` seperti wireframe; tombol pengalih tema ditunda."
3. Catatan 1 baris di 2.5: "Implementasi menyediakan token terang dan gelap; keduanya memakai nama variabel yang sama."

## 11. Verifikasi (WAJIB sebelum commit — jangan klaim berhasil tanpa ini)

| V | Cara | Lulus bila |
|---|---|---|
| V1 | `node -v` | ≥ 20 |
| V2 | `npm run build` | 0 error TypeScript + 0 error lint |
| V3 | `npm run dev` → buka `http://localhost:3000` | Login tampil, tidak ada error runtime di konsol |
| V4 | DevTools 375 px | Login rapi, teks 16 px, tombol ≥ 48 px, tanpa scroll horizontal |
| V5 | DevTools 1280 px | Form maks 640 px rata tengah, tidak penuh layar |
| V6 | DevTools → emulate `prefers-color-scheme: dark` (clear/light/dark) | Teks tetap terbaca, kartu & isian kontras (PK-C6) |
| V7 | Uji 5 keadaan FS 2.8 | Normal, Memuat, Kosong, Galat (email salah → MSG-15), Tanpa koneksi |
| V8 | Uji 4 akun mock (admin/kepala/guru/siswa) + 1 email salah | 4 berhasil → `/beranda` + nama peran; 1 gagal → MSG-15 |
| V9 | `KOM-10` galat bertahan ≥ 4 detik, sukses hilang ± 4 detik | Sesuai FS 2.6 |
| V10 | **Grep angka bisnis**: cari `200`, `50`, `30`, `10`, `180`, `60` di `src/app` & `src/komponen` | 0 kemunculan di luar `contoh.ts` (PK-F1) |
| V11 | Checklist FS 2.10 untuk SCR-01 | Semua butir A–F terisi |
| V12 | Grep istilah terlarang: "Datang", "Terlambat masuk", "Operator" | 0 hasil (PK-D1) |

## 12. Git

- `git status` → pastikan hanya file baru + `.gitignore` yang berubah.
- Commit: **`feat: tambah fondasi token, komponen dasar, dan layar login`**
- Lalu: **INGATKAN PENGGUNA UNTUK PUSH MANUAL lewat GitHub Desktop.** Saat ini branch `main` masih **1 commit di depan `origin/main`** (`15c9b32`) — 用户 should push both.
- Jangan pernah menyatakan push berhasil tanpa verifikasi `git status` bersih + branch tidak lagi "ahead".

## 13. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Dark mode diuji tapi status pill tetap terang | Kontras teks-di-latar sendiri tetap ≥ 4.5:1; verifikasi manual V6 |
| `create-next-app` gagal di repo non-kosong | Scaffold ke `tmp-scaffold/`, lalu pindahkan (L2–L3) |
| Node versi lama tidak bisa `next dev` | Deteksi di L0, hentikan & minta pengguna perbarui |
| Mock `contoh.ts` melebar jadi data hard-coded bercabang | Wajib terkonfirmasi saat modul berikutnya: layar **hanya** merakit & memanggil data, tidak mengarang angka |
| Penyimpangan dark mode dianggap cacat | Dicatat resmi di FS v1.2 (L13) → sesuai PK-E3, bukan perubahan diam-diam |

## 14. Roadmap (di luar plan ini — urutan FS 11.1 / BRD 18.3)

| Milestone | Isi | Plans/UAT terkait |
|---|---|---|
| M2 | **SCR-02 Beranda Guru** — 6 keadaan tombol, jadwal hari ini, simulasi GPS (dalam/luar radius, akurasi rendah), `KOM-02` | UAT-01..07, UAT-27, UAT-36 |
| M3 | **SCR-03 Absen Siswa** — `KOM-18` pemindai, scan beruntun, ketik NISN, `KOM-18` + `KOM-15` | UAT-11..14, UAT-30, UAT-39 |
| M4 | **SCR-07/08 Dashboard** + navigasi final per peran (FS 2.3) | UAT-41 |
| M5 | Master Data SCR-10..14 (termasuk wizard kenaikan kelas) | UAT-21, 23, 25, 29, 31 |
| M6 | Jadwal, Kalender, Override, Pengaturan SCR-15..18 | UAT-08..10, 26 |
| M7 | Izin & Koreksi SCR-05, 09, 19, 20, 22 | UAT-16..20, 32, 33 |
| M8 | Laporan SCR-21 + ekspor Excel/PDF | UAT-24, 25 |
| M9 | Rekap Siswa, Kartu QR SCR-23..25 + Bantuan SCR-27 | UAT-22, 34 |
| M10 | **Fase Backend** — Supabase, SQL Lampiran A, SF-01..SF-10, Tutup Hari, impor Excel | UAT-01..41, DT-01..16, UAT-37, UAT-40 |
