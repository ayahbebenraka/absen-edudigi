/**
 * contoh.ts — data contoh (mock) untuk fase frontend.
 *
 * Acuan: Data Model v1.0 Lampiran B dan Bagian 5.1. Isi hanya data, tanpa
 * logika bisnis (PK-F1). Angka bisnis hanya ada di tabel `lembaga` (PK-E2).
 *
 * Catatan:
 * - `id` memakai teks pendek (`u-g1`, `k-7a`) seperti contoh Lampiran B.
 * - Nilai `password` tidak ada di sini (DM-D1); kredensial mock ada di `sesi.ts`.
 * - Kolom `created_at`/`updated_at` tidak diberi nilai: keduanya diisi server.
 * - Kolom wajib (NOT NULL) yang tidak disebut Lampiran B memakai bawaan
 *   Data Model Bagian 5 (contoh `pulang_awal` = false).
 */

export type Tabel =
  | "lembaga"
  | "users"
  | "kelas"
  | "siswa"
  | "jadwal_default"
  | "jadwal_override_guru"
  | "kalender"
  | "absensi_guru"
  | "absensi_siswa"
  | "izin_guru"
  | "izin_siswa"
  | "pengajuan_koreksi"
  | "log_aktivitas";

/* ---------------------------------------------------------------- 5.1 */

export type BarisLembaga = {
  id: number;
  nama: string;
  npsn_nsm: string | null;
  alamat: string | null;
  logo_path: string | null;
  lat: number | null;
  lng: number | null;
  radius_m: number;
  akurasi_maks_m: number;
  buka_masuk_menit: number;
  toleransi_menit: number;
  tutup_masuk_menit: number;
  buka_pulang_menit: number;
  domain_email: string;
  tahun_ajaran_aktif: string | null;
  tutup_hari_terakhir: string | null;
};

export const lembaga: BarisLembaga[] = [
  {
    id: 1,
    nama: "Nama Madrasah",
    npsn_nsm: "",
    alamat: "",
    logo_path: "",
    lat: null,
    lng: null,
    radius_m: 200,
    akurasi_maks_m: 50,
    buka_masuk_menit: 30,
    toleransi_menit: 10,
    tutup_masuk_menit: 180,
    buka_pulang_menit: 60,
    domain_email: "akademik.sch.id",
    tahun_ajaran_aktif: "2026/2027",
    tutup_hari_terakhir: "2026-10-04",
  },
];

/* ---------------------------------------------------------------- 5.2 */

export type Peran = "admin" | "kepala" | "guru" | "siswa";

export type BarisUser = {
  id: string;
  email: string;
  role: Peran;
  nomor_induk: string;
  nama: string;
  kontak: string | null;
  foto_path: string | null;
  aktif: boolean;
  wajib_absen: boolean;
};

export const users: BarisUser[] = [
  {
    id: "u-admin",
    email: "admin@akademik.sch.id",
    role: "admin",
    nomor_induk: "ADM-001",
    nama: "Admin Madrasah",
    kontak: null,
    foto_path: null,
    aktif: true,
    wajib_absen: false,
  },
  {
    id: "u-kepala",
    email: "kepala@akademik.sch.id",
    role: "kepala",
    nomor_induk: "KPL-001",
    nama: "Kepala Madrasah",
    kontak: null,
    foto_path: null,
    aktif: true,
    wajib_absen: false,
  },
  {
    id: "u-g1",
    email: "guru1@akademik.sch.id",
    role: "guru",
    nomor_induk: "G-001",
    nama: "Guru Satu (wali kelas VII-A)",
    kontak: null,
    foto_path: null,
    aktif: true,
    wajib_absen: true,
  },
  {
    id: "u-g2",
    email: "guru2@akademik.sch.id",
    role: "guru",
    nomor_induk: "G-002",
    nama: "Guru Dua (override jadwal)",
    kontak: null,
    foto_path: null,
    aktif: true,
    wajib_absen: true,
  },
  {
    id: "u-g3",
    email: "guru3@akademik.sch.id",
    role: "guru",
    nomor_induk: "G-003",
    nama: "Guru Tiga (izin menunggu)",
    kontak: null,
    foto_path: null,
    aktif: true,
    wajib_absen: true,
  },
  {
    id: "u-g4",
    email: "guru4@akademik.sch.id",
    role: "guru",
    nomor_induk: "G-004",
    nama: "Guru Empat (wali kelas VII-C)",
    kontak: null,
    foto_path: null,
    aktif: true,
    wajib_absen: true,
  },
  {
    id: "u-g5",
    email: "guru5@akademik.sch.id",
    role: "guru",
    nomor_induk: "G-005",
    nama: "Guru Lima",
    kontak: null,
    foto_path: null,
    aktif: true,
    wajib_absen: true,
  },
  {
    id: "u-g6",
    email: "guru6@akademik.sch.id",
    role: "guru",
    nomor_induk: "G-006",
    nama: "Guru Enam",
    kontak: null,
    foto_path: null,
    aktif: true,
    wajib_absen: true,
  },
  ...Array.from({ length: 28 }, (_, index) => {
    const nomor = index + 3;
    const nisn = `00123456${String(nomor).padStart(2, "0")}`;
    return {
      id: `u-s${nomor}`,
      email: `${nisn}@siswa.akademik.sch.id`,
      role: "siswa" as const,
      nomor_induk: nisn,
      nama: `Siswa Contoh ${String(nomor).padStart(2, "0")}`,
      kontak: null,
      foto_path: null,
      aktif: true,
      wajib_absen: false,
    };
  }),
  {
    id: "u-s1",
    email: "0012345601@siswa.akademik.sch.id",
    role: "siswa",
    nomor_induk: "0012345601",
    nama: "Siswa Contoh Satu",
    kontak: null,
    foto_path: null,
    aktif: true,
    wajib_absen: false,
  },
  {
    id: "u-s2",
    email: "0012345602@siswa.akademik.sch.id",
    role: "siswa",
    nomor_induk: "0012345602",
    nama: "Siswa Contoh Dua",
    kontak: null,
    foto_path: null,
    aktif: true,
    wajib_absen: false,
  },
];

/* ---------------------------------------------------------------- 5.4 */

export type BarisKelas = {
  id: string;
  nama: string;
  tahun_ajaran: string;
  wali_user_id: string | null;
};

export const kelas: BarisKelas[] = [
  { id: "k-7a", nama: "VII-A", tahun_ajaran: "2026/2027", wali_user_id: "u-g1" },
  { id: "k-7b", nama: "VII-B", tahun_ajaran: "2026/2027", wali_user_id: "u-g2" },
  { id: "k-7c", nama: "VII-C", tahun_ajaran: "2026/2027", wali_user_id: "u-g4" },
];

/* ---------------------------------------------------------------- 5.3 */

export type BarisSiswa = {
  user_id: string;
  kelas_id: string;
  jenis_kelamin: "L" | "P";
  kontak_wali: string;
};

export const siswa: BarisSiswa[] = [
  { user_id: "u-s1", kelas_id: "k-7a", jenis_kelamin: "L", kontak_wali: "081200000001" },
  { user_id: "u-s2", kelas_id: "k-7a", jenis_kelamin: "P", kontak_wali: "081200000002" },
  ...Array.from({ length: 28 }, (_, index) => {
    const nomor = index + 3;
    const kelasIndex = Math.floor((nomor - 1) / 10);
    return {
      user_id: `u-s${nomor}`,
      kelas_id: kelasIndex === 0 ? "k-7a" : kelasIndex === 1 ? "k-7b" : "k-7c",
      jenis_kelamin: (nomor % 2 === 0 ? "P" : "L") as "L" | "P",
      kontak_wali: `08120000${String(nomor).padStart(4, "0")}`,
    };
  }),
];

/* ---------------------------------------------------------------- 5.5 */

export type BarisJadwalDefault = {
  untuk: "guru" | "siswa";
  hari: number;
  aktif: boolean;
  jam_masuk: string | null;
  jam_pulang: string | null;
};

/** 14 baris tetap: dua set (guru, siswa) x tujuh hari. 0 = Sabtu. */
export const jadwal_default: BarisJadwalDefault[] = [
  { untuk: "guru", hari: 0, aktif: true, jam_masuk: "07:00", jam_pulang: "14:00" },
  { untuk: "guru", hari: 1, aktif: true, jam_masuk: "07:00", jam_pulang: "14:00" },
  { untuk: "guru", hari: 2, aktif: true, jam_masuk: "07:00", jam_pulang: "14:00" },
  { untuk: "guru", hari: 3, aktif: true, jam_masuk: "07:00", jam_pulang: "14:00" },
  { untuk: "guru", hari: 4, aktif: true, jam_masuk: "07:00", jam_pulang: "14:00" },
  { untuk: "guru", hari: 5, aktif: true, jam_masuk: "07:00", jam_pulang: "12:00" },
  { untuk: "guru", hari: 6, aktif: false, jam_masuk: null, jam_pulang: null },
  { untuk: "siswa", hari: 0, aktif: true, jam_masuk: "07:00", jam_pulang: "14:00" },
  { untuk: "siswa", hari: 1, aktif: true, jam_masuk: "07:00", jam_pulang: "14:00" },
  { untuk: "siswa", hari: 2, aktif: true, jam_masuk: "07:00", jam_pulang: "14:00" },
  { untuk: "siswa", hari: 3, aktif: true, jam_masuk: "07:00", jam_pulang: "14:00" },
  { untuk: "siswa", hari: 4, aktif: true, jam_masuk: "07:00", jam_pulang: "14:00" },
  { untuk: "siswa", hari: 5, aktif: true, jam_masuk: "07:00", jam_pulang: "12:00" },
  { untuk: "siswa", hari: 6, aktif: false, jam_masuk: null, jam_pulang: null },
];

/* ---------------------------------------------------------------- 5.6 */

export type BarisJadwalOverrideGuru = {
  user_id: string;
  hari: number;
  aktif: boolean;
  jam_masuk: string | null;
  jam_pulang: string | null;
};

export const jadwal_override_guru: BarisJadwalOverrideGuru[] = [
  { user_id: "u-g2", hari: 1, aktif: true, jam_masuk: "10:00", jam_pulang: "12:00" },
  { user_id: "u-g2", hari: 3, aktif: false, jam_masuk: null, jam_pulang: null },
];

/* ---------------------------------------------------------------- 5.7 */

export type BarisKalender = {
  id: string;
  tanggal: string;
  jenis: "libur" | "khusus";
  untuk: "semua" | "guru" | "siswa";
  keterangan: string;
  jam_masuk: string | null;
  jam_pulang: string | null;
};

export const kalender: BarisKalender[] = [
  {
    id: "kal-1",
    tanggal: "2026-10-10",
    jenis: "libur",
    untuk: "semua",
    keterangan: "Libur contoh",
    jam_masuk: null,
    jam_pulang: null,
  },
  {
    id: "kal-2",
    tanggal: "2026-10-14",
    jenis: "khusus",
    untuk: "guru",
    keterangan: "Rapat guru",
    jam_masuk: "09:00",
    jam_pulang: "12:00",
  },
];

/* ---------------------------------------------------------------- 5.8 */

export type StatusAbsensi =
  | "hadir"
  | "terlambat"
  | "izin"
  | "sakit"
  | "dinas_luar"
  | "alpa";

export type BarisAbsensiGuru = {
  id: string;
  user_id: string;
  tanggal: string;
  jam_masuk: string | null;
  jam_pulang: string | null;
  status: StatusAbsensi;
  pulang_awal: boolean;
  tidak_lengkap: boolean;
  flag_curiga: boolean;
  dikoreksi: boolean;
};

export const absensi_guru: BarisAbsensiGuru[] = [
  {
    id: "ag-1",
    user_id: "u-g1",
    tanggal: "2026-10-03",
    jam_masuk: "06:55",
    jam_pulang: "14:02",
    status: "hadir",
    pulang_awal: false,
    tidak_lengkap: false,
    flag_curiga: false,
    dikoreksi: false,
  },
  {
    id: "ag-2",
    user_id: "u-g2",
    tanggal: "2026-10-03",
    jam_masuk: "07:25",
    jam_pulang: "12:30",
    status: "terlambat",
    pulang_awal: true,
    tidak_lengkap: false,
    flag_curiga: false,
    dikoreksi: false,
  },
  {
    id: "ag-3",
    user_id: "u-g3",
    tanggal: "2026-10-03",
    jam_masuk: "07:00",
    jam_pulang: null,
    status: "hadir",
    pulang_awal: false,
    tidak_lengkap: true,
    flag_curiga: false,
    dikoreksi: false,
  },
  {
    id: "ag-4",
    user_id: "u-g3",
    tanggal: "2026-10-04",
    jam_masuk: null,
    jam_pulang: null,
    status: "sakit",
    pulang_awal: false,
    tidak_lengkap: false,
    flag_curiga: false,
    dikoreksi: false,
  },
  {
    id: "ag-5",
    user_id: "u-g1",
    tanggal: "2026-10-02",
    jam_masuk: null,
    jam_pulang: null,
    status: "alpa",
    pulang_awal: false,
    tidak_lengkap: false,
    flag_curiga: false,
    dikoreksi: false,
  },
  {
    id: "ag-6",
    user_id: "u-g2",
    tanggal: "2026-10-01",
    jam_masuk: "07:05",
    jam_pulang: "14:00",
    status: "hadir",
    pulang_awal: false,
    tidak_lengkap: false,
    flag_curiga: false,
    dikoreksi: true,
  },
  {
    id: "ag-7",
    user_id: "u-g4",
    tanggal: "2026-10-02",
    jam_masuk: null,
    jam_pulang: null,
    status: "izin",
    pulang_awal: false,
    tidak_lengkap: false,
    flag_curiga: false,
    dikoreksi: false,
  },
  {
    id: "ag-8",
    user_id: "u-g5",
    tanggal: "2026-10-02",
    jam_masuk: null,
    jam_pulang: null,
    status: "dinas_luar",
    pulang_awal: false,
    tidak_lengkap: false,
    flag_curiga: false,
    dikoreksi: false,
  },
];

/* ---------------------------------------------------------------- 5.9 */

export type BarisAbsensiSiswa = {
  siswa_id: string;
  kelas_id: string;
  tanggal: string;
  jam_masuk: string | null;
  jam_pulang: string | null;
  status: StatusAbsensi;
  pulang_awal: boolean;
  tidak_lengkap: boolean;
  flag_curiga: boolean;
  dikoreksi: boolean;
  discan_masuk_oleh: string | null;
  discan_pulang_oleh: string | null;
};

export const absensi_siswa: BarisAbsensiSiswa[] = [
  {
    siswa_id: "u-s1",
    kelas_id: "k-7a",
    tanggal: "2026-10-06",
    jam_masuk: "06:55",
    jam_pulang: null,
    status: "hadir",
    pulang_awal: false,
    tidak_lengkap: false,
    flag_curiga: false,
    dikoreksi: false,
    discan_masuk_oleh: "u-g1",
    discan_pulang_oleh: null,
  },
  {
    siswa_id: "u-s2",
    kelas_id: "k-7a",
    tanggal: "2026-10-06",
    jam_masuk: "07:20",
    jam_pulang: null,
    status: "terlambat",
    pulang_awal: false,
    tidak_lengkap: false,
    flag_curiga: false,
    dikoreksi: false,
    discan_masuk_oleh: "u-g1",
    discan_pulang_oleh: null,
  },
  {
    siswa_id: "u-s3",
    kelas_id: "k-7a",
    tanggal: "2026-10-06",
    jam_masuk: null,
    jam_pulang: null,
    status: "sakit",
    pulang_awal: false,
    tidak_lengkap: false,
    flag_curiga: false,
    dikoreksi: false,
    discan_masuk_oleh: null,
    discan_pulang_oleh: null,
  },
  {
    siswa_id: "u-s4",
    kelas_id: "k-7a",
    tanggal: "2026-10-06",
    jam_masuk: null,
    jam_pulang: null,
    status: "alpa",
    pulang_awal: false,
    tidak_lengkap: false,
    flag_curiga: false,
    dikoreksi: false,
    discan_masuk_oleh: null,
    discan_pulang_oleh: null,
  },
  {
    siswa_id: "u-s1",
    kelas_id: "k-7a",
    tanggal: "2026-10-03",
    jam_masuk: "06:50",
    jam_pulang: "14:01",
    status: "hadir",
    pulang_awal: false,
    tidak_lengkap: false,
    flag_curiga: false,
    dikoreksi: false,
    discan_masuk_oleh: "u-g1",
    discan_pulang_oleh: "u-g2",
  },
  {
    siswa_id: "u-s2",
    kelas_id: "k-7a",
    tanggal: "2026-10-03",
    jam_masuk: "07:20",
    jam_pulang: null,
    status: "terlambat",
    pulang_awal: false,
    tidak_lengkap: true,
    flag_curiga: false,
    dikoreksi: false,
    discan_masuk_oleh: "u-g1",
    discan_pulang_oleh: null,
  },
  {
    siswa_id: "u-s2",
    kelas_id: "k-7a",
    tanggal: "2026-10-02",
    jam_masuk: null,
    jam_pulang: null,
    status: "izin",
    pulang_awal: false,
    tidak_lengkap: false,
    flag_curiga: false,
    dikoreksi: false,
    discan_masuk_oleh: null,
    discan_pulang_oleh: null,
  },
  {
    siswa_id: "u-s1",
    kelas_id: "k-7a",
    tanggal: "2026-10-02",
    jam_masuk: null,
    jam_pulang: null,
    status: "alpa",
    pulang_awal: false,
    tidak_lengkap: false,
    flag_curiga: false,
    dikoreksi: false,
    discan_masuk_oleh: null,
    discan_pulang_oleh: null,
  },
];

/* ---------------------------------------------------------------- 5.10 */

export type StatusIzinGuru = "menunggu" | "disetujui" | "ditolak";

export type BarisIzinGuru = {
  id: string;
  user_id: string;
  jenis: "sakit" | "izin" | "cuti" | "dinas_luar";
  tgl_mulai: string;
  tgl_selesai: string;
  alasan: string;
  status: StatusIzinGuru;
  diajukan_oleh: string;
  diputuskan_oleh: string | null;
  catatan_keputusan: string | null;
};

export const izin_guru: BarisIzinGuru[] = [
  {
    id: "ig-1",
    user_id: "u-g3",
    jenis: "sakit",
    tgl_mulai: "2026-10-04",
    tgl_selesai: "2026-10-06",
    alasan: "Kurang sehat",
    status: "disetujui",
    diajukan_oleh: "u-g3",
    diputuskan_oleh: "u-kepala",
    catatan_keputusan: null,
  },
  {
    id: "ig-2",
    user_id: "u-g2",
    jenis: "izin",
    tgl_mulai: "2026-10-12",
    tgl_selesai: "2026-10-12",
    alasan: "Keperluan pribadi",
    status: "menunggu",
    diajukan_oleh: "u-g2",
    diputuskan_oleh: null,
    catatan_keputusan: null,
  },
  {
    id: "ig-3",
    user_id: "u-g4",
    jenis: "izin",
    tgl_mulai: "2026-10-02",
    tgl_selesai: "2026-10-02",
    alasan: "Keperluan keluarga",
    status: "disetujui",
    diajukan_oleh: "u-g4",
    diputuskan_oleh: "u-kepala",
    catatan_keputusan: null,
  },
  {
    id: "ig-4",
    user_id: "u-g5",
    jenis: "dinas_luar",
    tgl_mulai: "2026-10-02",
    tgl_selesai: "2026-10-02",
    alasan: "Kegiatan luar madrasah",
    status: "disetujui",
    diajukan_oleh: "u-g5",
    diputuskan_oleh: "u-kepala",
    catatan_keputusan: null,
  },
];

/* ---------------------------------------------------------------- 5.11 */

export type BarisIzinSiswa = {
  id: string;
  siswa_id: string;
  jenis: "izin" | "sakit";
  tgl_mulai: string;
  tgl_selesai: string;
  keterangan: string;
  diinput_oleh: string;
  dibatalkan: boolean;
};

export const izin_siswa: BarisIzinSiswa[] = [
  {
    id: "is-2",
    siswa_id: "u-s3",
    jenis: "sakit",
    tgl_mulai: "2026-10-06",
    tgl_selesai: "2026-10-06",
    keterangan: "Demam",
    diinput_oleh: "u-g1",
    dibatalkan: false,
  },
  {
    id: "is-1",
    siswa_id: "u-s2",
    jenis: "izin",
    tgl_mulai: "2026-10-02",
    tgl_selesai: "2026-10-02",
    keterangan: "Acara keluarga",
    diinput_oleh: "u-g1",
    dibatalkan: false,
  },
];

/* ---------------------------------------------------------------- 5.12 */

export type BarisPengajuanKoreksi = {
  id: string;
  user_id: string;
  tanggal: string;
  usulan_jam_masuk: string | null;
  usulan_jam_pulang: string | null;
  alasan: string;
  status: StatusIzinGuru;
  diproses_oleh: string | null;
  catatan_keputusan: string | null;
};

export const pengajuan_koreksi: BarisPengajuanKoreksi[] = [
  {
    id: "pk-1",
    user_id: "u-g1",
    tanggal: "2026-10-02",
    usulan_jam_masuk: "07:00",
    usulan_jam_pulang: null,
    alasan: "Lupa absen",
    status: "menunggu",
    diproses_oleh: null,
    catatan_keputusan: null,
  },
];

/* ---------------------------------------------------------------- 5.13 */

export type BarisLogAktivitas = {
  id: number;
  waktu: string;
  user_id: string | null;
  aksi: string;
  entitas: string | null;
  ringkasan: string | null;
};

/** Tidak dipakai pada fase frontend; tetap disertakan agar 13 tabel lengkap. */
export const log_aktivitas: BarisLogAktivitas[] = [];