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
- Dilengkapi tombol **"Bacakan Layar"** di halaman masuk, halaman pelanggan, dan dashboard admin.
- Fitur **"Bacakan Rincian Biaya"** untuk membacakan total tagihan pesanan secara otomatis menggunakan Web Speech API (`id-ID`).
- Tombol **"Stop"** untuk menghentikan pembacaan suara kapan saja.

### 2. Autentikasi & Akses Multi-Peran
- **Login Nomor WhatsApp/HP + PIN**: Masuk atau daftar akun pelanggan baru dengan mudah.
- **Login Cepat Akun Google**: Masuk instan satu ketukan menggunakan akun Google yang tersimpan.
- **Akses Cepat Akun Demo**: Tersedia tombol *Satu Klik* di halaman utama untuk mencoba akun Pelanggan maupun Administrator tanpa perlu mengetik kredensial manual.
- **Tombol Keluar Aplikasi (Logout)**: Tersedia di header dan tab profil dengan warna merah kontras tinggi untuk kemudahan navigasi.

### 3. Formulir Pemesanan Layanan Pijat Interaktif
- **Galeri Carousel Layanan**: Menampilkan foto-foto layanan terapi pijat profesional di halaman utama.
- **6 Pilihan Layanan Pijat**:
  | Nama Layanan | Tarif per Jam |
  | :--- | :--- |
  | Pijat Seluruh Tubuh (*Full Body*) | Rp 80.000 / jam |
  | Pijat Refleksi Kaki | Rp 60.000 / jam |
  | Pijat Tradisional & Kerokan | Rp 85.000 / jam |
  | Pijat Kepala, Wajah & Telinga | Rp 50.000 / jam |
  | Pijat Keseleo / Salah Urat | Rp 90.000 / jam |
  | Pijat Ibu Hamil / Pasca Melahirkan | Rp 100.000 / jam |
- **Pengaturan Peserta & Durasi Dinamis**: Mendukung pemesanan untuk **1 hingga 3 peserta** sekaligus, dengan pengaturan jenis layanan, jenis kelamin terapis, dan durasi (**1–3 jam**) untuk masing-masing peserta.
- **Jadwal Operasional Terstruktur**: Pemilihan tanggal dan slot waktu mulai pukul **09.00 WIB hingga 19.00 WIB** (jam operasional Senin–Sabtu, 09.00–20.00 WIB).
- **Kalkulasi Biaya Otomatis**: Menghitung subtotal per peserta, biaya transportasi (*Home Service* Rp 100.000 atau *Outlet* Rp 0), serta total keseluruhan secara *real-time*.

### 4. Konfirmasi Pesanan & Integrasi WhatsApp CS
- Setelah pesanan dibuat, aplikasi menampilkan ringkasan struk pesanan lengkap dengan kode unik (contoh: `MNQ-104218`).
- Pelanggan dapat langsung menekan tombol **"Kirim via WhatsApp CS"** untuk meneruskan detail pesanan ke nomor WhatsApp Customer Service resmi atau menyalin teks pesanan ke *clipboard*.

### 5. Pelacakan Riwayat & 7 Tahap Status Pesanan
Pelanggan dapat memantau perkembangan pesanan mereka melalui indikator progres 7 tahap:
1. `Diterima Sistem`
2. `Menunggu Konfirmasi`
3. `Terapis Ditugaskan`
4. `Terapis Menuju Lokasi`
5. `Layanan Berlangsung`
6. `Menunggu Pembayaran`
7. `Layanan Selesai`

### 6. Dashboard Administrator Mitra NetraQu
- **Ringkasan KPI**: Menampilkan total seluruh pesanan, jumlah pesanan aktif, pesanan selesai, dan estimasi total pendapatan.
- **Filter & Pencarian Cepat**: Cari pesanan berdasarkan ID pesanan, nama pelanggan, nomor HP, atau filter berdasarkan tanggal pelaksanaan.
- **Pembaruan Status Real-Time**: Ubah status pesanan pelanggan ke salah satu dari 7 tahapan layanan secara instan.
- **Direktori Pelanggan & Pengaturan CS**: Lihat daftar pelanggan terdaftar dan perbarui nomor WhatsApp Customer Service aktif.

---

## 🔐 Akun Demo untuk Pengujian

Anda dapat langsung menguji aplikasi menggunakan tombol **Akses Cepat Akun Demo** di halaman login atau memasukkan data berikut secara manual:

| Peran | Nomor HP / WhatsApp | PIN / Password |
| :--- | :--- | :--- |
| **Pelanggan 1 (Bpk. Hendra Wijaya)** | `081271829911` | `123456` |
| **Pelanggan 2 (Ibu Siti Rahmawati)** | `082199887766` | `123456` |
| **Administrator Mitra NetraQu** | `081212345678` | `198006` |

---

## 🚀 Cara Pemakaian & Instalasi dari GitHub

Ikuti langkah-langkah berikut untuk menjalankan aplikasi **Mitra NetraQu Palembang** di komputer lokal Anda:

### 1. Prasyarat
Pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (versi 18.x atau lebih baru)
- `npm` (sudah termasuk bersama instalasi Node.js)
- `git`

### 2. Clone Repositori dari GitHub
Buka terminal atau Command Prompt, lalu jalankan perintah berikut:

```bash
git clone https://github.com/username-anda/mitra-netraqu-palembang.git
cd mitra-netraqu-palembang
```
*(Ganti `username-anda/mitra-netraqu-palembang` dengan URL repositori GitHub Anda).*

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
npm run preview
```

---

## 📖 Panduan Singkat Penggunaan Aplikasi

### Sebagai Pelanggan:
1. **Masuk / Daftar Akun**: Pilih tab **No. HP + PIN** atau **Akun Google**, atau klik tombol demo **Pelanggan: Bpk. Hendra**.
2. **Buat Pesanan Baru**:
   - Pada tab **Pesan Layanan**, pilih lokasi layanan (**Datang ke Outlet** atau **Panggil ke Rumah / Hotel**).
   - Pilih **Tanggal** dan **Jam Mulai** terapi.
   - Tentukan **Jumlah Peserta** (1–3 orang), lalu pilih jenis layanan pijat, jenis kelamin peserta, dan durasi jam untuk setiap peserta.
   - Periksa rincian biaya, lalu klik **"Konfirmasi & Buat Pesanan"**.
3. **Kirim Konfirmasi ke WhatsApp CS**: Klik **"Kirim via WhatsApp CS"** pada jendela konfirmasi yang muncul.
4. **Pantau Status & Profil**:
   - Buka tab **Riwayat & Status** untuk melihat tahapan pesanan Anda.
   - Buka tab **Profil Saya** untuk memperbarui nama, foto profil, jenis kelamin, atau alamat domisili.
5. **Keluar Aplikasi**: Klik tombol merah **"Keluar Aplikasi"** di pojok kanan atas layar atau di dalam halaman profil.

### Sebagai Administrator:
1. **Masuk ke Admin**: Masukkan Nomor HP `081212345678` dan Password `198006`, atau klik tombol **Admin Dashboard** pada bagian akses cepat.
2. **Kelola Pesanan**: Gunakan kolom pencarian atau filter tanggal untuk menemukan pesanan pelanggan, lalu ubah status pesanan pada menu *dropdown* **Ubah Status Pesanan**.
3. **Atur Nomor WhatsApp CS**: Perbarui nomor WhatsApp tujuan konfirmasi pada kartu pengaturan di bagian atas dashboard, lalu klik **Simpan**.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 (Palet Biru `#0D5C91`, Hijau `#4C9A2A`, dan Putih `#FFFFFF`)
- **Ikon**: Lucide React
- **Aksesibilitas Suara**: Web Speech API (`window.speechSynthesis` Bahasa Indonesia)
- **Penyimpanan Data**: Persistent `localStorage` Browser
