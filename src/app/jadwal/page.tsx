"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../komponen/Header";
import { BannerInfo } from "../../komponen/BannerInfo";
import { Ikon } from "../../komponen/Ikon";
import { Kartu } from "../../komponen/Kartu";
import { KeadaanKosong } from "../../komponen/KeadaanKosong";
import { Pesan } from "../../komponen/Pesan";
import { Tombol } from "../../komponen/Tombol";
import { NavigasiPeran } from "../../komponen/NavigasiPeran";
import {
  jadwal_default,
  jadwal_override_guru,
  users,
} from "../../data/contoh";
import { ambilSesi, ambilSesiServer, dengarSesi, keluar } from "../../data/sesi";

const MSG_TANPA_HAK_AKSES = "Halaman ini tidak tersedia untuk Anda.";
const MSG_BERLAKU_BESOK = "Perubahan berlaku mulai besok.";
const MSG_JAM_INVALID = "Jam pulang harus setelah jam masuk.";
const MSG_JAM_WAJIB = "Jam masuk dan pulang wajib diisi bila aktif.";
const MSG_TERSIMPAN = "Tersimpan.";

const HARI: { id: number; label: string }[] = [
  { id: 0, label: "Sabtu" },
  { id: 1, label: "Minggu" },
  { id: 2, label: "Senin" },
  { id: 3, label: "Selasa" },
  { id: 4, label: "Rabu" },
  { id: 5, label: "Kamis" },
  { id: 6, label: "Jumat" },
];

type DraftJadwal = {
  aktif: boolean;
  jam_masuk: string;
  jam_pulang: string;
};

type ModeHari = "default" | "override" | "nonaktif";

type DraftOverride = {
  mode: ModeHari;
  jam_masuk: string;
  jam_pulang: string;
};

export default function HalamanJadwal() {
  const router = useRouter();
  const sesi = useSyncExternalStore(dengarSesi, ambilSesi, ambilSesiServer);

  if (sesi === undefined) {
    return (
      <main className="rangka">
        <Kartu>
          <KeadaanKosong ikon="info" teks="Memuat…" />
        </Kartu>
      </main>
    );
  }

  if (sesi === null || (sesi.role !== "admin" && sesi.role !== "kepala")) {
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

  return <JadwalApp role={sesi.role} hanyaLihat={sesi.role === "kepala"} />;
}

function JadwalApp({
  role,
  hanyaLihat,
}: {
  role: "kepala" | "admin";
  hanyaLihat: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"default" | "override">("default");
  const [pesan, setPesan] = useState<{ jenis: "sukses" | "galat" | "info"; teks: string } | null>(
    null,
  );

  return (
    <main className="rangka rangka-guru">
      <Header
        judul="Jadwal"
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

      <div className="tumpak-rapat">
        <nav className="tab-master-data" aria-label="Tab Jadwal">
          <button
            type="button"
            className={tab === "default" ? "aktif" : ""}
            onClick={() => setTab("default")}
          >
            Jadwal Default
          </button>
          <button
            type="button"
            className={tab === "override" ? "aktif" : ""}
            onClick={() => setTab("override")}
          >
            Override Guru
          </button>
        </nav>

        {tab === "default" ? (
          <JadwalDefault
            hanyaLihat={hanyaLihat}
            onChange={() => setPesan(null)}
            onPesan={setPesan}
          />
        ) : (
          <OverrideGuru
            hanyaLihat={hanyaLihat}
            onChange={() => setPesan(null)}
            onPesan={setPesan}
          />
        )}
      </div>

      <NavigasiPeran role={role} aktif="jadwal" />
    </main>
  );
}

function JadwalDefault({
  hanyaLihat,
  onChange,
  onPesan,
}: {
  hanyaLihat: boolean;
  onChange: () => void;
  onPesan: (p: { jenis: "sukses" | "galat" | "info"; teks: string } | null) => void;
}) {
  const [target, setTarget] = useState<"guru" | "siswa">("guru");
  const [draft, setDraft] = useState<Record<number, DraftJadwal>>({});
  const [galat, setGalat] = useState<string | null>(null);

  function loadDraft() {
    const map: Record<number, DraftJadwal> = {};
    HARI.forEach((h) => {
      const d = jadwal_default.find((j) => j.untuk === target && j.hari === h.id);
      map[h.id] = {
        aktif: d?.aktif ?? true,
        jam_masuk: d?.jam_masuk ?? "",
        jam_pulang: d?.jam_pulang ?? "",
      };
    });
    setDraft(map);
  }

  if (Object.keys(draft).length === 0) {
    loadDraft();
  }

  function updateDraft(hari: number, field: "aktif" | "jam_masuk" | "jam_pulang", value: string | boolean) {
    onChange();
    setDraft((prev) => ({
      ...prev,
      [hari]: { ...prev[hari], [field]: value },
    }));
  }

  function simpanHandler() {
    const g: string[] = [];
    HARI.forEach((h) => {
      const d = draft[h.id];
      if (d.aktif) {
        if (!d.jam_masuk || !d.jam_pulang) {
          g.push(`${h.label}: ${MSG_JAM_WAJIB}`);
        } else if (d.jam_pulang <= d.jam_masuk) {
          g.push(`${h.label}: ${MSG_JAM_INVALID}`);
        }
      }
    });

    if (g.length > 0) {
      setGalat(g.join(" "));
      return;
    }

    HARI.forEach((h) => {
      const d = draft[h.id];
      const idx = jadwal_default.findIndex((j) => j.untuk === target && j.hari === h.id);
      if (idx >= 0) {
        jadwal_default[idx].aktif = d.aktif;
        jadwal_default[idx].jam_masuk = d.aktif ? d.jam_masuk : null;
        jadwal_default[idx].jam_pulang = d.aktif ? d.jam_pulang : null;
      }
    });

    setGalat(null);
    onPesan({ jenis: "sukses", teks: MSG_TERSIMPAN });
  }

  return (
    <Kartu judul="Jadwal Default">
      <BannerInfo>{MSG_BERLAKU_BESOK}</BannerInfo>

      <div className="tumpak-rapat">
        <div className="pil-peran">
          <label>
              <input
                type="radio"
                name="target-jadwal"
                value="guru"
                checked={target === "guru"}
                disabled={hanyaLihat}
                onChange={() => {
                  onChange();
                  setTarget("guru");
                  setDraft({});
                }}
              />
            <span>Guru</span>
          </label>
          <label>
              <input
                type="radio"
                name="target-jadwal"
                value="siswa"
                checked={target === "siswa"}
                disabled={hanyaLihat}
                onChange={() => {
                  onChange();
                  setTarget("siswa");
                  setDraft({});
                }}
              />
            <span>Siswa</span>
          </label>
        </div>

        <div className="jadwal-grid">
          <div className="jadwal-grid-header">
            <span>Hari</span>
            <span>Aktif</span>
            <span>Masuk</span>
            <span>Pulang</span>
          </div>
          {HARI.map((h) => {
            const d = draft[h.id];
            return (
              <div key={h.id} className="baris-jadwal">
                <span className="baris-jadwal-label">{h.label}</span>
                <label className="baris-jadwal-aktif">
                  <input
                    type="checkbox"
                    checked={d?.aktif ?? true}
                    disabled={hanyaLihat}
                    onChange={(e) => updateDraft(h.id, "aktif", e.target.checked)}
                  />
                  <span>Aktif</span>
                </label>
                <input
                  type="time"
                  className="isian-waktu"
                  value={d?.jam_masuk ?? ""}
                  disabled={hanyaLihat || !d?.aktif}
                  onChange={(e) => updateDraft(h.id, "jam_masuk", e.target.value)}
                />
                <input
                  type="time"
                  className="isian-waktu"
                  value={d?.jam_pulang ?? ""}
                  disabled={hanyaLihat || !d?.aktif}
                  onChange={(e) => updateDraft(h.id, "jam_pulang", e.target.value)}
                />
              </div>
            );
          })}
        </div>

        {galat ? (
          <span className="isian-keterangan isian-galat">
            <Ikon nama="silang" ukuran={16} />
            <span>{galat}</span>
          </span>
        ) : null}

        {hanyaLihat ? null : (
          <div className="tumpak-rapat">
            <Tombol label="Simpan" varian="utama" lebar onClick={simpanHandler} />
          </div>
        )}
      </div>
    </Kartu>
  );
}

function OverrideGuru({
  hanyaLihat,
  onChange,
  onPesan,
}: {
  hanyaLihat: boolean;
  onChange: () => void;
  onPesan: (p: { jenis: "sukses" | "galat" | "info"; teks: string } | null) => void;
}) {
  const guruAktif = users.filter((u) => u.role === "guru" && u.aktif);
  const [guruPilih, setGuruPilih] = useState<string>(guruAktif[0]?.id ?? "");
  const [draft, setDraft] = useState<Record<number, DraftOverride>>({});
  const [galat, setGalat] = useState<string | null>(null);

  function loadDraft(guruId: string) {
    const map: Record<number, DraftOverride> = {};
    HARI.forEach((h) => {
      const override = jadwal_override_guru.find(
        (j) => j.user_id === guruId && j.hari === h.id,
      );
      if (override) {
        map[h.id] = {
          mode: override.aktif ? "override" : "nonaktif",
          jam_masuk: override.jam_masuk ?? "",
          jam_pulang: override.jam_pulang ?? "",
        };
      } else {
        map[h.id] = { mode: "default", jam_masuk: "", jam_pulang: "" };
      }
    });
    setDraft(map);
  }

  if (Object.keys(draft).length === 0) {
    loadDraft(guruPilih);
  }

  function handleGuruChange(guruId: string) {
    onChange();
    setGuruPilih(guruId);
    setDraft({});
  }

  function updateOverride(hari: number, field: "mode" | "jam_masuk" | "jam_pulang", value: string) {
    onChange();
    setDraft((prev) => ({
      ...prev,
      [hari]: { ...prev[hari], [field]: value },
    }));
  }

  function guruPunyaOverride(guruId: string): boolean {
    return jadwal_override_guru.some((j) => j.user_id === guruId);
  }

  function simpanHandler() {
    const g: string[] = [];
    HARI.forEach((h) => {
      const d = draft[h.id];
      if (d.mode === "override") {
        if (!d.jam_masuk || !d.jam_pulang) {
          g.push(`${h.label}: ${MSG_JAM_WAJIB}`);
        } else if (d.jam_pulang <= d.jam_masuk) {
          g.push(`${h.label}: ${MSG_JAM_INVALID}`);
        }
      }
    });

    if (g.length > 0) {
      setGalat(g.join(" "));
      return;
    }

    HARI.forEach((h) => {
      const d = draft[h.id];
      const idx = jadwal_override_guru.findIndex(
        (j) => j.user_id === guruPilih && j.hari === h.id,
      );

      if (d.mode === "default") {
        if (idx >= 0) jadwal_override_guru.splice(idx, 1);
      } else if (idx >= 0) {
        jadwal_override_guru[idx].aktif = d.mode === "override";
        jadwal_override_guru[idx].jam_masuk = d.mode === "override" ? d.jam_masuk : null;
        jadwal_override_guru[idx].jam_pulang = d.mode === "override" ? d.jam_pulang : null;
      } else {
        jadwal_override_guru.push({
          user_id: guruPilih,
          hari: h.id,
          aktif: d.mode === "override",
          jam_masuk: d.mode === "override" ? d.jam_masuk : null,
          jam_pulang: d.mode === "override" ? d.jam_pulang : null,
        });
      }
    });

    setGalat(null);
    onPesan({ jenis: "sukses", teks: MSG_TERSIMPAN });
  }

  return (
    <Kartu judul="Override Guru">
      <BannerInfo>{MSG_BERLAKU_BESOK}</BannerInfo>

      <div className="tumpak-rapat">
        <span className="isian-satuan">
          <label className="isian-label" htmlFor="guru-override">
            Guru
          </label>
          <select
            id="guru-override"
            className="isian-bulan"
            value={guruPilih}
            disabled={hanyaLihat}
            onChange={(e) => handleGuruChange(e.target.value)}
          >
            {guruAktif.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nama}
              </option>
            ))}
          </select>
          {guruPunyaOverride(guruPilih) ? (
            <LencanaKecil label="Ada pengecualian" />
          ) : null}
        </span>

        <div className="jadwal-grid">
          <div className="jadwal-grid-header">
            <span>Hari</span>
            <span>Mode</span>
            <span>Masuk</span>
            <span>Pulang</span>
          </div>
          {HARI.map((h) => {
            const d = draft[h.id];
            if (!d) return null;
            return (
              <div key={h.id} className="baris-jadwal">
                <span className="baris-jadwal-label">{h.label}</span>
                <div className="tumpak-rapat">
                  {(["default", "override", "nonaktif"] as ModeHari[]).map((mode) => (
                     <label key={mode} className="pil-mode">
                       <input
                         type="radio"
                         name={`mode-${h.id}`}
                         value={mode}
                         checked={d.mode === mode}
                         disabled={hanyaLihat}
                         onChange={(e) =>
                           updateOverride(h.id, "mode", e.target.value as ModeHari)
                         }
                       />
                      <span>
                        {mode === "default" ? "Default" : mode === "override" ? "Override" : "Nonaktif"}
                      </span>
                    </label>
                  ))}
                </div>
                <input
                  type="time"
                  className="isian-waktu"
                  value={d.mode === "override" ? d.jam_masuk : ""}
                  disabled={hanyaLihat || d.mode !== "override"}
                  onChange={(e) => updateOverride(h.id, "jam_masuk", e.target.value)}
                />
                <input
                  type="time"
                  className="isian-waktu"
                  value={d.mode === "override" ? d.jam_pulang : ""}
                  disabled={hanyaLihat || d.mode !== "override"}
                  onChange={(e) => updateOverride(h.id, "jam_pulang", e.target.value)}
                />
              </div>
            );
          })}
        </div>

        {galat ? (
          <span className="isian-keterangan isian-galat">
            <Ikon nama="silang" ukuran={16} />
            <span>{galat}</span>
          </span>
        ) : null}

        {hanyaLihat ? null : (
          <div className="tumpak-rapat">
            <Tombol label="Simpan" varian="utama" lebar onClick={simpanHandler} />
          </div>
        )}
      </div>
    </Kartu>
  );
}

function LencanaKecil({ label }: { label: string }) {
  return (
    <span className="pil pil-penanda">
      <Ikon nama="tanda" ukuran={16} label={label} />
      <span>{label}</span>
    </span>
  );
}
