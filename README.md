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
- M6 (Jadwal) sedang dikerjakan: SCR-15 Jadwal Default dan SCR-16 Override Guru selesai sebagai mock di `/jadwal` — Admin dapat mengubah, Kepala mode lihat. SCR-17 Kalender dan SCR-18 Pengaturan belum dimulai.
- M5 (Master Data) selesai sebagai simulasi frontend: SCR-10..14 (Lembaga, Admin & Kepala, Guru, Siswa, Kelas & Kenaikan Kelas). Impor Excel (UAT-21/29) menunggu M10.
- M4 (Dashboard Kepala/Admin) selesai sebagai simulasi frontend; validasi server tetap menunggu M10.
- Fixture mock sudah dilengkapi menjadi 6 guru, 3 kelas, dan 30 siswa.
- M3 selesai sebagai simulasi frontend. UAT kamera/lokasi nyata, Tutup Hari, dan input izin/koreksi masih menunggu tahap yang sesuai.
- Lint, build, dan tsc terakhir berhasil. Perubahan belum di-commit atau di-push.


