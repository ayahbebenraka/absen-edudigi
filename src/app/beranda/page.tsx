"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../komponen/Header";
import { Ikon } from "../../komponen/Ikon";
import { Kartu } from "../../komponen/Kartu";
import { KeadaanKosong } from "../../komponen/KeadaanKosong";
import { Lencana } from "../../komponen/Lencana";
import { Pemuat } from "../../komponen/Pemuat";
import { Tombol } from "../../komponen/Tombol";
import { Pesan } from "../../komponen/Pesan";
import { NavigasiGuru } from "../../komponen/NavigasiGuru";
import { absensi_guru, absensi_siswa, izin_guru, kelas, lembaga, siswa, users, type BarisAbsensiGuru, type StatusAbsensi } from "../../data/contoh";
import { jadwalEfektif, jadwalGuruEfektif, jamWib, labelTanggalWib, menitDariJam, statusMasuk, tanggalWib } from "../../data/absensi";
import { ambilSesi, ambilSesiServer, dengarSesi, keluar, namaPeran, type Sesi } from "../../data/sesi";

const MSG_TANPA_HAK_AKSES = "Halaman ini tidak tersedia untuk Anda.";

type SkenarioLokasi = "dalam" | "luar" | "akurasi" | "belum-diatur";
type PesanBeranda = { jenis: "sukses" | "galat" | "info"; teks: string };

function sapaan(jam: string) {
  const angkaJam = Number(jam.slice(0, 2));
  if (angkaJam < 11) return "Selamat pagi";
  if (angkaJam < 15) return "Selamat siang";
  if (angkaJam < 18) return "Selamat sore";
  return "Selamat malam";
}

function labelStatus(status: BarisAbsensiGuru["status"]) {
  return {
    hadir: "Hadir",
    terlambat: "Terlambat",
    izin: "Izin",
    sakit: "Sakit",
    dinas_luar: "Dinas Luar",
    alpa: "Alpa",
  }[status];
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

  if (sesi.role === "guru") return <BerandaGuru sesi={sesi} />;
  if (sesi.role === "kepala") return <DashboardKepala />;

  return (
    <main className="rangka">
      <Header
        judul={sesi.nama}
        tanggal={labelTanggalWib()}
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
        <Kartu judul="Dashboard Admin">
          <p>
            Dashboard Admin belum dibangun.
          </p>
        </Kartu>

        <Kartu judul="Akun">
          <p>Peran: {namaPeran[sesi.role]}</p>
          <p className="ket angka">
            Email {sesi.email} · Nomor induk {sesi.nomor_induk}
          </p>
          <Tombol
            label="Akun dan Ganti Password"
            varian="teks"
            onClick={() => router.push("/akun")}
          />
        </Kartu>
      </div>
    </main>
  );
}

function DashboardKepala() {
  const router = useRouter();
  const [diperbarui, setDiperbarui] = useState(() => new Date());
  const tanggal = tanggalWib(diperbarui);
  const jadwalSiswa = jadwalEfektif("", tanggal, "siswa");
  const menitSekarang = menitDariJam(jamWib(diperbarui));
  const jendelaPulangDibuka = jadwalSiswa.jamPulang
    ? menitSekarang >= menitDariJam(jadwalSiswa.jamPulang) - lembaga[0].buka_pulang_menit
    : false;

  useEffect(() => {
    const interval = setInterval(() => setDiperbarui(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const guruWajib = users.filter((user) =>
    user.role === "guru" && user.aktif && user.wajib_absen && jadwalGuruEfektif(user.id, tanggal).aktif
  );
  const statusGuru = guruWajib.map((user) => {
    const absen = absensi_guru.find((baris) => baris.user_id === user.id && baris.tanggal === tanggal);
    const izin = izin_guru.find((baris) =>
      baris.user_id === user.id &&
      baris.status === "disetujui" &&
      baris.tgl_mulai <= tanggal &&
      baris.tgl_selesai >= tanggal
    );
    const statusIzin: StatusAbsensi | undefined = izin
      ? izin.jenis === "dinas_luar" ? "dinas_luar" : izin.jenis === "sakit" ? "sakit" : "izin"
      : undefined;
    return { user, status: absen?.status ?? statusIzin ?? null };
  });
  const siswaWajib = users.filter((user) =>
    user.role === "siswa" && user.aktif && jadwalSiswa.aktif
  );
  const statusSiswa = siswaWajib.map((user) => ({
    user,
    status: absensi_siswa.find((baris) => baris.siswa_id === user.id && baris.tanggal === tanggal)?.status ?? null,
  }));
  const hadirGuru = statusGuru.filter((baris) => baris.status === "hadir" || baris.status === "terlambat").length;
  const terlambatGuru = statusGuru.filter((baris) => baris.status === "terlambat").length;
  const izinGuru = statusGuru.filter((baris) => baris.status === "izin" || baris.status === "sakit" || baris.status === "dinas_luar").length;
  const belumAbsenGuru = statusGuru.filter((baris) => baris.status === null || baris.status === "alpa");
  const hadirSiswa = statusSiswa.filter((baris) => baris.status === "hadir" || baris.status === "terlambat").length;
  const terlambatSiswa = statusSiswa.filter((baris) => baris.status === "terlambat").length;
  const izinSakitSiswa = statusSiswa.filter((baris) => baris.status === "izin" || baris.status === "sakit").length;
  const belumAbsenSiswa = statusSiswa.filter((baris) => baris.status === null || baris.status === "alpa").length;
  const izinMenunggu = izin_guru.filter((baris) => baris.status === "menunggu");
  const belumPulang = jendelaPulangDibuka
    ? absensi_siswa.filter((baris) => baris.tanggal === tanggal && baris.jam_masuk && !baris.jam_pulang).length
    : null;

  const ringkasanKelas = kelas.map((barisKelas) => {
    const anggota = siswa.filter((profil) => {
      const user = users.find((baris) => baris.id === profil.user_id);
      return profil.kelas_id === barisKelas.id && user?.aktif && jadwalSiswa.aktif;
    });
    const catatan = absensi_siswa.filter((baris) => baris.kelas_id === barisKelas.id && baris.tanggal === tanggal);
    return {
      nama: barisKelas.nama,
      jumlahWajib: anggota.length,
      hadir: catatan.filter((baris) => baris.status === "hadir" || baris.status === "terlambat").length,
      terlambat: catatan.filter((baris) => baris.status === "terlambat").length,
      alpa: catatan.filter((baris) => baris.status === "alpa").length,
    };
  });

  function segarkan() {
    setDiperbarui(new Date());
  }

  return (
    <main className="rangka rangka-guru">
      <Header
        judul="Dashboard"
        tanggal={labelTanggalWib(diperbarui)}
        aksi={(
          <div className="aksi-kelas">
            <Tombol label="Segarkan" varian="sekunder" onClick={segarkan} />
            <Tombol label="Keluar" varian="sekunder" muatan={<Ikon nama="keluar" ukuran={20} />} onClick={() => { keluar(); router.replace("/"); }} />
          </div>
        )}
      />

      <div className="tumpuk">
        <section className="tumpuk-rapat" aria-labelledby="ringkasan-guru">
          <h2 id="ringkasan-guru">Guru</h2>
          <div className="ringkasan-kelas">
            <div><strong>{hadirGuru}/{guruWajib.length}</strong><span className="ket">Hadir</span></div>
            <div><strong>{terlambatGuru}</strong><span className="ket">Terlambat</span></div>
            <div><strong>{izinGuru}</strong><span className="ket">Izin/Sakit/Dinas Luar</span></div>
            <div><strong>{belumAbsenGuru.length}</strong><span className="ket">Belum Absen</span></div>
          </div>
        </section>

        <section className="tumpuk-rapat" aria-labelledby="ringkasan-siswa">
          <h2 id="ringkasan-siswa">Siswa</h2>
          <div className="ringkasan-kelas">
            <div><strong>{hadirSiswa}/{siswaWajib.length}</strong><span className="ket">Hadir</span></div>
            <div><strong>{terlambatSiswa}</strong><span className="ket">Terlambat</span></div>
            <div><strong>{izinSakitSiswa}</strong><span className="ket">Izin/Sakit</span></div>
            <div><strong>{belumAbsenSiswa}</strong><span className="ket">Belum Absen</span></div>
            {belumPulang !== null ? <div><strong>{belumPulang}</strong><span className="ket">Belum Pulang</span></div> : null}
          </div>
        </section>

        <Kartu judul="Perlu perhatian">
          <div className="daftar-kelas">
            <div>
              <strong>Guru Belum Absen · {belumAbsenGuru.length}</strong>
              <ul className="daftar-pindai">
                {belumAbsenGuru.map((baris) => <li key={baris.user.id}>{baris.user.nama}</li>)}
              </ul>
            </div>
            <div>
              <strong>Izin menunggu persetujuan · {izinMenunggu.length}</strong>
              <ul className="daftar-pindai">
                {izinMenunggu.map((baris) => (
                  <li key={baris.id}>{users.find((user) => user.id === baris.user_id)?.nama ?? "Guru"} · {baris.jenis}</li>
                ))}
              </ul>
            </div>
          </div>
        </Kartu>

        <section className="tumpuk-rapat" aria-labelledby="ringkasan-kelas">
          <h2 id="ringkasan-kelas">Per kelas</h2>
          <div className="daftar-kelas">
            {ringkasanKelas.map((baris) => (
              <Kartu key={baris.nama}>
                <div className="baris-kelas-kepala"><strong>{baris.nama}</strong><span className="ket">Hadir {baris.hadir}/{baris.jumlahWajib}</span></div>
                <div className="rincian-absen"><span>Terlambat {baris.terlambat}</span><span>Alpa {baris.alpa}</span></div>
              </Kartu>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function BerandaGuru({ sesi }: { sesi: Sesi }) {
  const router = useRouter();
  const tanggal = tanggalWib();
  const jadwal = jadwalGuruEfektif(sesi.userId, tanggal);
  const pengaturan = lembaga[0];
  const [waktu, setWaktu] = useState(jamWib());
  const [lokasi, setLokasi] = useState<SkenarioLokasi>(
    pengaturan.lat == null || pengaturan.lng == null ? "belum-diatur" : "dalam"
  );
  const [memproses, setMemproses] = useState(false);
  const [pesan, setPesan] = useState<PesanBeranda | null>(null);
  const [catatan, setCatatan] = useState<BarisAbsensiGuru | undefined>(() =>
    absensi_guru.find((baris) => baris.user_id === sesi.userId && baris.tanggal === tanggal)
  );

  const menitSekarang = menitDariJam(waktu);
  const menitMasuk = jadwal.jamMasuk ? menitDariJam(jadwal.jamMasuk) : 0;
  const menitPulang = jadwal.jamPulang ? menitDariJam(jadwal.jamPulang) : 0;
  const menitBukaMasuk = menitMasuk - pengaturan.buka_masuk_menit;
  const menitTutupMasuk = menitMasuk + pengaturan.tutup_masuk_menit;
  const statusTombol = !jadwal.aktif
    ? "libur"
    : catatan?.jam_pulang
      ? "selesai"
      : catatan?.jam_masuk
        ? "pulang"
        : menitSekarang < menitBukaMasuk
          ? "belum-dibuka"
          : menitSekarang > menitTutupMasuk
            ? "ditutup"
            : "masuk";

  const izinHariIni = izin_guru.find(
    (izin) =>
      izin.user_id === sesi.userId &&
      izin.status === "disetujui" &&
      izin.tgl_mulai <= tanggal &&
      izin.tgl_selesai >= tanggal
  );

  function keluarSesi() {
    keluar();
    router.replace("/");
  }

  async function catatAbsen() {
    if (memproses || !jadwal.aktif || statusTombol === "libur" || statusTombol === "selesai") return;
    setMemproses(true);
    await new Promise((selesai) => setTimeout(selesai, 350));

    if (lokasi === "belum-diatur") {
      setPesan({ jenis: "galat", teks: "Lokasi madrasah belum diatur. Hubungi Admin." });
      setMemproses(false);
      return;
    }
    if (lokasi === "luar") {
      setPesan({
        jenis: "galat",
        teks: `Anda ${pengaturan.radius_m + 1} m dari madrasah. Dekati area madrasah lalu tekan Coba lagi lokasi.`,
      });
      setMemproses(false);
      return;
    }
    if (lokasi === "akurasi") {
      setPesan({
        jenis: "galat",
        teks: `Lokasi belum akurat (±${pengaturan.akurasi_maks_m + 1} m). Pindah ke area terbuka lalu tekan Coba lagi lokasi.`,
      });
      setMemproses(false);
      return;
    }

    const jamTercatat = waktu;
    const menitTercatat = menitDariJam(jamTercatat);
    const jarak = Math.max(1, Math.floor(pengaturan.radius_m / 2));
    const dasar: BarisAbsensiGuru = catatan ?? {
      id: `sim-${sesi.userId}-${tanggal}`,
      user_id: sesi.userId,
      tanggal,
      jam_masuk: null,
      jam_pulang: null,
      status: "hadir",
      pulang_awal: false,
      tidak_lengkap: false,
      flag_curiga: false,
      dikoreksi: false,
    };

    if (!dasar.jam_masuk) {
      if (menitTercatat < menitBukaMasuk) {
        setPesan({ jenis: "galat", teks: `Absen Masuk dibuka pukul ${jadwal.jamMasuk}.` });
        setMemproses(false);
        return;
      }
      if (menitTercatat > menitTutupMasuk) {
        setPesan({
          jenis: "galat",
          teks: `Absen Masuk sudah ditutup pukul ${jadwal.jamMasuk}. Ajukan koreksi atau hubungi Admin.`,
        });
        setMemproses(false);
        return;
      }
      const status = statusMasuk(jamTercatat, jadwal.jamMasuk!, pengaturan.toleransi_menit);
      setCatatan({ ...dasar, jam_masuk: jamTercatat, status });
      setPesan({
        jenis: "sukses",
        teks: `Masuk tercatat pukul ${jamTercatat} · ${labelStatus(status)}. Jarak ${jarak} m dari madrasah.`,
      });
    } else if (!dasar.jam_pulang) {
      const pulangAwal = menitTercatat < menitPulang - pengaturan.buka_pulang_menit;
      setCatatan({ ...dasar, jam_pulang: jamTercatat, pulang_awal: pulangAwal });
      setPesan({
        jenis: "sukses",
        teks: `Pulang tercatat pukul ${jamTercatat}.${pulangAwal ? " Pulang Awal." : ""}`,
      });
    }

    setMemproses(false);
  }

  const tampilkanTombol = jadwal.aktif && statusTombol !== "selesai" && statusTombol !== "ditutup";
  const alasanNonaktif =
    statusTombol === "belum-dibuka" && jadwal.jamMasuk
      ? `Absen Masuk dibuka pukul ${jadwal.jamMasuk}.`
      : undefined;

  return (
    <main className="rangka rangka-guru">
      <Header
        judul={`${sapaan(waktu)}, ${sesi.nama}`}
        tanggal={labelTanggalWib()}
        aksi={
          <Tombol
            label="Keluar"
            varian="sekunder"
            muatan={<Ikon nama="keluar" ukuran={20} />}
            onClick={keluarSesi}
          />
        }
      />

      {pesan ? <Pesan jenis={pesan.jenis} teks={pesan.teks} onTutup={() => setPesan(null)} /> : null}

      <div className="tumpuk beranda-absen">
        {izinHariIni ? (
          <Kartu>
            <p>
              Hari ini tercatat <Lencana status={izinHariIni.jenis === "dinas_luar" ? "dinas_luar" : izinHariIni.jenis === "sakit" ? "sakit" : "izin"} />.
            </p>
          </Kartu>
        ) : null}

        <Kartu judul="Jadwal hari ini">
          {jadwal.aktif && jadwal.jamMasuk && jadwal.jamPulang ? (
            <p className="angka">{jadwal.jamMasuk}–{jadwal.jamPulang}</p>
          ) : (
            <p>{jadwal.keterangan ? `Hari ini libur: ${jadwal.keterangan}. Absen tidak diperlukan.` : "Hari ini bukan hari aktif Anda."}</p>
          )}
        </Kartu>

        <Kartu judul="Status hari ini">
          {catatan?.jam_masuk ? (
            <div className="rincian-absen">
              <span>Masuk {catatan.jam_masuk}</span>
              <Lencana status={catatan.status} />
              {catatan.jam_pulang ? <span>Pulang {catatan.jam_pulang}</span> : null}
              {catatan.pulang_awal ? <Lencana penanda="Pulang Awal" /> : null}
            </div>
          ) : catatan ? (
            <Lencana status={catatan.status} />
          ) : (
            <p>Belum absen</p>
          )}
        </Kartu>

        {statusTombol === "ditutup" ? (
          <Kartu>
            <p>
              Absen Masuk sudah ditutup pukul {jadwal.jamMasuk}. Ajukan koreksi atau hubungi Admin.
            </p>
            <Tombol
              label="Ajukan koreksi"
              varian="teks"
              onClick={() => setPesan({ jenis: "info", teks: "Pengajuan koreksi tersedia pada modul berikutnya." })}
            />
          </Kartu>
        ) : null}

        {statusTombol === "selesai" ? <p className="rata-tengah ket">Selesai untuk hari ini.</p> : null}

        {tampilkanTombol ? (
          <div className="tumpuk-rapat">
            <Tombol
              label={statusTombol === "pulang" ? "Pulang" : "Masuk"}
              varian="absen"
              lebar
              memproses={memproses}
              nonaktif={statusTombol === "belum-dibuka"}
              alasan={alasanNonaktif}
              onClick={catatAbsen}
            />
            <p className="ket rata-tengah">Lokasi hanya diminta saat tombol absen ditekan.</p>
          </div>
        ) : null}

        <details className="uji-frontend">
          <summary>Skenario uji frontend</summary>
          <div className="tumpuk-rapat">
            <label>
              Waktu simulasi (WIB)
              <input type="time" value={waktu} onChange={(event) => setWaktu(event.target.value)} />
            </label>
            <label>
              Hasil lokasi simulasi
              <select value={lokasi} onChange={(event) => setLokasi(event.target.value as SkenarioLokasi)}>
                <option value="dalam">Dalam radius</option>
                <option value="luar">Di luar radius</option>
                <option value="akurasi">Akurasi rendah</option>
                <option value="belum-diatur">Koordinat madrasah belum diatur</option>
              </select>
            </label>
            <p className="ket">
              Hasil lokasi dibuat untuk simulasi frontend. Backend tetap wajib memeriksa koordinat dan radius madrasah.
            </p>
          </div>
        </details>

        <div className="rata-tengah">
          <Tombol label="Absen Siswa" varian="teks" onClick={() => router.push("/absen-siswa")} />
          {kelas.some((baris) => baris.wali_user_id === sesi.userId) ? (
            <Tombol label="Kelas Saya" varian="teks" onClick={() => router.push("/kelas-saya")} />
          ) : null}
          <Tombol label="Rekap saya" varian="teks" onClick={() => setPesan({ jenis: "info", teks: "Rekap saya tersedia pada modul laporan." })} />
          <Tombol label="Ajukan koreksi" varian="teks" onClick={() => setPesan({ jenis: "info", teks: "Pengajuan koreksi tersedia pada modul Izin dan Koreksi." })} />
        </div>
      </div>
      <NavigasiGuru userId={sesi.userId} aktif="beranda" />
    </main>
  );
}