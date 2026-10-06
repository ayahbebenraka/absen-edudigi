import {
  jadwal_default,
  jadwal_override_guru,
  kalender,
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

function entriPalingSpesifik(entri: BarisKalender[], peran: "guru") {
  return entri.find((baris) => baris.untuk === peran) ?? entri.find((baris) => baris.untuk === "semua");
}

export function jadwalGuruEfektif(userId: string, tanggal: string): JadwalHariIni {
  const entriHari = kalender.filter((baris) => baris.tanggal === tanggal && (baris.untuk === "semua" || baris.untuk === "guru"));
  const libur = entriPalingSpesifik(entriHari.filter((baris) => baris.jenis === "libur"), "guru");
  if (libur) return { aktif: false, jamMasuk: null, jamPulang: null, keterangan: libur.keterangan };

  const khusus = entriPalingSpesifik(entriHari.filter((baris) => baris.jenis === "khusus"), "guru");
  if (khusus) {
    return {
      aktif: true,
      jamMasuk: khusus.jam_masuk,
      jamPulang: khusus.jam_pulang,
      keterangan: khusus.keterangan,
    };
  }

  const hari = hariBaku(tanggal);
  const override = jadwal_override_guru.find((baris) => baris.user_id === userId && baris.hari === hari);
  if (override) {
    return {
      aktif: override.aktif,
      jamMasuk: override.jam_masuk,
      jamPulang: override.jam_pulang,
    };
  }

  const bawaan = jadwal_default.find((baris) => baris.untuk === "guru" && baris.hari === hari);
  return {
    aktif: bawaan?.aktif ?? false,
    jamMasuk: bawaan?.jam_masuk ?? null,
    jamPulang: bawaan?.jam_pulang ?? null,
  };
}