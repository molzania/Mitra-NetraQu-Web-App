# Mitra NetraQu Palembang — Aplikasi Pemesanan Jasa Terapis Pijat Tuna Netra

**Mitra NetraQu Palembang** adalah aplikasi web pemesanan layanan pijat kebugaran dan refleksi oleh terapis tuna netra profesional serta bersertifikat di Kota Palembang. Aplikasi ini dirancang dengan antarmuka yang bersih (palet warna Biru, Hijau, dan Putih), mudah diakses oleh seluruh kalangan, serta dilengkapi fitur pembaca layar (*Text-to-Speech* Bahasa Indonesia) untuk mendukung aksesibilitas pengguna tuna netra maupun pelanggan umum.

---

## 🌿 Pengenalan Aplikasi

Mitra NetraQu menjembatani pelanggan di Kota Palembang dengan para terapis pijat tuna netra terlatih melalui sistem pemesanan digital yang transparan dan praktis. Pelanggan dapat memilih dua metode layanan:
1. **Datang Langsung ke Outlet** di *Jalan Sukahati No. 90 Palembang* (bebas biaya transportasi).
2. **Panggil Terapis ke Rumah / Hotel (Home Service)** di area Palembang dengan perhitungan biaya transportasi otomatis.

Selain itu, aplikasi menerapkan standar **Etika Terapis Sesuai Jenis Kelamin**, di mana peserta laki-laki ditangani oleh terapis pria dan peserta perempuan ditangani oleh terapis wanita.

---

## ✨ Fitur-Fitur Utama

### 1. Aksesibilitas Suara (*Text-to-Speech* Bahasa Indonesia)
- Dilengkapi pilihan **Suara Pria** (Bariton Gentleman) dan **Suara Wanita** dengan konfirmasi suara otomatis (*"suara diubah menjadi suara pria"* / *"suara diubah menjadi suara wanita"*).
- Dilengkapi pengaturan **Kecepatan Suara** (**Lambat**, **Sedang**, dan **Cepat**).
- Tombol **"Bacakan Layar"** dan **"Stop"** di halaman masuk, halaman pelanggan, dan dashboard admin.

### 2. Autentikasi, Keamanan Password & Akses Multi-Peran
- **Login Nomor WhatsApp/HP + PIN**: Masuk atau daftar akun pelanggan baru dengan mudah.
- **Inisial Huruf Nama Depan Otomatis**: Foto profil awal pelanggan menampilkan 2 huruf pertama dari nama depan (mengabaikan sapaan `Bpk.` / `Ibu`, misalnya `Bpk. Hendra Wijaya` menjadi **`HE`** dan `Ibu Siti Nurhaliza` menjadi **`SI`**) dengan latar belakang Biru (`#0D5C91`) dan teks Putih.
- **Pengaturan Profil & Perubahan Password**: Pelanggan dapat memperbarui 7 data profil (`Nama Lengkap`, `Nama Panggilan`, `Alamat`, `Patokan`, `Email`, `No. Hp`, dan `Jenis Kelamin : Pria / Wanita`) serta mengubah **Password / PIN** akun.
- **Proteksi Akun Demo & Administrator**: Khusus **Akun Demo** dan **Administrator**, kolom **Email** dan **Password/PIN** dikunci secara permanen dan tidak dapat diubah demi menjaga ketersediaan akses pengujian publik.
- **Tombol Keluar Aplikasi (Logout)**: Tersedia di header dan tab profil dengan warna merah kontras tinggi (`#DC2626`) dan teks putih.

### 3. Formulir Pemesanan Layanan Pijat Interaktif
- **Galeri Carousel Layanan**: Menampilkan foto-foto layanan terapi pijat profesional di halaman utama.
- **4 Pilihan Layanan Pijat & Tarif Resmi**:
  | Nama Layanan | Tarif per Jam |
  | :--- | :--- |
  | Pijat Seluruh Tubuh (Full Body) | Rp 100.000 |
  | Pijat Punggung + Kaki | Rp 75.000 |
  | Pijat Punggung + Tangan | Rp 75.000 |
  | Pijat Tangan / Kaki / Kepala / Kerokan Only | Rp 50.000 |
- **Komposisi Peserta sesuai Etika Terapis**:
  - **Peserta Laki-laki**: Maksimal **3 orang** (ditangani Terapis Pria).
  - **Peserta Perempuan**: Maksimal **3 orang** (ditangani Terapis Wanita).
- **Jadwal Operasional Terstruktur**: Pemilihan tanggal dan slot waktu mulai pukul **09.00 WIB hingga 19.00 WIB** (jam operasional Senin–Sabtu, 09.00–20.00 WIB).
- **Kolom Custom Message (Bagian 04)**: Pelanggan dapat menuliskan pesan atau catatan tambahan untuk terapis (keluhan pegal, tingkat tekanan pijatan, atau patokan rumah) yang otomatis disertakan ke pesan WhatsApp CS.
- **Kalkulasi Biaya Otomatis**: Menghitung subtotal layanan, biaya transportasi (*Panggilan ke Rumah* Rp 100.000 atau *Datang ke Lokasi Pijat* Rp 0), serta total keseluruhan secara *real-time*.

### 4. Konfirmasi Pesanan & Integrasi WhatsApp CS
- Setelah pesanan dibuat, aplikasi menampilkan ringkasan struk pesanan lengkap dengan kode unik (contoh: `MNQ-20261102-1081`).
- Pelanggan dapat langsung menekan tombol **"Kirim via WhatsApp CS"** untuk meneruskan detail pesanan ke nomor WhatsApp Customer Service resmi atau menyalin teks pesanan ke *clipboard*.

### 5. Pelacakan Riwayat & 7 Tahap Status Pesanan
Pelanggan dapat memantau perkembangan pesanan mereka melalui indikator progres 7 tahap:
1. `Menunggu Dikonfirmasi (1/7)`
2. `Dikonfirmasi (2/7)`
3. `Menunggu Pembayaran (3/7)`
4. `Pembayaran Lunas (4/7)`
5. `Konfirmasi Terapis (5/7)`
6. `Terapis On The Way (6/7)`
7. `Pesanan Selesai (7/7)`

### 6. Dashboard Administrator Mitra NetraQu
- **Ringkasan KPI**: Menampilkan total seluruh pesanan, jumlah pesanan hari ini, menunggu konfirmasi, dan estimasi total pendapatan.
- **Filter & Pencarian Cepat**: Cari pesanan berdasarkan ID pesanan, nama pelanggan, nomor HP, atau filter berdasarkan tanggal pelaksanaan.
- **Pembaruan Status Real-Time**: Ubah status pesanan pelanggan ke salah satu dari 7 tahapan layanan secara instan.
- **Direktori Pelanggan & Pengaturan CS**: Lihat daftar pelanggan terdaftar dan perbarui nomor WhatsApp Customer Service aktif.

---

## 🔐 Akun Demo untuk Pengujian

Anda dapat langsung menguji aplikasi menggunakan tombol **Akses Cepat Akun Demo** di halaman login atau memasukkan data berikut secara manual *(Catatan: Email & Password akun Demo dan Administrator dikunci agar tidak dapat diubah)*:

| Peran | Nomor HP / WhatsApp | PIN / Password |
| :--- | :--- | :--- |
| **Pelanggan Demo 1 (Bpk. Hendra Wijaya)** | `081271829911` | `123456` |
| **Pelanggan Demo 2 (Ibu Siti Nurhaliza)** | `082199887766` | `123456` |
| **Administrator Mitra NetraQu** | `081212345678` | `198006` |

---

## 🚀 Cara Pemakaian & Instalasi dari GitHub

Ikuti langkah-langkah berikut untuk menjalankan aplikasi **Mitra NetraQu Palembang** di komputer lokal Anda:

### 1. Prasyarat
Pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (versi 18.x atau lebih baru)
- `npm` (sudah termasuk bersama instalasi Node.js)
- `git`

### 2. Clone Repositori dari GitHub (Tanpa Menyertakan Database Spreadsheet Data Pribadi)
Demi menjaga **privasi dan keamanan data pribadi pelanggan**, repositori ini hanya menyertakan kode sumber aplikasi (*source code*) dan sampel akun demo tiruan, serta **tidak menyertakan file database spreadsheet (`.xlsx`, `.xls`, `.csv`, `.ods`, `.gsheet`) yang berisi data pribadi pelanggan asli**.

1. **Clone kode sumber aplikasi dari GitHub:**
   ```bash
   git clone https://github.com/username-anda/mitra-netraqu-palembang.git
   cd mitra-netraqu-palembang
   ```
   *(Ganti `username-anda/mitra-netraqu-palembang` dengan URL repositori GitHub Anda).*

2. **Jika repositori jarak jauh (remote) memiliki folder/file spreadsheet, lakukan clone dengan mengecualikan file spreadsheet data pribadi (`sparse-checkout`):**
   ```bash
   git clone --no-checkout https://github.com/username-anda/mitra-netraqu-palembang.git
   cd mitra-netraqu-palembang
   git sparse-checkout init --no-cone
   git sparse-checkout set "/*" "!**/*.xlsx" "!**/*.xls" "!**/*.csv" "!**/*.ods" "!**/*.gsheet" "!/database/" "!/spreadsheets/"
   git checkout
   ```

3. **Proteksi Otomatis `.gitignore`:**
   File `.gitignore` pada proyek ini telah dikonfigurasi untuk menolak seluruh format spreadsheet (`*.xlsx`, `*.xls`, `*.csv`, `*.ods`, `*.gsheet`) serta folder `database/` dan `spreadsheets/`, sehingga file spreadsheet yang berisi data pribadi pelanggan tidak akan ikut ter-*commit* atau ter-*upload* ke GitHub.

### 3. Instal Dependensi
Instal seluruh paket yang dibutuhkan aplikasi:

```bash
npm install
```

### 4. Jalankan Server Development
Untuk menjalankan aplikasi dalam mode pengembangan (*development*):

```bash
npm run dev
```

Setelah server aktif, buka browser dan akses alamat berikut:
```text
http://localhost:3000
```

### 5. Build untuk Produksi (Opsional)
Jika Anda ingin membuat bundel aplikasi siap pakai (*production build*):

```bash
npm run build
npm start
```

---

## 📖 Panduan Singkat Penggunaan Aplikasi

### Sebagai Pelanggan:
1. **Masuk / Daftar Akun**: Pilih tab **No. HP + PIN** atau **Akun Google**, atau klik tombol demo **Pelanggan: Bpk. Hendra** / **Ibu Siti**.
2. **Buat Pesanan Baru**:
   - Pada tab **Pesan Layanan**, pilih jenis layanan pijat dan durasi (**1 Jam** atau **2 Jam**).
   - Tentukan **Komposisi Peserta** (**Peserta Laki-laki maks. 3 orang** dan **Peserta Perempuan maks. 3 orang**).
   - Pilih **Tanggal**, **Jam Kedatangan**, serta **Lokasi Pijat** (**Datang ke Lokasi Pijat** atau **Panggilan ke Rumah**).
   - Tambahkan **Pesan / Catatan Tambahan (Custom Message)** pada bagian **04. Ringkasan Biaya Pemesanan** bila diperlukan, lalu klik **"Pesan & Konfirmasi ke WhatsApp CS"**.
3. **Kelola Profil & Password**:
   - Buka tab **Profil Pelanggan** untuk memperbarui `Nama Lengkap`, `Nama Panggilan`, `Alamat`, `Patokan`, `Email`, `No. Hp`, dan `Jenis Kelamin`, serta mengubah **Password / PIN** (khusus akun pelanggan reguler/baru).
4. **Keluar Aplikasi**: Klik tombol merah **"Keluar"** di pojok kanan atas layar atau di bagian bawah halaman profil.

### Sebagai Administrator:
1. **Masuk ke Admin**: Masukkan Nomor HP `081212345678` dan Password `198006`, atau klik tombol **Admin Dashboard** pada bagian akses cepat.
2. **Kelola Pesanan**: Gunakan kolom pencarian atau filter tanggal untuk menemukan pesanan pelanggan, lalu ubah status pesanan pada menu *dropdown* **Ubah Status (1–7)**.
3. **Atur Nomor WhatsApp CS**: Perbarui nomor WhatsApp tujuan konfirmasi pada tab **Pengaturan CS**, lalu klik **Simpan Nomor WhatsApp CS**.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend & Backend**: React 19 + TypeScript + Express (`server.ts`)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 (Palet Biru `#0D5C91`, Hijau `#4C9A2A`, dan Putih `#FFFFFF`)
- **Ikon**: Lucide React
- **Aksesibilitas Suara**: Neural TTS Bahasa Indonesia (Suara Pria & Wanita + Kecepatan Lambat, Sedang, Cepat) & Web Speech API Fallback
- **Penyimpanan Data Lokal**: Browser `localStorage` (Tanpa menyertakan database spreadsheet data pribadi di repositori GitHub)

