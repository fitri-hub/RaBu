// Halaman dashboard pengelola tanaman.

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './DashboardPengelola.css';

function IconPlant({ className = '' }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22v-9" />
      <path d="M9 13a5 5 0 0 1 5-5c2.5 0 4.5 1 5.5 3-1 2.5-3 4-5.5 4H9Z" />
      <path d="M15 11a5 5 0 0 0-5-5c-2.5 0-4.5 1-5.5 3 1 2.5 3 4 5.5 4h5Z" />
    </svg>
  );
}

function IconShieldCheck({ className = '' }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconAlertTriangle({ className = '' }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconCalendar({ className = '' }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  );
}

function IconClock({ className = '' }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconCheck({ className = '' }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconMapPin({ className = '' }) {
  return (
    <svg className={className} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconArrowRight({ className = '' }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function formatTanggal(strTanggal) {
  if (!strTanggal) return '-';
  try {
    const d = new Date(strTanggal);
    if (isNaN(d.getTime())) return strTanggal;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return strTanggal;
  }
}

function DashboardPengelola({ bukaHalaman }) {
  const [tanaman, setTanaman] = useState([]);
  const [jadwal, setJadwal] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [pesanError, setPesanError] = useState('');
  const [waktuSekarang, setWaktuSekarang] = useState(new Date());

  const hariIni = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const jamSekarang = waktuSekarang.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Update jam setiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      setWaktuSekarang(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function muatDataDashboard() {
    setMemuat(true);
    setPesanError('');

    try {
      const { data: dataTanaman, error: errorTanaman } = await supabase
        .from('tanaman')
        .select('id, nama_tanaman, lokasi, kondisi, penanggung_jawab')
        .order('id', { ascending: true });

      if (errorTanaman) throw errorTanaman;

      const { data: dataJadwal, error: errorJadwal } = await supabase
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
            item.tanaman?.nama_tanaman || 'Tanaman tidak ditemukan',
          lokasiTanaman: item.tanaman?.lokasi || '',
          kegiatan:
            item.kegiatan ||
            item.jenis_perawatan ||
            'Perawatan rutin',
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

  const totalTanaman = tanaman.length;
  const sehat = tanaman.filter((item) => item.kondisi === 'Sehat').length;
  const perhatian = tanaman.filter(
    (item) => item.kondisi === 'Perlu Perawatan' || item.kondisi === 'Kritis'
  ).length;
  const belumSelesai = jadwal.filter((item) => item.status === 'Belum').length;

  const aktivitasSelesai = jadwal
    .filter((item) => item.status === 'Selesai')
    .slice(0, 5);

  const tanamanPerhatian = tanaman.filter(
    (item) => item.kondisi === 'Perlu Perawatan' || item.kondisi === 'Kritis'
  );

  const persenSehat =
    totalTanaman > 0 ? Math.round((sehat / totalTanaman) * 100) : 0;

  return (
    <div className="rb-dashboard">
      {/* Header Dashboard Pengelola yang Besar & Jelas */}
      <header className="rb-topbar-open">
        <div className="rb-topbar-left">
          <h1 className="rb-title-large">Dashboard Pengelola</h1>
        </div>

        <div className="rb-topbar-right">
          <div className="rb-datetime-group">
            <div className="rb-date-open">
              <IconCalendar />
              <span>{hariIni}</span>
            </div>

            <div className="rb-time-open">
              <IconClock />
              <span>{jamSekarang}</span>
            </div>
          </div>

          <div className="rb-actions-open">
            <button
              type="button"
              className="rb-btn-open"
              onClick={() => bukaHalaman('tanaman')}
            >
              <IconPlant />
              <span>Katalog</span>
            </button>

            <button
              type="button"
              className="rb-btn-open active"
              onClick={() => bukaHalaman('jadwal')}
            >
              <IconCalendar />
              <span>Jadwal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner Foto Alam */}
      <section className="rb-welcome">
        <div className="rb-welcome-content">
          <div className="rb-welcome-badge-row">
            <span className="rb-welcome-label">PENGELOLA RUANG HIJAU</span>
            <span className="rb-welcome-subbadge">RaBu Ecosystem</span>
          </div>

          <h2 className="rb-welcome-title">Halo, Pengelola!</h2>

          <p className="rb-welcome-description">
            Setiap tindakan pemeliharaan yang terdata membantu menjaga kelestarian ruang hijau secara terukur dan berkelanjutan.
          </p>

          <div className="rb-welcome-chips">
            <span className="rb-welcome-chip">
              <IconPlant />
              <strong>{totalTanaman}</strong> Terdata
            </span>
            <span className="rb-welcome-chip">
              <IconShieldCheck />
              <strong>{sehat}</strong> Sehat
            </span>
            {perhatian > 0 && (
              <span className="rb-welcome-chip alert">
                <IconAlertTriangle />
                <strong>{perhatian}</strong> Butuh Aksi
              </span>
            )}
          </div>
        </div>

        <div className="rb-welcome-logo" title="Logo RaBu">
          <img src="/logo-rabu.png" alt="Logo RaBu" />
        </div>
      </section>

      {/* Grid Kartu Statistik Modern (Subteks Dihapus Sesuai Permintaan) */}
      <section className="rb-stats">
        {/* Kartu 1: Total Tanaman */}
        <button
          type="button"
          className="rb-stat-card theme-primary"
          onClick={() => bukaHalaman('tanaman', 'Semua')}
        >
          <div className="rb-stat-header">
            <span className="rb-stat-icon-wrapper">
              <IconPlant />
            </span>
            <span className="rb-stat-badge">Koleksi Terdaftar</span>
          </div>

          <div className="rb-stat-body">
            <span className="rb-stat-label">TOTAL TANAMAN</span>
            <strong className="rb-stat-value">{memuat ? '...' : totalTanaman}</strong>
          </div>

          <div className="rb-stat-footer">
            <span>Buka daftar tanaman</span>
            <IconArrowRight />
          </div>
        </button>

        {/* Kartu 2: Tanaman Sehat */}
        <button
          type="button"
          className="rb-stat-card theme-success"
          onClick={() => bukaHalaman('tanaman', 'Sehat')}
        >
          <div className="rb-stat-header">
            <span className="rb-stat-icon-wrapper">
              <IconShieldCheck />
            </span>
            <span className="rb-stat-badge">
              {memuat ? '...' : `${persenSehat}% Prima`}
            </span>
          </div>

          <div className="rb-stat-body">
            <span className="rb-stat-label">TANAMAN SEHAT</span>
            <strong className="rb-stat-value">{memuat ? '...' : sehat}</strong>
          </div>

          <div className="rb-stat-footer">
            <span>Lihat tanaman sehat</span>
            <IconArrowRight />
          </div>
        </button>

        {/* Kartu 3: Perlu Perhatian */}
        <button
          type="button"
          className="rb-stat-card theme-warning"
          onClick={() => bukaHalaman('tanaman', 'Perlu Perhatian')}
        >
          <div className="rb-stat-header">
            <span className="rb-stat-icon-wrapper">
              <IconAlertTriangle />
            </span>
            <span className={`rb-stat-badge ${perhatian > 0 ? 'badge-alert' : ''}`}>
              {perhatian > 0 ? `${perhatian} Butuh Aksi` : 'Semua Terkendali'}
            </span>
          </div>

          <div className="rb-stat-body">
            <span className="rb-stat-label">PERLU PERHATIAN</span>
            <strong className="rb-stat-value">{memuat ? '...' : perhatian}</strong>
          </div>

          <div className="rb-stat-footer">
            <span>Tinjau tanaman berisiko</span>
            <IconArrowRight />
          </div>
        </button>

        {/* Kartu 4: Tugas Perawatan */}
        <button
          type="button"
          className="rb-stat-card theme-info"
          onClick={() => bukaHalaman('jadwal', 'Belum')}
        >
          <div className="rb-stat-header">
            <span className="rb-stat-icon-wrapper">
              <IconCalendar />
            </span>
            <span className="rb-stat-badge">
              {belumSelesai > 0 ? `${belumSelesai} Jadwal Aktif` : 'Tugas Bersih'}
            </span>
          </div>

          <div className="rb-stat-body">
            <span className="rb-stat-label">TUGAS PERAWATAN</span>
            <strong className="rb-stat-value">{memuat ? '...' : belumSelesai}</strong>
          </div>

          <div className="rb-stat-footer">
            <span>Kelola jadwal tugas</span>
            <IconArrowRight />
          </div>
        </button>
      </section>

      {pesanError && (
        <div className="rb-alert-box" role="alert">
          <IconAlertTriangle />
          <div className="rb-alert-text">
            <strong>Terjadi Kendala Memuat Data</strong>
            <p>{pesanError}</p>
          </div>
          <button type="button" onClick={muatDataDashboard}>
            Coba Lagi
          </button>
        </div>
      )}

      {/* Bagian Riwayat & Pemantauan */}
      <section className="rb-panels">
        {/* PANEL 1: Riwayat Aktivitas Perawatan */}
        <article className="rb-panel">
          <div className="rb-panel-heading">
            <div className="rb-panel-title-group">
              <div className="rb-panel-heading-row">
                <h3>Aktivitas Perawatan Terkini</h3>
                <span className="rb-count-chip">
                  {memuat ? '...' : `${aktivitasSelesai.length} Terdata`}
                </span>
              </div>
              <p>Log perawatan yang telah diselesaikan oleh tim pekerja</p>
            </div>

            <button
              type="button"
              className="rb-pill-btn"
              onClick={() => bukaHalaman('jadwal', 'Selesai')}
            >
              <span>Semua Riwayat</span>
              <IconArrowRight />
            </button>
          </div>

          {memuat ? (
            <div className="rb-loading-state">
              <div className="rb-spinner" />
              <span>Memuat data aktivitas...</span>
            </div>
          ) : aktivitasSelesai.length === 0 ? (
            <div className="rb-empty-state">
              <div className="rb-empty-icon">
                <IconCalendar />
              </div>
              <strong>Belum Ada Riwayat Perawatan</strong>
              <p>
                Aktivitas akan tercatat otomatis saat pekerja menyelesaikan jadwal perawatan.
              </p>
              <button
                type="button"
                className="rb-pill-btn"
                onClick={() => bukaHalaman('jadwal', 'Semua')}
              >
                Buka Jadwal Perawatan
              </button>
            </div>
          ) : (
            <div className="rb-activity-feed">
              {aktivitasSelesai.map((item) => (
                <div className="rb-feed-item" key={item.id}>
                  <div className="rb-feed-indicator">
                    <span className="rb-check-bubble">
                      <IconCheck />
                    </span>
                    <span className="rb-feed-line" />
                  </div>

                  <div className="rb-feed-content">
                    <div className="rb-feed-header">
                      <h4 className="rb-feed-title">{item.kegiatan}</h4>
                      <span className="rb-status-pill success">
                        <span className="rb-dot" />
                        Selesai
                      </span>
                    </div>

                    <div className="rb-feed-meta">
                      <span className="rb-meta-pill plant">
                        <IconPlant />
                        {item.tanaman}
                      </span>

                      {item.lokasiTanaman && (
                        <span className="rb-meta-pill location">
                          <IconMapPin />
                          {item.lokasiTanaman}
                        </span>
                      )}

                      <span className="rb-meta-pill time">
                        <IconCalendar />
                        {formatTanggal(item.tanggal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        {/* PANEL 2: Tanaman Butuh Perhatian Segera */}
        <article className="rb-panel">
          <div className="rb-panel-heading">
            <div className="rb-panel-title-group">
              <div className="rb-panel-heading-row">
                <h3>Perlu Perhatian Segera</h3>
                <span className={`rb-count-chip ${tanamanPerhatian.length > 0 ? 'alert' : ''}`}>
                  {memuat ? '...' : `${tanamanPerhatian.length} Tanaman`}
                </span>
              </div>
              <p>Daftar tanaman berstatus Kritis atau Perlu Perawatan</p>
            </div>

            <button
              type="button"
              className="rb-pill-btn"
              onClick={() => bukaHalaman('tanaman', 'Perlu Perhatian')}
            >
              <span>Lihat Semua</span>
              <IconArrowRight />
            </button>
          </div>

          {memuat ? (
            <div className="rb-loading-state">
              <div className="rb-spinner" />
              <span>Memeriksa kondisi tanaman...</span>
            </div>
          ) : tanamanPerhatian.length === 0 ? (
            <div className="rb-empty-state">
              <div className="rb-empty-icon success-icon">
                <IconShieldCheck />
              </div>
              <strong>Kondisi Tanaman Prima!</strong>
              <p>
                Tidak ada tanaman yang berstatus Kritis atau Perlu Perawatan saat ini.
              </p>
            </div>
          ) : (
            <div className="rb-triage-list">
              {tanamanPerhatian.slice(0, 5).map((item) => {
                const isKritis = item.kondisi === 'Kritis';
                return (
                  <button
                    type="button"
                    className={`rb-triage-card ${isKritis ? 'card-critical' : 'card-warning'}`}
                    key={item.id}
                    onClick={() => bukaHalaman('tanaman', item.kondisi)}
                  >
                    <div className="rb-triage-icon-col">
                      <span className={`rb-triage-icon ${isKritis ? 'icon-critical' : 'icon-warning'}`}>
                        <IconAlertTriangle />
                      </span>
                    </div>

                    <div className="rb-triage-info">
                      <div className="rb-triage-title-row">
                        <strong className="rb-triage-name">{item.nama_tanaman}</strong>
                        <span className={`rb-status-pill ${isKritis ? 'danger' : 'warning'}`}>
                          <span className={`rb-dot ${isKritis ? 'pulse' : ''}`} />
                          {item.kondisi}
                        </span>
                      </div>

                      <div className="rb-triage-meta-row">
                        <span className="rb-meta-pill location">
                          <IconMapPin />
                          {item.lokasi || 'Lokasi belum diatur'}
                        </span>

                        {item.penanggung_jawab && (
                          <span className="rb-meta-pill pj">
                            PJ: {item.penanggung_jawab}
                          </span>
                        )}

                        <span className="rb-action-hint">
                          <span>Periksa detail</span>
                          <IconArrowRight />
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </article>
      </section>

      {/* Kontainer paling bawah telah dihapus sesuai permintaan */}
    </div>
  );
}

export default DashboardPengelola;
