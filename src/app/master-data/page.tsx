"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../komponen/Header";
import { BannerInfo } from "../../komponen/BannerInfo";
import { Ikon } from "../../komponen/Ikon";
import { Isian } from "../../komponen/Isian";
import { Kartu } from "../../komponen/Kartu";
import { KeadaanKosong } from "../../komponen/KeadaanKosong";
import { Lencana } from "../../komponen/Lencana";
import { Pemuat } from "../../komponen/Pemuat";
import { Pesan } from "../../komponen/Pesan";
import { Tombol } from "../../komponen/Tombol";
import { Unggah } from "../../komponen/Unggah";
import { NavigasiPeran } from "../../komponen/NavigasiPeran";
import { lembaga, type BarisLembaga, users, type BarisUser, kelas, type BarisKelas, siswa } from "../../data/contoh";
import { ambilSesi, ambilSesiServer, dengarSesi, keluar, type Sesi } from "../../data/sesi";

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

const MSG_NIP = "NIP/ID wajib diisi, 5–30 karakter, huruf/angka tanpa spasi.";
const MSG_EMAIL = "Email wajib diisi dengan format yang benar. Contoh: nama@akademik.sch.id.";
const MSG_EMAIL_GANDA = "Email sudah dipakai akun lain.";
const MSG_NIP_GANDA = "NIP/ID sudah dipakai akun lain.";
const MSG_KONTAK = "Kontak berupa angka 8–15 digit, boleh diawali +.";
const MSG_ROLE_WAJIB = "Pilih peran: Admin atau Kepala.";
const MSG_SATU_KEPALA = "Hanya boleh ada satu Kepala aktif.";
const MSG_SATU_ADMIN = "Minimal harus ada satu Admin aktif.";
const NEMU_PENGATURAN = "Angka bisnis (radius, akurasi, domain email) akan dapat diubah pada modul Pengaturan.";

const KUNCI_LOCAL = "lembaga-absen-edudigi";
const polaTahunAjaran = /^\d{4}\/\d{4}$/;
const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const polaNip = /^[A-Za-z0-9]{5,30}$/;
const polaTelepon = /^\+?\d{8,15}$/;

type TabMasterData = "lembaga" | "admin-kepala" | "guru" | "siswa" | "kelas";

const DAFTAR_TAB: { id: TabMasterData; label: string }[] = [
  { id: "lembaga", label: "Data Lembaga" },
  { id: "admin-kepala", label: "Admin & Kepala" },
  { id: "guru", label: "Guru" },
  { id: "siswa", label: "Siswa" },
  { id: "kelas", label: "Kelas" },
];

function bebanTersimpan(): Partial<Record<string, unknown>> {
  try {
    const teks = window.localStorage.getItem(KUNCI_LOCAL);
    return teks ? JSON.parse(teks) : {};
  } catch {
    return {};
  }
}

function simpanKeLocal(data: Record<string, unknown>) {
  window.localStorage.setItem(KUNCI_LOCAL, JSON.stringify(data));
}

function lembagaDariBaris(baris: BarisLembaga): Record<string, unknown> {
  return {
    nama: baris.nama,
    npsn_nsm: baris.npsn_nsm ?? "",
    alamat: baris.alamat ?? "",
    logo_path: baris.logo_path ?? "",
    lat: baris.lat?.toString() ?? "",
    lng: baris.lng?.toString() ?? "",
    tahun_ajaran_aktif: baris.tahun_ajaran_aktif ?? "",
  };
}

type GalatLembaga = {
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

function FormulirLembaga({ sesi }: { sesi: Sesi }) {
  const router = useRouter();
  const simpanan = bebanTersimpan();

  const [form, setForm] = useState<FormLembaga>(() => {
    const awal = lembagaDariBaris(lembaga[0]);
    return { ...awal, ...simpanan } as FormLembaga;
  });

  const [galat, setGalat] = useState<GalatLembaga>({});
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
    const galatBaru: GalatLembaga = {};

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

type GalatPengguna = {
  role?: string;
  nip_id?: string;
  nama?: string;
  email?: string;
  kontak?: string;
};

type FormPengguna = {
  role: "admin" | "kepala";
  nip_id: string;
  nama: string;
  email: string;
  kontak: string;
  aktif: boolean;
  foto_path: string | null;
};

const FORM_KOSONG: FormPengguna = {
  role: "admin",
  nip_id: "",
  nama: "",
  email: "",
  kontak: "",
  aktif: true,
  foto_path: null,
};

function ManajemenAdminKepala({ sesi }: { sesi: Sesi }) {
  const router = useRouter();
  const admin = sesi.role === "admin";

  const daftar = users.filter((u) => u.role === "admin" || u.role === "kepala");

  const [modus, setModus] = useState<"daftar" | "tambah" | "ubah">("daftar");
  const [form, setForm] = useState<FormPengguna>(FORM_KOSONG);
  const [galat, setGalat] = useState<GalatPengguna>({});
  const [pesan, setPesan] = useState<{ jenis: "sukses" | "galat" | "info"; teks: string } | null>(null);
  const [konfirmasiId, setKonfirmasiId] = useState<string | null>(null);

  const penggunaAktif = users.filter((u) => u.role === "admin" && u.aktif);
  const kepalaAktif = users.filter((u) => u.role === "kepala" && u.aktif);

  if (!admin) {
    return (
      <Kartu>
        <KeadaanKosong
          ikon="info"
          teks="Halaman ini belum tersedia untuk peran Anda."
          aksi={<Tombol label="Kembali" varian="utama" onClick={() => router.replace("/")} />}
        />
      </Kartu>
    );
  }

  function mulaiNonaktif(user: BarisUser) {
    if (user.role === "admin" && penggunaAktif.length <= 1) {
      setPesan({ jenis: "galat", teks: MSG_SATU_ADMIN });
      return;
    }
    if (user.role === "kepala" && user.aktif && daftar.filter((u) => u.role === "kepala" && u.aktif).length > 1) {
      setKonfirmasiId(user.id);
      return;
    }
    if (user.aktif && user.role === "kepala") {
      const lainAktifKepala = kepalaAktif.filter((u) => u.id !== user.id);
      if (lainAktifKepala.length === 0) {
        setPesan({ jenis: "galat", teks: MSG_SATU_KEPALA });
        return;
      }
    }
    setKonfirmasiId(user.id);
  }

  function konfirmasiNonaktif(user: BarisUser) {
    if (konfirmasiId !== user.id) return;
    if (user.role === "admin" && penggunaAktif.length <= 1) {
      setPesan({ jenis: "galat", teks: MSG_SATU_ADMIN });
      setKonfirmasiId(null);
      return;
    }
    if (user.role === "kepala" && !user.aktif && kepalaAktif.length > 0) {
      setPesan({ jenis: "galat", teks: MSG_SATU_KEPALA });
      setKonfirmasiId(null);
      return;
    }
    user.aktif = !user.aktif;
    setPesan({
      jenis: "sukses",
      teks: user.aktif ? `${user.nama} diaktifkan.` : `${user.nama} dinonaktifkan.`,
    });
    setKonfirmasiId(null);
  }

  function bukaForm(role: "admin" | "kepala") {
    setForm({ ...FORM_KOSONG, role });
    setGalat({});
    setModus("tambah");
  }

  function editUser(user: BarisUser) {
    setForm({
      role: user.role as "admin" | "kepala",
      nip_id: user.nomor_induk,
      nama: user.nama,
      email: user.email,
      kontak: user.kontak ?? "",
      aktif: user.aktif,
      foto_path: user.foto_path,
    });
    setGalat({});
    setModus("ubah");
  }

  function validasi(userEdit?: BarisUser): GalatPengguna {
    const g: GalatPengguna = {};

    if (modus === "tambah" && !form.role) {
      g.role = MSG_ROLE_WAJIB;
    }
    if (!form.nip_id || !polaNip.test(form.nip_id)) {
      g.nip_id = MSG_NIP;
    } else if (modus === "tambah" || (userEdit && form.nip_id !== userEdit.nomor_induk)) {
      const ada = users.find((u) => u.nomor_induk === form.nip_id && u.role === form.role);
      if (ada) g.nip_id = MSG_NIP_GANDA;
    }

    if (!form.nama || form.nama.trim().length < 3 || form.nama.trim().length > 100) {
      g.nama = "Nama wajib diisi, 3–100 karakter.";
    }
    if (!form.email || !polaEmail.test(form.email)) {
      g.email = MSG_EMAIL;
    } else if (modus === "tambah" || (userEdit && form.email.toLowerCase() !== userEdit.email)) {
      const ada = users.find((u) => u.email === form.email.toLowerCase());
      if (ada) g.email = MSG_EMAIL_GANDA;
    }
    if (form.kontak && !polaTelepon.test(form.kontak.trim())) {
      g.kontak = MSG_KONTAK;
    }

    return g;
  }

  function simpanHandler() {
    let userEdit: BarisUser | undefined;
    if (modus === "ubah") {
      const idx = users.findIndex((u) => u.role === form.role && u.email === form.email && u.nama === form.nama && u.nomor_induk === form.nip_id);
      if (idx >= 0) userEdit = users[idx];
    }
    // fallback: cari berdasarkan email
    if (!userEdit) {
      userEdit = users.find((u) => u.email === form.email) ?? undefined;
    }

    const g = validasi(userEdit);
    setGalat(g);
    if (Object.keys(g).length > 0) return;

    if (modus === "tambah") {
      const idBaru = `u-${form.role}-${Date.now().toString(36).slice(-6)}`;
      users.push({
        id: idBaru,
        email: form.email.toLowerCase(),
        role: form.role,
        nomor_induk: form.nip_id.trim(),
        nama: form.nama.trim(),
        kontak: form.kontak.trim() || null,
        foto_path: form.foto_path,
        aktif: form.aktif,
        wajib_absen: form.role === "admin" ? false : true,
      });
      setPesan({ jenis: "sukses", teks: `${form.role === "admin" ? "Admin" : "Kepala"} ${form.nama} ditambahkan.` });
    } else if (modus === "ubah" && userEdit) {
      userEdit.nama = form.nama.trim();
      userEdit.kontak = form.kontak.trim() || null;
      userEdit.foto_path = form.foto_path;
      userEdit.aktif = form.aktif;
      setPesan({ jenis: "sukses", teks: MSG_TERSIMPAN });
    }

    setModus("daftar");
    setForm(FORM_KOSONG);
    setGalat({});
  }

  function pilihFoto(berkas: File) {
    if (berkas.type !== "image/jpeg" && berkas.type !== "image/png") {
      setGalat((s) => ({ ...s, nama: "Berkas harus JPG atau PNG." }));
      return;
    }
    if (berkas.size > 1024 * 1024) {
      setGalat((s) => ({ ...s, nama: "Berkas melebihi 1 MB." }));
      return;
    }
    setForm((f) => ({ ...f, foto_path: berkas.name }));
  }

  function renderDaftar() {
    return (
      <div className="tumpuk">
        <div className="rata-tengah">
          <Tombol label="Tambah" varian="utama" muatan={<Ikon nama="tambah" ukuran={20} />} onClick={() => bukaForm("admin")} />
        </div>

        {daftar.length === 0 ? (
          <Kartu>
            <KeadaanKosong
              ikon="pengguna"
              teks="Belum ada data admin atau kepala."
              aksi={<Tombol label="Tambah" varian="utama" onClick={() => bukaForm("admin")} />}
            />
          </Kartu>
        ) : (
          <Kartu judul={`Admin & Kepala (${daftar.length})`}>
            <ul className="daftar-pengguna">
              {daftar.map((user) => {
                const sedangDikonfirmasi = konfirmasiId === user.id;
                const bisaNonaktif = user.role === "admin"
                  ? penggunaAktif.some((u) => u.id !== user.id)
                  : true;

                return (
                  <li key={user.id} className="baris-pengguna">
                    <div className="baris-pengguna-info">
                      <strong>{user.nama}</strong>
                      <div className="baris-pengguna-meta">
                        <span className="ket">{user.email}</span>
                        <span className="ket">NIP/ID: {user.nomor_induk}</span>
                        {user.role === "kepala" ? (
                          <Lencana status="izin" />
                        ) : (
                          <span className="pil pil-penanda">
                            <Ikon nama="kotak-masuk" ukuran={16} label="Admin" />
                            <span>Admin</span>
                          </span>
                        )}
                        {user.aktif ? (
                          <Lencana status="hadir" />
                        ) : (
                          <Lencana status="alpa" />
                        )}
                      </div>
                    </div>
                    <div className="baris-pengguna-aksi">
                      <Tombol label="Ubah" varian="teks" onClick={() => editUser(user)} />
                      {sedangDikonfirmasi ? (
                        <span className="satuan">
                          <Tombol
                            label={user.aktif ? "Nonaktifkan" : "Aktifkan"}
                            varian="bahaya"
                            onClick={() => konfirmasiNonaktif(user)}
                          />
                          <Tombol label="Batal" varian="teks" onClick={() => setKonfirmasiId(null)} />
                        </span>
                      ) : (
                        <Tombol
                          label={user.aktif ? "Nonaktifkan" : "Aktifkan"}
                          varian={user.aktif ? "bahaya" : "sekunder"}
                          nonaktif={user.role === "admin" && !bisaNonaktif}
                          onClick={() => mulaiNonaktif(user)}
                        />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Kartu>
        )}
      </div>
    );
  }

  function renderForm() {
    const labelRole = form.role === "admin" ? "Admin" : "Kepala";
    const labelTombol = modus === "tambah" ? "Simpan" : "Simpan";

    return (
      <Kartu judul={modus === "tambah" ? "Tambah" : "Ubah"} subjudul={labelRole}>
        <div className="tumpak-rapat">
          {modus === "tambah" ? (
            <div className="pil-peran">
              {(["admin", "kepala"] as const).map((r) => (
                <label key={r}>
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={form.role === r}
                    onChange={() => setForm((f) => ({ ...f, role: r }))}
                  />
                  <span>{r === "admin" ? "Admin" : "Kepala"}</span>
                </label>
              ))}
            </div>
          ) : null}

          {form.role === "kepala" && kepalaAktif.some((u) => u.id !== (modus === "ubah" ? form.email : "")) && form.aktif ? (
            <p className="ket">
              <Ikon nama="info" ukuran={16} /> {MSG_SATU_KEPALA}
            </p>
          ) : null}

          <Isian
            id="nip"
            label="NIP/ID"
            nilai={form.nip_id}
            onChange={(v) => setForm((f) => ({ ...f, nip_id: v }))}
            galat={galat.nip_id}
            nonaktif={modus === "ubah"}
          />

          <Isian
            id="nama"
            label="Nama"
            nilai={form.nama}
            onChange={(v) => setForm((f) => ({ ...f, nama: v }))}
            galat={galat.nama}
            placeholder="Nama lengkap"
          />

          <Isian
            id="email"
            label="Email"
            tipe="email"
            nilai={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
            galat={galat.email}
            nonaktif={modus === "ubah"}
            placeholder="nama@akademik.sch.id"
          />

          <Isian
            id="kontak"
            label="Kontak"
            nilai={form.kontak}
            onChange={(v) => setForm((f) => ({ ...f, kontak: v }))}
            galat={galat.kontak}
            placeholder="Opsional"
            bantuan="Angka 8–15 digit, boleh diawali +."
          />

          <Unggah
            id="foto"
            label="Foto"
            terima=".jpg,.png"
            keterangan="JPG/PNG · maks 1 MB"
            namaBerkas={form.foto_path}
            onPilih={pilihFoto}
          />

          <label className="satuan">
            <span className="isian-label">Status</span>
            <div className="pil-peran">
              <label>
                <input
                  type="radio"
                  name="aktif"
                  value="true"
                  checked={form.aktif === true}
                  onChange={() => setForm((f) => ({ ...f, aktif: true }))}
                />
                <span>Aktif</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="aktif"
                  value="false"
                  checked={form.aktif === false}
                  onChange={() => setForm((f) => ({ ...f, aktif: false }))}
                />
                <span>Nonaktif</span>
              </label>
            </div>
          </label>
        </div>

        <div className="tumpuk-rapat">
          <Tombol label={labelTombol} varian="utama" lebar onClick={simpanHandler} />
          <Tombol label="Batal" varian="teks" lebar onClick={() => { setModus("daftar"); setForm(FORM_KOSONG); setGalat({}); }} />
        </div>
      </Kartu>
    );
  }

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

      {pesan ? <Pesan jenis={pesan.jenis} teks={pesan.teks} onTutup={() => setPesan(null)} /> : null}

      <Kartu>
        <div className="tumpuk-rapat">
          {modus === "daftar" ? renderDaftar() : renderForm()}
        </div>
      </Kartu>

      <NavigasiPeran role="admin" aktif="master-data" />
    </main>
  );
}

type GalatGuru = {
  nip_id?: string;
  nama?: string;
  email?: string;
  kontak?: string;
  mata_pelajaran?: string;
};

type FormGuru = {
  nip_id: string;
  nama: string;
  email: string;
  kontak: string;
  mata_pelajaran: string;
  wali_kelas: boolean;
  aktif: boolean;
  foto_path: string | null;
};

const FORM_GURU_KOSONG: FormGuru = {
  nip_id: "",
  nama: "",
  email: "",
  kontak: "",
  mata_pelajaran: "",
  wali_kelas: false,
  aktif: true,
  foto_path: null,
};

const MSG_GURU_WALI_AKTIF = "Guru wali kelas aktif tidak dapat dinonaktifkan sebelum wali kelas diganti.";
const MSG_MATA_PELAJARAN = "Mata pelajaran wajib diisi, 2–100 karakter.";

function ManajemenGuru({ sesi: _sesi }: { sesi: Sesi }) {
  void _sesi;
  const router = useRouter();

  const daftar = users.filter((u) => u.role === "guru");

  const [modus, setModus] = useState<"daftar" | "tambah" | "ubah">("daftar");
  const [form, setForm] = useState<FormGuru>(FORM_GURU_KOSONG);
  const [galat, setGalat] = useState<GalatGuru>({});
  const [pesan, setPesan] = useState<{ jenis: "sukses" | "galat" | "info"; teks: string } | null>(null);
  const [konfirmasiId, setKonfirmasiId] = useState<string | null>(null);
  const [cari, setCari] = useState("");
  const [filterAktif, setFilterAktif] = useState<"semua" | "aktif" | "nonaktif">("semua");

  const guruWaliAktif = users.filter((u) => u.role === "guru" && u.wali_kelas === true && u.aktif);

  const daftarTerfilter = daftar.filter((u) => {
    const cocokCari =
      cari.trim() === "" ||
      u.nama.toLowerCase().includes(cari.toLowerCase()) ||
      u.nomor_induk.toLowerCase().includes(cari.toLowerCase()) ||
      u.email.toLowerCase().includes(cari.toLowerCase());
    const cocokStatus =
      filterAktif === "semua" || (filterAktif === "aktif" ? u.aktif : !u.aktif);
    return cocokCari && cocokStatus;
  });

  function mulaiNonaktif(user: BarisUser) {
    if (user.role === "guru" && user.wali_kelas && user.aktif && guruWaliAktif.length >= 1 && guruWaliAktif.some((u) => u.id === user.id)) {
      if (guruWaliAktif.length <= 1) {
        setPesan({ jenis: "galat", teks: MSG_GURU_WALI_AKTIF });
        return;
      }
    }
    setKonfirmasiId(user.id);
  }

  function konfirmasiNonaktif(user: BarisUser) {
    if (konfirmasiId !== user.id) return;
    if (user.wali_kelas && user.aktif) {
      const guruLain = users.filter((u) => u.role === "guru" && u.wali_kelas && u.aktif && u.id !== user.id);
      if (guruWaliAktif.some((u) => u.id === user.id) && guruLain.length === 0 && daftar.filter((u) => u.wali_kelas && u.aktif).length <= 1) {
        setPesan({ jenis: "galat", teks: MSG_GURU_WALI_AKTIF });
        setKonfirmasiId(null);
        return;
      }
    }
    user.aktif = !user.aktif;
    setPesan({
      jenis: "sukses",
      teks: user.aktif ? `${user.nama} diaktifkan.` : `${user.nama} dinonaktifkan.`,
    });
    setKonfirmasiId(null);
  }

  function bukaForm() {
    setForm(FORM_GURU_KOSONG);
    setGalat({});
    setModus("tambah");
  }

  function editUser(user: BarisUser) {
    setForm({
      nip_id: user.nomor_induk,
      nama: user.nama,
      email: user.email,
      kontak: user.kontak ?? "",
      mata_pelajaran: user.mata_pelajaran ?? "",
      wali_kelas: user.wali_kelas ?? false,
      aktif: user.aktif,
      foto_path: user.foto_path,
    });
    setGalat({});
    setModus("ubah");
  }

  function validasi(userEdit?: BarisUser): GalatGuru {
    const g: GalatGuru = {};

    if (!form.nip_id || !polaNip.test(form.nip_id)) {
      g.nip_id = MSG_NIP;
    } else if (modus === "tambah" || (userEdit && form.nip_id !== userEdit.nomor_induk)) {
      const ada = users.find((u) => u.nomor_induk === form.nip_id && u.role === "guru");
      if (ada) g.nip_id = MSG_NIP_GANDA;
    }

    if (!form.nama || form.nama.trim().length < 3 || form.nama.trim().length > 100) {
      g.nama = "Nama wajib diisi, 3–100 karakter.";
    }
    if (!form.email || !polaEmail.test(form.email)) {
      g.email = MSG_EMAIL;
    } else if (modus === "tambah" || (userEdit && form.email.toLowerCase() !== userEdit.email)) {
      const ada = users.find((u) => u.email === form.email.toLowerCase());
      if (ada) g.email = MSG_EMAIL_GANDA;
    }
    if (form.kontak && !polaTelepon.test(form.kontak.trim())) {
      g.kontak = MSG_KONTAK;
    }
    if (!form.mata_pelajaran || form.mata_pelajaran.trim().length < 2 || form.mata_pelajaran.trim().length > 100) {
      g.mata_pelajaran = MSG_MATA_PELAJARAN;
    }

    return g;
  }

  function simpanHandler() {
    let userEdit: BarisUser | undefined;
    if (modus === "ubah") {
      userEdit = users.find((u) => u.role === "guru" && u.email === form.email && u.nomor_induk === form.nip_id) ?? undefined;
    }

    const g = validasi(userEdit);
    setGalat(g);
    if (Object.keys(g).length > 0) return;

    if (modus === "tambah") {
      const idBaru = `u-guru-${Date.now().toString(36).slice(-6)}`;
      users.push({
        id: idBaru,
        email: form.email.toLowerCase(),
        role: "guru",
        nomor_induk: form.nip_id.trim(),
        nama: form.nama.trim(),
        kontak: form.kontak.trim() || null,
        foto_path: form.foto_path,
        aktif: form.aktif,
        wajib_absen: true,
        mata_pelajaran: form.mata_pelajaran.trim(),
        wali_kelas: form.wali_kelas,
      });
      setPesan({ jenis: "sukses", teks: `Guru ${form.nama} ditambahkan.` });
    } else if (modus === "ubah" && userEdit) {
      userEdit.nama = form.nama.trim();
      userEdit.kontak = form.kontak.trim() || null;
      userEdit.foto_path = form.foto_path;
      userEdit.mata_pelajaran = form.mata_pelajaran.trim() || null;
      userEdit.wali_kelas = form.wali_kelas;
      userEdit.aktif = form.aktif;
      setPesan({ jenis: "sukses", teks: MSG_TERSIMPAN });
    }

    setModus("daftar");
    setForm(FORM_GURU_KOSONG);
    setGalat({});
  }

  function pilihFoto(berkas: File) {
    if (berkas.type !== "image/jpeg" && berkas.type !== "image/png") {
      setGalat((s) => ({ ...s, nama: "Berkas harus JPG atau PNG." }));
      return;
    }
    if (berkas.size > 1024 * 1024) {
      setGalat((s) => ({ ...s, nama: "Berkas melebihi 1 MB." }));
      return;
    }
    setForm((f) => ({ ...f, foto_path: berkas.name }));
  }

  function renderDaftar() {
    return (
      <div className="tumpak">
        <div className="form-pencarian-filter">
          <Isian
            id="cari-guru"
            label="Cari"
            nilai={cari}
            onChange={(v) => setCari(v)}
            placeholder="Nama, NIP, email"
          />
          <div className="pil-peran">
            {(["semua", "aktif", "nonaktif"] as const).map((f) => (
              <label key={f}>
                <input
                  type="radio"
                  name="filter-status"
                  value={f}
                  checked={filterAktif === f}
                  onChange={() => setFilterAktif(f)}
                />
                <span>{f === "semua" ? "Semua" : f === "aktif" ? "Aktif" : "Nonaktif"}</span>
              </label>
            ))}
          </div>
        </div>

        {daftarTerfilter.length === 0 ? (
          <Kartu>
            <KeadaanKosong
              ikon="pengguna"
              teks="Belum ada data guru."
              aksi={<Tombol label="Tambah" varian="utama" onClick={bukaForm} />}
            />
          </Kartu>
        ) : (
          <Kartu judul={`Guru (${daftarTerfilter.length})`}>
            <ul className="daftar-pengguna">
              {daftarTerfilter.map((user) => {
                const sedangDikonfirmasi = konfirmasiId === user.id;
                const bisaNonaktif = !(user.wali_kelas && user.aktif && guruWaliAktif.filter((u) => u.id !== user.id).length === 0);

                return (
                  <li key={user.id} className="baris-pengguna">
                    <div className="baris-pengguna-info">
                      <strong>{user.nama}</strong>
                      <div className="baris-pengguna-meta">
                        <span className="ket">{user.email}</span>
                        <span className="ket">NIP: {user.nomor_induk}</span>
                        {user.mata_pelajaran ? (
                          <span className="ket">{user.mata_pelajaran}</span>
                        ) : null}
                        {user.wali_kelas ? (
                          <span className="pil pil-penanda">
                            <Ikon nama="kotak-masuk" ukuran={16} label="Wali Kelas" />
                            <span>Wali Kelas</span>
                          </span>
                        ) : null}
                        {user.aktif ? (
                          <Lencana status="hadir" />
                        ) : (
                          <Lencana status="alpa" />
                        )}
                      </div>
                    </div>
                    <div className="baris-pengguna-aksi">
                      <Tombol label="Ubah" varian="teks" onClick={() => editUser(user)} />
                      {sedangDikonfirmasi ? (
                        <span className="satuan">
                          <Tombol
                            label={user.aktif ? "Nonaktifkan" : "Aktifkan"}
                            varian="bahaya"
                            onClick={() => konfirmasiNonaktif(user)}
                          />
                          <Tombol label="Batal" varian="teks" onClick={() => setKonfirmasiId(null)} />
                        </span>
                      ) : (
                        <Tombol
                          label={user.aktif ? "Nonaktifkan" : "Aktifkan"}
                          varian={user.aktif ? "bahaya" : "sekunder"}
                          nonaktif={!bisaNonaktif}
                          onClick={() => mulaiNonaktif(user)}
                        />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Kartu>
        )}
      </div>
    );
  }

  function renderForm() {
    const labelTombol = modus === "tambah" ? "Simpan" : "Simpan";

    return (
      <Kartu judul={modus === "tambah" ? "Tambah" : "Ubah"} subjudul="Guru">
        <div className="tumpak-rapat">
          <Isian
            id="nip-guru"
            label="NIP"
            nilai={form.nip_id}
            onChange={(v) => setForm((f) => ({ ...f, nip_id: v }))}
            galat={galat.nip_id}
            nonaktif={modus === "ubah"}
          />

          <Isian
            id="nama-guru"
            label="Nama"
            nilai={form.nama}
            onChange={(v) => setForm((f) => ({ ...f, nama: v }))}
            galat={galat.nama}
            placeholder="Nama lengkap"
          />

          <Isian
            id="email-guru"
            label="Email"
            tipe="email"
            nilai={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
            galat={galat.email}
            nonaktif={modus === "ubah"}
            placeholder="nama@akademik.sch.id"
          />

          <Isian
            id="kontak-guru"
            label="Kontak"
            nilai={form.kontak}
            onChange={(v) => setForm((f) => ({ ...f, kontak: v }))}
            galat={galat.kontak}
            placeholder="Opsional"
            bantuan="Angka 8–15 digit, boleh diawali +."
          />

          <Isian
            id="mata-pelajaran"
            label="Mata Pelajaran"
            nilai={form.mata_pelajaran}
            onChange={(v) => setForm((f) => ({ ...f, mata_pelajaran: v }))}
            galat={galat.mata_pelajaran}
            placeholder="Contoh: Matematika"
          />

          <label className="satuan">
            <span className="isian-label">Wali Kelas</span>
            <div className="pil-peran">
              <label>
                <input
                  type="radio"
                  name="wali_kelas"
                  value="true"
                  checked={form.wali_kelas === true}
                  onChange={() => setForm((f) => ({ ...f, wali_kelas: true }))}
                />
                <span>Ya</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="wali_kelas"
                  value="false"
                  checked={form.wali_kelas === false}
                  onChange={() => setForm((f) => ({ ...f, wali_kelas: false }))}
                />
                <span>Tidak</span>
              </label>
            </div>
          </label>

          <Unggah
            id="foto-guru"
            label="Foto"
            terima=".jpg,.png"
            keterangan="JPG/PNG · maks 1 MB"
            namaBerkas={form.foto_path}
            onPilih={pilihFoto}
          />

          <label className="satuan">
            <span className="isian-label">Status</span>
            <div className="pil-peran">
              <label>
                <input
                  type="radio"
                  name="aktif"
                  value="true"
                  checked={form.aktif === true}
                  onChange={() => setForm((f) => ({ ...f, aktif: true }))}
                />
                <span>Aktif</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="aktif"
                  value="false"
                  checked={form.aktif === false}
                  onChange={() => setForm((f) => ({ ...f, aktif: false }))}
                />
                <span>Nonaktif</span>
              </label>
            </div>
          </label>
        </div>

        <div className="tumpak-rapat">
          <Tombol label={labelTombol} varian="utama" lebar onClick={simpanHandler} />
          <Tombol label="Batal" varian="teks" lebar onClick={() => { setModus("daftar"); setForm(FORM_GURU_KOSONG); setGalat({}); }} />
        </div>
      </Kartu>
    );
  }

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

      {pesan ? <Pesan jenis={pesan.jenis} teks={pesan.teks} onTutup={() => setPesan(null)} /> : null}

      <Kartu>
        <div className="tumpuk-rapat">
          {modus === "daftar" && (
            <div className="rata-tengah">
              <Tombol label="Tambah" varian="utama" muatan={<Ikon nama="tambah" ukuran={20} />} onClick={bukaForm} />
            </div>
          )}
          {modus === "daftar" ? renderDaftar() : renderForm()}
        </div>
      </Kartu>

      <NavigasiPeran role="admin" aktif="master-data" />
    </main>
  );
}

type GalatSiswa = {
  nisn?: string;
  nama?: string;
  email?: string;
  kontak_wali?: string;
  kelas_id?: string;
  jenis_kelamin?: string;
};

type FormSiswa = {
  nisn: string;
  nama: string;
  email: string;
  kontak_wali: string;
  kelas_id: string;
  jenis_kelamin: "L" | "P";
  aktif: boolean;
  foto_path: string | null;
};

const FORM_SISWA_KOSONG: FormSiswa = {
  nisn: "",
  nama: "",
  email: "",
  kontak_wali: "",
  kelas_id: "",
  jenis_kelamin: "L",
  aktif: true,
  foto_path: null,
};

const MSG_NISN = "NISN wajib diisi, 5–30 karakter, huruf/angka tanpa spasi.";
const MSG_NISN_GANDA = "NISN sudah dipakai akun lain.";
const MSG_KELAS_WAJIB = "Pilih kelas.";
const MSG_JENIS_KELAMIN_WAJIB = "Pilih jenis kelamin.";
const MSG_KONTAK_WALI = "Kontak wali berupa angka 8–15 digit, boleh diawali +.";
const MSG_NAMA_SISWA = "Nama wajib diisi, 3–100 karakter.";

function ManajemenSiswa({ sesi: _sesi }: { sesi: Sesi }) {
  void _sesi;
  const router = useRouter();

  const daftarSiswa = users.filter((u) => u.role === "siswa");
  const daftarKelas = kelas;

  const [modus, setModus] = useState<"daftar" | "tambah" | "ubah">("daftar");
  const [form, setForm] = useState<FormSiswa>(FORM_SISWA_KOSONG);
  const [galat, setGalat] = useState<GalatSiswa>({});
  const [pesan, setPesan] = useState<{ jenis: "sukses" | "galat" | "info"; teks: string } | null>(null);
  const [konfirmasiId, setKonfirmasiId] = useState<string | null>(null);
  const [cari, setCari] = useState("");
  const [filterAktif, setFilterAktif] = useState<"semua" | "aktif" | "nonaktif">("semua");
  const [filterKelas, setFilterKelas] = useState("");

  const daftarTerfilter = daftarSiswa.filter((u) => {
    const dataSiswa = siswa.find((s) => s.user_id === u.id);
    const cocokCari =
      cari.trim() === "" ||
      u.nama.toLowerCase().includes(cari.toLowerCase()) ||
      u.nomor_induk.toLowerCase().includes(cari.toLowerCase()) ||
      u.email.toLowerCase().includes(cari.toLowerCase());
    const cocokStatus =
      filterAktif === "semua" || (filterAktif === "aktif" ? u.aktif : !u.aktif);
    const cocokKelas =
      filterKelas === "" || (dataSiswa ? dataSiswa.kelas_id === filterKelas : false);
    return cocokCari && cocokStatus && cocokKelas;
  });

  function mulaiNonaktif(user: BarisUser) {
    setKonfirmasiId(user.id);
  }

  function konfirmasiNonaktif(user: BarisUser) {
    if (konfirmasiId !== user.id) return;
    user.aktif = !user.aktif;
    setPesan({
      jenis: "sukses",
      teks: user.aktif ? `${user.nama} diaktifkan.` : `${user.nama} dinonaktifkan.`,
    });
    setKonfirmasiId(null);
  }

  function bukaForm() {
    setForm(FORM_SISWA_KOSONG);
    setGalat({});
    setModus("tambah");
  }

  function editUser(user: BarisUser) {
    const dataSiswa = siswa.find((s) => s.user_id === user.id);
    setForm({
      nisn: user.nomor_induk,
      nama: user.nama,
      email: user.email,
      kontak_wali: dataSiswa?.kontak_wali ?? "",
      kelas_id: dataSiswa?.kelas_id ?? "",
      jenis_kelamin: dataSiswa?.jenis_kelamin ?? "L",
      aktif: user.aktif,
      foto_path: user.foto_path,
    });
    setGalat({});
    setModus("ubah");
  }

  function validasi(userEdit?: BarisUser): GalatSiswa {
    const g: GalatSiswa = {};

    if (!form.nisn || !polaNip.test(form.nisn)) {
      g.nisn = MSG_NISN;
    } else if (modus === "tambah" || (userEdit && form.nisn !== userEdit.nomor_induk)) {
      const ada = users.find((u) => u.nomor_induk === form.nisn);
      if (ada) g.nisn = MSG_NISN_GANDA;
    }

    if (!form.nama || form.nama.trim().length < 3 || form.nama.trim().length > 100) {
      g.nama = MSG_NAMA_SISWA;
    }
    if (!form.email || !polaEmail.test(form.email)) {
      g.email = MSG_EMAIL;
    } else if (modus === "tambah" || (userEdit && form.email.toLowerCase() !== userEdit.email)) {
      const ada = users.find((u) => u.email === form.email.toLowerCase());
      if (ada) g.email = MSG_EMAIL_GANDA;
    }
    if (form.kontak_wali && !polaTelepon.test(form.kontak_wali.trim())) {
      g.kontak_wali = MSG_KONTAK_WALI;
    }
    if (!form.kelas_id) {
      g.kelas_id = MSG_KELAS_WAJIB;
    }
    if (form.jenis_kelamin !== "L" && form.jenis_kelamin !== "P") {
      g.jenis_kelamin = MSG_JENIS_KELAMIN_WAJIB;
    }

    return g;
  }

  function simpanHandler() {
    let userEdit: BarisUser | undefined;
    if (modus === "ubah") {
      userEdit = users.find((u) => u.role === "siswa" && u.email === form.email && u.nomor_induk === form.nisn) ?? undefined;
    }

    const g = validasi(userEdit);
    setGalat(g);
    if (Object.keys(g).length > 0) return;

    if (modus === "tambah") {
      const idBaru = `u-siswa-${Date.now().toString(36).slice(-6)}`;
      users.push({
        id: idBaru,
        email: form.email.toLowerCase(),
        role: "siswa",
        nomor_induk: form.nisn.trim(),
        nama: form.nama.trim(),
        kontak: null,
        foto_path: form.foto_path,
        aktif: form.aktif,
        wajib_absen: false,
      });
      siswa.push({
        user_id: idBaru,
        kelas_id: form.kelas_id,
        jenis_kelamin: form.jenis_kelamin,
        kontak_wali: form.kontak_wali.trim(),
      });
      setPesan({ jenis: "sukses", teks: `Siswa ${form.nama} ditambahkan.` });
    } else if (modus === "ubah" && userEdit) {
      userEdit.nama = form.nama.trim();
      userEdit.foto_path = form.foto_path;
      userEdit.aktif = form.aktif;

      const dataSiswa = siswa.find((s) => s.user_id === userEdit!.id);
      if (dataSiswa) {
        dataSiswa.kelas_id = form.kelas_id;
        dataSiswa.jenis_kelamin = form.jenis_kelamin;
        dataSiswa.kontak_wali = form.kontak_wali.trim();
      }
      setPesan({ jenis: "sukses", teks: MSG_TERSIMPAN });
    }

    setModus("daftar");
    setForm(FORM_SISWA_KOSONG);
    setGalat({});
  }

  function pilihFoto(berkas: File) {
    if (berkas.type !== "image/jpeg" && berkas.type !== "image/png") {
      setGalat((s) => ({ ...s, nama: "Berkas harus JPG atau PNG." }));
      return;
    }
    if (berkas.size > 1024 * 1024) {
      setGalat((s) => ({ ...s, nama: "Berkas melebihi 1 MB." }));
      return;
    }
    setForm((f) => ({ ...f, foto_path: berkas.name }));
  }

  function renderDaftar() {
    return (
      <div className="tumpak">
        <div className="form-pencarian-filter">
          <Isian
            id="cari-siswa"
            label="Cari"
            nilai={cari}
            onChange={(v) => setCari(v)}
            placeholder="Nama, NISN, email"
          />

          <span className="isian-satuan">
            <label className="isian-label" htmlFor="filter-kelas">
              Kelas
            </label>
            <select
              id="filter-kelas"
              className="isian-bulan"
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
            >
              <option value="">Semua kelas</option>
              {daftarKelas.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>
          </span>

          <div className="pil-peran">
            {(["semua", "aktif", "nonaktif"] as const).map((f) => (
              <label key={f}>
                <input
                  type="radio"
                  name="filter-status"
                  value={f}
                  checked={filterAktif === f}
                  onChange={() => setFilterAktif(f)}
                />
                <span>{f === "semua" ? "Semua" : f === "aktif" ? "Aktif" : "Nonaktif"}</span>
              </label>
            ))}
          </div>
        </div>

        {daftarTerfilter.length === 0 ? (
          <Kartu>
            <KeadaanKosong
              ikon="pengguna"
              teks="Belum ada data siswa."
              aksi={<Tombol label="Tambah" varian="utama" onClick={bukaForm} />}
            />
          </Kartu>
        ) : (
          <Kartu judul={`Siswa (${daftarTerfilter.length})`}>
            <ul className="daftar-pengguna">
              {daftarTerfilter.map((user) => {
                const dataSiswa = siswa.find((s) => s.user_id === user.id);
                const sedangDikonfirmasi = konfirmasiId === user.id;

                return (
                  <li key={user.id} className="baris-pengguna">
                    <div className="baris-pengguna-info">
                      <strong>{user.nama}</strong>
                      <div className="baris-pengguna-meta">
                        <span className="ket">{user.email}</span>
                        <span className="ket">NISN: {user.nomor_induk}</span>
                        {dataSiswa ? (
                          <span className="ket">Kelas: {dataSiswa.kelas_id ? kelas.find((k) => k.id === dataSiswa.kelas_id)?.nama ?? dataSiswa.kelas_id : "-"}</span>
                        ) : null}
                        {user.aktif ? (
                          <Lencana status="hadir" />
                        ) : (
                          <Lencana status="alpa" />
                        )}
                      </div>
                    </div>
                    <div className="baris-pengguna-aksi">
                      <Tombol
                        label="Cetak QR"
                        varian="teks"
                        muatan={<Ikon nama="cetak" ukuran={16} />}
                        onClick={() => setPesan({ jenis: "info", teks: "Cetak Kartu QR sedang dikembangkan." })}
                      />
                      <Tombol label="Ubah" varian="teks" onClick={() => editUser(user)} />
                      {sedangDikonfirmasi ? (
                        <span className="satuan">
                          <Tombol
                            label={user.aktif ? "Nonaktifkan" : "Aktifkan"}
                            varian="bahaya"
                            onClick={() => konfirmasiNonaktif(user)}
                          />
                          <Tombol label="Batal" varian="teks" onClick={() => setKonfirmasiId(null)} />
                        </span>
                      ) : (
                        <Tombol
                          label={user.aktif ? "Nonaktifkan" : "Aktifkan"}
                          varian={user.aktif ? "bahaya" : "sekunder"}
                          onClick={() => mulaiNonaktif(user)}
                        />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Kartu>
        )}

        {modus === "tambah" && (
          <Tombol label="Tambah" varian="utama" muatan={<Ikon nama="tambah" ukuran={20} />} onClick={bukaForm} />
        )}
      </div>
    );
  }

  function renderForm() {
    const labelTombol = modus === "tambah" ? "Simpan" : "Simpan";

    return (
      <Kartu judul={modus === "tambah" ? "Tambah" : "Ubah"} subjudul="Siswa">
        <div className="tumpak-rapat">
          <Isian
            id="nisn"
            label="NISN"
            nilai={form.nisn}
            onChange={(v) => setForm((f) => ({ ...f, nisn: v }))}
            galat={galat.nisn}
            nonaktif={modus === "ubah"}
          />

          <Isian
            id="nama-siswa"
            label="Nama"
            nilai={form.nama}
            onChange={(v) => setForm((f) => ({ ...f, nama: v }))}
            galat={galat.nama}
            placeholder="Nama lengkap"
          />

          <Isian
            id="email-siswa"
            label="Email"
            tipe="email"
            nilai={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
            galat={galat.email}
            nonaktif={modus === "ubah"}
            placeholder="nama@akademik.sch.id"
          />

          <span className="isian-satuan">
            <label className="isian-label" htmlFor="kelas-siswa">
              Kelas
            </label>
            <select
              id="kelas-siswa"
              className="isian-bulan"
              value={form.kelas_id}
              onChange={(e) => setForm((f) => ({ ...f, kelas_id: e.target.value }))}
            >
              <option value="">Pilih kelas</option>
              {daftarKelas.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>
          </span>
          {galat.kelas_id ? (
            <span className="isian-keterangan isian-galat">
              <Ikon nama="silang" ukuran={16} />
              <span>{galat.kelas_id}</span>
            </span>
          ) : null}

          <label className="satuan">
            <span className="isian-label">Jenis Kelamin</span>
            <div className="pil-peran">
              <label>
                <input
                  type="radio"
                  name="jenis_kelamin"
                  value="L"
                  checked={form.jenis_kelamin === "L"}
                  onChange={() => setForm((f) => ({ ...f, jenis_kelamin: "L" }))}
                />
                <span>Laki-laki</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="jenis_kelamin"
                  value="P"
                  checked={form.jenis_kelamin === "P"}
                  onChange={() => setForm((f) => ({ ...f, jenis_kelamin: "P" }))}
                />
                <span>Perempuan</span>
              </label>
            </div>
          </label>
          {galat.jenis_kelamin ? (
            <span className="isian-keterangan isian-galat">
              <Ikon nama="silang" ukuran={16} />
              <span>{galat.jenis_kelamin}</span>
            </span>
          ) : null}

          <Isian
            id="kontak-wali"
            label="Kontak Wali"
            nilai={form.kontak_wali}
            onChange={(v) => setForm((f) => ({ ...f, kontak_wali: v }))}
            galat={galat.kontak_wali}
            placeholder="Opsional"
            bantuan="Angka 8–15 digit, boleh diawali +."
          />

          <Unggah
            id="foto-siswa"
            label="Foto"
            terima=".jpg,.png"
            keterangan="JPG/PNG · maks 1 MB"
            namaBerkas={form.foto_path}
            onPilih={pilihFoto}
          />

          <label className="satuan">
            <span className="isian-label">Status</span>
            <div className="pil-peran">
              <label>
                <input
                  type="radio"
                  name="aktif"
                  value="true"
                  checked={form.aktif === true}
                  onChange={() => setForm((f) => ({ ...f, aktif: true }))}
                />
                <span>Aktif</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="aktif"
                  value="false"
                  checked={form.aktif === false}
                  onChange={() => setForm((f) => ({ ...f, aktif: false }))}
                />
                <span>Nonaktif</span>
              </label>
            </div>
          </label>
        </div>

        <div className="tumpak-rapat">
          <Tombol label={labelTombol} varian="utama" lebar onClick={simpanHandler} />
          <Tombol label="Batal" varian="teks" lebar onClick={() => { setModus("daftar"); setForm(FORM_SISWA_KOSONG); setGalat({}); }} />
        </div>
      </Kartu>
    );
  }

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

      {pesan ? <Pesan jenis={pesan.jenis} teks={pesan.teks} onTutup={() => setPesan(null)} /> : null}

      <Kartu>
        <div className="tumpak-rapat">
          {modus === "daftar" ? renderDaftar() : renderForm()}
        </div>
      </Kartu>

      <NavigasiPeran role="admin" aktif="master-data" />
    </main>
  );
}

type GalatKelas = {
  nama?: string;
  tahun_ajaran?: string;
  wali_user_id?: string;
};

type FormKelas = {
  nama: string;
  tahun_ajaran: string;
  wali_user_id: string;
};

const FORM_KELAS_KOSONG: FormKelas = {
  nama: "",
  tahun_ajaran: "",
  wali_user_id: "",
};

type PemetaanKelas = { nama: string; wali_user_id: string };

const MSG_NAMA_KELAS = "Nama kelas wajib diisi, 3–100 karakter.";
const MSG_WALI_KELAS_WAJIB = "Pilih wali kelas.";
const MSG_KELAS_DUPLIKAT = "Kelas dengan nama dan tahun ajaran yang sama sudah ada.";
const MSG_WALI_TERPAKAI = "Guru ini sudah menjadi wali kelas kelas lain pada tahun ajaran yang sama.";
const MSG_TAHUN_AJARAN_BARU = "Tahun ajaran baru wajib diisi, format YYYY/YYYY, mis. 2027/2028.";

function ManajemenKelas({ sesi: _sesi }: { sesi: Sesi }) {
  void _sesi;
  const router = useRouter();

  const [modus, setModus] = useState<"daftar" | "tambah" | "ubah">("daftar");
  const [form, setForm] = useState<FormKelas>(FORM_KELAS_KOSONG);
  const [galat, setGalat] = useState<GalatKelas>({});
  const [pesan, setPesan] = useState<{ jenis: "sukses" | "galat" | "info"; teks: string } | null>(
    null,
  );
  const [kelasEditId, setKelasEditId] = useState<string | null>(null);
  const [cari, setCari] = useState("");

  const [wizardAktif, setWizardAktif] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [tahunAjaranBaru, setTahunAjaranBaru] = useState("");
  const [galatWizard, setGalatWizard] = useState<string | null>(null);
  const [pemetaan, setPemetaan] = useState<Record<string, PemetaanKelas | "lulus">>({});
  const [showConfirm, setShowConfirm] = useState(false);

  const guruWaliAktif = users.filter(
    (u) => u.role === "guru" && u.wali_kelas === true && u.aktif,
  );

  const daftarTerfilter = kelas.filter((k) => {
    const cocokCari =
      cari.trim() === "" ||
      k.nama.toLowerCase().includes(cari.toLowerCase()) ||
      k.tahun_ajaran.toLowerCase().includes(cari.toLowerCase());
    return cocokCari;
  });

  function namaGuru(userId: string | null): string {
    if (!userId) return "-";
    const u = users.find((usr) => usr.id === userId);
    return u ? u.nama : "-";
  }

  function jumlahSiswa(kelasId: string): number {
    return siswa.filter((s) => s.kelas_id === kelasId).length;
  }

  function bukaForm() {
    setForm(FORM_KELAS_KOSONG);
    setGalat({});
    setKelasEditId(null);
    setModus("tambah");
  }

  function editKelas(k: BarisKelas) {
    setForm({
      nama: k.nama,
      tahun_ajaran: k.tahun_ajaran,
      wali_user_id: k.wali_user_id ?? "",
    });
    setKelasEditId(k.id);
    setGalat({});
    setModus("ubah");
  }

  function validasi(): GalatKelas {
    const g: GalatKelas = {};

    if (!form.nama || form.nama.trim().length < 3 || form.nama.trim().length > 100) {
      g.nama = MSG_NAMA_KELAS;
    }
    if (!form.tahun_ajaran || !polaTahunAjaran.test(form.tahun_ajaran)) {
      g.tahun_ajaran = MSG_TERBUKA;
    }
    if (!form.wali_user_id) {
      g.wali_user_id = MSG_WALI_KELAS_WAJIB;
    } else {
      const waliSama = kelas.find(
        (kk) =>
          kk.tahun_ajaran === form.tahun_ajaran &&
          kk.wali_user_id === form.wali_user_id &&
          kk.id !== kelasEditId,
      );
      if (waliSama) {
        g.wali_user_id = MSG_WALI_TERPAKAI;
      }
    }

    const duplikat = kelas.find(
      (kk) =>
        kk.nama === form.nama.trim() &&
        kk.tahun_ajaran === form.tahun_ajaran &&
        kk.id !== kelasEditId,
    );
    if (duplikat) {
      g.nama = MSG_KELAS_DUPLIKAT;
    }

    return g;
  }

  function simpanHandler() {
    const g = validasi();
    setGalat(g);
    if (Object.keys(g).length > 0) return;

    if (modus === "tambah") {
      const idBaru = `k-${Date.now().toString(36).slice(-6)}`;
      kelas.push({
        id: idBaru,
        nama: form.nama.trim(),
        tahun_ajaran: form.tahun_ajaran,
        wali_user_id: form.wali_user_id || null,
      });
      setPesan({ jenis: "sukses", teks: `Kelas ${form.nama} ditambahkan.` });
    } else if (modus === "ubah" && kelasEditId) {
      const idx = kelas.findIndex((k) => k.id === kelasEditId);
      if (idx >= 0) {
        kelas[idx].nama = form.nama.trim();
        kelas[idx].tahun_ajaran = form.tahun_ajaran;
        kelas[idx].wali_user_id = form.wali_user_id || null;
      }
      setPesan({ jenis: "sukses", teks: MSG_TERSIMPAN });
    }

    setModus("daftar");
    setForm(FORM_KELAS_KOSONG);
    setGalat({});
    setKelasEditId(null);
  }

  function bukaWizard() {
    setWizardAktif(true);
    setWizardStep(1);
    setTahunAjaranBaru("");
    setGalatWizard(null);
    setPemetaan({});
    setShowConfirm(false);
  }

  function wizardLanjut1() {
    if (!tahunAjaranBaru || !polaTahunAjaran.test(tahunAjaranBaru)) {
      setGalatWizard(MSG_TAHUN_AJARAN_BARU);
      return;
    }
    setGalatWizard(null);
    const map: Record<string, PemetaanKelas | "lulus"> = {};
    kelas.forEach((k) => {
      map[k.id] = {
        nama: k.nama,
        wali_user_id: k.wali_user_id ?? "",
      };
    });
    setPemetaan(map);
    setWizardStep(2);
  }

  function waliTersediaUntuk(sourceId: string): BarisUser[] {
    const terpakai = new Set<string>();
    Object.entries(pemetaan).forEach(([id, p]) => {
      if (id !== sourceId && p !== "lulus" && (p as PemetaanKelas).wali_user_id) {
        terpakai.add((p as PemetaanKelas).wali_user_id);
      }
    });
    return guruWaliAktif.filter((u) => !terpakai.has(u.id));
  }

  function validasiPemetaan(): string | null {
    for (const [id, p] of Object.entries(pemetaan)) {
      if (p === "lulus") continue;
      const sumber = kelas.find((k) => k.id === id);
      const label = sumber ? sumber.nama : id;
      if (!p.nama || p.nama.trim().length < 3 || p.nama.trim().length > 100) {
        return `Nama kelas tidak valid untuk ${label}.`;
      }
      if (!p.wali_user_id) {
        return `Wali kelas wajib dipilih untuk ${label}.`;
      }
    }
    const namaList = Object.entries(pemetaan)
      .filter(([, p]) => p !== "lulus")
      .map(([, p]) => (p as PemetaanKelas).nama.trim());
    if (new Set(namaList).size !== namaList.length) {
      return "Nama kelas tidak boleh duplikat dalam tahun ajaran baru.";
    }
    return null;
  }

  function wizardLanjut2() {
    const err = validasiPemetaan();
    if (err) {
      setGalatWizard(err);
      return;
    }
    setGalatWizard(null);
    setWizardStep(3);
  }

  function wizardKembali() {
    if (wizardStep > 1) {
      setWizardStep((s) => (s - 1) as 1 | 2 | 3);
    }
  }

  function wizardBatal() {
    setWizardAktif(false);
    setWizardStep(1);
    setTahunAjaranBaru("");
    setGalatWizard(null);
    setPemetaan({});
    setShowConfirm(false);
  }

  function hitungRingkasan(): { pindah: number; lulus: number } {
    let pindah = 0;
    let lulus = 0;
    kelas.forEach((k) => {
      const jumlah = jumlahSiswa(k.id);
      const p = pemetaan[k.id];
      if (p === "lulus") {
        lulus += jumlah;
      } else {
        pindah += jumlah;
      }
    });
    return { pindah, lulus };
  }

  function konfirmasiTerapkan() {
    const ringkasan = hitungRingkasan();
    let counter = 0;
    kelas.forEach((k) => {
      const p = pemetaan[k.id];
      if (p !== "lulus") {
        const idBaru = `k-${Date.now().toString(36).slice(-6)}-${counter}`;
        counter++;
        kelas.push({
          id: idBaru,
          nama: p.nama,
          tahun_ajaran: tahunAjaranBaru,
          wali_user_id: p.wali_user_id || null,
        });
        siswa.forEach((s) => {
          if (s.kelas_id === k.id) {
            s.kelas_id = idBaru;
          }
        });
      } else {
        siswa.forEach((s) => {
          if (s.kelas_id === k.id) {
            const u = users.find((usr) => usr.id === s.user_id);
            if (u) u.aktif = false;
          }
        });
      }
    });
    if (lembaga[0]) {
      lembaga[0].tahun_ajaran_aktif = tahunAjaranBaru;
    }
    setPesan({
      jenis: "sukses",
      teks: `Kenaikan kelas diterapkan. ${ringkasan.pindah} siswa pindah, ${ringkasan.lulus} siswa lulus.`,
    });
    setWizardAktif(false);
    setWizardStep(1);
    setTahunAjaranBaru("");
    setPemetaan({});
    setShowConfirm(false);
  }

  function renderDaftar() {
    return (
      <div className="tumpak">
        <div className="form-pencarian-filter">
          <Isian
            id="cari-kelas"
            label="Cari"
            nilai={cari}
            onChange={(v) => setCari(v)}
            placeholder="Nama, tahun ajaran"
          />
        </div>

        {daftarTerfilter.length === 0 ? (
          <Kartu>
            <KeadaanKosong
              ikon="info"
              teks="Belum ada data kelas."
              aksi={<Tombol label="Tambah" varian="utama" onClick={bukaForm} />}
            />
          </Kartu>
        ) : (
          <Kartu judul={`Kelas (${daftarTerfilter.length})`}>
            <ul className="daftar-pengguna">
              {daftarTerfilter.map((k) => (
                <li key={k.id} className="baris-pengguna">
                  <div className="baris-pengguna-info">
                    <strong>{k.nama}</strong>
                    <div className="baris-pengguna-meta">
                      <span className="ket">{k.tahun_ajaran}</span>
                      <span className="ket">Wali: {namaGuru(k.wali_user_id)}</span>
                      <span className="ket">{jumlahSiswa(k.id)} siswa</span>
                    </div>
                  </div>
                  <div className="baris-pengguna-aksi">
                    <Tombol label="Ubah" varian="teks" onClick={() => editKelas(k)} />
                  </div>
                </li>
              ))}
            </ul>
          </Kartu>
        )}

        <div className="rata-tengah">
          <Tombol
            label="Mulai Kenaikan Kelas"
            varian="utama"
            muatan={<Ikon nama="jam" ukuran={20} />}
            onClick={bukaWizard}
          />
        </div>
      </div>
    );
  }

  function renderForm() {
    return (
      <Kartu judul={modus === "tambah" ? "Tambah" : "Ubah"} subjudul="Kelas">
        <div className="tumpak-rapat">
          <Isian
            id="nama-kelas"
            label="Nama"
            nilai={form.nama}
            onChange={(v) => setForm((f) => ({ ...f, nama: v }))}
            galat={galat.nama}
            placeholder="Contoh: VII-A"
          />

          <Isian
            id="tahun-ajaran-kelas"
            label="Tahun Ajaran"
            nilai={form.tahun_ajaran}
            onChange={(v) => setForm((f) => ({ ...f, tahun_ajaran: v }))}
            galat={galat.tahun_ajaran}
            placeholder="YYYY/YYYY"
            bantuan='Format: 2026/2027'
          />

          <span className="isian-satuan">
            <label className="isian-label" htmlFor="wali-kelas">
              Wali Kelas
            </label>
            <select
              id="wali-kelas"
              className="isian-bulan"
              value={form.wali_user_id}
              onChange={(e) => setForm((f) => ({ ...f, wali_user_id: e.target.value }))}
            >
              <option value="">Pilih guru wali kelas</option>
              {guruWaliAktif.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nama}
                </option>
              ))}
            </select>
          </span>
          {galat.wali_user_id ? (
            <span className="isian-keterangan isian-galat">
              <Ikon nama="silang" ukuran={16} />
              <span>{galat.wali_user_id}</span>
            </span>
          ) : null}
        </div>

        <div className="tumpak-rapat">
          <Tombol label="Simpan" varian="utama" lebar onClick={simpanHandler} />
          <Tombol
            label="Batal"
            varian="teks"
            lebar
            onClick={() => {
              setModus("daftar");
              setForm(FORM_KELAS_KOSONG);
              setGalat({});
              setKelasEditId(null);
            }}
          />
        </div>
      </Kartu>
    );
  }

  function renderWizard() {
    const ringkasan = hitungRingkasan();

    return (
      <div className="tumpak">
        <div className="wizard-langkah">
          <span className={wizardStep >= 1 ? "wizard-langkah-item aktif" : "wizard-langkah-item"}>
            1 Tahun Ajaran Baru
          </span>
          <span className={wizardStep >= 2 ? "wizard-langkah-item aktif" : "wizard-langkah-item"}>
            2 Pemetaan
          </span>
          <span className={wizardStep >= 3 ? "wizard-langkah-item aktif" : "wizard-langkah-item"}>
            3 Pratinjau
          </span>
        </div>

        {wizardStep === 1 && (
          <Kartu judul="Tahun Ajaran Baru">
            <div className="tumpak-rapat">
              <Isian
                id="tahun-ajaran-baru"
                label="Tahun Ajaran Baru"
                nilai={tahunAjaranBaru}
                onChange={(v) => setTahunAjaranBaru(v)}
                galat={galatWizard ?? undefined}
                placeholder="YYYY/YYYY"
                bantuan="Contoh: 2027/2028. Sistem akan menyiapkan salinan daftar kelas."
              />
              <div className="tumpak-rapat">
                <Tombol label="Batal" varian="teks" lebar onClick={wizardBatal} />
                <Tombol label="Lanjut" varian="utama" lebar onClick={wizardLanjut1} />
              </div>
            </div>
          </Kartu>
        )}

        {wizardStep === 2 && (
          <Kartu judul="Pemetaan Kelas">
            <div className="tumpak">
              <div className="tumpak">
                {kelas.map((k) => {
                  const p = pemetaan[k.id];
                  const lulus = p === "lulus";
                  const target = (p !== "lulus" ? p : null) as PemetaanKelas | null;
                  const namaTarget = target ? target.nama : k.nama;
                  const waliTarget = target ? target.wali_user_id : k.wali_user_id ?? "";
                  const walis = waliTersediaUntuk(k.id);

                  return (
                    <div key={k.id} className="pemetaan-baris">
                      <div className="pemetaan-sumber">
                        <strong>{k.nama}</strong>
                        <span className="ket">{k.tahun_ajaran}</span>
                        <span className="ket">Wali: {namaGuru(k.wali_user_id)}</span>
                        <span className="ket">{jumlahSiswa(k.id)} siswa</span>
                      </div>
                      <div className="pemetaan-target">
                        <label className="satuan">
                          <span className="isian-label">Pilih</span>
                          <div className="pil-peran">
                            <label>
                              <input
                                type="radio"
                                name={`mode-${k.id}`}
                                value="lanjut"
                                checked={!lulus}
                                onChange={() =>
                                  setPemetaan((prev) => ({
                                    ...prev,
                                    [k.id]: {
                                      nama: target ? target.nama : k.nama,
                                      wali_user_id: target ? target.wali_user_id : k.wali_user_id ?? "",
                                    },
                                  }))
                                }
                              />
                              <span>Teruskan ke kelas baru</span>
                            </label>
                            <label>
                              <input
                                type="radio"
                                name={`mode-${k.id}`}
                                value="lulus"
                                checked={lulus}
                                onChange={() =>
                                  setPemetaan((prev) => ({
                                    ...prev,
                                    [k.id]: "lulus",
                                  }))
                                }
                              />
                              <span>Lulus</span>
                            </label>
                          </div>
                        </label>

                        {!lulus && (
                          <div className="tumpak-rapat">
                            <Isian
                              id={`nama-baru-${k.id}`}
                              label="Nama Baru"
                              nilai={namaTarget}
                              onChange={(v) =>
                                setPemetaan((prev) => ({
                                  ...prev,
                                  [k.id]: { nama: v, wali_user_id: waliTarget },
                                }))
                              }
                              placeholder="Nama kelas"
                            />
                            <span className="isian-satuan">
                              <label className="isian-label" htmlFor={`wali-baru-${k.id}`}>
                                Wali Kelas Baru
                              </label>
                              <select
                                id={`wali-baru-${k.id}`}
                                className="isian-bulan"
                                value={waliTarget}
                                onChange={(e) =>
                                  setPemetaan((prev) => ({
                                    ...prev,
                                    [k.id]: {
                                      nama: namaTarget,
                                      wali_user_id: e.target.value,
                                    },
                                  }))
                                }
                              >
                                <option value="">Pilih guru wali kelas</option>
                                {walis.map((u) => (
                                  <option key={u.id} value={u.id}>
                                    {u.nama}
                                  </option>
                                ))}
                              </select>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {galatWizard ? (
                <span className="isian-keterangan isian-galat">
                  <Ikon nama="silang" ukuran={16} />
                  <span>{galatWizard}</span>
                </span>
              ) : null}

              <div className="tumpak-rapat">
                <Tombol label="Kembali" varian="teks" lebar onClick={wizardKembali} />
                <Tombol label="Lanjut" varian="utama" lebar onClick={wizardLanjut2} />
              </div>
            </div>
          </Kartu>
        )}

        {wizardStep === 3 && (
          <Kartu judul="Pratinjau dan Konfirmasi">
            {!showConfirm ? (
              <div className="tumpak">
                <div className="ringkasan-kenaikan">
                  <div className="ringkasan-box">
                    <span className="ringkasan-nilai">{ringkasan.pindah}</span>
                    <span className="ringkasan-label">Siswa pindah kelas</span>
                  </div>
                  <div className="ringkasan-box">
                    <span className="ringkasan-nilai">{ringkasan.lulus}</span>
                    <span className="ringkasan-label">Siswa lulus</span>
                  </div>
                </div>
                <div className="tumpak-rapat">
                  <Tombol label="Kembali" varian="teks" lebar onClick={wizardKembali} />
                  <Tombol
                    label="Terapkan"
                    varian="utama"
                    lebar
                    onClick={() => setShowConfirm(true)}
                  />
                </div>
              </div>
            ) : (
              <div className="tumpak">
                <p className="konfirmasi-teks">
                  Terapkan kenaikan kelas? {ringkasan.pindah} siswa pindah kelas dan{" "}
                  {ringkasan.lulus} siswa dinyatakan lulus (dinonaktifkan). Riwayat absen tidak
                  berubah.
                </p>
                <div className="tumpak-rapat">
                  <Tombol label="Batal" varian="teks" lebar onClick={() => setShowConfirm(false)} />
                  <Tombol label="Terapkan" varian="utama" lebar onClick={konfirmasiTerapkan} />
                </div>
              </div>
            )}
          </Kartu>
        )}
      </div>
    );
  }

  return (
    <main className="rangka rangka-guru rangka-kelas">
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

      {pesan ? <Pesan jenis={pesan.jenis} teks={pesan.teks} onTutup={() => setPesan(null)} /> : null}

      <Kartu>
        <div className="tumpak-rapat">
          {modus === "daftar" && !wizardAktif && (
            <div className="rata-tengah">
              <Tombol
                label="Tambah"
                varian="utama"
                muatan={<Ikon nama="tambah" ukuran={20} />}
                onClick={bukaForm}
              />
            </div>
          )}
          {modus === "daftar" && !wizardAktif
            ? renderDaftar()
            : modus === "tambah" || modus === "ubah"
              ? renderForm()
              : renderWizard()}
        </div>
      </Kartu>

      <NavigasiPeran role="admin" aktif="master-data" />
    </main>
  );
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

  return <MasterDataApp sesi={sesi} />;
}

function MasterDataApp({ sesi }: { sesi: Sesi }) {
  const [tab, setTab] = useState<TabMasterData>("lembaga");

  return (
    <>
      <div className="tumpak-rapat">
        <nav className="tab-master-data" aria-label="Tab Master Data">
          {DAFTAR_TAB.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? "aktif" : ""}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "lembaga" && <FormulirLembaga sesi={sesi} />}
        {tab === "admin-kepala" && <ManajemenAdminKepala sesi={sesi} />}
        {tab === "guru" && <ManajemenGuru sesi={sesi} />}
        {tab === "siswa" && <ManajemenSiswa sesi={sesi} />}
        {tab === "kelas" && <ManajemenKelas sesi={sesi} />}
      </div>
    </>
  );
}
