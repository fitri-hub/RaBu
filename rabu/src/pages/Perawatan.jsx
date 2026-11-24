// Halaman jadwal & pencatatan perawatan tanaman
import { useEffect, useState, useMemo } from 'react';
import './Perawatan.css';
import { supabase } from '../lib/supabaseClient';

// ===== HELPER =====
function formatTanggal(tanggalStr) {
  if (!tanggalStr) return '-';
  const d = new Date(tanggalStr + 'T00:00:00');
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
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

const FORM_KOSONG = {
  tanaman_id: '',
  kegiatan: '',
  tanggal: '',
  waktu: '',
  user_id: '',
  catatan: '',
};

function Perawatan({ filterAwal = 'Semua' }) {
  const [jadwal, setJadwal] = useState([]);
  const [filter, setFilter] = useState(filterAwal);
  const [kataKunci, setKataKunci] = useState('');
  const [memuat, setMemuat] = useState(true);
  const [pesan, setPesan] = useState({ teks: '', tipe: '' });
  const [jadwalDiproses, setJadwalDiproses] = useState(null);
  const [daftarTanaman, setDaftarTanaman] = useState([]);
  const [daftarPekerja, setDaftarPekerja] = useState([]);
  const [formTerbuka, setFormTerbuka] = useState(false);
  const [menyimpan, setMenyimpan] = useState(false);
  const [formData, setFormData] = useState(FORM_KOSONG);
  const [idDiedit, setIdDiedit] = useState(null);
  const [idHapus, setIdHapus] = useState(null);
  const [konfirmasiHapus, setKonfirmasiHapus] = useState(null);
  const [detailTerbuka, setDetailTerbuka] = useState(null);

  // ===== MUAT DATA =====
  async function muatPilihanForm() {
    try {
      const [{ data: tanamanData, error: tanamanError }, { data: pekerjaData, error: pekerjaError }] =
        await Promise.all([
          supabase.from('tanaman').select('id, nama_tanaman, kode, lokasi').order('nama_tanaman', { ascending: true }),
          supabase.from('profiles').select('id, nama_lengkap').eq('role', 'pekerja').eq('aktif', true).order('nama_lengkap', { ascending: true }),
        ]);
      if (tanamanError) throw tanamanError;
      if (pekerjaError) throw pekerjaError;
      setDaftarTanaman(tanamanData || []);
      setDaftarPekerja(pekerjaData || []);
    } catch (err) {
      tampilPesan('Gagal memuat pilihan formulir: ' + err.message, 'error');
    }
  }

  async function muatJadwal() {
    setMemuat(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authData.user) { tampilPesan('Silakan login kembali.', 'error'); return; }

      const { data, error } = await supabase
        .from('jadwal_perawatan')
        .select(`
          id, tanaman_id, jenis_perawatan, kegiatan, tanggal, waktu, status, catatan, user_id,
          tanaman!jadwal_perawatan_tanaman_id_fkey (id, nama_tanaman, kode, lokasi),
          profiles!jadwal_perawatan_user_id_fkey (nama_lengkap)
        `)
        .order('tanggal', { ascending: true });

      if (error) throw error;

      const daftar = (data || []).map((item) => ({
        id: item.id,
        tanamanId: item.tanaman_id,
        kegiatan: item.kegiatan || item.jenis_perawatan || 'Perawatan tanaman',
        tanaman: item.tanaman?.nama_tanaman || 'Tanaman tidak ditemukan',
        kode: item.tanaman?.kode || '',
        lokasi: item.tanaman?.lokasi || '',
        penanggungJawab: item.profiles?.nama_lengkap || '-',
        userId: item.user_id,
        tanggal: item.tanggal,
        waktu: item.waktu,
        status: item.status,
        catatan: item.catatan || '',
      }));
      setJadwal(daftar);
    } catch (err) {
      tampilPesan('Gagal memuat jadwal: ' + err.message, 'error');
    } finally {
      setMemuat(false);
    }
  }

  useEffect(() => {
    muatJadwal();
    muatPilihanForm();
  }, []);

  // ===== HELPER PESAN =====
  function tampilPesan(teks, tipe = 'sukses') {
    setPesan({ teks, tipe });
    setTimeout(() => setPesan({ teks: '', tipe: '' }), 4000);
  }

  // ===== FORM =====
  function bukaFormTambah() {
    setIdDiedit(null);
    setFormData(FORM_KOSONG);
    setFormTerbuka(true);
    setDetailTerbuka(null);
  }

  function bukaFormEdit(item) {
    setIdDiedit(item.id);
    setFormData({
      tanaman_id: String(item.tanamanId),
      kegiatan: item.kegiatan,
      tanggal: item.tanggal,
      waktu: item.waktu || '',
      user_id: item.userId || '',
      catatan: item.catatan,
    });
    setFormTerbuka(true);
    setDetailTerbuka(null);
  }

  function tutupForm() {
    setFormTerbuka(false);
    setIdDiedit(null);
    setFormData(FORM_KOSONG);
  }

  function handleFormChange(field, value) {
    setFormData((f) => ({ ...f, [field]: value }));
  }

  async function simpanJadwal(event) {
    event.preventDefault();
    if (!formData.tanaman_id || !formData.kegiatan.trim() || !formData.tanggal || !formData.waktu || !formData.user_id) {
      tampilPesan('Semua kolom wajib harus diisi.', 'error');
      return;
    }
    setMenyimpan(true);
    try {
      const payload = {
        tanaman_id: Number(formData.tanaman_id),
        jenis_perawatan: formData.kegiatan.trim(),
        kegiatan: formData.kegiatan.trim(),
        tanggal: formData.tanggal,
        waktu: formData.waktu,
        user_id: formData.user_id,
        catatan: formData.catatan.trim() || null,
      };

      if (idDiedit) {
        const { error } = await supabase.from('jadwal_perawatan').update(payload).eq('id', idDiedit);
        if (error) throw error;
        tampilPesan('Jadwal berhasil diperbarui.');
      } else {
        const { error } = await supabase.from('jadwal_perawatan').insert({ ...payload, status: 'Belum' });
        if (error) throw error;
        tampilPesan('Jadwal perawatan berhasil ditambahkan.');
      }

      tutupForm();
      await muatJadwal();
      window.dispatchEvent(new Event('jadwal-berubah'));
    } catch (err) {
      tampilPesan('Gagal menyimpan jadwal: ' + err.message, 'error');
    } finally {
      setMenyimpan(false);
    }
  }

  // ===== HAPUS =====
  async function hapusJadwal(id) {
    setIdHapus(id);
    try {
      const { error } = await supabase.from('jadwal_perawatan').delete().eq('id', id);
      if (error) throw error;
      setJadwal((d) => d.filter((j) => j.id !== id));
      setKonfirmasiHapus(null);
      setDetailTerbuka(null);
      tampilPesan('Jadwal berhasil dihapus.');
      window.dispatchEvent(new Event('jadwal-berubah'));
    } catch (err) {
      tampilPesan('Gagal menghapus jadwal: ' + err.message, 'error');
    } finally {
      setIdHapus(null);
    }
  }

  // ===== UBAH STATUS =====
  async function ubahStatus(item) {
    if (jadwalDiproses !== null) return;
    const statusBaru = item.status === 'Selesai' ? 'Belum' : 'Selesai';
    setJadwalDiproses(item.id);
    try {
      const { data, error } = await supabase
        .from('jadwal_perawatan')
        .update({ status: statusBaru })
        .eq('id', item.id)
        .select('id, status');
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Status tidak berubah. Periksa izin RLS di Supabase.');
      setJadwal((d) => d.map((j) => (j.id === item.id ? { ...j, status: data[0].status } : j)));
      tampilPesan(statusBaru === 'Selesai' ? 'Jadwal ditandai selesai ✓' : 'Jadwal dikembalikan ke belum selesai.');
      window.dispatchEvent(new Event('jadwal-berubah'));
    } catch (err) {
      tampilPesan('Gagal mengubah status: ' + err.message, 'error');
    } finally {
      setJadwalDiproses(null);
    }
  }

  // ===== FILTER & STATISTIK =====
  const hari_ini_str = new Date().toISOString().slice(0, 10);

  const statistik = useMemo(() => {
    const selesai = jadwal.filter((j) => j.status === 'Selesai').length;
    const terlambat = jadwal.filter((j) => j.status !== 'Selesai' && j.tanggal < hari_ini_str).length;
    const hariIni = jadwal.filter((j) => j.status !== 'Selesai' && j.tanggal === hari_ini_str).length;
    return { total: jadwal.length, selesai, terlambat, hariIni, belum: jadwal.length - selesai };
  }, [jadwal]);

  const jadwalTampil = useMemo(() => {
    let hasil = jadwal;
    // Filter status
    if (filter === 'Belum') hasil = hasil.filter((j) => j.status !== 'Selesai');
    else if (filter === 'Selesai') hasil = hasil.filter((j) => j.status === 'Selesai');
    else if (filter === 'Terlambat') hasil = hasil.filter((j) => j.status !== 'Selesai' && j.tanggal < hari_ini_str);
    else if (filter === 'HariIni') hasil = hasil.filter((j) => j.tanggal === hari_ini_str && j.status !== 'Selesai');
    // Pencarian
    if (kataKunci.trim()) {
      const q = kataKunci.trim().toLowerCase();
      hasil = hasil.filter(
        (j) =>
          j.tanaman.toLowerCase().includes(q) ||
          j.kegiatan.toLowerCase().includes(q) ||
          j.lokasi.toLowerCase().includes(q) ||
          j.penanggungJawab.toLowerCase().includes(q)
      );
    }
    // Urutan: terlambat → hari ini → akan datang → selesai
    return hasil.slice().sort((a, b) => {
      const prioritas = (item) => {
        if (item.status === 'Selesai') return 3;
        if (item.tanggal < hari_ini_str) return 0;
        if (item.tanggal === hari_ini_str) return 1;
        return 2;
      };
      const pa = prioritas(a), pb = prioritas(b);
      if (pa !== pb) return pa - pb;
      return a.tanggal.localeCompare(b.tanggal);
    });
  }, [jadwal, filter, kataKunci]);

  // ===== RENDER =====
  return (
    <section className="page-section">
      {/* HEADER */}
      <header className="page-header">
        <div>
          <h1>Jadwal Perawatan</h1>
          <p className="page-desc">Kelola dan pantau aktivitas perawatan tanaman.</p>
        </div>
        <button type="button" className="add-schedule-btn" onClick={formTerbuka && !idDiedit ? tutupForm : bukaFormTambah}>
          {formTerbuka && !idDiedit ? '✕ Tutup Formulir' : '+ Tambah Jadwal'}
        </button>
      </header>

      {/* PESAN FEEDBACK */}
      {pesan.teks && (
        <div role="status" className={`perawatan-feedback perawatan-feedback--${pesan.tipe}`}>
          {pesan.tipe === 'sukses' ? '✓ ' : '⚠ '}{pesan.teks}
        </div>
      )}

      {/* BANNER PENGINGAT */}
      {!memuat && (statistik.terlambat > 0 || statistik.hariIni > 0) && (
        <div className="pengingat-banner">
          {statistik.terlambat > 0 && (
            <div className="pengingat-item pengingat-item--merah" onClick={() => setFilter('Terlambat')} role="button" tabIndex={0}>
              <span className="pengingat-ikon">🚨</span>
              <div>
                <strong>{statistik.terlambat} jadwal terlambat</strong>
                <p>Belum selesai dan sudah melewati tanggal yang dijadwalkan.</p>
              </div>
              <span className="pengingat-lihat">Lihat →</span>
            </div>
          )}
          {statistik.hariIni > 0 && (
            <div className="pengingat-item pengingat-item--biru" onClick={() => setFilter('HariIni')} role="button" tabIndex={0}>
              <span className="pengingat-ikon">📅</span>
              <div>
                <strong>{statistik.hariIni} jadwal hari ini</strong>
                <p>Harus diselesaikan hari ini.</p>
              </div>
              <span className="pengingat-lihat">Lihat →</span>
            </div>
          )}
        </div>
      )}

      {/* KARTU STATISTIK */}
      <div className="care-summary">
        <article className="care-card" onClick={() => setFilter('Semua')}>
          <span>Total Jadwal</span>
          <h2>{statistik.total}</h2>
        </article>
        <article className="care-card care-card--warning" onClick={() => setFilter('Terlambat')}>
          <span>⚠ Terlambat</span>
          <h2>{statistik.terlambat}</h2>
        </article>
        <article className="care-card care-card--info" onClick={() => setFilter('HariIni')}>
          <span>📅 Hari Ini</span>
          <h2>{statistik.hariIni}</h2>
        </article>
        <article className="care-card" onClick={() => setFilter('Belum')}>
          <span>Belum Selesai</span>
          <h2>{statistik.belum}</h2>
        </article>
        <article className="care-card care-card--done" onClick={() => setFilter('Selesai')}>
          <span>✓ Selesai</span>
          <h2>{statistik.selesai}</h2>
        </article>
      </div>

      {/* FORM TAMBAH / EDIT */}
      {formTerbuka && (
        <form className="schedule-form" onSubmit={simpanJadwal}>
          <div className="schedule-form-header">
            <h3>{idDiedit ? '✏️ Edit Jadwal Perawatan' : '➕ Tambah Jadwal Perawatan'}</h3>
            <button type="button" className="form-close-btn" onClick={tutupForm} aria-label="Tutup form">✕</button>
          </div>

          <div className="schedule-form-grid">
            <label>
              Pilih Tanaman *
              <select value={formData.tanaman_id} onChange={(e) => handleFormChange('tanaman_id', e.target.value)} required>
                <option value="">Pilih tanaman</option>
                {daftarTanaman.map((t) => (
                  <option key={t.id} value={t.id}>{t.nama_tanaman} — {t.lokasi}</option>
                ))}
              </select>
            </label>

            <label>
              Kegiatan Perawatan *
              <input
                type="text"
                value={formData.kegiatan}
                onChange={(e) => handleFormChange('kegiatan', e.target.value)}
                placeholder="Contoh: Menyiram, Pemupukan, Pemangkasan"
                list="saran-kegiatan"
                required
              />
              <datalist id="saran-kegiatan">
                <option value="Menyiram tanaman" />
                <option value="Pemupukan rutin" />
                <option value="Pemangkasan daun" />
                <option value="Pengecekan hama" />
                <option value="Penggantian media tanam" />
                <option value="Pembersihan area tanam" />
              </datalist>
            </label>

            <label>
              Tanggal *
              <input type="date" value={formData.tanggal} onChange={(e) => handleFormChange('tanggal', e.target.value)} required />
            </label>

            <label>
              Waktu *
              <input type="time" value={formData.waktu} onChange={(e) => handleFormChange('waktu', e.target.value)} required />
            </label>

            <label>
              Pekerja yang Ditugaskan *
              <select value={formData.user_id} onChange={(e) => handleFormChange('user_id', e.target.value)} required>
                <option value="">Pilih pekerja</option>
                {daftarPekerja.map((p) => (
                  <option key={p.id} value={p.id}>{p.nama_lengkap}</option>
                ))}
              </select>
            </label>

            <label>
              Catatan
              <textarea
                value={formData.catatan}
                onChange={(e) => handleFormChange('catatan', e.target.value)}
                placeholder="Instruksi khusus, kondisi tanaman, dsb. (opsional)"
                rows={3}
              />
            </label>
          </div>

          <div className="schedule-form-actions">
            <button type="button" className="cancel-btn" onClick={tutupForm}>Batal</button>
            <button type="submit" className="save-schedule-btn" disabled={menyimpan}>
              {menyimpan ? 'Menyimpan...' : idDiedit ? 'Perbarui Jadwal' : 'Simpan Jadwal'}
            </button>
          </div>
        </form>
      )}

      {/* PANEL TABEL */}
      <section className="panel care-panel">
        <div className="panel-heading">
          <div>
            <h3>Daftar Jadwal</h3>
            <p>{jadwalTampil.length} jadwal ditampilkan</p>
          </div>
          <div className="panel-controls">
            <input
              type="search"
              className="cari-jadwal"
              placeholder="Cari tanaman, kegiatan..."
              value={kataKunci}
              onChange={(e) => setKataKunci(e.target.value)}
              aria-label="Cari jadwal"
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter status jadwal">
              <option value="Semua">Semua Status</option>
              <option value="HariIni">📅 Hari Ini</option>
              <option value="Terlambat">🚨 Terlambat</option>
              <option value="Belum">Belum Selesai</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>

        <div className="care-table-wrap">
          {memuat && <p className="loading-text">⏳ Memuat jadwal perawatan...</p>}

          {!memuat && jadwalTampil.length > 0 && (
            <table className="care-table">
              <thead>
                <tr>
                  <th>Kegiatan</th>
                  <th>Tanaman</th>
                  <th>Lokasi</th>
                  <th>Tanggal & Waktu</th>
                  <th>Penanggung Jawab</th>
                  <th>Catatan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {jadwalTampil.map((item) => {
                  const tglStatus = statusTanggal(item.tanggal, item.status);
                  return (
                    <tr key={item.id} className={`row-${tglStatus}`}>
                      <td>
                        <div className="table-cell-activity">
                          <strong className="activity-title">{item.kegiatan}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="table-cell-plant">
                          <strong className="plant-name">{item.tanaman}</strong>
                          {item.kode && <span className="plant-code">{item.kode}</span>}
                        </div>
                      </td>
                      <td><span className="cell-text">{item.lokasi || '-'}</span></td>
                      <td>
                        <div className="cell-datetime">
                          <span className="cell-date">{formatTanggal(item.tanggal)}</span>
                          {item.waktu && <span className="cell-time">{item.waktu.slice(0, 5)}</span>}
                        </div>
                      </td>
                      <td><span className="cell-text">{item.penanggungJawab}</span></td>
                      <td>
                        <span className="cell-catatan">{item.catatan || <em className="no-catatan">—</em>}</span>
                      </td>
                      <td>
                        <span className={`care-status care-status--${tglStatus}`}>
                          {tglStatus === 'selesai' && '✓ Selesai'}
                          {tglStatus === 'terlambat' && '🚨 Terlambat'}
                          {tglStatus === 'hari_ini' && '📅 Hari Ini'}
                          {tglStatus === 'akan_datang' && '🕐 Akan Datang'}
                        </span>
                      </td>
                      <td>
                        <div className="aksi-group">
                          <button
                            type="button"
                            className={item.status === 'Selesai' ? 'action-btn action-cancel' : 'action-btn action-complete'}
                            onClick={() => ubahStatus(item)}
                            disabled={jadwalDiproses !== null}
                          >
                            {jadwalDiproses === item.id ? '...' : item.status === 'Selesai' ? 'Batalkan' : '✓ Selesai'}
                          </button>
                          <button
                            type="button"
                            className="action-btn action-edit"
                            onClick={() => bukaFormEdit(item)}
                            disabled={jadwalDiproses !== null}
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="action-btn action-delete"
                            onClick={() => setKonfirmasiHapus(item)}
                            disabled={jadwalDiproses !== null}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {!memuat && jadwalTampil.length === 0 && (
            <div className="care-empty">
              <span>🌱</span>
              <p>
                {jadwal.length === 0
                  ? 'Belum ada jadwal perawatan. Klik "+ Tambah Jadwal" untuk memulai.'
                  : 'Tidak ada jadwal yang cocok dengan filter / pencarian ini.'}
              </p>
              {(filter !== 'Semua' || kataKunci) && (
                <button type="button" className="reset-filter-btn" onClick={() => { setFilter('Semua'); setKataKunci(''); }}>
                  Reset Filter
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* MODAL KONFIRMASI HAPUS */}
      {konfirmasiHapus && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Konfirmasi hapus jadwal">
          <div className="modal-box">
            <h3>🗑️ Hapus Jadwal?</h3>
            <p>
              Jadwal <strong>"{konfirmasiHapus.kegiatan}"</strong> untuk tanaman{' '}
              <strong>{konfirmasiHapus.tanaman}</strong> pada{' '}
              <strong>{formatTanggal(konfirmasiHapus.tanggal)}</strong> akan dihapus secara permanen.
            </p>
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={() => setKonfirmasiHapus(null)}>Batal</button>
              <button
                type="button"
                className="action-btn action-delete-confirm"
                onClick={() => hapusJadwal(konfirmasiHapus.id)}
                disabled={idHapus === konfirmasiHapus.id}
              >
                {idHapus === konfirmasiHapus.id ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Perawatan;
