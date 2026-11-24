// Halaman Estafet Pengelola — Manajemen Alih Kelola Jabatan RaBu
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './EstafetPengelola.css';

// ===== ICONS =====
function IconCrown({ className = '' }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}

function IconUserCheck({ className = '' }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}

function IconHistory({ className = '' }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

function IconArrowRight({ className = '' }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function IconShieldAlert({ className = '' }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function IconCalendar({ className = '' }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

// ===== HELPER FORMAT TANGGAL =====
function formatTanggalLengkap(strTanggal) {
  if (!strTanggal) return '-';
  try {
    const d = new Date(strTanggal);
    if (isNaN(d.getTime())) return strTanggal;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return strTanggal;
  }
}

function EstafetPengelola() {
  const [pekerja, setPekerja] = useState([]);
  const [riwayat, setRiwayat] = useState([]);
  const [pengelolaId, setPengelolaId] = useState('');
  const [namaPengelolaLama, setNamaPengelolaLama] = useState('');
  const [calonPengelola, setCalonPengelola] = useState('');
  const [statusLama, setStatusLama] = useState('pekerja');
  const [alasan, setAlasan] = useState('');
  const [memuat, setMemuat] = useState(true);
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState('');
  const [error, setError] = useState('');
  const [modalKonfirmasi, setModalKonfirmasi] = useState(false);

  useEffect(() => {
    ambilData();
  }, []);

  async function ambilData() {
    setMemuat(true);
    setError('');

    const { data: auth, error: errorAuth } = await supabase.auth.getUser();

    if (errorAuth || !auth?.user) {
      setError('Sesi pengguna tidak ditemukan.');
      setMemuat(false);
      return;
    }

    setPengelolaId(auth.user.id);

    // Ambil nama pengelola saat ini
    const { data: profilSaya } = await supabase
      .from('profiles')
      .select('nama_lengkap')
      .eq('id', auth.user.id)
      .maybeSingle();

    if (profilSaya) {
      setNamaPengelolaLama(profilSaya.nama_lengkap || 'Pengelola');
    }

    // Ambil daftar pekerja aktif
    const { data: daftarPekerja, error: errorPekerja } = await supabase
      .from('profiles')
      .select('id, nama_lengkap')
      .eq('role', 'pekerja')
      .eq('aktif', true)
      .order('nama_lengkap');

    if (errorPekerja) {
      setError('Gagal mengambil daftar pekerja: ' + errorPekerja.message);
      setMemuat(false);
      return;
    }

    setPekerja(daftarPekerja || []);

    // Ambil riwayat estafet
    const { data: dataRiwayat, error: errorRiwayat } = await supabase
      .from('riwayat_estafet')
      .select('*')
      .order('tanggal_estafet', { ascending: false });

    if (errorRiwayat) {
      setError('Gagal mengambil riwayat: ' + errorRiwayat.message);
      setMemuat(false);
      return;
    }

    const semuaId = [
      ...new Set(
        (dataRiwayat || []).flatMap((item) => [
          item.pengelola_lama,
          item.pengelola_baru,
        ]).filter(Boolean)
      ),
    ];

    let daftarNama = [];

    if (semuaId.length > 0) {
      const { data, error: errorNama } = await supabase
        .from('profiles')
        .select('id, nama_lengkap')
        .in('id', semuaId);

      if (errorNama) {
        setError('Gagal mengambil nama pada riwayat: ' + errorNama.message);
        setMemuat(false);
        return;
      }

      daftarNama = data || [];
    }

    const namaMap = Object.fromEntries(
      daftarNama.map((item) => [item.id, item.nama_lengkap])
    );

    setRiwayat(
      (dataRiwayat || []).map((item) => ({
        ...item,
        namaLama: namaMap[item.pengelola_lama] || 'Pengguna',
        namaBaru: namaMap[item.pengelola_baru] || 'Pengguna',
      }))
    );

    setMemuat(false);
  }

  function bukaModalKonfirmasi(event) {
    event.preventDefault();
    setError('');

    if (!calonPengelola) {
      setError('Silakan pilih calon pengelola baru terlebih dahulu.');
      return;
    }

    if (calonPengelola === pengelolaId) {
      setError('Tidak dapat memilih akun Anda sendiri sebagai calon pengelola.');
      return;
    }

    setModalKonfirmasi(true);
  }

  async function prosesEstafet() {
    setMenyimpan(true);
    setModalKonfirmasi(false);
    setError('');

    const { error: errorEstafet } = await supabase.rpc('estafet_pengelola', {
      p_pengelola_baru: calonPengelola,
      p_status_lama: statusLama,
      p_alasan: alasan.trim() || null,
    });

    if (errorEstafet) {
      setError('Estafet gagal: ' + errorEstafet.message);
      setMenyimpan(false);
      return;
    }

    alert(
      'Estafet kepengelolaan berhasil! Hak akses telah dialihkan. Anda akan keluar secara otomatis, silakan masuk kembali untuk mengakses RaBu sesuai peran baru Anda.'
    );

    const { error: errorLogout } = await supabase.auth.signOut();

    if (errorLogout) {
      setError('Estafet berhasil, tetapi gagal keluar: ' + errorLogout.message);
      setMenyimpan(false);
    }
  }

  const calonTerpilih = pekerja.find((p) => p.id === calonPengelola);

  return (
    <div className="estafet-page">
      {/* HEADER SECTION */}
      <header className="page-header">
        <div>
          <h1>Estafet Pengelola</h1>
        </div>
      </header>

      {/* FEEDBACK ERROR / PESAN */}
      {error && (
        <div className="estafet-feedback estafet-feedback--error" role="alert">
          <IconShieldAlert />
          <span>{error}</span>
        </div>
      )}
      {pesan && (
        <div className="estafet-feedback estafet-feedback--sukses" role="status">
          <span>✓ {pesan}</span>
        </div>
      )}

      {/* KARTU STATISTIK RINGKASAN */}
      <div className="estafet-stats-grid">
        <article className="estafet-stat-card theme-current">
          <div className="stat-card-header">
            <span className="stat-card-icon"><IconCrown /></span>
            <span className="stat-card-badge">Penanggung Jawab</span>
          </div>
          <div className="stat-card-body">
            <span className="stat-card-label">PENGELOLA SAAT INI</span>
            <strong className="stat-card-value">{memuat ? '...' : namaPengelolaLama || 'Anda'}</strong>
          </div>
        </article>

        <article className="estafet-stat-card theme-workers">
          <div className="stat-card-header">
            <span className="stat-card-icon"><IconUserCheck /></span>
            <span className="stat-card-badge">Siap Menerima</span>
          </div>
          <div className="stat-card-body">
            <span className="stat-card-label">PEKERJA AKTIF</span>
            <strong className="stat-card-value">{memuat ? '...' : `${pekerja.length} Orang`}</strong>
          </div>
        </article>

        <article className="estafet-stat-card theme-history">
          <div className="stat-card-header">
            <span className="stat-card-icon"><IconHistory /></span>
            <span className="stat-card-badge">Rekam Jejak</span>
          </div>
          <div className="stat-card-body">
            <span className="stat-card-label">TOTAL PERGANTIAN</span>
            <strong className="stat-card-value">{memuat ? '...' : `${riwayat.length} Kali`}</strong>
          </div>
        </article>
      </div>

      {/* BANNER INFORMASI KEBERLANJUTAN */}
      <section className="estafet-banner">
        <div className="estafet-banner-icon">
          <span>🌱</span>
        </div>
        <div className="estafet-banner-text">
          <h3>Prinsip Keberlanjutan Komunitas RaBu</h3>
          <p>
            Proses estafet kepengelolaan menjamin kelangsungan rawat bumi secara mulus. Semua data master tanaman,
            riwayat perawatan harian, dan tugas tim pekerja akan tetap aman dan otomatis diteruskan ke pengelola baru.
          </p>
        </div>
      </section>

      {/* PANEL FORMULIR ESTAFET */}
      <section className="estafet-panel">
        <div className="panel-header-block">
          <div className="panel-title-group">
            <span className="panel-pre-title">FORMULIR RESMI</span>
            <h2>Penyerahan Mandat Jabatan</h2>
            <p>Tentukan penerima mandat dan status keanggotaan Anda setelah proses serah terima selesai.</p>
          </div>
        </div>

        <div className="panel-content-body">
          {memuat ? (
            <div className="estafet-loading">
              <div className="estafet-spinner" />
              <span>Memuat pilihan pekerja...</span>
            </div>
          ) : pekerja.length === 0 ? (
            <div className="estafet-empty-workers">
              <span className="empty-icon">👥</span>
              <h4>Belum Ada Pekerja Aktif</h4>
              <p>Tambahkan atau aktifkan akun pekerja terlebih dahulu untuk dapat melakukan estafet jabatan.</p>
            </div>
          ) : (
            <form onSubmit={bukaModalKonfirmasi} className="estafet-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="calonPengelola">
                    Calon Pengelola Baru *
                  </label>
                  <div className="input-wrap">
                    <select
                      id="calonPengelola"
                      value={calonPengelola}
                      onChange={(e) => setCalonPengelola(e.target.value)}
                      required
                    >
                      <option value="">— Pilih salah satu pekerja aktif —</option>
                      {pekerja.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nama_lengkap}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="form-hint">Hanya akun pekerja dengan status aktif yang dapat dipilih.</span>
                </div>

                <div className="form-group">
                  <label htmlFor="statusLama">
                    Status Anda Setelah Estafet *
                  </label>
                  <div className="input-wrap">
                    <select
                      id="statusLama"
                      value={statusLama}
                      onChange={(e) => setStatusLama(e.target.value)}
                    >
                      <option value="pekerja">Tetap aktif berkontribusi sebagai Pekerja</option>
                      <option value="nonaktif">Nonaktifkan akun (Keluar dari komunitas RaBu)</option>
                    </select>
                  </div>
                  <span className="form-hint">Tentukan apakah Anda tetap ingin membantu merawat tanaman di lapangan.</span>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="alasan">
                  Alasan Pergantian Mandat (Opsional)
                </label>
                <textarea
                  id="alasan"
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  placeholder="Contoh: Purna tugas kepengurusan periode 2026, rotasi tanggung jawab berkala, dsb..."
                  rows={3}
                />
              </div>

              {/* KARTU PREVIEW TRANSISI JIKA CALON DIPILIH */}
              {calonTerpilih && (
                <div className="estafet-preview-card">
                  <div className="preview-header">
                    <span className="preview-badge">RINGKASAN SERAH TERIMA</span>
                  </div>
                  <div className="preview-flow">
                    <div className="preview-person">
                      <span className="person-role">PENGELOLA LAMA</span>
                      <strong className="person-name">{namaPengelolaLama || 'Anda'}</strong>
                      <span className="person-future">
                        {statusLama === 'pekerja' ? '→ Menjadi Pekerja' : '→ Nonaktif'}
                      </span>
                    </div>

                    <div className="preview-arrow">
                      <IconArrowRight />
                    </div>

                    <div className="preview-person highlight">
                      <span className="person-role">PENGELOLA BARU</span>
                      <strong className="person-name">{calonTerpilih.nama_lengkap}</strong>
                      <span className="person-future">→ Memegang Hak Pengelola Penuh</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="form-actions-row">
                <button
                  type="submit"
                  className="btn-submit-estafet"
                  disabled={menyimpan || !calonPengelola}
                >
                  <IconCrown />
                  <span>{menyimpan ? 'Memproses Alih Jabatan...' : 'Serahkan Jabatan Pengelola'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* PANEL RIWAYAT ESTAFET */}
      <section className="estafet-panel">
        <div className="panel-header-block">
          <div className="panel-title-group">
            <span className="panel-pre-title">REKAM JEJAK KEPENGURUSAN</span>
            <h2>Riwayat Estafet Jabatan</h2>
            <p>Arsip catatan alih kepengurusan RaBu yang pernah dilakukan sebelumnya.</p>
          </div>
          <span className="history-count-badge">
            {riwayat.length} Catatan Terdata
          </span>
        </div>

        <div className="panel-content-body">
          {memuat ? (
            <div className="estafet-loading">
              <div className="estafet-spinner" />
              <span>Memuat rekam jejak...</span>
            </div>
          ) : riwayat.length === 0 ? (
            <div className="estafet-empty-state">
              <div className="empty-state-icon">
                <IconHistory />
              </div>
              <h4>Belum Ada Riwayat Pergantian</h4>
              <p>Belum pernah ada proses serah terima jabatan pengelola yang tercatat di sistem.</p>
            </div>
          ) : (
            <div className="estafet-history-grid">
              {riwayat.map((item) => {
                const isPekerja = item.status_pengelola_lama === 'pekerja';
                return (
                  <article className="estafet-history-card" key={item.id}>
                    <div className="history-card-top">
                      <div className="history-transfer-flow">
                        <div className="person-pill from">
                          <span className="pill-dot" />
                          <span className="pill-name">{item.namaLama}</span>
                        </div>
                        <span className="history-arrow"><IconArrowRight /></span>
                        <div className="person-pill to">
                          <span className="pill-crown">👑</span>
                          <span className="pill-name">{item.namaBaru}</span>
                        </div>
                      </div>

                      <span className={`status-pill ${isPekerja ? 'status-pekerja' : 'status-nonaktif'}`}>
                        {isPekerja ? 'Tetap Jadi Pekerja' : 'Akun Nonaktif'}
                      </span>
                    </div>

                    {item.alasan ? (
                      <div className="history-reason-box">
                        <span className="reason-label">Alasan Pergantian:</span>
                        <p className="reason-text">"{item.alasan}"</p>
                      </div>
                    ) : (
                      <p className="history-no-reason">Tidak menyertakan catatan alasan.</p>
                    )}

                    <div className="history-card-footer">
                      <span className="history-time">
                        <IconCalendar />
                        {formatTanggalLengkap(item.tanggal_estafet)}
                      </span>
                      <span className="history-verified">
                        ✓ Berhasil Dialihkan
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* MODAL KONFIRMASI ESTAFET */}
      {modalKonfirmasi && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Konfirmasi Estafet">
          <div className="modal-card">
            <div className="modal-icon-badge">
              <IconShieldAlert />
            </div>
            <h3>Konfirmasi Pengalihan Jabatan</h3>
            <p>
              Anda akan menyerahkan jabatan <strong>Pengelola Utama RaBu</strong> kepada rekan:
            </p>
            <div className="modal-target-box">
              <strong>{calonTerpilih?.nama_lengkap}</strong>
              <span>
                Status Anda selanjutnya: {statusLama === 'pekerja' ? 'Pekerja Aktif' : 'Keluar / Nonaktif'}
              </span>
            </div>
            <p className="modal-warning-text">
              ⚠️ Setelah proses ini selesai, hak akses Anda sebagai pengelola akan langsung dicabut dan Anda akan dialihkan keluar (logout). Apakah Anda yakin ingin melanjutkan?
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setModalKonfirmasi(false)}
              >
                Batalkan
              </button>
              <button
                type="button"
                className="btn-modal-confirm"
                onClick={prosesEstafet}
                disabled={menyimpan}
              >
                {menyimpan ? 'Memproses...' : 'Ya, Serahkan Jabatan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EstafetPengelola;
