"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Header } from "../../komponen/Header";
import { Ikon } from "../../komponen/Ikon";
import { Isian } from "../../komponen/Isian";
import { Kartu } from "../../komponen/Kartu";
import { KeadaanKosong } from "../../komponen/KeadaanKosong";
import { Pesan } from "../../komponen/Pesan";
import { Pemuat } from "../../komponen/Pemuat";
import { Tombol } from "../../komponen/Tombol";
import { Unggah } from "../../komponen/Unggah";
import { users, type BarisUser } from "../../data/contoh";
import {
  ambilProfil,
  ambilSesi,
  ambilSesiServer,
  dengarSesi,
  gantiPassword,
  keluar,
  namaPeran,
  simpanProfil,
  type Sesi,
} from "../../data/sesi";

const MSG_TANPA_HAK_AKSES = "Halaman ini tidak tersedia untuk Anda.";
const MSG_TANPA_KONEKSI = "Tidak ada koneksi. Periksa sinyal lalu coba lagi.";
const MSG_TERSIMPAN = "Tersimpan.";
const MSG_LAMA_SALAH = "Password lama tidak cocok. Periksa lalu coba lagi.";
const BANTUAN_TERKUNCI = "Hubungi Admin untuk mengubah.";
const BANTUAN_PROFIL_LAIN = "Profil diubah oleh Admin lewat Master Data.";
const BANTUAN_FOTO =
  "Fase Frontend menyimpan nama berkas saja; unggah sebenarnya tersedia setelah Fase Backend (M10).";

type Galat = {
  nama?: string;
  kontak?: string;
  foto?: string;
  sandiLama?: string;
  sandiBaru?: string;
  sandiUlang?: string;
};

/**
 * SCR-26 Akun dan Ganti Password (FR-AK-02, FR-AK-04, FR-AK-05).
 * Guru boleh mengubah nama, kontak, dan foto; peran lain hanya lihat.
 * Email dan nomor induk selalu terkunci untuk semua peran.
 */
export default function HalamanAkun() {
  const router = useRouter();
  const sesi = useSyncExternalStore(dengarSesi, ambilSesi, ambilSesiServer);

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

  const user = users.find((calon) => calon.id === sesi.userId);
  if (!user) {
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

  return <FormulirAkun key={sesi.userId} sesi={sesi} user={user} />;
}

function FormulirAkun({ sesi, user }: { sesi: Sesi; user: BarisUser }) {
  const router = useRouter();
  const tersimpan = ambilProfil(sesi.userId);

  const [nama, setNama] = useState(tersimpan.nama ?? sesi.nama);
  const [kontak, setKontak] = useState(tersimpan.kontak ?? "");
  const [fotoNama, setFotoNama] = useState(tersimpan.foto_path ?? null);
  const [sandiLama, setSandiLama] = useState("");
  const [sandiBaru, setSandiBaru] = useState("");
  const [sandiUlang, setSandiUlang] = useState("");
  const [galat, setGalat] = useState<Galat>({});
  const [pesan, setPesan] = useState<{ jenis: "sukses" | "galat"; teks: string } | null>(null);
  const [memproses, setMemproses] = useState(false);

  const bolehUbahProfil = sesi.role === "guru";

  function keluarSesi() {
    keluar();
    router.replace("/");
  }

  function pilihFoto(berkas: File) {
    if (berkas.type !== "image/jpeg" && berkas.type !== "image/png") {
      setGalat((sebelum) => ({ ...sebelum, foto: "Berkas harus JPG atau PNG." }));
      return;
    }
    if (berkas.size > 1024 * 1024) {
      setGalat((sebelum) => ({ ...sebelum, foto: "Berkas melebihi 1 MB." }));
      return;
    }
    setGalat((sebelum) => ({ ...sebelum, foto: undefined }));
    setFotoNama(berkas.name);
  }

  function simpanProfilHandler() {
    const galatBaru: Galat = {};
    if (nama.trim().length < 3 || nama.trim().length > 100) {
      galatBaru.nama = "Nama wajib diisi, 3–100 karakter.";
    }
    if (kontak.trim() && !/^\+?\d{8,15}$/.test(kontak.trim())) {
      galatBaru.kontak = "Kontak berupa angka 8–15 digit, boleh diawali +.";
    }
    setGalat(galatBaru);
    if (Object.keys(galatBaru).length > 0) return;

    simpanProfil(sesi.userId, {
      nama: nama.trim(),
      kontak: kontak.trim() || undefined,
      foto_path: fotoNama ?? undefined,
    });
    setPesan({ jenis: "sukses", teks: MSG_TERSIMPAN });
  }

  async function gantiSandiHandler() {
    const galatBaru: Galat = {};
    if (!sandiLama) galatBaru.sandiLama = "Isian Password lama wajib diisi.";
    if (!sandiBaru) {
      galatBaru.sandiBaru = "Isian Password baru wajib diisi.";
    } else if (sandiBaru.length < 6) {
      galatBaru.sandiBaru = "Password baru minimal 6 karakter.";
    } else if (sandiBaru === sandiLama) {
      galatBaru.sandiBaru = "Password baru tidak boleh sama dengan password lama.";
    }
    if (!sandiUlang) {
      galatBaru.sandiUlang = "Isian Ulangi password baru wajib diisi.";
    } else if (sandiUlang !== sandiBaru) {
      galatBaru.sandiUlang = "Ulangi password baru tidak sama dengan password baru.";
    }
    setGalat(galatBaru);
    if (Object.keys(galatBaru).length > 0) return;

    setMemproses(true);
    const hasil = await gantiPassword(sesi.userId, sesi.role, sandiLama, sandiBaru);
    setMemproses(false);

    if (!hasil.berhasil) {
      setPesan({
        jenis: "galat",
        teks: hasil.sebab === "koneksi" ? MSG_TANPA_KONEKSI : MSG_LAMA_SALAH,
      });
      return;
    }

    setSandiLama("");
    setSandiBaru("");
    setSandiUlang("");
    setGalat({});
    setPesan({ jenis: "sukses", teks: MSG_TERSIMPAN });
  }

  return (
    <main className="rangka">
      <Header
        judul="Akun"
        aksi={
          <Tombol
            label="Keluar"
            varian="sekunder"
            muatan={<Ikon nama="keluar" ukuran={20} />}
            onClick={keluarSesi}
          />
        }
      />

      {pesan ? (
        <Pesan jenis={pesan.jenis} teks={pesan.teks} onTutup={() => setPesan(null)} />
      ) : null}

      <div className="tumpuk">
        <Kartu judul="Profil">
          <div className="profil-kepala">
            <span className="foto-profil">
              <Ikon nama="pengguna" ukuran={32} />
            </span>
            <div>
              <p>{nama || user.nama}</p>
              <p className="ket">{namaPeran[sesi.role]}</p>
            </div>
          </div>

          <div className="tumpuk-rapat">
            <div className="satuan">
              <span className="ket">Email</span>
              <p>
                <Ikon nama="gembok" ukuran={16} /> {sesi.email}
              </p>
            </div>
            <div className="satuan">
              <span className="ket">{user.role === "siswa" ? "NISN" : "NIP/ID"}</span>
              <p>
                <Ikon nama="gembok" ukuran={16} /> {user.nomor_induk}
              </p>
            </div>
            <p className="ket">{BANTUAN_TERKUNCI}</p>
          </div>

          {bolehUbahProfil ? (
            <div className="tumpuk-rapat">
              <Isian
                id="nama"
                label="Nama"
                nilai={nama}
                onChange={setNama}
                galat={galat.nama}
              />
              <Isian
                id="kontak"
                label="Kontak"
                nilai={kontak}
                onChange={setKontak}
                tipe="nomor"
                galat={galat.kontak}
                bantuan="Opsional. Angka 8–15 digit, boleh diawali +."
              />
              <Unggah
                id="foto"
                label="Foto"
                terima=".jpg,.png"
                keterangan="JPG/PNG · maks 1 MB"
                namaBerkas={fotoNama}
                onPilih={pilihFoto}
                galat={galat.foto}
              />
              <p className="ket">{BANTUAN_FOTO}</p>
              <Tombol label="Simpan" varian="utama" onClick={simpanProfilHandler} />
            </div>
          ) : (
            <div className="tumpuk-rapat">
              <div className="satuan">
                <span className="ket">Nama</span>
                <p>{user.nama}</p>
              </div>
              <div className="satuan">
                <span className="ket">Kontak</span>
                <p>{user.kontak ?? "—"}</p>
              </div>
              <p className="ket">{BANTUAN_PROFIL_LAIN}</p>
            </div>
          )}
        </Kartu>

        <Kartu judul="Ganti Password">
          <div className="tumpuk-rapat">
            <Isian
              id="sandi-lama"
              label="Password lama"
              tipe="password"
              nilai={sandiLama}
              onChange={setSandiLama}
              galat={galat.sandiLama}
              bolehLihat
              autoComplete="current-password"
            />
            <Isian
              id="sandi-baru"
              label="Password baru"
              tipe="password"
              nilai={sandiBaru}
              onChange={setSandiBaru}
              galat={galat.sandiBaru}
              bantuan="Minimal 6 karakter."
              bolehLihat
              autoComplete="new-password"
            />
            <Isian
              id="sandi-ulang"
              label="Ulangi password baru"
              tipe="password"
              nilai={sandiUlang}
              onChange={setSandiUlang}
              galat={galat.sandiUlang}
              bolehLihat
              autoComplete="new-password"
            />
            <Tombol
              label="Simpan"
              varian="utama"
              onClick={gantiSandiHandler}
              memproses={memproses}
            />
          </div>
        </Kartu>
      </div>
    </main>
  );
}
