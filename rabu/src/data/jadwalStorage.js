export const KUNCI_JADWAL = 'rawatbumi-jadwal-perawatan';

export const JADWAL_AWAL = [
  {
    id: 1,
    tanaman: 'Pohon Mangga',
    kegiatan: 'Penyiraman',
    tanggal: '2026-10-10',
    penanggungJawab: 'Anggota 1',
    status: 'Belum Selesai',
  },
  {
    id: 2,
    tanaman: 'Pohon Ketapang',
    kegiatan: 'Pemeriksaan Kondisi',
    tanggal: '2026-10-11',
    penanggungJawab: 'Anggota 2',
    status: 'Belum Selesai',
  },
  {
    id: 3,
    tanaman: 'Pohon Jambu',
    kegiatan: 'Pemupukan',
    tanggal: '2026-10-12',
    penanggungJawab: 'Anggota 1',
    status: 'Selesai',
  },
];

export function bacaJadwal() {
  try {
    const data = localStorage.getItem(KUNCI_JADWAL);

    if (data !== null) {
      const hasil = JSON.parse(data);
      if (Array.isArray(hasil)) return hasil;
    }
  } catch (error) {
    console.error('Gagal membaca jadwal:', error);
  }

  return JADWAL_AWAL;
}

export function simpanJadwal(data) {
  try {
    localStorage.setItem(KUNCI_JADWAL, JSON.stringify(data));
    window.dispatchEvent(new Event('jadwal-berubah'));
  } catch (error) {
    console.error('Gagal menyimpan jadwal:', error);
  }
}