import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import './TugasPekerja.css';

// ===== HELPER =====
function formatTanggal(tanggalStr) {
  if (!tanggalStr) return '-';
  const d = new Date(tanggalStr + 'T00:00:00');
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function statusTanggal(tanggalStr, statusItem) {
  if (statusItem === 'Selesai') return 'selesai';
  const hari_ini = new Date();
  hari_ini.setHours(0, 0, 0, 0);
  const tgl = new Date(tanggalStr + 'T00:00:00');
  if (tgl < hari_ini) return 'terlambat';
  if (tgl.getTime() === hari_ini.getTime()) return 'hari_ini';
  return 'akan_datang';
}

function TugasPekerja({ bukaHalaman }) {
  const [tugas, setTugas] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [error, setError] = useState('');
  const [tugasDiproses, setTugasDiproses] = useState(null);
  const [filter, setFilter] = useState('Semua');
  const [pesanSukses, setPesanSukses] = useState('');

  async function muatTugas() {
    setMemuat(true);
    setError('');

    const { data: sesiData, error: sesiError } = await supabase.auth.getSession();
    if (sesiError || !sesiData.session) {
      setError('Sesi login tidak ditemukan. Silakan login kembali.');
      setMemuat(false);
      return;
    }

    const userId = sesiData.session.user.id;

    const { data, error: tugasError } = await supabase
      .from('jadwal_perawatan')
      .select(`
        id, tanaman_id, jenis_perawatan, kegiatan, tanggal, waktu, catatan, status,
        tanaman!jadwal_perawatan_tanaman_id_fkey (id, nama_tanaman, kode, lokasi)
      `)
      .eq('user_id', userId)
      .order('tanggal', { ascending: true });

    if (tugasError) {
      setError('Tugas belum dapat dimuat. Silakan coba lagi.');
      setMemuat(false);
      return;
    }

    setTugas(data || []);
    setMemuat(false);
  }

  useEffect(() => { muatTugas(); }, []);

  async function ubahStatus(item) {
    const statusBaru = item.status === 'Selesai' ? 'Belum' : 'Selesai';
    setTugasDiproses(item.id);
    setError('');

    const { data: sesiData } = await supabase.auth.getSession();
    const userId = sesiData.session?.user?.id;

    if (!userId) {
      setError('Sesi login tidak ditemukan. Silakan login kembali.');
      setTugasDiproses(null);
      return;
    }

    const { data, error: updateError } = await supabase
      .from('jadwal_perawatan')
      .update({ status: statusBaru })
      .eq('id', item.id)
      .eq('user_id', userId)
      .select('id, status')
      .maybeSingle();

    if (updateError || !data) {
      setError('Status belum berhasil diperbarui. Coba lagi.');
    } else {
      setTugas((daftar) =>
        daftar.map((t) =>
          t.id === item.id ? { ...t, status: data.status } : t
        )
      );
      window.dispatchEvent(new Event('jadwal-berubah'));
    }
    setTugasDiproses(null);
  }

  const hari_ini_str = new Date().toISOString().slice(0, 10);

  const statistik = useMemo(() => {
    const selesai = tugas.filter((t) => t.status === 'Selesai').length;
    const terlambat = tugas.filter((t) => t.status !== 'Selesai' && t.tanggal < hari_ini_str).length;
    const hariIni = tugas.filter((t) => t.status !== 'Selesai' && t.tanggal === hari_ini_str).length;
    return { total: tugas.length, selesai, terlambat, hariIni, belum: tugas.length - selesai };
  }, [tugas]);

  const tugasTampil = useMemo(() => {
    let hasil = tugas;
    if (filter === 'Belum') hasil = hasil.filter((t) => t.status !== 'Selesai');
    else if (filter === 'Selesai') hasil = hasil.filter((t) => t.status === 'Selesai');
    else if (filter === 'HariIni') hasil = hasil.filter((t) => t.tanggal === hari_ini_str && t.status !== 'Selesai');
    else if (filter === 'Terlambat') hasil = hasil.filter((t) => t.status !== 'Selesai' && t.tanggal < hari_ini_str);

    // Urutan: terlambat → hari ini → akan datang → selesai
    return hasil.slice().sort((a, b) => {
      const p = (item) => {
        if (item.status === 'Selesai') return 3;
        if (item.tanggal < hari_ini_str) return 0;
        if (item.tanggal === hari_ini_str) return 1;
        return 2;
      };
      return p(a) - p(b) || a.tanggal.localeCompare(b.tanggal);
    });
  }, [tugas, filter]);

  if (memuat) {
    return (
      <section className="tugas-pekerja">
        <button type="button" className="tombol-kembali" onClick={() => bukaHalaman?.('dashboard-pekerja')}>← Kembali</button>
        <p className="tugas-loading">⏳ Memuat tugas perawatan...</p>
      </section>
    );
  }

  return (
    <section className="tugas-pekerja">
      <button type="button" className="tombol-kembali" onClick={() => bukaHalaman?.('dashboard-pekerja')}>← Kembali</button>

      <header className="tugas-header">
        <div>
          <p className="tugas-breadcrumb"></p>
          <h1>Tugas Perawatan</h1>
          <p className="tugas-subtitle">
            Pantau dan selesaikan tugas perawatan tanaman yang menjadi
            tanggung jawabmu.
          </p>
        </div>
        <button type="button" className="tugas-refresh" onClick={muatTugas}>↻ Muat Ulang</button>
      </header>

      {error && <div className="tugas-error" role="alert">{error}</div>}
      {pesanSukses && <div className="tugas-sukses" role="status">{pesanSukses}</div>}

      {/* BANNER PENGINGAT */}
      {(statistik.terlambat > 0 || statistik.hariIni > 0) && (
        <div className="tugas-pengingat-banner">
          {statistik.terlambat > 0 && (
            <div className="tugas-pengingat tugas-pengingat--merah" onClick={() => setFilter('Terlambat')} role="button" tabIndex={0}>
              <span>🚨</span>
              <div>
                <strong>{statistik.terlambat} tugas terlambat</strong>
                <p>Belum selesai dan sudah melewati batas waktu.</p>
              </div>
            </div>
          )}
          {statistik.hariIni > 0 && (
            <div className="tugas-pengingat tugas-pengingat--biru" onClick={() => setFilter('HariIni')} role="button" tabIndex={0}>
              <span>📅</span>
              <div>
                <strong>{statistik.hariIni} tugas hari ini</strong>
                <p>Harus diselesaikan hari ini.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RINGKASAN */}
      <div className="tugas-ringkasan">
        <article className="tugas-ringkasan-card" onClick={() => setFilter('Semua')}>
          <span>Total Tugas</span>
          <strong>{statistik.total}</strong>
        </article>
        <article className="tugas-ringkasan-card tugas-ringkasan-card--warning" onClick={() => setFilter('Terlambat')}>
          <span>🚨 Terlambat</span>
          <strong>{statistik.terlambat}</strong>
        </article>
        <article className="tugas-ringkasan-card tugas-ringkasan-card--info" onClick={() => setFilter('HariIni')}>
          <span>📅 Hari Ini</span>
          <strong>{statistik.hariIni}</strong>
        </article>
        <article className="tugas-ringkasan-card tugas-ringkasan-card--done" onClick={() => setFilter('Selesai')}>
          <span>✓ Selesai</span>
          <strong>{statistik.selesai}</strong>
        </article>
      </div>

      {/* DAFTAR TUGAS */}
      <div className="tugas-daftar-panel">
        <div className="tugas-daftar-heading">
          <div>
            <h2>Daftar Tugas Saya</h2>
            <p>{tugasTampil.length} tugas ditampilkan</p>
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter status tugas">
            <option value="Semua">Semua Status</option>
            <option value="HariIni">📅 Hari Ini</option>
            <option value="Terlambat">🚨 Terlambat</option>
            <option value="Belum">Belum Selesai</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>

        {tugasTampil.length === 0 ? (
          <div className="tugas-kosong">
            <span className="tugas-kosong-ikon">🌱</span>
            <h3>Tidak Ada Tugas</h3>
            <p>
              {tugas.length === 0
                ? 'Belum ada jadwal perawatan yang ditugaskan ke akunmu.'
                : 'Tidak ada tugas dengan status yang dipilih.'}
            </p>
            {filter !== 'Semua' && (
              <button type="button" className="reset-filter-tugas" onClick={() => setFilter('Semua')}>Lihat Semua Tugas</button>
            )}
          </div>
        ) : (
          <div className="tugas-list">
            {tugasTampil.map((item) => {
              const tglStatus = statusTanggal(item.tanggal, item.status);
              const namaKegiatan = item.kegiatan || item.jenis_perawatan || 'Perawatan tanaman';
              const namaTanaman = item.tanaman?.nama_tanaman || `Tanaman #${item.tanaman_id ?? '-'}`;
              const lokasi = item.tanaman?.lokasi || '';
              const kode = item.tanaman?.kode || '';

              return (
                <article className={`tugas-item tugas-item--${tglStatus}`} key={item.id}>
                  <div className="tugas-item-kiri">
                    <div className="tugas-item-tanggal">
                      <span className="tugas-tgl-bulan">{new Date(item.tanggal + 'T00:00:00').toLocaleDateString('id-ID', { month: 'short' })}</span>
                      <span className="tugas-tgl-hari">{new Date(item.tanggal + 'T00:00:00').getDate()}</span>
                    </div>
                  </div>

                  <div className="tugas-item-info">
                    <div className="tugas-item-top">
                      <span className={`tugas-status tugas-status--${tglStatus}`}>
                        {tglStatus === 'selesai' && '✓ Selesai'}
                        {tglStatus === 'terlambat' && '🚨 Terlambat'}
                        {tglStatus === 'hari_ini' && '📅 Hari Ini'}
                        {tglStatus === 'akan_datang' && '🕐 Akan Datang'}
                      </span>
                    </div>

                    <span className="tugas-item-label">{namaKegiatan}</span>
                    <h3>{namaTanaman}{kode ? ` (${kode})` : ''}</h3>

                    <div className="tugas-item-meta">
                      {lokasi && <span>📍 {lokasi}</span>}
                      <span>🗓 {formatTanggal(item.tanggal)}{item.waktu ? ` · ${item.waktu.slice(0, 5)}` : ''}</span>
                    </div>

                    {item.catatan && (
                      <div className="tugas-catatan">
                        <strong>📝 Catatan:</strong> {item.catatan}
                      </div>
                    )}
                  </div>

                  <div className="tugas-item-aksi">
                    <button
                      type="button"
                      className={item.status === 'Selesai' ? 'tugas-btn tugas-btn--batal' : 'tugas-btn tugas-btn--selesai'}
                      disabled={tugasDiproses === item.id}
                      onClick={() => ubahStatus(item)}
                    >
                      {tugasDiproses === item.id
                        ? 'Menyimpan...'
                        : item.status === 'Selesai'
                          ? 'Batalkan'
                          : '✓ Tandai Selesai'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default TugasPekerja;
