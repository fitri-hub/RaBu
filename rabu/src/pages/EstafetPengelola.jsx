
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './EstafetPengelola.css';

function EstafetPengelola() {
  const [pekerja, setPekerja] = useState([]);
  const [riwayat, setRiwayat] = useState([]);
  const [pengelolaId, setPengelolaId] = useState('');
  const [calonPengelola, setCalonPengelola] = useState('');
  const [statusLama, setStatusLama] = useState('pekerja');
  const [alasan, setAlasan] = useState('');
  const [memuat, setMemuat] = useState(true);
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    ambilData();
  }, []);

  async function ambilData() {
    setMemuat(true);
    setError('');

    const { data: auth, error: errorAuth } =
      await supabase.auth.getUser();

    if (errorAuth || !auth?.user) {
      setError('Sesi pengguna tidak ditemukan.');
      setMemuat(false);
      return;
    }

    setPengelolaId(auth.user.id);

    const { data: daftarPekerja, error: errorPekerja } =
      await supabase
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

    const { data: dataRiwayat, error: errorRiwayat } =
      await supabase
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

  async function lakukanEstafet(event) {
    event.preventDefault();
    setPesan('');
    setError('');

    if (!calonPengelola) {
      setError('Silakan pilih calon pengelola baru.');
      return;
    }

    if (calonPengelola === pengelolaId) {
      setError('Tidak dapat memilih akun sendiri.');
      return;
    }

    const konfirmasi = window.confirm(
      'Yakin ingin menyerahkan jabatan Pengelola? Tindakan ini akan mengubah hak akses kedua akun.'
    );

    if (!konfirmasi) return;

    setMenyimpan(true);

    const { error: errorEstafet } = await supabase.rpc(
      'estafet_pengelola',
      {
        p_pengelola_baru: calonPengelola,
        p_status_lama: statusLama,
        p_alasan: alasan.trim() || null,
      }
    );

    if (errorEstafet) {
      setError('Estafet gagal: ' + errorEstafet.message);
      setMenyimpan(false);
      return;
    }

    alert(
      'Estafet berhasil. Silakan masuk kembali menggunakan akun Anda untuk mengakses RaBu sesuai status yang baru.'
    );

    const { error: errorLogout } = await supabase.auth.signOut();

    if (errorLogout) {
      setError('Estafet berhasil, tetapi gagal keluar: ' + errorLogout.message);
      setMenyimpan(false);
      return;
    }
  }

  if (memuat) {
    return <div className="estafet-page">Memuat data estafet...</div>;
  }

  return (
    <div className="estafet-page">
      <header className="estafet-header">
        <p className="estafet-eyebrow">MANAJEMEN PENGELOLA</p>
        <h1>Estafet Pengelola</h1>
        <p>
          Serahkan tanggung jawab pengelolaan RaBu kepada pekerja
          yang akan melanjutkan pengelolaan.
        </p>
      </header>

      <section className="estafet-banner">
        <div className="estafet-banner-icon">🌱</div>
        <div>
          <h2>Keberlanjutan Pengelolaan RaBu</h2>
          <p>
            Pergantian pengelola tidak menghapus data tanaman,
            jadwal perawatan, maupun laporan pemulihan.
          </p>
        </div>
      </section>

      {error && <div className="estafet-error">{error}</div>}
      {pesan && <div className="estafet-success">{pesan}</div>}

      <section className="estafet-card">
        <h2>Formulir Estafet Jabatan</h2>
        <p className="estafet-description">
          Pilih pekerja aktif yang akan menerima tanggung jawab
          sebagai pengelola baru.
        </p>

        {pekerja.length === 0 ? (
          <p>Belum ada pekerja aktif yang dapat dipilih.</p>
        ) : (
          <form onSubmit={lakukanEstafet}>
            <label htmlFor="calonPengelola">
              Calon Pengelola Baru
            </label>
            <select
              id="calonPengelola"
              value={calonPengelola}
              onChange={(e) => setCalonPengelola(e.target.value)}
              required
            >
              <option value="">Pilih pekerja</option>
              {pekerja.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama_lengkap}
                </option>
              ))}
            </select>

            <label htmlFor="statusLama">
              Status Setelah Menyerahkan Jabatan
            </label>
            <select
              id="statusLama"
              value={statusLama}
              onChange={(e) => setStatusLama(e.target.value)}
            >
              <option value="pekerja">
                Tetap bergabung sebagai pekerja
              </option>
              <option value="nonaktif">
                Keluar dari RaBu
              </option>
            </select>

            <label htmlFor="alasan">
              Alasan Estafet (Opsional)
            </label>
            <textarea
              id="alasan"
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder="Tuliskan alasan pergantian pengelola..."
              rows={3}
            />

            <button type="submit" disabled={menyimpan}>
              {menyimpan ? 'Memproses...' : 'Serahkan Jabatan'}
            </button>
          </form>
        )}
      </section>

      <section className="estafet-card">
        <h2>Riwayat Estafet</h2>

        {riwayat.length === 0 ? (
          <p className="estafet-empty">
            Belum ada riwayat pergantian pengelola.
          </p>
        ) : (
          <div className="estafet-history">
            {riwayat.map((item) => (
              <article className="estafet-history-item" key={item.id}>
                <h3>{item.namaLama} → {item.namaBaru}</h3>
                <p>
                  Status pengelola lama:{' '}
                  {item.status_pengelola_lama === 'pekerja'
                    ? 'Menjadi pekerja'
                    : 'Nonaktif'}
                </p>
                <p>Alasan: {item.alasan || '-'}</p>
                <small>
                  {new Date(item.tanggal_estafet).toLocaleString('id-ID')}
                </small>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default EstafetPengelola;
