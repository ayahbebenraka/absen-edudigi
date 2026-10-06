import {
  absensi_siswa,
  jadwal_default,
  jadwal_override_guru,
  kelas,
  kalender,
  lembaga,
  siswa,
  users,
  type BarisAbsensiSiswa,
  type BarisKalender,
} from "./contoh";

export type JadwalHariIni = {
  aktif: boolean;
  jamMasuk: string | null;
  jamPulang: string | null;
  keterangan?: string;
};

const ZONA_WAKTU = "Asia/Jakarta";

function bagianTanggal(tanggal: Date) {
  const bagian = new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA_WAKTU,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(tanggal);
  const nilai = Object.fromEntries(bagian.map((item) => [item.type, item.value]));
  return `${nilai.year}-${nilai.month}-${nilai.day}`;
}

export function tanggalWib(tanggal = new Date()) {
  return bagianTanggal(tanggal);
}

export function labelTanggalWib(tanggal = new Date()) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: ZONA_WAKTU,
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(tanggal);
}

export function jamWib(tanggal = new Date()) {
  const bagian = new Intl.DateTimeFormat("en-GB", {
    timeZone: ZONA_WAKTU,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(tanggal);
  const nilai = Object.fromEntries(bagian.map((item) => [item.type, item.value]));
  return `${nilai.hour}:${nilai.minute}`;
}

export function menitDariJam(jam: string) {
  const [jamAngka, menitAngka] = jam.split(":").map(Number);
  return jamAngka * 60 + menitAngka;
}

function hariBaku(tanggal: string) {
  const [tahun, bulan, hari] = tanggal.split("-").map(Number);
  return (new Date(Date.UTC(tahun, bulan - 1, hari)).getUTCDay() + 1) % 7;
}

function entriPalingSpesifik(entri: BarisKalender[], peran: "guru" | "siswa") {
  return entri.find((baris) => baris.untuk === peran) ?? entri.find((baris) => baris.untuk === "semua");
}

export function jadwalEfektif(userId: string, tanggal: string, peran: "guru" | "siswa" = "guru"): JadwalHariIni {
  const entriHari = kalender.filter((baris) => baris.tanggal === tanggal && (baris.untuk === "semua" || baris.untuk === peran));
  const libur = entriPalingSpesifik(entriHari.filter((baris) => baris.jenis === "libur"), peran);
  if (libur) return { aktif: false, jamMasuk: null, jamPulang: null, keterangan: libur.keterangan };

  const khusus = entriPalingSpesifik(entriHari.filter((baris) => baris.jenis === "khusus"), peran);
  if (khusus) {
    return {
      aktif: true,
      jamMasuk: khusus.jam_masuk,
      jamPulang: khusus.jam_pulang,
      keterangan: khusus.keterangan,
    };
  }

  const hari = hariBaku(tanggal);
  const override = peran === "guru"
    ? jadwal_override_guru.find((baris) => baris.user_id === userId && baris.hari === hari)
    : undefined;
  if (override) {
    return {
      aktif: override.aktif,
      jamMasuk: override.jam_masuk,
      jamPulang: override.jam_pulang,
    };
  }

  const bawaan = jadwal_default.find((baris) => baris.untuk === peran && baris.hari === hari);
  return {
    aktif: bawaan?.aktif ?? false,
    jamMasuk: bawaan?.jam_masuk ?? null,
    jamPulang: bawaan?.jam_pulang ?? null,
  };
}

export function jadwalGuruEfektif(userId: string, tanggal: string): JadwalHariIni {
  return jadwalEfektif(userId, tanggal, "guru");
}

export function statusMasuk(jam: string, jamMasuk: string, toleransiMenit: number): "hadir" | "terlambat" {
  return menitDariJam(jam) > menitDariJam(jamMasuk) + toleransiMenit ? "terlambat" : "hadir";
}

export type HasilCatatAbsenSiswa =
  | { berhasil: true; baris: BarisAbsensiSiswa }
  | {
      berhasil: false;
      sebab: "siswa-tidak-ditemukan" | "siswa-nonaktif" | "jadwal-tidak-aktif" | "belum-dibuka" | "sudah-ditutup" | "sudah-tercatat" | "belum-masuk";
      baris?: BarisAbsensiSiswa;
    };

export function catatAbsenSiswaMock(input: {
  nisn: string;
  jenis: "masuk" | "pulang";
  tanggal: string;
  jam: string;
  pemindaiId: string;
}): HasilCatatAbsenSiswa {
  const user = users.find((baris) => baris.role === "siswa" && baris.nomor_induk === input.nisn);
  if (!user) return { berhasil: false, sebab: "siswa-tidak-ditemukan" };
  if (!user.aktif) return { berhasil: false, sebab: "siswa-nonaktif" };

  const profil = siswa.find((baris) => baris.user_id === user.id);
  if (!profil) return { berhasil: false, sebab: "siswa-tidak-ditemukan" };

  const jadwal = jadwalEfektif(user.id, input.tanggal, "siswa");
  if (!jadwal.aktif || !jadwal.jamMasuk || !jadwal.jamPulang) {
    return { berhasil: false, sebab: "jadwal-tidak-aktif" };
  }

  const catatan = absensi_siswa.find((baris) => baris.siswa_id === user.id && baris.tanggal === input.tanggal);
  if (input.jenis === "pulang" && !catatan?.jam_masuk) {
    return { berhasil: false, sebab: "belum-masuk" };
  }
  const jamTercatat = input.jenis === "masuk" ? catatan?.jam_masuk : catatan?.jam_pulang;
  if (jamTercatat) return { berhasil: false, sebab: "sudah-tercatat", baris: catatan };

  const pengaturan = lembaga[0];
  if (input.jenis === "masuk") {
    if (menitDariJam(input.jam) < menitDariJam(jadwal.jamMasuk) - pengaturan.buka_masuk_menit) {
      return { berhasil: false, sebab: "belum-dibuka" };
    }
    if (menitDariJam(input.jam) > menitDariJam(jadwal.jamMasuk) + pengaturan.tutup_masuk_menit) {
      return { berhasil: false, sebab: "sudah-ditutup" };
    }
  }

  const baris: BarisAbsensiSiswa = catatan ?? {
    siswa_id: user.id,
    kelas_id: profil.kelas_id,
    tanggal: input.tanggal,
    jam_masuk: null,
    jam_pulang: null,
    status: "hadir",
    pulang_awal: false,
    tidak_lengkap: false,
    flag_curiga: false,
    dikoreksi: false,
    discan_masuk_oleh: null,
    discan_pulang_oleh: null,
  };

  if (input.jenis === "masuk") {
    baris.jam_masuk = input.jam;
    baris.status = statusMasuk(input.jam, jadwal.jamMasuk, pengaturan.toleransi_menit);
    baris.kelas_id = profil.kelas_id;
    baris.discan_masuk_oleh = input.pemindaiId;
  } else {
    baris.jam_pulang = input.jam;
    baris.pulang_awal = menitDariJam(input.jam) < menitDariJam(jadwal.jamPulang) - pengaturan.buka_pulang_menit;
    baris.discan_pulang_oleh = input.pemindaiId;
  }

  if (!catatan) absensi_siswa.push(baris);
  return { berhasil: true, baris };
}

export function namaKelas(kelasId: string): string {
  return kelas.find((baris) => baris.id === kelasId)?.nama ?? "Kelas tidak ditemukan";
}