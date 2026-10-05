# PROGRES — Aplikasi Absensi Guru dan Siswa Berbasis Geo Tagging

Pelacakan milestone, layar, komponen, dan UAT. Diperbarui tiap **CHECKPOINT** (Master Instruction §19).
Sumber ID: BRD v1.1, FS v1.2, Data Model v1.0, dan plan M1 (`.kilo/plans/`).

## Kondisi Saat Ini

| Item | Nilai |
|---|---|
| Fase (BRD 18.2) | **Tahap 3 — Fase Frontend (layout)** dengan data contoh |
| Milestone aktif | **M1** — Fondasi Frontend + SCR-01 Login |
| Commit terakhir | `f36d0a4` (5 Okt 2026) · branch `main` · remote `origin` (SSH `github-ayahbebenraka`) |
| Layar selesai | 2/27 (SCR-01, SCR-26) |
| Komponen selesai | 9/18 (KOM-01, 03, 05, 08, 10, 11, 12, 16, 17) |
| UAT dijalankan | 0/41 |
| Build/lint | Lulus (`npm run build`, `npm run lint`) |

---

## 1. Milestone Pembangunan (M1–M10)

Urutan mengikuti FS 11.1 / BRD 18.3. UAT ditulis pada milestone pemiliknya.

| ID | Isi | Layar | UAT | Status |
|---|---|---|---|---|
| **M1** | Fondasi Frontend: token (FS 2.5), komponen dasar, mock 13 tabel, sesi mock; SCR-01 Login + SCR-26 Akun dan Ganti Password (gerbang modul Akun, FS 3.1) | SCR-01, 26 | UAT-23, 35, 37 | ✅ **Selesai** (`c8778b0`, `f7bd64a`); UAT-23/35/37 menyusul |
| **M2** | SCR-02 Beranda Guru: 6 keadaan tombol (KOM-02), jadwal hari ini, simulasi GPS (dalam/luar radius, akurasi rendah) | SCR-02 | UAT-01..07, 27, 36 | ⬜ Belum dimulai |
| **M3** | SCR-03 Absen Siswa: pemindai QR (KOM-18), scan beruntun, ketik NISN (KOM-15), kontrol segmen (KOM-04) | SCR-03, 06 | UAT-11..14, 30, 39 | ⬜ Belum dimulai |
| **M4** | SCR-07/08 Dashboard Kepala/Admin + navigasi final per peran (FS 2.3) | SCR-07, 08 | UAT-41 | ⬜ Belum dimulai |
| **M5** | Master Data: Lembaga, Admin/Kepala, Guru, Siswa, Kelas, wizard kenaikan kelas, impor Excel | SCR-10..14 | UAT-21, 23, 25, 29, 31 | ⬜ Belum dimulai |
| **M6** | Jadwal Default, Override Guru, Kalender, Pengaturan | SCR-15..18 | UAT-08..10, 26 | ⬜ Belum dimulai |
| **M7** | Izin & Koreksi: Izin Saya, Persetujuan, Izin input Admin, Koreksi Absen, Log Aktivitas | SCR-05, 09, 19, 20, 22 | UAT-16..20, 32, 33 | ⬜ Belum dimulai |
| **M8** | Laporan + ekspor Excel/PDF + Rekap Saya (SCR-04) | SCR-04, 21 | UAT-24, 25 | ⬜ Belum dimulai |
| **M9** | Rekap Siswa, Kartu QR (cetak massal + saya), Bantuan | SCR-23, 24, 25, 27 | UAT-22, 34 | ⬜ Belum dimulai |
| **M10** | **Fase Backend**: Supabase, SQL Lampiran A Data Model, SF-01..SF-10, Tutup Hari (23:30 WIB), impor Excel, login nyata | semua | UAT-01..41, DT-01..16, UAT-37, 40 | ⬜ Belum dimulai |

---

## 2. Layar (SCR-01..27)

Nama dan peran mengikuti FS 3.2. Kolom "Milestone" kosong = belum ditempatkan (lihat §5).

| ID | Layar | Peran | Perangkat | Milestone | Status |
|---|---|---|---|---|---|
| SCR-01 | Login | Semua | HP | M1 | ✅ Selesai |
| SCR-02 | Beranda Guru (Masuk/Pulang) | Guru; Kepala (kartu opsional di SCR-07) | HP | M2 | ⬜ |
| SCR-03 | Absen Siswa (QR/NISN) | Guru | HP | M3 | ⬜ |
| SCR-04 | Rekap Saya | Guru | HP | M8 | ⬜ |
| SCR-05 | Izin Saya | Guru | HP | M7 | ⬜ |
| SCR-06 | Kelas Saya | Guru (wali kelas) | HP | M3 | ⬜ |
| SCR-07 | Dashboard Kepala | Kepala | HP, desktop | M4 | ⬜ |
| SCR-08 | Dashboard Admin | Admin | Desktop | M4 | ⬜ |
| SCR-09 | Persetujuan Izin Guru | Kepala | HP, desktop | M7 | ⬜ |
| SCR-10 | Master Data: Lembaga | Admin | Desktop | M5 | ⬜ |
| SCR-11 | Master Data: Admin dan Kepala | Admin | Desktop | M5 | ⬜ |
| SCR-12 | Master Data: Guru | Admin | Desktop | M5 | ⬜ |
| SCR-13 | Master Data: Siswa | Admin | Desktop | M5 | ⬜ |
| SCR-14 | Master Data: Kelas dan Kenaikan Kelas | Admin | Desktop | M5 | ⬜ |
| SCR-15 | Jadwal Default | Admin | Desktop | M6 | ⬜ |
| SCR-16 | Override Guru | Admin | Desktop | M6 | ⬜ |
| SCR-17 | Kalender | Admin | Desktop | M6 | ⬜ |
| SCR-18 | Pengaturan | Admin | Desktop | M6 | ⬜ |
| SCR-19 | Izin (input Admin) | Admin | Desktop | M7 | ⬜ |
| SCR-20 | Koreksi Absen | Admin | Desktop | M7 | ⬜ |
| SCR-21 | Laporan | Admin, Kepala, Wali Kelas | Desktop, HP | M8 | ⬜ |
| SCR-22 | Log Aktivitas | Admin, Kepala | Desktop | M7 | ⬜ |
| SCR-23 | Kartu QR (cetak massal) | Admin | Desktop | M9 | ⬜ |
| SCR-24 | Rekap Siswa | Siswa | HP | M9 | ⬜ |
| SCR-25 | Kartu QR Saya | Siswa | HP | M9 | ⬜ |
| SCR-26 | Akun dan Ganti Password | Semua | HP, desktop | M1 | ✅ Selesai |
| SCR-27 | Bantuan | Semua | HP, desktop | M9 | ⬜ |

Rute: `/` = SCR-01; `/akun` = SCR-26; `/beranda` = placeholder hasil masuk (bukan SCR final; diganti navigasi final di M4).

---

## 3. Komponen (KOM-01..18)

Spesifikasi mengikuti FS 2.6. Milestone = perkiraan pertama dipakai.

| ID | Komponen | Milestone pertama | Status |
|---|---|---|---|
| KOM-01 | Tombol (Utama/Sekunder/Bahaya/Teks) | M1 | ✅ Selesai |
| KOM-02 | Tombol Absen Besar (≥72 px, label Masuk/Pulang) | M2 | ⬜ |
| KOM-03 | Isian (label di atas, galat inline) | M1 | ✅ Selesai |
| KOM-04 | Pilihan (dropdown, segmen, sakelar) | M3 (segmen Masuk/Pulang) | ⬜ |
| KOM-05 | Lencana Status (pil ikon + teks) | M1 | ✅ Selesai |
| KOM-06 | Tabel (desktop) | M5 | ⬜ |
| KOM-07 | Daftar Kartu (HP) | M5 | ⬜ |
| KOM-08 | Kartu | M1 | ✅ Selesai |
| KOM-09 | Jendela Konfirmasi (dialog/bottom sheet) | M5 | ⬜ |
| KOM-10 | Pesan Singkat (4 detik; galat bertahan) | M1 | ✅ Selesai |
| KOM-11 | Keadaan Kosong (ES-xx) | M1 | ✅ Selesai |
| KOM-12 | Pemuat (skeleton) | M1 | ✅ Selesai |
| KOM-13 | Banner Info | M4 | ⬜ |
| KOM-14 | Kalender Kehadiran (grid bulan H/T/I/S/D/A) | M8 (Rekap Saya) | ⬜ |
| KOM-15 | Pencarian (nama, NIP, NISN) | M3 (Ketik NISN) | ⬜ |
| KOM-16 | Unggah File | M1 (foto SCR-26) | ✅ Selesai |
| KOM-17 | Header Halaman | M1 | ✅ Selesai |
| KOM-18 | Pemindai QR (bingkai kamera, hitungan, 5 terakhir) | M3 | ⬜ |

Sesuai PK-F2, komponen dibuat saat pertama dipakai; KOM-02, 04, 06, 07, 09, 13, 14, 15, 16, 18 sengaja belum ada.

---

## 4. UAT (UAT-01..41)

UAT-01..27 dari BRD 16.2; UAT-28..41 dari FS 12.2. Semua **belum dijalankan** (0/41) — diuji manual per modul (tanpa test framework, keputusan M1).

| ID | Skenario (ringkas) | Sumber | Milestone | Status |
|---|---|---|---|---|
| UAT-01 | Guru Masuk dalam radius, sebelum jam masuk + toleransi → Hadir + konfirmasi jam/status/jarak | BRD | M2 | ⬜ |
| UAT-02 | Masuk setelah toleransi → Terlambat | BRD | M2 | ⬜ |
| UAT-03 | Masuk di luar radius → ditolak, pesan menyebut jarak, tombol Coba lagi lokasi | BRD | M2 | ⬜ |
| UAT-04 | Masuk dua kali → percobaan kedua ditolak | BRD | M2 | ⬜ |
| UAT-05 | Pulang sebelum jendela buka Pulang → tersimpan + penanda Pulang Awal (tidak diblokir) | BRD | M2 | ⬜ |
| UAT-06 | Masuk tanpa Pulang sampai tutup hari → penanda Tidak Lengkap | BRD | M2/M10 | ⬜ |
| UAT-07 | Tanpa absen dan izin pada hari aktif → Alpa otomatis setelah tutup hari | BRD | M10 | ⬜ |
| UAT-08 | Hari libur / guru Override nonaktif → tombol absen tidak tersedia; tidak dihitung Alpa | BRD | M6 | ⬜ |
| UAT-09 | Libur "Untuk: Siswa" → siswa tidak dapat absen; guru tetap dapat | BRD | M6 | ⬜ |
| UAT-10 | Hari Khusus + guru nonaktif hari itu → jam mengikuti Hari Khusus; guru nonaktif tidak Alpa | BRD | M6 | ⬜ |
| UAT-11 | Scan QR siswa (Masuk) dalam radius → Hadir/Terlambat; pemindai tercatat | BRD | M3 | ⬜ |
| UAT-12 | Scan beruntun 10 siswa → semua tercatat tanpa ketukan tambahan | BRD | M3 | ⬜ |
| UAT-13 | Kartu hilang: guru mengetik NISN → tercatat sama seperti scan QR | BRD | M3 | ⬜ |
| UAT-14 | Siswa tidak scan dan tanpa izin → Alpa otomatis; wali kelas dapat ubah ke Izin/Sakit | BRD | M3/M7 | ⬜ |
| UAT-15 | Siswa Masuk tanpa Pulang → penanda Tidak Lengkap; tetap dihitung hadir | BRD | M10 | ⬜ |
| UAT-16 | Izin siswa diinput setelah Alpa tercipta → Alpa berubah menjadi Izin/Sakit | BRD | M7 | ⬜ |
| UAT-17 | Siswa berizin tetapi ter-scan → tercatat Hadir | BRD | M7 | ⬜ |
| UAT-18 | Guru ajukan izin, Kepala menyetujui → absensi tanggal terkait otomatis berubah | BRD | M7 | ⬜ |
| UAT-19 | Guru lupa absen → ajukan koreksi; Admin memproses; log tercatat; bertanda Dikoreksi | BRD | M7 | ⬜ |
| UAT-20 | Wali kelas mengoreksi siswa tanpa alasan → ditolak; alasan wajib | BRD | M7 | ⬜ |
| UAT-21 | Impor Excel guru dan siswa → akun dibuat otomatis; siswa tanpa email mendapat `NISN@siswa.[domain]` | BRD | M5 | ⬜ |
| UAT-22 | Login siswa → hanya melihat rekap sendiri, Kartu QR saya, ganti password | BRD | M9 | ⬜ |
| UAT-23 | Guru mengedit profil sendiri → email dan NIP tidak dapat diubah | BRD | M1 (SCR-26) | ⬜ |
| UAT-24 | Laporan rentang tanggal, ekspor Excel dan PDF → data benar; kop dan tanda tangan Kepala tampil | BRD | M8 | ⬜ |
| UAT-25 | Kenaikan kelas, lalu laporan kelas tahun lalu → laporan lama tetap benar | BRD | M5 | ⬜ |
| UAT-26 | Ubah jadwal hari ini → berlaku mulai besok; hari ini tidak berubah | BRD | M6 | ⬜ |
| UAT-27 | Kepala tanpa absen pada hari aktif → tidak dihitung Alpa | BRD | M2/M4 | ⬜ |
| UAT-28 | Pulang tanpa Masuk (guru dan siswa) → ditolak dengan MSG-08 | FS | M2 | ⬜ |
| UAT-29 | Impor dengan baris bermasalah (email ganda, kelas tidak ada) → pratinjau menampilkan alasan; hanya baris valid disimpan; daftar kesalahan dapat diunduh | FS | M5 | ⬜ |
| UAT-30 | Scan QR sama dua kali dalam 3 detik → detik pertama diabaikan; scan ulang → kartu netral "sudah tercatat" (bukan galat merah) | FS | M3 | ⬜ |
| UAT-31 | Kenaikan kelas (wizard) lalu buka laporan kelas tahun lalu → siswa pindah/lulus sesuai pemetaan; laporan lama tetap benar | FS | M5 | ⬜ |
| UAT-32 | Ajukan izin guru yang tumpang tindih → ditolak dengan MSG-22 | FS | M7 | ⬜ |
| UAT-33 | Batalkan izin siswa yang sudah diterapkan → baris tanpa jam masuk kembali Alpa; tercatat di log | FS | M7 | ⬜ |
| UAT-34 | Cetak Kartu QR satu kelas → PDF A4, 8 kartu/halaman; QR terbaca pemindai | FS | M9 | ⬜ |
| UAT-35 | Login siswa mencoba membuka layar guru/Admin → ditolak halaman "tidak tersedia"; data siswa lain tidak terlihat | FS | M1 (SCR-26) | ⬜ |
| UAT-36 | Kepala menekan Masuk lalu tidak Pulang → penanda Tidak Lengkap; **tidak** menjadi Alpa | FS | M2/M4 | ⬜ |
| UAT-37 | Uji Kepatuhan Pedoman seluruh layar → Daftar Periksa 2.10 seluruhnya terpenuhi pada ±375 px dan ±1280 px | FS | semua | ⬜ |
| UAT-38 | Tutup Hari tidak berjalan satu hari → hari berikutnya menyusul tanggal tertinggal; tidak ada duplikasi | FS | M10 | ⬜ |
| UAT-39 | Scan beruntun 20 siswa dengan lokasi dalam radius → tercatat berturut-turut; lokasi diambil ulang hanya bila usia > T-04 | FS | M3 | ⬜ |
| UAT-40 | Uji Struktur (PK-F): skema identik 13 tabel; tidak ada angka bisnis tertanam; logika hanya lewat SF/`jadwal_efektif`; DT-01..DT-16 lulus | FS | M10 | ⬜ |
| UAT-41 | Koordinat madrasah belum diisi lalu guru menekan Masuk → ditolak MSG-25; Dashboard Admin menampilkan banner pengingat | FS | M4/M10 | ⬜ |

---

## 5. Catatan, Gap, dan Menunggu Keputusan

1. **Gerbang M1 (modul Akun):** FS 3.1 dan 12.1 menetapkan modul Akun = **SCR-01 + SCR-26** (UAT-23, UAT-35). Diputuskan 6 Okt 2026 (pilihan A): **SCR-26 masuk M1**. SCR-01 selesai; SCR-26 menyusul sebagai penutup gerbang M1.
2. **Penempatan layar (diputuskan 6 Okt 2026, pilihan A):** SCR-26 → M1, SCR-06 → M3, SCR-04 → M8. Roadmap kini mencakup 27/27 layar.
3. **Data contoh vs FS 11.1:** mock `src/data/contoh.ts` berisi 3 guru, 2 kelas, 2 siswa; syarat minimum FS 11.1 = 6 guru (1 wali kelas, 1 dengan override, 1 dengan izin), 3 kelas, ±30 siswa. `absensi_guru` mock belum memuat status Izin dan Dinas Luar. Perlu dilengkapi saat M2/M3.
4. **Dokumen:** nama berkas FS sudah `002_..._v1.2.md` dan Master Instruction sudah diperbarui (6 Okt 2026). Persetujuan BRD §22 dan FS §14 masih kosong.
5. **Push:** remote `origin` sudah memakai SSH (`git@github-ayahbebenraka:...`); push dari terminal berfungsi.
6. **SCR-26 (catatan implementasi):** pesan "Password lama tidak cocok. Periksa lalu coba lagi." adalah **usulan H-09** — Lampiran A belum memilikinya (mengikuti pola MSG-15); perlu dikukuhkan di versi FS berikutnya (PK-E3). Foto hanya dipratinjau namanya lewat KOM-16; unggah dan kompres sebenarnya (T-06) berjalan di Fase Backend (M10). Ikon `gembok` dan `pengguna` ditambahkan ke set baku (PK-C4). Mock `users` ditambah kolom `kontak` dan `foto_path` sesuai Data Model.

---

## 6. Riwayat CHECKPOINT

| Tanggal | Milestone | Commit | Push | Status |
|---|---|---|---|---|
| 5 Okt 2026 | M1 fondasi + SCR-01 | `c8778b0` | ✅ | ✅ Berhasil (build/lint lulus; 12 verifikasi, 6 penyimpangan tercatat) |
| 5 Okt 2026 | M1 dokumen: peta sumber kebenaran `blueprint/README.md` | `f36d0a4` | ✅ | ✅ Berhasil |
| 6 Okt 2026 | Pelacakan: `PROGRES.md` (4 tabel) | `c621e95` | ✅ | ✅ Berhasil |
| 6 Okt 2026 | Keputusan 1A/2A/3A: plan dilacak git; berkas FS → v1.2; penempatan SCR-26/06/04 | `6a51081`, `baf1142` | ✅ | ✅ Berhasil |
| 6 Okt 2026 | M1 penutup gerbang: SCR-26 Akun dan Ganti Password + KOM-16 | `f7bd64a` | ✅ | ✅ Berhasil (lint + build lulus) |
