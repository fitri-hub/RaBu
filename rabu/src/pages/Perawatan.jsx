// Halaman jadwal perawatan tanaman
import { useEffect, useState } from 'react';
import './Perawatan.css';
import { supabase } from '../lib/supabaseClient';

function Perawatan() {
  const [jadwal, setJadwal] = useState([]);
  const [filter, setFilter] = useState('Semua');
  const [memuat, setMemuat] = useState(true);
  const [pesan, setPesan] = useState('');
  const [jadwalDiproses, setJadwalDiproses] = useState(null);

  async function muatJadwal() {
    setMemuat(true);
    setPesan('');

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;

      const pengguna = authData.user;

      if (!pengguna) {
        setPesan('Silakan login kembali.');
        return;
      }

      const { data, error } = await supabase
        .from('jadwal_perawatan')
        .select(`
          id,
          tanaman_id,
          jenis_perawatan,
          kegiatan,
          tanggal,
          status,
          tanaman!jadwal_perawatan_tanaman_id_fkey (
            id,
            nama_tanaman,
            kode,
            lokasi,
            user_id,
            penanggung_jawab
          )
        `)
        .order('tanggal', { ascending: true });

      if (error) throw error;

      const daftar = (data || []).map((item) => ({
        id: item.id,
        tanamanId: item.tanaman_id,
        kegiatan:
          item.kegiatan ||
          item.jenis_perawatan ||
          'Perawatan tanaman',
        tanaman:
          item.tanaman?.nama_tanaman ||
          'Tanaman tidak ditemukan',
        kode: item.tanaman?.kode || '',
        lokasi: item.tanaman?.lokasi || '',
        penanggungJawab:
          item.tanaman?.penanggung_jawab || '',
        userId: item.tanaman?.user_id || null,
        tanggal: item.tanggal,
        status: item.status,
      }));

      setJadwal(daftar);
    } catch (error) {
      console.error('Gagal memuat jadwal:', error);
      setPesan(`Gagal memuat jadwal: ${error.message}`);
    } finally {
      setMemuat(false);
    }
  }

  useEffect(() => {
    muatJadwal();
  }, []);

  async function ubahStatus(item) {
    if (jadwalDiproses !== null) return;

    const statusLama = item.status;
    const statusBaru =
      statusLama === 'Selesai' ? 'Belum' : 'Selesai';

    setJadwalDiproses(item.id);
    setPesan('');

    try {
      const { data, error } = await supabase
        .from('jadwal_perawatan')
        .update({ status: statusBaru })
        .eq('id', item.id)
        .select('id, status');

      if (error) throw error;

      // Pastikan database benar-benar mengembalikan baris yang diubah.
      if (!data || data.length === 0) {
        throw new Error(
          'Status tidak berubah. Periksa izin pembaruan jadwal di Supabase (RLS).'
        );
      }

      setJadwal((daftar) =>
        daftar.map((jadwalItem) =>
          jadwalItem.id === item.id
            ? { ...jadwalItem, status: data[0].status }
            : jadwalItem
        )
      );

      setPesan(
        statusBaru === 'Selesai'
          ? 'Jadwal berhasil ditandai selesai.'
          : 'Jadwal dikembalikan ke status belum selesai.'
      );

      // Beri tahu dashboard jika menggunakan event pembaruan.
      window.dispatchEvent(new Event('jadwal-berubah'));
    } catch (error) {
      console.error('Gagal mengubah status:', error);
      setPesan(`Gagal mengubah status: ${error.message}`);
    } finally {
      setJadwalDiproses(null);
    }
  }

  const jadwalTampil = jadwal.filter((item) => {
    if (filter === 'Semua') return true;
    if (filter === 'Belum') return item.status === 'Belum';
    return item.status === filter;
  });

  const totalSelesai = jadwal.filter(
    (item) => item.status === 'Selesai'
  ).length;

  const totalBelumSelesai = jadwal.filter(
    (item) => item.status === 'Belum'
  ).length;

  return (
    <section className="page-section">
      <header className="page-header">
        <div>
          <h1>Jadwal Perawatan</h1>
        </div>
      </header>

      {pesan && (
        <p role="status" className="tanaman-feedback">
          {pesan}
        </p>
      )}

      <div className="care-summary">
        <article className="care-card">
          <span>Total Jadwal</span>
          <h2>{jadwal.length}</h2>
        </article>

        <article className="care-card">
          <span>Belum Selesai</span>
          <h2>{totalBelumSelesai}</h2>
        </article>

        <article className="care-card">
          <span>Selesai</span>
          <h2>{totalSelesai}</h2>
        </article>
      </div>

      <section className="panel care-panel">
        <div className="panel-heading">
          <div>
            <h3>Daftar Jadwal</h3>
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter status jadwal"
          >
            <option value="Semua">Semua Status</option>
            <option value="Belum">Belum Selesai</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>

        <div className="care-table-wrap">
          {memuat && <p className="loading-text">Memuat jadwal perawatan...</p>}

          {!memuat && jadwalTampil.length > 0 && (
            <table className="care-table">
              <thead>
                <tr>
                  <th>Kegiatan Perawatan</th>
                  <th>Tanaman</th>
                  <th>Lokasi</th>
                  <th>Tanggal</th>
                  <th>Penanggung Jawab</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {jadwalTampil.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="table-cell-activity">
                        <div className="activity-content">
                          <strong className="activity-title">{item.kegiatan}</strong>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="table-cell-plant">
                        <strong className="plant-name">{item.tanaman}</strong>
                        {item.kode && <span className="plant-code">{item.kode}</span>}
                      </div>
                    </td>
                    <td>
                      <span className="cell-text">{item.lokasi || '-'}</span>
                    </td>
                    <td>
                      <span className="cell-text">{item.tanggal}</span>
                    </td>
                    <td>
                      <span className="cell-text">{item.penanggungJawab || '-'}</span>
                    </td>
                    <td>
                      <span
                        className={
                          item.status === 'Selesai'
                            ? 'care-status done'
                            : 'care-status pending'
                        }
                      >
                        {item.status === 'Selesai'
                          ? 'Selesai'
                          : 'Belum Selesai'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={
                          item.status === 'Selesai'
                            ? 'action-btn action-cancel'
                            : 'action-btn action-complete'
                        }
                        onClick={() => ubahStatus(item)}
                        disabled={jadwalDiproses !== null}
                      >
                        {jadwalDiproses === item.id
                          ? 'Menyimpan...'
                          : item.status === 'Selesai'
                            ? 'Batalkan'
                            : 'Tandai Selesai'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!memuat && jadwalTampil.length === 0 && (
            <div className="care-empty">
              <span>🌱</span>
              <p>
                {jadwal.length === 0
                  ? 'Belum ada jadwal perawatan di database.'
                  : 'Tidak ada jadwal dengan status ini.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}

export default Perawatan;
