
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import '../App.css';

function Dashboard({ bukaHalaman }) {
  const [tanaman, setTanaman] = useState([]);
  const [jadwal, setJadwal] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [pesanError, setPesanError] = useState('');

  async function muatDataDashboard() {
    setMemuat(true);
    setPesanError('');

    try {
      // Mengambil data tanaman dari Supabase
      const {
        data: dataTanaman,
        error: errorTanaman,
      } = await supabase
        .from('tanaman')
        .select(
          'id, nama_tanaman, lokasi, kondisi, penanggung_jawab'
        )
        .order('id', { ascending: true });

      if (errorTanaman) throw errorTanaman;

      // Mengambil jadwal perawatan beserta nama tanamannya
      const {
        data: dataJadwal,
        error: errorJadwal,
      } = await supabase
        .from('jadwal_perawatan')
        .select(`
          id,
          tanaman_id,
          jenis_perawatan,
          kegiatan,
          tanggal,
          waktu,
          status,
          tanaman (
            nama_tanaman,
            lokasi
          )
        `)
        .order('tanggal', { ascending: false });

      if (errorJadwal) throw errorJadwal;

      setTanaman(dataTanaman || []);

      setJadwal(
        (dataJadwal || []).map((item) => ({
          ...item,
          tanaman:
            item.tanaman?.nama_tanaman ||
            'Tanaman tidak ditemukan',
          kegiatan:
            item.kegiatan ||
            item.jenis_perawatan ||
            'Perawatan tanaman',
        }))
      );
    } catch (error) {
      console.error('Gagal memuat dashboard:', error);
      setPesanError(
        'Data dashboard gagal dimuat. Periksa koneksi dan konfigurasi Supabase.'
      );
    } finally {
      setMemuat(false);
    }
  }

  useEffect(() => {
    muatDataDashboard();

    // Memperbarui dashboard saat data berubah di halaman lain
    const perbarui = () => {
      muatDataDashboard();
    };

    window.addEventListener('tanaman-berubah', perbarui);
    window.addEventListener('jadwal-berubah', perbarui);

    return () => {
      window.removeEventListener('tanaman-berubah', perbarui);
      window.removeEventListener('jadwal-berubah', perbarui);
    };
  }, []);

  // Menghitung statistik berdasarkan data Supabase
  const sehat = tanaman.filter(
    (item) => item.kondisi === 'Sehat'
  ).length;

  const perhatian = tanaman.filter(
    (item) =>
      item.kondisi === 'Perlu Perawatan' ||
      item.kondisi === 'Kritis'
  ).length;

  const belumSelesai = jadwal.filter(
    (item) => item.status === 'Belum'
  ).length;

  const aktivitasSelesai = jadwal
    .filter((item) => item.status === 'Selesai')
    .slice(0, 4);

  const tanamanPerhatian = tanaman.filter(
    (item) =>
      item.kondisi === 'Perlu Perawatan' ||
      item.kondisi === 'Kritis'
  );

  return (
    <div className="rb-dashboard">
      <header className="rb-topbar">
        <div>
          <p className="rb-eyebrow">RUANG HIJAU • RABU</p>
          <h1>Dashboard 🌱</h1>
          <p className="rb-subtitle">
            Pantau tanaman dan rawat bumi, mulai dari hari ini.
          </p>
        </div>

        <div className="rb-date-chip">
          🌿 Rawat hari ini, hijaukan masa depan
        </div>
      </header>

      {/* Kartu sambutan */}
      <section className="rb-welcome">
        <div className="rb-welcome-content">
          <span className="rb-welcome-label">
            SELAMAT DATANG DI RABU
          </span>

          <h2 className="rb-welcome-title">
            Halo, Pengelola!
          </h2>

          <p className="rb-welcome-description">
            Setiap tanaman yang terawat adalah langkah kecil
            menuju lingkungan yang lebih hijau.
          </p>
        </div>

        <div className="rb-welcome-logo">
          <img src="/logo-rabu.png" alt="Logo RaBu" />
        </div>
      </section>

      {/* Statistik tanaman dan jadwal */}
      <section className="rb-stats">
        <button
          className="rb-stat"
          onClick={() => bukaHalaman('tanaman', 'Semua')}
        >
          <span className="rb-stat-icon">🌱</span>
          <span className="rb-stat-label">Total Tanaman</span>
          <strong>{memuat ? '...' : tanaman.length}</strong>
          <span className="rb-stat-foot">
            Lihat semua tanaman ↗
          </span>
        </button>

        <button
          className="rb-stat"
          onClick={() => bukaHalaman('tanaman', 'Sehat')}
        >
          <span className="rb-stat-icon">🍃</span>
          <span className="rb-stat-label">Tanaman Sehat</span>
          <strong>{memuat ? '...' : sehat}</strong>
          <span className="rb-stat-foot">
            Lihat tanaman sehat ↗
          </span>
        </button>

        <button
          className="rb-stat"
          onClick={() =>
            bukaHalaman('tanaman', 'Perlu Perhatian')
          }
        >
          <span className="rb-stat-icon">🪴</span>
          <span className="rb-stat-label">Perlu Perhatian</span>
          <strong>{memuat ? '...' : perhatian}</strong>
          <span className="rb-stat-foot">
            Perlu Perawatan + Kritis ↗
          </span>
        </button>

        <button
          className="rb-stat"
          onClick={() =>
            bukaHalaman('jadwal', 'Belum')
          }
        >
          <span className="rb-stat-icon">📅</span>
          <span className="rb-stat-label">Tugas Perawatan</span>
          <strong>{memuat ? '...' : belumSelesai}</strong>
          <span className="rb-stat-foot">
            Lihat tugas aktif ↗
          </span>
        </button>
      </section>

      {pesanError && (
        <div className="rb-empty" role="alert">
          <p>{pesanError}</p>
          <button type="button" onClick={muatDataDashboard}>
            Coba lagi
          </button>
        </div>
      )}

      {/* Aktivitas dan tanaman yang perlu perhatian */}
      <section className="rb-panels">
        <article className="rb-panel">
          <div className="rb-panel-heading">
            <div>
              <h3>Aktivitas Perawatan</h3>
              <p>Jadwal yang sudah selesai</p>
            </div>

            <button
              className="rb-text-button"
              onClick={() => bukaHalaman('jadwal', 'Selesai')}
            >
              Lihat semua ↗
            </button>
          </div>

          {memuat ? (
            <div className="rb-empty">
              <p>Memuat aktivitas perawatan...</p>
            </div>
          ) : aktivitasSelesai.length === 0 ? (
            <div className="rb-empty">
              <span>🌿</span>
              <strong>Belum ada aktivitas selesai</strong>
              <p>
                Aktivitas akan muncul setelah jadwal ditandai selesai.
              </p>
              <button
                onClick={() => bukaHalaman('jadwal', 'Semua')}
              >
                Buka jadwal perawatan
              </button>
            </div>
          ) : (
            <div className="rb-list">
              {aktivitasSelesai.map((item) => (
                <div className="rb-list-item" key={item.id}>
                  <span className="rb-list-icon">✓</span>

                  <div className="rb-list-info">
                    <strong>{item.kegiatan}</strong>
                    <span>{item.tanaman}</span>
                    <small>{item.tanggal}</small>
                  </div>

                  <span className="rb-badge rb-badge-done">
                    Selesai
                  </span>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="rb-panel">
          <div className="rb-panel-heading">
            <div>
              <h3>Perlu Perhatian</h3>
              <p>Tanaman yang butuh pemeriksaan</p>
            </div>

            <button
              className="rb-text-button"
              onClick={() =>
                bukaHalaman('tanaman', 'Perlu Perhatian')
              }
            >
              Lihat semua ↗
            </button>
          </div>

          {memuat ? (
            <div className="rb-empty">
              <p>Memuat data tanaman...</p>
            </div>
          ) : tanamanPerhatian.length === 0 ? (
            <div className="rb-empty">
              <span>🌳</span>
              <strong>Semua tanaman terkendali!</strong>
              <p>
                Belum ada tanaman yang perlu perhatian.
              </p>
            </div>
          ) : (
            <div className="rb-list">
              {tanamanPerhatian.slice(0, 4).map((item) => (
                <button
                  className="rb-list-item rb-clickable"
                  key={item.id}
                  onClick={() =>
                    bukaHalaman('tanaman', item.kondisi)
                  }
                >
                  <span className="rb-list-icon">🌿</span>

                  <span className="rb-list-info">
                    <strong>{item.nama_tanaman}</strong>
                    <span>{item.lokasi || '-'}</span>
                  </span>

                  <span
                    className={`rb-badge ${
                      item.kondisi === 'Kritis'
                        ? 'rb-badge-critical'
                        : 'rb-badge-care'
                    }`}
                  >
                    {item.kondisi}
                  </span>
                </button>
              ))}
            </div>
          )}
        </article>
      </section>

      <footer className="rb-footer">
        <span>RaBu — RawatBumi 🌱</span>
        <span>Rawat hari ini, hijaukan masa depan.</span>
      </footer>
    </div>
  );
}

export default Dashboard;
