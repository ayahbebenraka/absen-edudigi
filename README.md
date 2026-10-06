# absen-edudigi
Aplikasi absen digital untuk guru dan siswa.

## Menjalankan (Fase Frontend)

Butuh **Node.js 20 LTS atau lebih baru** (`node -v`). Lalu di folder repo:

```
npm install
npm run dev
```

Buka `http://localhost:3000`. `npm run build` untuk pemeriksaan sebelum commit.

Akun mock (hanya fase frontend, belum Supabase): `admin@akademik.sch.id`/`admin123`, `kepala@akademik.sch.id`/`kepala123`, `guru1@akademik.sch.id`/`guru123`, `0012345601@siswa.akademik.sch.id`/`siswa123`.

Lanjutkan proyek dari kondisi workspace saat ini, jangan mulai ulang analisis dari awal. Ikuti blueprint/000_Master_Instruction_copilot.md dan urutan sumber kebenaran yang ditetapkan blueprint/README.md.

Status terakhir:
- Gerbang frontend M2 (SCR-02) ditutup; UAT server dan dashboard yang belum terpenuhi tetap terbuka.
- Fixture mock sudah dilengkapi menjadi 6 guru, 3 kelas, dan 30 siswa.
- M3 sedang berjalan: SCR-03 Absen Siswa dan SCR-06 Kelas Saya sudah dibuat sebagai simulasi frontend. UAT-12, UAT-13, dan UAT-30 lulus simulasi; UAT kamera/lokasi nyata, Tutup Hari, dan input izin/koreksi masih menunggu tahap yang sesuai.
- Lint dan build terakhir berhasil. Perubahan belum di-commit atau di-push.


-- op
-- saat ini saya ingin jeda.
-- apa yang saya tulis di chat nanti agar copilot melanjutkan proyek -- sesuai langkah, tindakan dan rekomendasi terakhir.
-- next
Lanjutkan M3 secara bertahap dari sini. Periksa dulu status workspace dan PROGRES.md, pertahankan perubahan yang sudah ada, verifikasi perilaku dan responsivitas sebelum menandai UAT, lalu perbarui checkpoint. Jangan mulai mengubah skema atau autentikasi backend sebelum konflik `password_hash` antara BRD dan FS/Data Model diselesaikan. Jangan commit atau push tanpa instruksi saya.