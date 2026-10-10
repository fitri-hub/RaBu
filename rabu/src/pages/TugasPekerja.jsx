import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './TugasPekerja.css';

function TugasPekerja() {
  const [tugas, setTugas] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [error, setError] = useState('');
  const [tugasDiproses, setTugasDiproses] = useState(null);
  const [filter, setFilter] = useState('Semua');

  async function muatTugas() {
    setMemuat(true);
    setError('');

    const { data: sesiData, error: sesiError } =
      await supabase.auth.getSession();

    if (sesiError || !sesiData.session) {
      setError('Sesi login tidak ditemukan. Silakan login kembali.');
      setMemuat(false);
      return;
    }

    const userId = sesiData.session.user.id;
    console.log('User ID yang sedang login:', userId);

    const { data, error: tugasError } = await supabase
  .from('jadwal_perawatan')
  .select(`
    id,
    tanaman_id,
    jenis_perawatan,
    tanggal,
    waktu,
    catatan,
    status
  `)
  .eq('user_id', userId)
  .order('tanggal', { ascending: true });

    if (tugasError) {
  console.error('Detail error Supabase:', tugasError);
  console.error('Kode:', tugasError.code);
  console.error('Pesan:', tugasError.message);
  console.error('Detail:', tugasError.details);
  console.error('Hint:', tugasError.hint);

  setError('Tugas belum dapat dimuat. Silakan coba lagi.');
  setMemuat(false);
  return;
}

    setTugas(data || []);
    setMemuat(false);
  }

  useEffect(() => {
    muatTugas();
  }, []);

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
      console.error(
        'Gagal memperbarui status:',
        updateError?.message || 'Tidak ada jadwal yang diperbarui'
      );
      setError('Status belum berhasil diperbarui. Coba lagi.');
    } else {
      setTugas((daftar) =>
        daftar.map((t) =>
          t.id === item.id ? { ...t, status: data.status } : t
        )
      );
    }

    setTugasDiproses(null);
  }

  const tugasTampil = tugas.filter((item) => {
    if (filter === 'Semua') return true;
    if (filter === 'Belum') return item.status !== 'Selesai';
    return item.status === 'Selesai';
  });

  const totalSelesai = tugas.filter(
    (item) => item.status === 'Selesai'
  ).length;

  const totalBelum = tugas.length - totalSelesai;

  if (memuat) {
    return (
      <section className="tugas-pekerja">
        <p>Memuat tugas perawatan...</p>
      </section>
    );
  }

  return (
    <section className="tugas-pekerja">
      <header className="tugas-header">
        <div>
          <p className="tugas-breadcrumb">Dashboard / Tugas Perawatan</p>
          <h1>Tugas Perawatan</h1>
          <p className="tugas-subtitle">
            Pantau dan selesaikan tugas perawatan tanaman yang menjadi
            tanggung jawabmu.
          </p>
        </div>

        <button
          type="button"
          className="tugas-refresh"
          onClick={muatTugas}
        >
          Muat Ulang
        </button>
      </header>

      {error && (
        <div className="tugas-error" role="alert">
          {error}
        </div>
      )}

      <div className="tugas-ringkasan">
        <article className="tugas-ringkasan-card">
          <span>Total Tugas</span>
          <strong>{tugas.length}</strong>
        </article>

        <article className="tugas-ringkasan-card">
          <span>Belum Selesai</span>
          <strong>{totalBelum}</strong>
        </article>

        <article className="tugas-ringkasan-card">
          <span>Selesai</span>
          <strong>{totalSelesai}</strong>
        </article>
      </div>

      <div className="tugas-daftar-panel">
        <div className="tugas-daftar-heading">
          <div>
            <h2>Daftar Tugas Saya</h2>
            <p>Kerjakan tugas sesuai jadwal yang diberikan.</p>
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter status tugas"
          >
            <option value="Semua">Semua Status</option>
            <option value="Belum">Belum Selesai</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>

        {tugasTampil.length === 0 ? (
          <div className="tugas-kosong">
            <h3>Belum Ada Tugas</h3>
            <p>
              {tugas.length === 0
                ? 'Belum ada jadwal perawatan yang ditugaskan ke akunmu.'
                : 'Tidak ada tugas dengan status yang dipilih.'}
            </p>
          </div>
        ) : (
          <div className="tugas-list">
            {tugasTampil.map((item) => (
              <article className="tugas-item" key={item.id}>
                <div className="tugas-item-info">
                  <span className="tugas-item-label">
                    {item.jenis_perawatan}
                  </span>

                  <h3>
                    {item.tanaman?.nama || `Tanaman #${item.tanaman_id ?? '-'}`}
                  </h3>

                  <p>
                    <strong>Tanggal:</strong> {item.tanggal}
                  </p>

                  {item.waktu && (
                    <p>
                      <strong>Waktu:</strong> {item.waktu.slice(0, 5)}
                    </p>
                  )}

                  {item.catatan && (
                    <p>
                      <strong>Catatan:</strong> {item.catatan}
                    </p>
                  )}
                </div>

                <div className="tugas-item-aksi">
                  <span
                    className={
                      item.status === 'Selesai'
                        ? 'tugas-status tugas-status-selesai'
                        : 'tugas-status tugas-status-belum'
                    }
                  >
                    {item.status === 'Selesai' ? 'Selesai' : 'Belum Selesai'}
                  </span>

                  <button
                    type="button"
                    disabled={tugasDiproses === item.id}
                    onClick={() => ubahStatus(item)}
                  >
                    {tugasDiproses === item.id
                      ? 'Menyimpan...'
                      : item.status === 'Selesai'
                        ? 'Batalkan'
                        : 'Tandai Selesai'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default TugasPekerja;
