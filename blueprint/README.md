# blueprint/

Dokumen acuan (**sumber kebenaran**) proyek. Perubahan hanya lewat versi baru (PK-E3).

| Dokumen | Versi | Status |
|---|---|---|
| `001_BRD_…_v1.1.md` | 1.1 | **Mengikat** — kebutuhan bisnis, aturan bisnis, pedoman, UAT |
| `002_FS_…_v1.2.md` | 1.2 | **Mengikat** — spesifikasi fungsi, token, komponen, katalog pesan |
| `003_DataModel_…_v1.0.md` | 1.0 | **Mengikat** — 13 tabel, fungsi basis data, mock Lampiran B |
| `004_01` s.d. `004_08` (HTML) | — | **Mengikat** — wireframe per modul |
| `DESIGN.md`, `design.html` | — | **Referensi saja** — nilai tidak diambil; token mengikuti FS 2.5 |
| `catatan-artefak.md` | — | Penjelasan istilah dokumen |

**Prioritas rujukan:** BRD → FS → Data Model → Wireframe → keputusan percakapan → dokumentasi resmi teknologi → rekomendasi asisten.

**Aturan:** perubahan dicatat sebagai versi baru (PK-E3); temuan uji dikembalikan ke dokumen sebelum kode diubah (PK-E4). Selengkapnya: `../README.md` dan `.kilo/plans/`.