
import { useEffect, useState } from 'react';
import { bacaTanaman } from '../data/tanamanStorage';
import '../App.css';

const KUNCI_JADWAL = 'rawatbumi-jadwal-perawatan';

function bacaJadwal() {
  try {
    const data = localStorage.getItem(KUNCI_JADWAL);

    return data ? JSON.parse(data) : [
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
  } catch {
    return [];
  }
}

function Dashboard({ bukaHalaman }) {
  const [tanaman, setTanaman] = useState(bacaTanaman);
  const [jadwal, setJadwal] = useState(bacaJadwal);

  useEffect(() => {
    function perbarui() {
      setTanaman(bacaTanaman());
      setJadwal(bacaJadwal());
    }

    window.addEventListener('tanaman-berubah', perbarui);
    window.addEventListener('jadwal-berubah', perbarui);
    window.addEventListener('storage', perbarui);

    return () => {
      window.removeEventListener('tanaman-berubah', perbarui);
      window.removeEventListener('jadwal-berubah', perbarui);
      window.removeEventListener('storage', perbarui);
    };
  }, []);

  const sehat = tanaman.filter(
    (item) => item.kondisi === 'Sehat'
  ).length;

  const perhatian = tanaman.filter(
    (item) =>
      item.kondisi === 'Perlu Perawatan' ||
      item.kondisi === 'Kritis'
  ).length;

  const belumSelesai = jadwal.filter(
    (item) => item.status === 'Belum Selesai'
  ).length;

  const aktivitasSelesai = jadwal
    .filter((item) => item.status === 'Selesai')
    .slice()
    .reverse()
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

        {/* Logo bulat di sebelah kanan */}
        <div className="rb-welcome-logo">
          <img
            src="/logo-rabu.png"
            alt="Logo RaBu"
          />
        </div>
      </section>

      {/* Statistik tanaman */}
      <section className="rb-stats">
        <button
          className="rb-stat"
          onClick={() => bukaHalaman('tanaman', 'Semua')}
        >
          <span className="rb-stat-icon">🌱</span>
          <span className="rb-stat-label">Total Tanaman</span>
          <strong>{tanaman.length}</strong>
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
          <strong>{sehat}</strong>
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
          <strong>{perhatian}</strong>
          <span className="rb-stat-foot">
            Perlu Perawatan + Kritis ↗
          </span>
        </button>

        <button
          className="rb-stat"
          onClick={() =>
            bukaHalaman('jadwal', 'Belum Selesai')
          }
        >
          <span className="rb-stat-icon">📅</span>
          <span className="rb-stat-label">Tugas Perawatan</span>
          <strong>{belumSelesai}</strong>
          <span className="rb-stat-foot">
            Lihat tugas aktif ↗
          </span>
        </button>
      </section>

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
              onClick={() =>
                bukaHalaman('jadwal', 'Selesai')
              }
            >
              Lihat semua ↗
            </button>
          </div>

          {aktivitasSelesai.length === 0 ? (
            <div className="rb-empty">
              <span>🌿</span>
              <strong>Belum ada aktivitas selesai</strong>
              <p>
                Aktivitas akan muncul setelah jadwal ditandai selesai.
              </p>
              <button
                onClick={() =>
                  bukaHalaman('jadwal', 'Semua')
                }
              >
                Buka jadwal perawatan
              </button>
            </div>
          ) : (
            <div className="rb-list">
              {aktivitasSelesai.map((item) => (
                <div
                  className="rb-list-item"
                  key={item.id}
                >
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

          {tanamanPerhatian.length === 0 ? (
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
                    <strong>{item.nama}</strong>
                    <span>{item.lokasi}</span>
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