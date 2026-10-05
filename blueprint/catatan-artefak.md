*blueprint-artefak*
*proyek pembuatan program/aplikasi, **artefak/dokumen acuan (project documentation)** yang menjembatani kebutuhan bisnis dengan implementasi teknis.*

 Secara sederhana, alurnya bisa dibayangkan:

 **Kebutuhan bisnis → Analisis kebutuhan → Desain sistem/data → Development → Testing → Deployment**

 | Dokumen | Kepanjangan | Fungsi utama | Menjawab pertanyaan |
| --- | --- | --- | --- |
| **BRD** | Business Requirements Document | Menjelaskan kebutuhan dan tujuan bisnis | **"Bisnis membutuhkan apa dan kenapa?"** |
| **FRD/FS** | Functional Requirements / Functional Specification | Menjelaskan fungsi sistem secara detail | **"Sistem harus melakukan apa?"** |
| **SRS** | Software/System Requirements Specification | Mendokumentasikan requirement software secara menyeluruh | **"Apa saja requirement sistem?"** |
| **Use Case** | Use Case Specification/Diagram | Menggambarkan interaksi user dengan sistem | **"User melakukan apa terhadap sistem?"** |
| **Data Model** | Data Model / ERD | Mendefinisikan struktur dan hubungan data | **"Data apa yang disimpan dan bagaimana hubungannya?"** |
| **UI/UX Design** | Wireframe/Mockup/Prototype | Menentukan tampilan dan pengalaman pengguna | **"Sistem akan terlihat dan digunakan seperti apa?"** |
| **Technical Design** | Technical/System Design | Menentukan rancangan teknis aplikasi | **"Bagaimana sistem akan dibangun?"** |
| **API Specification** | API Spec | Mendefinisikan komunikasi antar sistem | **"Bagaimana aplikasi saling berkomunikasi?"** |
| **Test Scenario/Case** | QA Documentation | Menentukan cara memverifikasi sistem | **"Bagaimana kita memastikan sistem benar?"** |

### Contoh sederhananya

 Misalnya perusahaan ingin membuat **aplikasi pengajuan cuti karyawan**.

 **BRD**:

 > Perusahaan membutuhkan sistem pengajuan cuti agar proses yang sebelumnya menggunakan formulir/email menjadi terkomputerisasi.

 Kemudian **FS** menjabarkan:

 > Karyawan dapat membuat pengajuan cuti, memilih tanggal mulai dan selesai, memasukkan alasan, kemudian sistem mengirimkan pengajuan kepada atasan untuk approval.

 **Data Model/ERD** kemudian menentukan data seperti:

```
Employee
- employee_id
- name
- department

Leave_Request
- leave_id
- employee_id
- start_date
- end_date
- reason
- status
- approved_by
```

 **UI/UX** menentukan halaman:

```
Login
  ↓
Dashboard
  ↓
Pengajuan Cuti
  ↓
Form Cuti
  ↓
Submit
  ↓
Approval Atasan
```

 Sedangkan **Technical Design** mungkin menentukan:

```
Frontend
   ↓
REST API
   ↓
Backend
   ↓
Database
```

 Jadi, **dokumen-dokumen tersebut bukan programnya**, tetapi menjadi **blueprint/acuan untuk membuat program**.

 ### Hubungan antar dokumen

 Yang cukup umum adalah:

```
BRD
 │
 │ kebutuhan bisnis
 ▼
Functional Specification / SRS
 │
 │ kebutuhan sistem
 ├───────────────┐
 ▼               ▼
UI/UX         Data Model
 │               │
 └───────┬───────┘
         ▼
   Technical Design
         │
         ▼
    Development
         │
         ▼
      Testing
         │
         ▼
      Release
```

 **Catatan:** istilah dan urutan bisa berbeda antar perusahaan. Ada perusahaan yang menggunakan **BRD → FSD/FS → Technical Design**, sementara yang lain menggunakan **BRD → SRS → HLD/LLD**.
