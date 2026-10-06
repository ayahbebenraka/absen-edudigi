"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../komponen/Header";
import { BannerInfo } from "../../komponen/BannerInfo";
import { Ikon } from "../../komponen/Ikon";
import { Isian } from "../../komponen/Isian";
import { Kartu } from "../../komponen/Kartu";
import { KeadaanKosong } from "../../komponen/KeadaanKosong";
import { Pemuat } from "../../komponen/Pemuat";
import { Pesan } from "../../komponen/Pesan";
import { Tombol } from "../../komponen/Tombol";
import { Unggah } from "../../komponen/Unggah";
import { NavigasiPeran } from "../../komponen/NavigasiPeran";
import { lembaga, type BarisLembaga } from "../../data/contoh";
import {
  ambilSesi,
  ambilSesiServer,
  dengarSesi,
  keluar,
  type Sesi,
} from "../../data/sesi";

const MSG_TANPA_HAK_AKSES = "Halaman ini tidak tersedia untuk Anda.";
const MSG_TERSIMPAN = "Tersimpan.";
const MSG_LOKASI_GAGAL =
  "Lokasi tidak tersedia. Pastikan mengizinkan akses lokasi pada pengaturan browser.";
const MSG_NAMA_WAJIB = "Nama wajib diisi, 3–200 karakter.";
const MSG_LINTANG = "Lintang harus antara -90 dan 90.";
const MSG_BUJUR = "Bujur harus antara -180 dan 180.";
const MSG_TERBUKA =
  'Tahun ajaran aktif harus berupa dua tahun dengan pemisah "/", mis. 2026/2027.';
const MSG_LOGO = "Logo harus JPG atau PNG, maks 1 MB.";
const NEMU_PENGATURAN =
  "Angka bisnis (radius, akurasi, domain email) akan dapat diubah pada modul Pengaturan.";
const KUNCI_LOCAL = "lembaga-absen-edudigi";

const polaTahunAjaran = /^\d{4}\/\d{4}$/;

type Galat = {
  nama?: string;
  lat?: string;
  lng?: string;
  tahun_ajaran?: string;
  logo?: string;
};

type FormLembaga = {
  nama: string;
  npsn_nsm: string;
  alamat: string;
  logo_path: string | null;
  lat: string;
  lng: string;
  tahun_ajaran_aktif: string;
};

function bebanTersimpan(): Partial<FormLembaga> {
  try {
    const teks = window.localStorage.getItem(KUNCI_LOCAL);
    return teks ? JSON.parse(teks) : {};
  } catch {
    return {};
  }
}

function simpanKeLocal(data: FormLembaga) {
  window.localStorage.setItem(KUNCI_LOCAL, JSON.stringify(data));
}

function dariLembaga(baris: BarisLembaga): FormLembaga {
  return {
    nama: baris.nama,
    npsn_nsm: baris.npsn_nsm ?? "",
    alamat: baris.alamat ?? "",
    logo_path: baris.logo_path ?? null,
    lat: baris.lat?.toString() ?? "",
    lng: baris.lng?.toString() ?? "",
    tahun_ajaran_aktif: baris.tahun_ajaran_aktif ?? "",
  };
}

export default function HalamanMasterData() {
  const router = useRouter();
  const sesi = useSyncExternalStore(dengarSesi, ambilSesi, ambilSesiServer);

  if (sesi === undefined) {
    return (
      <main className="rangka">
        <Pemuat teks="Memeriksa sesi…" />
      </main>
    );
  }

  if (sesi === null || sesi.role !== "admin") {
    return (
      <main className="rangka">
        <Kartu>
          <KeadaanKosong
            ikon="silang"
            teks={MSG_TANPA_HAK_AKSES}
            aksi={<Tombol label="Kembali" varian="utama" onClick={() => router.replace("/")} />}
          />
        </Kartu>
      </main>
    );
  }

  return <FormulirMasterData sesi={sesi} />;
}

function FormulirMasterData({ sesi }: { sesi: Sesi }) {
  const router = useRouter();
  const simpanan = bebanTersimpan();

  const [form, setForm] = useState<FormLembaga>(() => {
    const awal = dariLembaga(lembaga[0]);
    return { ...awal, ...simpanan };
  });

  const [galat, setGalat] = useState<Galat>({});
  const [pesan, setPesan] = useState<{ jenis: "sukses" | "galat" | "info"; teks: string } | null>(null);
  const [memproses, setMemproses] = useState(false);

  const koordinatBelumDiatur = !form.lat || !form.lng;

  function pilihLogo(berkas: File) {
    if (berkas.type !== "image/jpeg" && berkas.type !== "image/png") {
      setGalat((s) => ({ ...s, logo: MSG_LOGO }));
      return;
    }
    if (berkas.size > 1024 * 1024) {
      setGalat((s) => ({ ...s, logo: MSG_LOGO }));
      return;
    }
    setGalat((s) => ({ ...s, logo: undefined }));
    setForm((f) => ({ ...f, logo_path: berkas.name }));
  }

  function gunakanLokasi() {
    if (!navigator.geolocation) {
      setPesan({ jenis: "galat", teks: MSG_LOKASI_GAGAL });
      return;
    }
    setMemproses(true);
    navigator.geolocation.getCurrentPosition(
      (posisi) => {
        const { latitude, longitude } = posisi.coords;
        setForm((f) => ({
          ...f,
          lat: latitude.toString(),
          lng: longitude.toString(),
        }));
        setMemproses(false);
        setPesan({
          jenis: "sukses",
          teks: `Lokasi dipakai: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
        });
      },
      () => {
        setForm((f) => ({ ...f, lat: "", lng: "" }));
        setMemproses(false);
        setPesan({ jenis: "galat", teks: MSG_LOKASI_GAGAL });
      }
    );
  }

  function simpanHandler() {
    const galatBaru: Galat = {};

    if (!form.nama || form.nama.trim().length < 3 || form.nama.trim().length > 200) {
      galatBaru.nama = MSG_NAMA_WAJIB;
    }

    if (form.lat) {
      const lat = Number(form.lat);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        galatBaru.lat = MSG_LINTANG;
      }
    }

    if (form.lng) {
      const lng = Number(form.lng);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        galatBaru.lng = MSG_BUJUR;
      }
    }

    if (form.tahun_ajaran_aktif && !polaTahunAjaran.test(form.tahun_ajaran_aktif)) {
      galatBaru.tahun_ajaran = MSG_TERBUKA;
    }

    setGalat(galatBaru);
    if (Object.keys(galatBaru).length > 0) return;

    simpanKeLocal(form);

    lembaga[0].nama = form.nama.trim();
    lembaga[0].npsn_nsm = form.npsn_nsm.trim() || null;
    lembaga[0].alamat = form.alamat.trim() || null;
    lembaga[0].logo_path = form.logo_path;
    lembaga[0].lat = form.lat ? Number(form.lat) : null;
    lembaga[0].lng = form.lng ? Number(form.lng) : null;
    lembaga[0].tahun_ajaran_aktif = form.tahun_ajaran_aktif.trim() || null;

    setPesan({ jenis: "sukses", teks: MSG_TERSIMPAN });
  }

  const admin = sesi.role === "admin";

  return (
    <main className="rangka rangka-guru">
      <Header
        judul="Master Data"
        aksi={
          <Tombol
            label="Keluar"
            varian="sekunder"
            muatan={<Ikon nama="keluar" ukuran={20} />}
            onClick={() => {
              keluar();
              router.replace("/");
            }}
          />
        }
      />

      {admin && koordinatBelumDiatur ? (
        <BannerInfo>
          <strong>Lokasi madrasah belum diatur.</strong>
          <p>Isi koordinat lintang dan bujur agar absen berbasis lokasi bekerja.</p>
        </BannerInfo>
      ) : null}

      {pesan ? <Pesan jenis={pesan.jenis} teks={pesan.teks} onTutup={() => setPesan(null)} /> : null}

      <div className="tumpuk">
        <Kartu judul="Data Lembaga">
          <div className="tumpuk-rapat">
            <Unggah
              id="logo"
              label="Logo"
              terima=".jpg,.png"
              keterangan="JPG/PNG · maks 1 MB"
              namaBerkas={form.logo_path}
              onPilih={pilihLogo}
              galat={galat.logo}
            />

            <Isian
              id="nama"
              label="Nama"
              nilai={form.nama}
              onChange={(v) => setForm((f) => ({ ...f, nama: v }))}
              galat={galat.nama}
              placeholder="Nama Madrasah"
            />

            <Isian
              id="npsn"
              label="NPSN / NSM"
              nilai={form.npsn_nsm}
              onChange={(v) => setForm((f) => ({ ...f, npsn_nsm: v }))}
              placeholder="Opsional"
            />

            <span className="isian-satuan">
              <label className="isian-label" htmlFor="alamat">
                Alamat
              </label>
              <textarea
                id="alamat"
                className="isian-area"
                value={form.alamat}
                onChange={(e) => setForm((f) => ({ ...f, alamat: e.target.value }))}
                placeholder="Alamat lengkap madrasah"
                rows={3}
              />
            </span>

            <div className="form-grid">
              <Isian
                id="lintang"
                label="Lintang"
                nilai={form.lat}
                onChange={(v) => setForm((f) => ({ ...f, lat: v }))}
                galat={galat.lat}
                placeholder="-6.20000"
              />
              <Isian
                id="bujur"
                label="Bujur"
                nilai={form.lng}
                onChange={(v) => setForm((f) => ({ ...f, lng: v }))}
                galat={galat.lng}
                placeholder="106.80000"
              />
            </div>

            <Tombol
              label="Gunakan lokasi saya sekarang"
              varian="sekunder"
              onClick={gunakanLokasi}
              memproses={memproses}
              lebar
            />

            <Isian
              id="tahun-ajaran"
              label="Tahun ajaran aktif"
              nilai={form.tahun_ajaran_aktif}
              onChange={(v) => setForm((f) => ({ ...f, tahun_ajaran_aktif: v }))}
              galat={galat.tahun_ajaran}
              placeholder="2026/2027"
            />
          </div>

          <Tombol label="Simpan" varian="utama" lebar onClick={simpanHandler} />
        </Kartu>

        <Kartu judul="Angka bisnis">
          <div className="info-bisnis">
            <div className="info-bisnis-row">
              <span className="info-bisnis-label">Radius masuk</span>
              <span>{lembaga[0].radius_m} m</span>
            </div>
            <div className="info-bisnis-row">
              <span className="info-bisnis-label">Akurasi GPS maksimal</span>
              <span>{lembaga[0].akurasi_maks_m} m</span>
            </div>
            <div className="info-bisnis-row">
              <span className="info-bisnis-label">Domain email</span>
              <span>{lembaga[0].domain_email}</span>
            </div>
            <div className="info-bisnis-row">
              <span className="info-bisnis-label">Jendela masuk</span>
              <span>
                {lembaga[0].buka_masuk_menit}–{lembaga[0].tutup_masuk_menit} menit
              </span>
            </div>
            <Tombol
              label="Ubah di Pengaturan"
              varian="teks"
              onClick={() => setPesan({ jenis: "info", teks: NEMU_PENGATURAN })}
            />
          </div>
        </Kartu>
      </div>

      <NavigasiPeran role={admin ? "admin" : "kepala"} aktif="master-data" />
    </main>
  );
}
