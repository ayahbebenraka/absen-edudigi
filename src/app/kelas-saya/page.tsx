"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { absensi_siswa, kelas, lembaga, siswa, users, type BarisAbsensiSiswa, type StatusAbsensi } from "../../data/contoh";
import { labelTanggalWib, tanggalWib } from "../../data/absensi";
import { Header } from "../../komponen/Header";
import { Kartu } from "../../komponen/Kartu";
import { KeadaanKosong } from "../../komponen/KeadaanKosong";
import { Lencana } from "../../komponen/Lencana";
import { NavigasiGuru } from "../../komponen/NavigasiGuru";
import { Pemuat } from "../../komponen/Pemuat";
import { Pesan } from "../../komponen/Pesan";
import { Tombol } from "../../komponen/Tombol";
import { ambilSesi, ambilSesiServer, dengarSesi } from "../../data/sesi";

type FilterStatus = "semua" | "belum-masuk" | "terlambat" | "alpa" | "izin-sakit";
type DataSiswaHariIni = { userId: string; nama: string; nisn: string; baris?: BarisAbsensiSiswa };

const labelFilter: Record<FilterStatus, string> = {
  semua: "Semua",
  "belum-masuk": "Belum Masuk",
  terlambat: "Terlambat",
  alpa: "Alpa",
  "izin-sakit": "Izin-Sakit",
};

function statusTampil(baris?: BarisAbsensiSiswa): string {
  if (!baris) return "Belum Absen";
  return {
    hadir: "Hadir",
    terlambat: "Terlambat",
    izin: "Izin",
    sakit: "Sakit",
    dinas_luar: "Dinas Luar",
    alpa: "Alpa",
  }[baris.status];
}

export default function HalamanKelasSaya() {
  const router = useRouter();
  const sesi = useSyncExternalStore(dengarSesi, ambilSesi, ambilSesiServer);
  const [tab, setTab] = useState<"hari" | "rekap">("hari");
  const [filter, setFilter] = useState<FilterStatus>("semua");
  const [bulan, setBulan] = useState(tanggalWib().slice(0, 7));
  const [pesan, setPesan] = useState<string | null>(null);

  if (sesi === undefined) return <main className="rangka"><Pemuat teks="Memeriksa sesi…" /></main>;
  const kelasWali = sesi?.role === "guru"
    ? kelas.find((baris) => baris.wali_user_id === sesi.userId && baris.tahun_ajaran === lembaga[0].tahun_ajaran_aktif)
    : undefined;
  if (!sesi || sesi.role !== "guru" || !kelasWali) {
    return (
      <main className="rangka">
        <Kartu>
          <KeadaanKosong
            ikon="silang"
            teks="Halaman ini tidak tersedia untuk Anda."
            aksi={<Tombol label="Kembali ke Beranda" varian="utama" onClick={() => router.replace("/beranda")} />}
          />
        </Kartu>
      </main>
    );
  }

  const hariIni = tanggalWib();
  const dataSiswa: DataSiswaHariIni[] = siswa
    .filter((baris) => baris.kelas_id === kelasWali.id)
    .map((profil) => {
      const user = users.find((baris) => baris.id === profil.user_id);
      return {
        userId: profil.user_id,
        nama: user?.nama ?? "Siswa tidak ditemukan",
        nisn: user?.nomor_induk ?? "",
        baris: absensi_siswa.find((absen) => absen.siswa_id === profil.user_id && absen.tanggal === hariIni),
      };
    })
    .sort((a, b) => a.nama.localeCompare(b.nama, "id"));
  const tampilHari = dataSiswa.filter((baris) => {
    if (filter === "semua") return true;
    if (filter === "belum-masuk") return !baris.baris?.jam_masuk && !baris.baris;
    if (filter === "terlambat") return baris.baris?.status === "terlambat";
    if (filter === "alpa") return baris.baris?.status === "alpa";
    return baris.baris?.status === "izin" || baris.baris?.status === "sakit";
  });
  const absensiBulan = absensi_siswa.filter(
    (baris) => baris.kelas_id === kelasWali.id && baris.tanggal.startsWith(bulan)
  );
  const jumlahHadir = absensiBulan.filter((baris) => baris.status === "hadir").length;
  const terlambat = absensiBulan.filter((baris) => baris.status === "terlambat").length;
  const izinSakit = absensiBulan.filter((baris) => baris.status === "izin" || baris.status === "sakit").length;
  const alpa = absensiBulan.filter((baris) => baris.status === "alpa").length;

  return (
    <main className="rangka rangka-guru">
      <Header judul={`Kelas Saya · ${kelasWali.nama}`} tanggal={labelTanggalWib()} />

      <div className="tumpuk">
        <div className="segmen" role="tablist" aria-label="Tampilan kelas">
          <button type="button" role="tab" aria-selected={tab === "hari"} className={tab === "hari" ? "aktif" : ""} onClick={() => setTab("hari")}>Hari Ini</button>
          <button type="button" role="tab" aria-selected={tab === "rekap"} className={tab === "rekap" ? "aktif" : ""} onClick={() => setTab("rekap")}>Rekap</button>
        </div>

        {tab === "hari" ? (
          <>
            <div className="filter-status" role="group" aria-label="Saring status siswa">
              {(Object.keys(labelFilter) as FilterStatus[]).map((nilai) => (
                <button key={nilai} type="button" className={filter === nilai ? "aktif" : ""} aria-pressed={filter === nilai} onClick={() => setFilter(nilai)}>
                  {labelFilter[nilai]}
                </button>
              ))}
            </div>
            {tampilHari.length ? (
              <div className="daftar-kelas">
                {tampilHari.map((baris) => (
                  <Kartu key={baris.userId}>
                    <div className="baris-kelas-kepala">
                      <div><strong>{baris.nama}</strong><p className="ket">NISN {baris.nisn}</p></div>
                      <span className="ket">{statusTampil(baris.baris)}</span>
                    </div>
                    <div className="rincian-absen">
                      {baris.baris?.jam_masuk ? <span>Masuk {baris.baris.jam_masuk}</span> : null}
                      {baris.baris?.jam_pulang ? <span>Pulang {baris.baris.jam_pulang}</span> : null}
                      {baris.baris ? <Lencana status={baris.baris.status as StatusAbsensi} /> : <span className="ket">Belum Masuk</span>}
                      {baris.baris?.tidak_lengkap ? <Lencana penanda="Tidak Lengkap" /> : null}
                      {baris.baris?.dikoreksi ? <Lencana penanda="Dikoreksi" /> : null}
                    </div>
                    <div className="aksi-kelas">
                      <Tombol label="Input Izin/Sakit" varian="teks" onClick={() => setPesan("Input izin siswa tersedia di modul Izin dan Koreksi.")} />
                      <Tombol label="Koreksi" varian="teks" onClick={() => setPesan("Koreksi absensi tersedia di modul Izin dan Koreksi.")} />
                    </div>
                  </Kartu>
                ))}
              </div>
            ) : (
              <Kartu><p className="ket">Tidak ada siswa untuk filter ini.</p></Kartu>
            )}
          </>
        ) : (
          <>
            <label className="label-bulan" htmlFor="bulan-rekap">Bulan rekap</label>
            <input id="bulan-rekap" className="isian-bulan" type="month" value={bulan} onChange={(event) => setBulan(event.target.value || tanggalWib().slice(0, 7))} />
            {absensiBulan.length > 0 ? (
              <>
                <Kartu judul={`Rekap ${bulan}`}>
                  <div className="ringkasan-kelas">
                    <div><strong>{jumlahHadir}</strong><span className="ket">Hadir</span></div>
                    <div><strong>{terlambat}</strong><span className="ket">Terlambat</span></div>
                    <div><strong>{izinSakit}</strong><span className="ket">Izin/Sakit</span></div>
                    <div><strong>{alpa}</strong><span className="ket">Alpa</span></div>
                  </div>
                </Kartu>
                <div className="daftar-kelas">
                  {dataSiswa.map((baris) => {
                    const riwayatSiswa = absensiBulan.filter((absen) => absen.siswa_id === baris.userId);
                    const hitungStatus = (status: StatusAbsensi) => riwayatSiswa.filter((absen) => absen.status === status).length;
                    const jumlahHadir = hitungStatus("hadir");
                    const jumlahTerlambat = hitungStatus("terlambat");
                    const jumlahIzin = hitungStatus("izin");
                    const jumlahSakit = hitungStatus("sakit");
                    const jumlahAlpa = hitungStatus("alpa");
                    const persentase = riwayatSiswa.length > 0
                      ? `${(((jumlahHadir + jumlahTerlambat) / riwayatSiswa.length) * 100).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`
                      : "—";

                    return (
                      <Kartu key={baris.userId}>
                        <div className="baris-kelas-kepala">
                          <strong>{baris.nama}</strong>
                          <span className="ket">Kehadiran {persentase}</span>
                        </div>
                        <div className="ringkasan-kelas">
                          <div><strong>{jumlahHadir}</strong><span className="ket">Hadir</span></div>
                          <div><strong>{jumlahTerlambat}</strong><span className="ket">Terlambat</span></div>
                          <div><strong>{jumlahIzin}</strong><span className="ket">Izin</span></div>
                          <div><strong>{jumlahSakit}</strong><span className="ket">Sakit</span></div>
                          <div><strong>{jumlahAlpa}</strong><span className="ket">Alpa</span></div>
                        </div>
                      </Kartu>
                    );
                  })}
                </div>
              </>
            ) : (
              <KeadaanKosong teks="Belum ada catatan kehadiran pada bulan ini." />
            )}
          </>
        )}
      </div>

      {pesan ? <Pesan jenis="info" teks={pesan} onTutup={() => setPesan(null)} /> : null}
      <NavigasiGuru userId={sesi.userId} aktif="kelas" />
    </main>
  );
}