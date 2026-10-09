
export const KUNCI_STORAGE = 'rawatbumi-data-tanaman';

export const DATA_AWAL = [
  {
    id: 1,
    kode: 'TNM-001',
    nama: 'Pohon Mangga',
    jenis: 'Pohon Buah',
    lokasi: 'Taman Depan',
    tanggalTanam: '2025-01-15',
    kondisi: 'Sehat',
    penanggungJawab: 'Tim Hijau',
    catatan: 'Pertumbuhan baik dan daun berwarna hijau.',
  },
  {
    id: 2,
    kode: 'TNM-002',
    nama: 'Pohon Ketapang',
    jenis: 'Pohon Peneduh',
    lokasi: 'Halaman Kampus',
    tanggalTanam: '2024-08-20',
    kondisi: 'Perlu Perawatan',
    penanggungJawab: 'Tim Bumi',
    catatan: 'Pohon perlu diperiksa.',
  },
  {
    id: 3,
    kode: 'TNM-003',
    nama: 'Pohon Jambu',
    jenis: 'Pohon Buah',
    lokasi: 'Taman Belakang',
    tanggalTanam: '2025-03-10',
    kondisi: 'Perlu Perawatan',
    penanggungJawab: 'Tim Hijau',
    catatan: 'Daun mulai menguning.',
  },
  {
    id: 4,
    kode: 'TNM-004',
    nama: 'Pohon Trembesi',
    jenis: 'Pohon Peneduh',
    lokasi: 'Area Parkir',
    tanggalTanam: '2023-11-05',
    kondisi: 'Kritis',
    penanggungJawab: 'Tim Bumi',
    catatan: 'Perlu pemeriksaan segera.',
  },
  {
    id: 5,
    kode: 'TNM-005',
    nama: 'Bunga Bougenville',
    jenis: 'Tanaman Hias',
    lokasi: 'Taman Depan',
    tanggalTanam: '2025-06-12',
    kondisi: 'Sehat',
    penanggungJawab: 'Tim Lestari',
    catatan: 'Berbunga dan tumbuh dengan baik.',
  },
];

export function bacaTanaman() {
  try {
    const data = localStorage.getItem(KUNCI_STORAGE);

    if (data !== null) {
      const hasil = JSON.parse(data);
      if (Array.isArray(hasil)) return hasil;
    }
  } catch (error) {
    console.error('Gagal membaca data tanaman:', error);
  }

  return DATA_AWAL;
}

export function simpanTanaman(data) {
  try {
    localStorage.setItem(KUNCI_STORAGE, JSON.stringify(data));
    window.dispatchEvent(new Event('tanaman-berubah'));
  } catch (error) {
    console.error('Gagal menyimpan data tanaman:', error);
  }
}