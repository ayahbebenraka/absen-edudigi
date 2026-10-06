"use client";

import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { lembaga, users } from "../../data/contoh";
import {
  catatAbsenSiswaMock,
  jadwalEfektif,
  jamWib,
  labelTanggalWib,
  menitDariJam,
  namaKelas,
  tanggalWib,
} from "../../data/absensi";
import { Header } from "../../komponen/Header";
import { Ikon } from "../../komponen/Ikon";
import { Kartu } from "../../komponen/Kartu";
import { KeadaanKosong } from "../../komponen/KeadaanKosong";
import { NavigasiGuru } from "../../komponen/NavigasiGuru";
import { Pemuat } from "../../komponen/Pemuat";
import { Pesan } from "../../komponen/Pesan";
import { Tombol } from "../../komponen/Tombol";
import { ambilSesi, ambilSesiServer, dengarSesi, keluar } from "../../data/sesi";

type JenisAbsen = "masuk" | "pulang";
type LokasiUji = "dalam" | "luar" | "akurasi" | "belum-diatur";
type HasilLayar = { jenis: "sukses" | "info" | "galat"; teks: string; durasiOtomatis?: number };
type BarisTercatat = { id: string; nama: string; kelas: string; jam: string; status: string };

const MSG_TANPA_HAK_AKSES = "Halaman ini tidak tersedia untuk Anda.";

function labelJenis(jenis: JenisAbsen) {
  return jenis === "masuk" ? "Masuk" : "Pulang";
}

function beriGetar(jumlah: 1 | 2) {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  navigator.vibrate(jumlah === 1 ? 100 : [100, 80, 100]);
}

export default function HalamanAbsenSiswa() {
  const router = useRouter();
  const sesi = useSyncExternalStore(dengarSesi, ambilSesi, ambilSesiServer);
  const tanggal = tanggalWib();
  const jadwal = jadwalEfektif("", tanggal, "siswa");
  const [jenis, setJenis] = useState<JenisAbsen>(() => {
    const pulangDibuka = jadwal.jamPulang
      ? menitDariJam(jamWib()) >= menitDariJam(jadwal.jamPulang) - lembaga[0].buka_pulang_menit
      : false;
    return pulangDibuka ? "pulang" : "masuk";
  });
  const [waktu, setWaktu] = useState(jamWib());
  const [lokasi, setLokasi] = useState<LokasiUji>(
    lembaga[0].lat == null || lembaga[0].lng == null ? "belum-diatur" : "dalam"
  );
  const [scanAktif, setScanAktif] = useState(false);
  const [ketikNisn, setKetikNisn] = useState(false);
  const [nisn, setNisn] = useState("");
  const [memproses, setMemproses] = useState(false);
  const [hasil, setHasil] = useState<HasilLayar | null>(null);
  const [tercatat, setTercatat] = useState<BarisTercatat[]>([]);
  const [jumlah, setJumlah] = useState(0);
  const nisnRef = useRef<HTMLInputElement>(null);
  const scanTerakhir = useRef(new Map<string, number>());

  if (sesi === undefined) {
    return <main className="rangka"><Pemuat teks="Memeriksa sesi…" /></main>;
  }
  if (sesi === null || sesi.role !== "guru") {
    return (
      <main className="rangka">
        <Kartu>
          <KeadaanKosong
            ikon="silang"
            teks={MSG_TANPA_HAK_AKSES}
            aksi={<Tombol label="Kembali ke Beranda" varian="utama" onClick={() => router.replace("/beranda")} />}
          />
        </Kartu>
      </main>
    );
  }
  const pemindaiId = sesi.userId;

  function keluarSesi() {
    keluar();
    router.replace("/");
  }

  function pesanLokasi(): string | null {
    if (lokasi === "belum-diatur") return "Lokasi madrasah belum diatur. Hubungi Admin.";
    if (lokasi === "luar") {
      return `Anda ${lembaga[0].radius_m + 1} m dari madrasah. Dekati area madrasah lalu tekan Coba lagi lokasi.`;
    }
    if (lokasi === "akurasi") {
      return `Lokasi belum akurat (±${lembaga[0].akurasi_maks_m + 1} m). Pindah ke area terbuka lalu tekan Coba lagi lokasi.`;
    }
    return null;
  }

  function mulaiScan() {
    const masalahLokasi = pesanLokasi();
    if (masalahLokasi) {
      setHasil({ jenis: "galat", teks: masalahLokasi });
      return;
    }
    if (!jadwal.aktif) {
      setHasil({ jenis: "galat", teks: jadwal.keterangan ? `Hari ini libur: ${jadwal.keterangan}. Absen tidak diperlukan.` : "Hari ini bukan hari aktif." });
      return;
    }
    setKetikNisn(false);
    setScanAktif(true);
    setHasil({ jenis: "info", teks: "Pemindai siap. Masukkan NISN atau kode QR contoh untuk simulasi." });
    requestAnimationFrame(() => nisnRef.current?.focus());
  }

  function cobaLagiLokasi() {
    const masalahLokasi = pesanLokasi();
    setHasil(masalahLokasi
      ? { jenis: "galat", teks: masalahLokasi }
      : { jenis: "sukses", teks: "Lokasi dalam radius (simulasi). Pemindai siap digunakan." }
    );
  }

  async function catatNisn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (memproses) return;
    const nilai = nisn.trim();
    if (!nilai) {
      setHasil({ jenis: "galat", teks: "Isian NISN wajib diisi." });
      return;
    }
    if (!jadwal.aktif) {
      setHasil({ jenis: "galat", teks: jadwal.keterangan ? `Hari ini libur: ${jadwal.keterangan}. Absen tidak diperlukan.` : "Hari ini bukan hari aktif." });
      return;
    }
    const masalahLokasi = pesanLokasi();
    if (masalahLokasi) {
      setHasil({ jenis: "galat", teks: masalahLokasi });
      return;
    }
    if (scanAktif) {
      const sebelumnya = scanTerakhir.current.get(nilai);
      const sekarang = Date.now();
      if (sebelumnya !== undefined && sekarang - sebelumnya < 3000) {
        setHasil({ jenis: "info", teks: "Pemindaian QR yang sama dalam 3 detik diabaikan." });
        setNisn("");
        requestAnimationFrame(() => nisnRef.current?.focus());
        return;
      }
      scanTerakhir.current.set(nilai, sekarang);
    }

    setMemproses(true);
    await new Promise((selesai) => setTimeout(selesai, 250));
    const hasilCatat = catatAbsenSiswaMock({
      nisn: nilai,
      jenis,
      tanggal,
      jam: waktu,
      pemindaiId,
    });
    setMemproses(false);

    if (!hasilCatat.berhasil) {
      if (hasilCatat.sebab !== "sudah-tercatat") beriGetar(2);
      const pesanGagal = {
        "siswa-tidak-ditemukan": "NISN tidak ditemukan. Periksa angkanya lalu coba lagi.",
        "siswa-nonaktif": "Siswa ini tidak aktif. Hubungi Admin.",
        "jadwal-tidak-aktif": "Hari ini bukan hari aktif.",
        "belum-dibuka": `Absen Masuk dibuka pukul ${jadwal.jamMasuk}.`,
        "sudah-ditutup": `Absen Masuk sudah ditutup. Hubungi wali kelas.`,
        "sudah-tercatat": `${users.find((user) => user.id === hasilCatat.baris?.siswa_id)?.nama ?? "Siswa"} sudah tercatat ${labelJenis(jenis)} pukul ${jenis === "masuk" ? hasilCatat.baris?.jam_masuk : hasilCatat.baris?.jam_pulang}.`,
        "belum-masuk": "Belum tercatat Masuk hari ini. Hubungi Admin atau wali kelas untuk koreksi.",
      }[hasilCatat.sebab];
      setHasil({
        jenis: hasilCatat.sebab === "sudah-tercatat" ? "info" : "galat",
        teks: pesanGagal,
      });
      setNisn("");
      if (scanAktif) requestAnimationFrame(() => nisnRef.current?.focus());
      return;
    }

    const baris = hasilCatat.baris;
    const nama = users.find((user) => user.id === baris.siswa_id)?.nama ?? "Siswa";
    const kelasNama = namaKelas(baris.kelas_id);
    const status = baris.status === "hadir" ? "Hadir" : "Terlambat";
    beriGetar(1);
    setHasil({
      jenis: "sukses",
      teks: `${nama} (${kelasNama}) tercatat ${labelJenis(jenis)} ${waktu} · ${status}.`,
      durasiOtomatis: 2000,
    });
    setTercatat((sebelumnya) => [
      { id: baris.siswa_id, nama, kelas: kelasNama, jam: waktu, status },
      ...sebelumnya.filter((item) => item.id !== baris.siswa_id),
    ].slice(0, 5));
    setJumlah((sebelumnya) => sebelumnya + 1);
    setNisn("");
    if (!scanAktif) setKetikNisn(false);
    else requestAnimationFrame(() => nisnRef.current?.focus());
  }

  return (
    <main className="rangka rangka-guru">
      <Header
        judul="Absen Siswa"
        tanggal={labelTanggalWib()}
        aksi={<Tombol label="Keluar" varian="sekunder" muatan={<Ikon nama="keluar" ukuran={20} />} onClick={keluarSesi} />}
      />

      <div className="tumpuk">
        <Kartu>
          <div className="segmen" role="group" aria-label="Jenis absensi">
            {(["masuk", "pulang"] as const).map((pilihan) => (
              <button
                key={pilihan}
                type="button"
                className={jenis === pilihan ? "aktif" : ""}
                aria-pressed={jenis === pilihan}
                onClick={() => {
                  setJenis(pilihan);
                  setScanAktif(false);
                  setHasil(null);
                }}
              >
                {labelJenis(pilihan)}
              </button>
            ))}
          </div>
          {jadwal.aktif && jadwal.jamMasuk && jadwal.jamPulang ? (
            <p className="ket">Jadwal siswa {jadwal.jamMasuk}–{jadwal.jamPulang}</p>
          ) : (
            <p className="ket">{jadwal.keterangan ? `Hari ini libur: ${jadwal.keterangan}.` : "Hari ini bukan hari aktif."}</p>
          )}
        </Kartu>

        <div className={`status-lokasi ${lokasi === "dalam" ? "valid" : "perlu"}`} role="status" aria-live="polite">
          <Ikon nama={lokasi === "dalam" ? "periksa" : "info"} ukuran={20} />
          <div>
            <strong>{lokasi === "dalam" ? "Lokasi dalam radius (simulasi)" : pesanLokasi()}</strong>
            <span className="ket">Lokasi perangkat nyata diperiksa pada fase backend.</span>
          </div>
          <Tombol label="Coba lagi lokasi" varian="sekunder" onClick={cobaLagiLokasi} nonaktif={scanAktif} />
        </div>

        <div className="area-pindai">
          <div className="kontrol-pindai">
            <div className="bingkai-pindai" aria-label="Area pemindai QR simulasi">
              <span className="bingkai-pindai-ikon"><Ikon nama="pengguna" ukuran={32} /></span>
              <strong>{scanAktif ? "Pemindai siap" : "Kamera belum aktif"}</strong>
              <span className="ket">{scanAktif ? "Masukkan kode QR contoh di bawah." : "Lokasi dan kamera hanya digunakan selama sesi scan."}</span>
            </div>

            <div className="tumpuk-rapat">
              {!scanAktif ? (
                <Tombol label="Mulai Scan" varian="utama" lebar onClick={mulaiScan} nonaktif={!jadwal.aktif || lokasi !== "dalam"} />
              ) : (
                <Tombol
                  label="Selesai"
                  varian="sekunder"
                  lebar
                  onClick={() => {
                    setScanAktif(false);
                    setHasil(null);
                  }}
                />
              )}
              {!ketikNisn && !scanAktif ? (
                <Tombol label="Ketik NISN" varian="sekunder" lebar onClick={() => setKetikNisn(true)} />
              ) : null}
            </div>

            {(scanAktif || ketikNisn) ? (
              <Kartu judul={scanAktif ? "Simulasi QR beruntun" : "Ketik NISN"}>
                <form className="form-pindai" onSubmit={catatNisn}>
                  <label htmlFor="nisn-siswa">{scanAktif ? "Kode QR / NISN" : "NISN"}</label>
                  <input
                    ref={nisnRef}
                    id="nisn-siswa"
                    value={nisn}
                    onChange={(event) => setNisn(event.target.value.replace(/\D/g, ""))}
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="Contoh: 0012345601"
                  />
                  {!scanAktif ? (
                    <Tombol label={memproses ? "Memproses…" : "Catat"} varian="utama" tipe="submit" memproses={memproses} />
                  ) : (
                    <button className="tombol-tersembunyi" type="submit" aria-label="Catat hasil pindai" disabled={memproses} />
                  )}
                </form>
                <p className="ket">Fase frontend memakai input contoh; lokasi dan kamera asli akan diperiksa saat backend.</p>
              </Kartu>
            ) : null}
          </div>

          {scanAktif || jumlah > 0 ? (
            <Kartu judul={`Tercatat: ${jumlah}`}>
              {tercatat.length > 0 ? (
                <ul className="daftar-pindai">
                  {tercatat.map((item) => (
                    <li key={item.id}>
                      <span><strong>{item.nama}</strong><span className="ket">{item.kelas} · {item.jam}</span></span>
                      <span className="ket">{item.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="ket">Hasil pemindaian akan tampil di sini.</p>
              )}
            </Kartu>
          ) : null}
        </div>

        {hasil ? <Pesan jenis={hasil.jenis} teks={hasil.teks} durasiOtomatis={hasil.durasiOtomatis} onTutup={() => setHasil(null)} /> : null}

        <details className="uji-frontend">
          <summary>Skenario uji frontend</summary>
          <div className="tumpuk-rapat">
            <label>Waktu simulasi (WIB)<input type="time" value={waktu} onChange={(event) => setWaktu(event.target.value)} /></label>
            <label>
              Hasil lokasi pemindai
              <select value={lokasi} onChange={(event) => setLokasi(event.target.value as LokasiUji)}>
                <option value="dalam">Dalam radius</option>
                <option value="luar">Di luar radius</option>
                <option value="akurasi">Akurasi rendah</option>
                <option value="belum-diatur">Koordinat madrasah belum diatur</option>
              </select>
            </label>
            <p className="ket">Pemindaian dan lokasi di layar ini adalah simulasi frontend, bukan pemeriksaan perangkat atau server.</p>
          </div>
        </details>
      </div>
      <NavigasiGuru userId={sesi.userId} aktif="absen" />
    </main>
  );
}