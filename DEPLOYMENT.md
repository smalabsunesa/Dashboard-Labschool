# Panduan Deployment: Vercel & Supabase
**SMA Labschool Unesa 1 Website**

Panduan ini berisi langkah-langkah lengkap untuk melakukan deployment website ke **Vercel** dan menghubungkan database **Supabase**.

---

## 🚀 Bagian 1: Pengaturan Database di Supabase

### 1. Buat Proyek Supabase Baru
1. Buka [https://supabase.com](https://supabase.com) dan login/daftar akun.
2. Klik **New Project** dan isi detail proyek:
   - **Name**: `smalabschoolunesa` (atau nama pilihan Anda)
   - **Database Password**: Buat dan simpan kata sandi yang aman.
   - **Region**: Pilih lokasi terdekat (misal: *Singapore*).
3. Klik **Create new project** dan tunggu proses inisialisasi selesai (sekitar 1-2 menit).

### 2. Jalankan Skrip Database (SQL Schema)
1. Di dashboard Supabase, buka menu **SQL Editor** dari navigasi sebelah kiri.
2. Klik **New query**.
3. Buka file [`supabase-schema.sql`](./supabase-schema.sql) dari proyek ini, salin seluruh isinya, dan tempel ke dalam SQL Editor di Supabase.
4. Klik tombol **Run** (atau tekan `Ctrl + Enter`).
5. Skrip akan membuat tabel `smal_faqs`, `smal_updates`, `smal_inquiries`, menyeting akses publik (RLS), dan mengisi data awal secara otomatis.

### 3. Ambil Kunci API Supabase
1. Di dashboard Supabase, buka menu **Project Settings** (ikon roda gigi) -> **API**.
2. Salin nilai berikut:
   - **Project URL** (misal: `https://xyzcompany.supabase.co`)
   - **anon / public key** (kunci publik)

---

## 🌐 Bagian 2: Deployment ke Vercel

### 1. Push Kode ke Repository GitHub / GitLab / Bitbucket
Pastikan seluruh file proyek Anda sudah berada di repository Git Anda.

### 2. Hubungkan ke Vercel
1. Buka [https://vercel.com](https://vercel.com) dan login.
2. Klik tombol **Add New...** -> **Project**.
3. Pilih repository proyek `labschool-site-main` dari akun GitHub Anda dan klik **Import**.

### 3. Konfigurasi Proyek di Vercel
1. **Framework Preset**: Pilih `Vite`.
2. **Root Directory**: `./` (default).
3. **Environment Variables**:
   Buka bagian **Environment Variables** dan tambahkan 2 variabel berikut:
   - `VITE_SUPABASE_URL`: Tempelkan **Project URL** dari Supabase.
   - `VITE_SUPABASE_ANON_KEY`: Tempelkan **anon key** dari Supabase.

### 4. Deploy!
1. Klik tombol **Deploy**.
2. Tunggu proses build selesai (biasanya kurang dari 1 menit).
3. Setelah selesai, Vercel akan memberikan URL publik (misal: `https://labschool-site.vercel.app`).

---

## 💡 Fitur Unggulan Sistem Deployment Ini

- **Dual Mode Data Fetching**: Website secara otomatis menggunakan Supabase sebagai database utama jika variabel `VITE_SUPABASE_URL` terpasang.
- **Fail-Safe Fallback**: Jika database Supabase belum dikonfigurasi atau mengalami gangguan jaringan, aplikasi secara otomatis menampilkan data fallback lokal sehingga halaman website **tidak pernah error / blank**.
- **Public Inquiry Submission**: Formulir kontak di bagian *Contact Us* secara otomatis menyimpan pesan pengunjung ke tabel `smal_inquiries` di Supabase.
