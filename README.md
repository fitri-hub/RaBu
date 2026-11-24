# RaBu

RaBu adalah aplikasi berbasis web yang dirancang untuk membantu komunitas lingkungan dalam mengelola serta memantau keberlanjutan kegiatan penghijauan. Aplikasi ini dibangun menggunakan React dan Vite, serta memanfaatkan Supabase untuk kebutuhan backend.

## Tentang Proyek

**Tujuan:** Membantu komunitas lingkungan mengelola dan memantau keberlanjutan kegiatan penghijauan.

**Permasalahan:** Kegiatan penghijauan membutuhkan pengelolaan dan pemantauan yang teratur agar keberlanjutannya tetap terjaga.

**Manfaat:** Memudahkan pengguna dalam mengelola kegiatan penghijauan serta memantau perkembangannya.

## Fitur Utama

- **Beranda:** Halaman utama untuk mengenal aplikasi RaBu.
- **Login dan Registrasi:** Fitur autentikasi pengguna untuk mengakses aplikasi.
- **Dashboard:** Halaman utama setelah pengguna berhasil masuk.
- **Data Tanaman:** Mengelola informasi dan data tanaman.
- **Perawatan:** Membantu pencatatan dan pengelolaan perawatan tanaman.
- **Pemulihan Tanaman:** Mencatat kondisi tanaman serta proses penanganan dan pemulihannya.
- **Penanggung Jawab:** Mengelola informasi pengelola yang bertanggung jawab terhadap tanaman.
- **Estafet Pengelola:** Memfasilitasi pergantian tanggung jawab pengelolaan tanaman dari satu pengelola kepada pengelola berikutnya melalui proses serah terima.

## Teknologi yang Digunakan

- React
- Vite
- Supabase
- Docker
- Nginx

## Persyaratan

Untuk menjalankan proyek secara lokal, siapkan:

- Node.js dan npm
- Akses ke proyek Supabase yang digunakan oleh aplikasi

Untuk menjalankan aplikasi melalui Docker, siapkan Docker Desktop atau Docker Engine.

## Cara Menjalankan Secara Lokal

1. Clone repository GitHub proyek:

   ```bash
   git clone https://github.com/fitri-hub/RaBu.git
   ```

2. Masuk ke direktori proyek:

   ```bash
   cd RaBu
   ```

3. Instal dependensi:

   ```bash
   npm install
   ```

4. Buat file `.env.local` di direktori utama proyek dengan konfigurasi berikut:

   ```env
   VITE_SUPABASE_URL=https://vzeovowvbcoefaznrrlq.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_jqgYG8pHaMjQvGCVXIK_xA_HZ0p79Zf
   ```

5. Jalankan aplikasi:

   ```bash
   npm run dev
   ```

6. Buka alamat lokal yang ditampilkan pada terminal.

## Menjalankan dengan Docker

Aplikasi RaBu dapat dijalankan menggunakan Docker. Proses pembangunan aplikasi menggunakan Node.js, sedangkan Nginx digunakan sebagai web server untuk menjalankan hasil build aplikasi.

### 1. Membangun Docker Image
Jalankan perintah berikut di terminal pada direktori utama proyek:

```powershell
docker build --no-cache --build-arg VITE_SUPABASE_URL="//vzeovowvbcoefaznrrlq.supabase.co" --build-arg VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_jqgYG8pHaMjQvGCVXIK_xA_HZ0p79Zf" -t rabu-app .
 ```

### 2. Menjalankan Container
Setelah proses build berhasil, jalankan perintah berikut:

```powershell
docker run -d --name rabu-container-baru -p 8080:80 rabu-app
 ```
### 3. Mengakses Aplikasi
Setelah container berhasil berjalan, buka aplikasi melalui browser:

[http://localhost:8080]

## Dokumentasi Docker

Proyek ini menggunakan Dockerfile dengan metode multi-stage build. Node.js digunakan untuk membangun aplikasi React + Vite, sedangkan Nginx digunakan sebagai web server untuk menjalankan hasil build aplikasi.

Docker digunakan untuk mempermudah proses pembangunan dan menjalankan aplikasi dalam container sehingga aplikasi dapat dijalankan di lingkungan yang berbeda dengan konfigurasi yang konsisten.

## Anggota

- Fitriani (2408107010022)
- Cut Wynona Andromeda (2408107010097)
- Khalisa Humaira (2408107010099)
