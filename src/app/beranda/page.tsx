"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../komponen/Header";
import { Ikon } from "../../komponen/Ikon";
import { Kartu } from "../../komponen/Kartu";
import { KeadaanKosong } from "../../komponen/KeadaanKosong";
import { Pemuat } from "../../komponen/Pemuat";
import { Tombol } from "../../komponen/Tombol";
import { ambilSesi, ambilSesiServer, dengarSesi, keluar, namaPeran } from "../../data/sesi";

const MSG_TANPA_HAK_AKSES = "Halaman ini tidak tersedia untuk Anda.";

const HARI = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

/** Tanggal hari ini, WIB, format FS 2.7: "Senin, 5 Okt 2026". */
function tanggalHariIni() {
  const sekarang = new Date();
  return `${HARI[sekarang.getDay()]}, ${sekarang.getDate()} ${BULAN[sekarang.getMonth()]} ${sekarang.getFullYear()}`;
}

export default function HalamanBeranda() {
  const router = useRouter();
  const sesi = useSyncExternalStore(dengarSesi, ambilSesi, ambilSesiServer);

  function keluarSesi() {
    keluar();
    router.replace("/");
  }

  if (sesi === undefined) {
    return (
      <main className="rangka">
        <Pemuat teks="Memeriksa sesi…" />
      </main>
    );
  }

  if (sesi === null) {
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

  return (
    <main className="rangka">
      <Header
        judul={sesi.nama}
        tanggal={tanggalHariIni()}
        aksi={
          <Tombol
            label="Keluar"
            varian="sekunder"
            muatan={<Ikon nama="keluar" ukuran={20} />}
            onClick={keluarSesi}
          />
        }
      />

      <div className="tumpuk">
        <Kartu judul="Modul berikutnya">
          <p>
            Modul berikutnya: Beranda Guru — absen Masuk dan Pulang dengan geo tagging. Modul ini belum
            dibangun.
          </p>
        </Kartu>

        <Kartu judul="Akun">
          <p>Peran: {namaPeran[sesi.role]}</p>
          <p className="ket angka">
            Email {sesi.email} · Nomor induk {sesi.nomor_induk}
          </p>
        </Kartu>
      </div>
    </main>
  );
}