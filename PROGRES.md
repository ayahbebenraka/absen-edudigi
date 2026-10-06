# PROGRES — Aplikasi Absensi Guru dan Siswa Berbasis Geo Tagging

Pelacakan milestone, layar, komponen, dan UAT. Diperbarui tiap **CHECKPOINT** (Master Instruction §19).
Sumber ID: BRD v1.1, FS v1.2, Data Model v1.0, dan plan M1 (`.kilo/plans/`).

## Kondisi Saat Ini

| Item | Nilai |
|---|---|
| Fase (BRD 18.2) | **Tahap 3 — Fase Frontend (layout)** dengan data contoh |
| Milestone aktif | **M5** — Master Data (frontend mock) |
| Commit implementasi terakhir | `a4a8148` (6 Okt 2026) · branch `main` · remote `origin` (SSH `github-ayahbebenraka`) |
| Layar selesai | 5/27 (SCR-01, SCR-02, SCR-03, SCR-06, SCR-26; frontend mock) |
| Komponen selesai | 13/18 (KOM-01, 02, 03, 04, 05, 08, 10, 11, 12, 13, 16, 17, 18) |
| UAT lulus penuh | 8/41 |
| Build/lint | Lulus (`npm run build`, `npm run lint`) |

---

## 1. Milestone Pembangunan (M1–M10)

Urutan mengikuti FS 11.1 / BRD 18.3. UAT ditulis pada milestone pemiliknya.

| ID | Isi | Layar | UAT | Status |
|---|---|---|---|---|
| **M1** | Fondasi Frontend: token (FS 2.5), komponen dasar, mock 13 tabel, sesi mock; SCR-01 Login + SCR-26 Akun dan Ganti Password (gerbang modul Akun, FS 3.1) | SCR-01, 26 | UAT-23, 35, 37 | ✅ **Selesai** (`c8778b0`, `f7bd64a`); UAT-23 lulus, UAT-35/37 menunggu cakupan terkait |
| **M2** | SCR-02 Beranda Guru: 6 keadaan tombol (KOM-02), jadwal hari ini, simulasi GPS (dalam/luar radius, akurasi rendah) | SCR-02 | UAT-01..07, 27, 36 | ✅ Selesai untuk frontend SCR-02; UAT-01/02/03/05 lulus simulasi. Validasi server dan Tutup Hari tetap di M10; dashboard Kepala M4 |
| **M3** | SCR-03 Absen Siswa: pemindai QR simulasi, scan beruntun, ketik NISN, kontrol segmen; Kelas Saya untuk wali kelas | SCR-03, 06 | UAT-11..14, 30, 39 | 🔄 Frontend mock SCR-03/06 selesai; UAT-11/39 menunggu kamera/GPS dan server M10, UAT-14 menunggu Alpa M10 serta izin/koreksi M7; belum lulus end-to-end |
| **M4** | SCR-07/08 Dashboard Kepala/Admin + navigasi per peran (FS 2.3) | SCR-07, 08 | UAT-41 | ✅ Selesai sebagai mock; UAT-41 lulus simulasi frontend, validasi server menunggu M10 |
| **M5** | Master Data: Lembaga, Admin/Kepala, Guru, Siswa, Kelas, wizard kenaikan kelas, impor Excel | SCR-10..14 | UAT-21, 23, 25, 29, 31 | 🔄 SCR-10 mock awal tersedia dan dibatasi untuk Admin; UAT layar belum diverifikasi; SCR-11..14 belum dimulai |
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
| SCR-02 | Beranda Guru (Masuk/Pulang) | Guru; Kepala (kartu opsional di SCR-07) | HP | M2 | ✅ Selesai (frontend mock) |
| SCR-03 | Absen Siswa (QR/NISN) | Guru | HP | M3 | ✅ Frontend mock selesai; kamera/GPS dan validasi server menunggu M10 |
| SCR-04 | Rekap Saya | Guru | HP | M8 | ⬜ |
| SCR-05 | Izin Saya | Guru | HP | M7 | ⬜ |
| SCR-06 | Kelas Saya | Guru (wali kelas) | HP | M3 | ✅ Frontend mock selesai; input izin/koreksi menunggu M7 |
| SCR-07 | Dashboard Kepala | Kepala | HP, desktop | M4 | 🔄 Ringkasan dan kartu absen opsional mock selesai; menu Dashboard/Akun tersedia, tujuan lain menunggu layar terkait |
| SCR-08 | Dashboard Admin | Admin | Desktop | M4 | 🔄 Dashboard mock dan banner koordinat/Tutup Hari; menu Dashboard/Akun tersedia, validasi UAT-41 menunggu |
| SCR-09 | Persetujuan Izin Guru | Kepala | HP, desktop | M7 | ⬜ |
| SCR-10 | Master Data: Lembaga | Admin | Desktop | M5 | 🔄 Mock awal; validasi form dan izin akses telah diperiksa, UAT visual belum dilakukan |
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

Rute: `/` = SCR-01; `/akun` = SCR-26; `/beranda` = SCR-02 mock untuk Guru, SCR-07 mock untuk Kepala, SCR-08 mock untuk Admin; `/master-data` = SCR-10 mock untuk Admin. Navigasi Kepala menautkan Dashboard/Akun; navigasi Admin juga menautkan Master Data. Tujuan lain ditambahkan saat rutenya tersedia.

---

## 3. Komponen (KOM-01..18)

Spesifikasi mengikuti FS 2.6. Milestone = perkiraan pertama dipakai.

| ID | Komponen | Milestone pertama | Status |
|---|---|---|---|
| KOM-01 | Tombol (Utama/Sekunder/Bahaya/Teks) | M1 | ✅ Selesai |
| KOM-02 | Tombol Absen Besar (≥72 px, label Masuk/Pulang) | M2 | ✅ Selesai |
| KOM-03 | Isian (label di atas, galat inline) | M1 | ✅ Selesai |
| KOM-04 | Pilihan (dropdown, segmen, sakelar) | M3 (segmen Masuk/Pulang) | ✅ Segmen Masuk/Pulang |
| KOM-05 | Lencana Status (pil ikon + teks) | M1 | ✅ Selesai |
| KOM-06 | Tabel (desktop) | M5 | ⬜ |
| KOM-07 | Daftar Kartu (HP) | M5 | ⬜ |
| KOM-08 | Kartu | M1 | ✅ Selesai |
| KOM-09 | Jendela Konfirmasi (dialog/bottom sheet) | M5 | ⬜ |
| KOM-10 | Pesan Singkat (4 detik; galat bertahan) | M1 | ✅ Selesai |
| KOM-11 | Keadaan Kosong (ES-xx) | M1 | ✅ Selesai |
| KOM-12 | Pemuat (skeleton) | M1 | ✅ Selesai |
| KOM-13 | Banner Info | M4 | ✅ Selesai |
| KOM-14 | Kalender Kehadiran (grid bulan H/T/I/S/D/A) | M8 (Rekap Saya) | ⬜ |
| KOM-15 | Pencarian (nama, NIP, NISN) | M3 (Ketik NISN) | ⬜ |
| KOM-16 | Unggah File | M1 (foto SCR-26) | ✅ Selesai |
| KOM-17 | Header Halaman | M1 | ✅ Selesai |
| KOM-18 | Pemindai QR (bingkai kamera, hitungan, 5 terakhir) | M3 | ✅ Bingkai dan alur simulasi; kamera belum tersambung |

Sesuai PK-F2, komponen dibuat saat pertama dipakai; KOM-06, 07, 09, 13, 14, dan KOM-15 (pencarian umum) belum dibuat.

---

## 4. UAT (UAT-01..41)

UAT-01..27 dari BRD 16.2; UAT-28..41 dari FS 12.2. Pengujian dilakukan manual per modul (tanpa test framework, keputusan M1).

| ID | Skenario (ringkas) | Sumber | Milestone | Status |
|---|---|---|---|---|
| UAT-01 | Guru Masuk dalam radius, sebelum jam masuk + toleransi → Hadir + konfirmasi jam/status/jarak | BRD | M2 | ✅ Lulus (simulasi frontend, 6 Okt 2026) |
| UAT-02 | Masuk setelah toleransi → Terlambat | BRD | M2 | ✅ Lulus (simulasi frontend, 6 Okt 2026) |
| UAT-03 | Masuk di luar radius → ditolak, pesan menyebut jarak, tombol Coba lagi lokasi | BRD | M2 | ✅ Lulus (simulasi frontend, 6 Okt 2026) |
| UAT-04 | Masuk dua kali → percobaan kedua ditolak | BRD | M2 | ⚠️ UI menyembunyikan tombol Masuk kedua; penolakan duplikat server menunggu M10 |
| UAT-05 | Pulang sebelum jendela buka Pulang → tersimpan + penanda Pulang Awal (tidak diblokir) | BRD | M2 | ✅ Lulus (simulasi frontend, 6 Okt 2026) |
| UAT-06 | Masuk tanpa Pulang sampai tutup hari → penanda Tidak Lengkap | BRD | M2/M10 | ⬜ |
| UAT-07 | Tanpa absen dan izin pada hari aktif → Alpa otomatis setelah tutup hari | BRD | M10 | ⬜ |
| UAT-08 | Hari libur / guru Override nonaktif → tombol absen tidak tersedia; tidak dihitung Alpa | BRD | M6 | ⬜ |
| UAT-09 | Libur "Untuk: Siswa" → siswa tidak dapat absen; guru tetap dapat | BRD | M6 | ⬜ |
| UAT-10 | Hari Khusus + guru nonaktif hari itu → jam mengikuti Hari Khusus; guru nonaktif tidak Alpa | BRD | M6 | ⬜ |
| UAT-11 | Scan QR siswa (Masuk) dalam radius → Hadir/Terlambat; pemindai tercatat | BRD | M3 | ⚠️ Simulasi Masuk/Pulang, status, dan hasil sukses 2 detik teruji; getar diuji dengan stub, kamera/GPS nyata dan validasi server menunggu M10 |
| UAT-12 | Scan beruntun 10 siswa → semua tercatat tanpa ketukan tambahan | BRD | M3 | ✅ Lulus simulasi frontend: 20 NISN beruntun tercatat, penghitung benar, 5 terakhir tampil (6 Okt 2026) |
| UAT-13 | Kartu hilang: guru mengetik NISN → tercatat sama seperti scan QR | BRD | M3 | ✅ Lulus simulasi frontend: input manual Masuk/Pulang mencatat siswa, lalu kembali ke mode scan simulasi untuk siswa berikutnya (6 Okt 2026) |
| UAT-14 | Siswa tidak scan dan tanpa izin → Alpa otomatis; wali kelas dapat ubah ke Izin/Sakit | BRD | M3/M7 | ⚠️ Daftar kelas/filter tersedia; Alpa otomatis menunggu M10 dan input izin/koreksi M7 |
| UAT-15 | Siswa Masuk tanpa Pulang → penanda Tidak Lengkap; tetap dihitung hadir | BRD | M10 | ⬜ |
| UAT-16 | Izin siswa diinput setelah Alpa tercipta → Alpa berubah menjadi Izin/Sakit | BRD | M7 | ⬜ |
| UAT-17 | Siswa berizin tetapi ter-scan → tercatat Hadir | BRD | M7 | ⬜ |
| UAT-18 | Guru ajukan izin, Kepala menyetujui → absensi tanggal terkait otomatis berubah | BRD | M7 | ⬜ |
| UAT-19 | Guru lupa absen → ajukan koreksi; Admin memproses; log tercatat; bertanda Dikoreksi | BRD | M7 | ⬜ |
| UAT-20 | Wali kelas mengoreksi siswa tanpa alasan → ditolak; alasan wajib | BRD | M7 | ⬜ |
| UAT-21 | Impor Excel guru dan siswa → akun dibuat otomatis; siswa tanpa email mendapat `NISN@siswa.[domain]` | BRD | M5 | ⬜ |
| UAT-22 | Login siswa → hanya melihat rekap sendiri, Kartu QR saya, ganti password | BRD | M9 | ⬜ |
| UAT-23 | Guru mengedit profil sendiri → email dan NIP tidak dapat diubah | BRD | M1 (SCR-26) | ✅ Lulus (manual, 6 Okt 2026) |
| UAT-24 | Laporan rentang tanggal, ekspor Excel dan PDF → data benar; kop dan tanda tangan Kepala tampil | BRD | M8 | ⬜ |
| UAT-25 | Kenaikan kelas, lalu laporan kelas tahun lalu → laporan lama tetap benar | BRD | M5 | ⬜ |
| UAT-26 | Ubah jadwal hari ini → berlaku mulai besok; hari ini tidak berubah | BRD | M6 | ⬜ |
| UAT-27 | Kepala tanpa absen pada hari aktif → tidak dihitung Alpa | BRD | M2/M4 | ⬜ |
| UAT-28 | Pulang tanpa Masuk (guru dan siswa) → ditolak dengan MSG-08 | FS | M2 | ⚠️ Siswa ditolak dengan teks mock yang cocok persis dengan MSG-08; UI guru hanya menampilkan Masuk saat belum absen, penolakan server menunggu M10 |
| UAT-29 | Impor dengan baris bermasalah (email ganda, kelas tidak ada) → pratinjau menampilkan alasan; hanya baris valid disimpan; daftar kesalahan dapat diunduh | FS | M5 | ⬜ |
| UAT-30 | Scan QR sama dua kali dalam 3 detik → detik pertama diabaikan; scan ulang → kartu netral "sudah tercatat" (bukan galat merah) | FS | M3 | ✅ Lulus simulasi frontend Masuk/Pulang: scan dalam 3 detik diabaikan; setelah 3 detik tampil pesan netral dan penghitung tetap (6 Okt 2026) |
| UAT-31 | Kenaikan kelas (wizard) lalu buka laporan kelas tahun lalu → siswa pindah/lulus sesuai pemetaan; laporan lama tetap benar | FS | M5 | ⬜ |
| UAT-32 | Ajukan izin guru yang tumpang tindih → ditolak dengan MSG-22 | FS | M7 | ⬜ |
| UAT-33 | Batalkan izin siswa yang sudah diterapkan → baris tanpa jam masuk kembali Alpa; tercatat di log | FS | M7 | ⬜ |
| UAT-34 | Cetak Kartu QR satu kelas → PDF A4, 8 kartu/halaman; QR terbaca pemindai | FS | M9 | ⬜ |
| UAT-35 | Login siswa mencoba membuka layar guru/Admin → ditolak halaman "tidak tersedia"; data siswa lain tidak terlihat | FS | M1 (SCR-26) | ⬜ |
| UAT-36 | Kepala menekan Masuk lalu tidak Pulang → penanda Tidak Lengkap; **tidak** menjadi Alpa | FS | M2/M4 | ⬜ |
| UAT-37 | Uji Kepatuhan Pedoman seluruh layar → Daftar Periksa 2.10 seluruhnya terpenuhi pada ±375 px dan ±1280 px | FS | semua | ⬜ |
| UAT-38 | Tutup Hari tidak berjalan satu hari → hari berikutnya menyusul tanggal tertinggal; tidak ada duplikasi | FS | M10 | ⬜ |
| UAT-39 | Scan beruntun 20 siswa dengan lokasi dalam radius → tercatat berturut-turut; lokasi diambil ulang hanya bila usia > T-04 | FS | M3 | ⚠️ 20 scan simulasi beruntun tercatat pada 375 px; pengambilan ulang GPS nyata saat usia >60 detik menunggu M10 |
| UAT-40 | Uji Struktur (PK-F): skema identik 13 tabel; tidak ada angka bisnis tertanam; logika hanya lewat SF/`jadwal_efektif`; DT-01..DT-16 lulus | FS | M10 | ⬜ |
| UAT-41 | Koordinat madrasah belum diisi lalu guru menekan Masuk → ditolak MSG-25; Dashboard Admin menampilkan banner pengingat | FS | M4/M10 | ⚠️ Lulus simulasi frontend (banner + MSG-25); validasi server tetap menunggu M10 |

---

## 5. Catatan, Gap, dan Menunggu Keputusan

1. **Gerbang M1 (modul Akun):** FS 3.1 dan 12.1 menetapkan modul Akun = **SCR-01 + SCR-26**. UAT-23 lulus manual di browser: guru dapat menyimpan nama/kontak, sedangkan email dan nomor induk tetap terkunci. UAT-35 menunggu layar sesuai peran; UAT-37 menunggu seluruh layar.
2. **Penempatan layar (diputuskan 6 Okt 2026, pilihan A):** SCR-26 → M1, SCR-06 → M3, SCR-04 → M8. Roadmap kini mencakup 27/27 layar.
3. **Data contoh:** `src/data/contoh.ts` kini memenuhi minimum FS 11.1: 6 guru (wali kelas, override, dan izin), 3 kelas, 30 siswa; data guru juga memuat status Izin dan Dinas Luar.
4. **Dokumen:** nama berkas FS sudah `002_..._v1.2.md` dan Master Instruction sudah diperbarui (6 Okt 2026). Persetujuan BRD §22 dan FS §14 masih kosong.
5. **Push:** remote `origin` sudah memakai SSH (`git@github-ayahbebenraka:...`); push dari terminal berfungsi.
6. **SCR-26 (catatan implementasi):** pesan "Password lama tidak cocok. Periksa lalu coba lagi." adalah **usulan H-09** — Lampiran A belum memilikinya (mengikuti pola MSG-15); perlu dikukuhkan di versi FS berikutnya (PK-E3). Foto hanya dipratinjau namanya lewat KOM-16; unggah dan kompres sebenarnya (T-06) berjalan di Fase Backend (M10). Ikon `gembok` dan `pengguna` ditambahkan ke set baku (PK-C4). Mock `users` ditambah kolom `kontak` dan `foto_path` sesuai Data Model.
7. **M2 (gerbang frontend ditutup):** SCR-02 menyimulasikan seluruh 6 keadaan tombol; UAT-01/02/03/05 lulus, termasuk luar radius, akurasi rendah, dan Pulang Awal. Waktu/lokasi tetap mock; duplikat dan MSG-08 baru dijamin server pada M10. UAT-06/07 menunggu Tutup Hari M10; UAT-27/36 menunggu dashboard M4 dan Tutup Hari M10; UAT-41 menunggu banner Dashboard Admin M4.
8. **M3 (frontend mock selesai; UAT tertunda):** SCR-03 dan SCR-06 memakai fixture; NISN menjadi masukan simulasi QR, bukan pembacaan kamera. UAT-12/13/30 diverifikasi di browser; setelah input NISN manual sukses Masuk atau Pulang, layar kembali ke mode scan simulasi untuk siswa berikutnya. UAT-11/39 menunggu kamera/GPS dan validasi server M10; UAT-14 menunggu Alpa M10 serta izin/koreksi M7. M3 belum lulus end-to-end. Status lokasi, debounce, feedback, rekap bulanan, dan responsivitas 375/1280 px sudah diuji; tidak ada perubahan skema atau autentikasi.
9. **M4 (berjalan):** SCR-07 ringkasan Kepala dan kartu absen opsional mock memakai fixture serta jadwal guru sesuai SF-01; Kepala tetap tidak masuk hitungan wajib. Panel absen dipakai bersama Beranda Guru agar aturan waktu/lokasi/status tidak diduplikasi. SCR-08 Admin mock memakai ringkasan fixture, banner koordinat belum diatur, banner Tutup Hari tertinggal, dan perhatian lokasi mencurigakan; UAT-41 belum lulus karena validasi server belum tersedia. Navigasi Kepala/Admin responsif: saat ini hanya Dashboard/Akun ditautkan; menu final menunggu rute layar lain. Uji browser 375/1280 px lulus dan tidak ada overflow.

---

## 6. Riwayat CHECKPOINT

| Tanggal | Milestone | Commit | Push | Status |
|---|---|---|---|---|
| 5 Okt 2026 | M1 fondasi + SCR-01 | `c8778b0` | ✅ | ✅ Berhasil (build/lint lulus; 12 verifikasi, 6 penyimpangan tercatat) |
| 5 Okt 2026 | M1 dokumen: peta sumber kebenaran `blueprint/README.md` | `f36d0a4` | ✅ | ✅ Berhasil |
| 6 Okt 2026 | Pelacakan: `PROGRES.md` (4 tabel) | `c621e95` | ✅ | ✅ Berhasil |
| 6 Okt 2026 | Keputusan 1A/2A/3A: plan dilacak git; berkas FS → v1.2; penempatan SCR-26/06/04 | `6a51081`, `baf1142` | ✅ | ✅ Berhasil |
| 6 Okt 2026 | M1 penutup gerbang: SCR-26 Akun dan Ganti Password + KOM-16 | `f7bd64a` | ✅ | ✅ Berhasil (lint + build lulus) |
| 6 Okt 2026 | UAT-23; M2 SCR-02 mock + UAT-01/02/03/05 | `587b0af`, `bb25856` | Belum didorong | 🔄 M2 berjalan; lint/build lulus |
| 6 Okt 2026 | Gerbang frontend M2 ditutup; fixture minimum dilengkapi; M3 SCR-03/SCR-06 mock dimulai | — | Belum dibuat | ✅ Lint/build lulus; UAT simulasi 8/41; tanpa perubahan backend |
| 6 Okt 2026 | M3 SCR-03: status lokasi simulasi, coba ulang, dan scan dikunci saat lokasi tidak valid; UAT/responsivitas diverifikasi | `30da07b` | ✅ | ✅ Lint/build lulus; uji browser 375/1280 px; UAT-12/13/30 terverifikasi; UAT-11/39 tetap parsial |
| 6 Okt 2026 | Verifikasi lanjutan M3: scan Pulang untuk siswa yang sudah Masuk | `30da07b` | ✅ | ✅ Scan simulasi tercatat 14:00, penghitung bertambah, status Hadir; UAT kamera/GPS nyata tetap terbuka |
| 6 Okt 2026 | Verifikasi UAT-28: Pulang siswa tanpa Masuk cocok dengan MSG-08; jalur guru tidak tersedia di UI | — | ✅ | ⚠️ Parsial; penolakan server untuk guru dan siswa menunggu M10 |
| 6 Okt 2026 | UAT-30 Pulang: duplikat dalam 3 detik diabaikan; setelah jeda tampil pesan netral | — | ✅ | ✅ Penghitung tidak bertambah pada duplikat; diuji dalam simulasi frontend |
| 6 Okt 2026 | M4 dimulai: SCR-07 Dashboard Kepala ringkasan harian dari fixture/SF-01 | `9be7f7f` | ✅ | 🔄 M4 aktif; build/lint dan uji browser 375/1280 px lulus; SCR-08, kartu absen opsional, navigasi final, dan UAT-41 belum selesai |
| 6 Okt 2026 | SCR-07: kartu Absen saya opsional Kepala memakai panel bersama Beranda Guru | `786e194` | ✅ | ✅ Uji mock: Kepala absen tanpa masuk denominator; Admin tanpa tombol absen; responsif 375/1280 px; SCR-08/navigasi/UAT-41 tetap terbuka |
| 6 Okt 2026 | SCR-08: Dashboard Admin mock, banner koordinat/Tutup Hari, dan perhatian lokasi; KOM-13 | `741a247` | ✅ | ✅ Uji browser banner/refresh, ringkasan Admin dan responsivitas 375/1280 px; UAT-41 tetap menunggu backend |
| 6 Okt 2026 | M4 dokumentasi: UAT-41 lulus simulasi frontend; checkpoint navigasi role | `92c3ee9` | ✅ | ✅ Lint/build lulus; UAT-11/39 (kamera/GPS nyata) dan UAT server validasi tetap menunggu M10 |
| 6 Okt 2026 | SCR-03: layout scanner dan panel hasil dua kolom desktop, satu kolom mobile | `82d426f` | ✅ | ✅ Uji browser 375/1280 px; scan sukses tampil di panel hasil; lint dan build lulus; UAT-37 tetap terbuka |
| 6 Okt 2026 | SCR-03: hasil sukses 2 detik dan getar opsional; durasi default KOM-10 tetap 4 detik | `f50d865` | ✅ | ✅ Uji browser: sukses/galat/duplikat dan timer; pola getar via stub; lint/build lulus; getar fisik menunggu uji perangkat |
| 6 Okt 2026 | SCR-06: hitungan status dan persentase per siswa sesuai SF-09; ES-08 untuk bulan tanpa data | `a512522` | ✅ | ✅ Uji browser 375/1280 px; data fixture dan keadaan kosong terverifikasi; lint/build lulus |
| 6 Okt 2026 | SCR-06: input bulan kosong kembali ke bulan berjalan dan tidak mencampur catatan semua bulan | `48e4080` | ✅ | ✅ Uji browser: bulan kosong pulih ke Oktober, 10 kartu Oktober tampil, September menampilkan ES-08; lint/build lulus |
| 6 Okt 2026 | SCR-03: input NISN manual kembali ke scan simulasi untuk pemindaian berikutnya | `1956256` | ✅ | ✅ Uji browser Masuk dan Pulang, dua siswa berurutan; form tetap fokus; kamera nyata tetap menunggu M10; lint/build lulus |
