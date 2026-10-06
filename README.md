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
- M4 (Dashboard Kepala/Admin) selesai sebagai simulasi frontend; validasi server tetap menunggu M10.
- Fixture mock sudah dilengkapi menjadi 6 guru, 3 kelas, dan 30 siswa.
- M3 selesai sebagai simulasi frontend. UAT kamera/lokasi nyata, Tutup Hari, dan input izin/koreksi masih menunggu tahap yang sesuai.
- M5 sedang dikerjakan: SCR-10 Data Lembaga, SCR-11 Admin & Kepala, dan SCR-12 Guru tersedia sebagai mock; akses dibatasi untuk Admin. Layar Siswa, Kelas, dan impor Excel belum dimulai.
- Lint dan build terakhir berhasil. Perubahan belum di-commit atau di-push.


