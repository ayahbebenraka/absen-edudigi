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
import { lembaga, type BarisLembaga, users, type BarisUser } from "../../data/contoh";
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

function PlaceholderTab({ label }: { label: string }) {
  return (
    <Kartu>
      <KeadaanKosong
        ikon="info"
        teks={`Modul ${label} sedang dikembangkan pada milestone berikutnya.`}
      />
    </Kartu>
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
        {tab === "siswa" && <PlaceholderTab label="Siswa" />}
        {tab === "kelas" && <PlaceholderTab label="Kelas" />}
      </div>
    </>
  );
}
