"use client";

import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Ikon } from "../komponen/Ikon";
import { Isian } from "../komponen/Isian";
import { Kartu } from "../komponen/Kartu";
import { Pemuat } from "../komponen/Pemuat";
import { Pesan } from "../komponen/Pesan";
import { Tombol } from "../komponen/Tombol";
import {
  ambilKoneksi,
  ambilKoneksiServer,
  ambilSesi,
  ambilSesiServer,
  dengarKoneksi,
  dengarSesi,
  masuk,
  tujuanSesudahMasuk,
} from "../data/sesi";

/** SCR-01 Login — FR-AK-01, semua peran, satu aksi utama: Masuk. */
const MSG_LOGIN_GAGAL = "Email atau password salah. Periksa lalu coba lagi.";
const MSG_TANPA_KONEKSI = "Tidak ada koneksi. Periksa sinyal lalu coba lagi.";
const MSG_EMAIL_BELUM_BENAR = "Format email belum benar. Contoh: nama@akademik.sch.id";
const MSG_EMAIL_WAJIB = "Isian Email wajib diisi";
const MSG_PASSWORD_WAJIB = "Isian Password wajib diisi";
const MSG_LUPA_PASSWORD = "Hubungi Admin untuk mengatur ulang password.";

const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Galat = { email?: string; password?: string };

export default function HalamanMasuk() {
  const router = useRouter();

  const sesi = useSyncExternalStore(dengarSesi, ambilSesi, ambilSesiServer);
  const terhubung = useSyncExternalStore(dengarKoneksi, ambilKoneksi, ambilKoneksiServer);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [galat, setGalat] = useState<Galat>({});
  const [memproses, setMemproses] = useState(false);
  const [pesan, setPesan] = useState<{ jenis: "sukses" | "galat" | "info"; teks: string } | null>(null);

  useEffect(() => {
    if (sesi) router.replace(tujuanSesudahMasuk[sesi.role]);
  }, [router, sesi]);

  async function kirimMasuk(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (memproses) return;

    const temuan: Galat = {};
    const emailBersih = email.trim();
    if (emailBersih === "") temuan.email = MSG_EMAIL_WAJIB;
    else if (!polaEmail.test(emailBersih)) temuan.email = MSG_EMAIL_BELUM_BENAR;
    if (password === "") temuan.password = MSG_PASSWORD_WAJIB;

    setGalat(temuan);
    setPesan(null);
    if (Object.keys(temuan).length > 0) return;

    setMemproses(true);
    const hasil = await masuk(email, password);
    setMemproses(false);

    if (!hasil.berhasil) {
      setPesan({ jenis: "galat", teks: terhubung ? MSG_LOGIN_GAGAL : MSG_TANPA_KONEKSI });
      return;
    }
    router.replace(tujuanSesudahMasuk[hasil.sesi.role]);
  }

  if (sesi === undefined) {
    return (
      <main className="rangka-layar">
        <div className="rangka-form">
          <Pemuat teks="Memeriksa sesi…" />
        </div>
      </main>
    );
  }

  return (
    <main className="rangka-layar">
      <div className="rangka-form">
        <div className="tumpuk">
          <div className="pusat">
            <span className="merek">
              <Ikon nama="tanda" ukuran={24} />
            </span>
            <h1>Absensi Madrasah</h1>
            <p className="ket">Masuk untuk melanjutkan</p>
          </div>

          <Kartu>
            <form className="tumpuk" onSubmit={kirimMasuk} noValidate>
              <p className="ket">Masukkan email dan password Anda</p>

              <Isian
                id="email"
                label="Email"
                tipe="email"
                nilai={email}
                onChange={setEmail}
                galat={galat.email}
                placeholder="nama@akademik.sch.id"
                autoComplete="username"
              />

              <Isian
                id="password"
                label="Password"
                tipe="password"
                nilai={password}
                onChange={setPassword}
                galat={galat.password}
                autoComplete="current-password"
                bolehLihat
              />

              <Tombol
                label={memproses ? "Memproses…" : "Masuk"}
                varian="utama"
                tipe="submit"
                lebar
                memproses={memproses}
                nonaktif={!terhubung}
                alasan={terhubung ? undefined : MSG_TANPA_KONEKSI}
              />
            </form>
          </Kartu>

          <div className="rata-tengah">
            <Tombol
              label="Lupa password? Hubungi Admin"
              varian="teks"
              onClick={() => setPesan({ jenis: "info", teks: MSG_LUPA_PASSWORD })}
            />
          </div>
        </div>
      </div>

      {pesan ? <Pesan jenis={pesan.jenis} teks={pesan.teks} onTutup={() => setPesan(null)} /> : null}
    </main>
  );
}