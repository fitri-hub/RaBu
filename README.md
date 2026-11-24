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
- **Pemulihan Tanaman:** Fitur yang berkaitan dengan penanganan dan pemulihan kondisi tanaman.
- **Penanggung Jawab:** Mengelola informasi pihak yang bertanggung jawab terhadap tanaman.

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
   VITE_SUPABASE_URL=(https://bevqvhyciukudrmaawto.supabase.co)
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ZJHHxuiN_OyzGT1wXAU_Gw_U6sjYUQ5
   ```

5. Jalankan aplikasi:

   ```bash
   npm run dev
   ```

6. Buka alamat lokal yang ditampilkan pada terminal.

## Menjalankan dengan Docker

Image Docker RaBu tersedia melalui repository publik berikut:

[**RaBu di Docker Hub**](https://hub.docker.com/r/fitri947/rabu-uts)

Tag image untuk pengumpulan UTS: `latest`.

Untuk mengunduh image dan menjalankan aplikasi:

```bash
docker pull fitri947/rabu-uts:latest
docker run -d --name rabu-container -p 8080:80 fitri947/rabu-uts:latest
```

Setelah container berjalan, buka alamat berikut di browser:

`http://localhost:8080`

## Dokumentasi Docker

Proyek ini menggunakan Dockerfile untuk membangun image aplikasi. Hasil build dikemas dan dijalankan menggunakan Nginx. Image tersedia pada repository publik Docker Hub yang tercantum di atas.

## Anggota

- Fitriani (2408107010022)
- Cut Wynona Andromeda (2408107010097)
- Khalisa Humaira (2408107010099)
