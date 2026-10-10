
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Profil.css';

function Profil({ role, onLogout, onKembali }) {
  const [nama, setNama] = useState('');
  const [namaAwal, setNamaAwal] = useState('');
  const [email, setEmail] = useState('');
  const [memuat, setMemuat] = useState(true);
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState('');
  const [error, setError] = useState('');

  const [kataSandi, setKataSandi] = useState('');
  const [konfirmasiSandi, setKonfirmasiSandi] = useState('');

  useEffect(() => {
    async function ambilProfil() {
      const { data: hasilAuth, error: errorAuth } =
        await supabase.auth.getUser();

      if (errorAuth || !hasilAuth?.user) {
        setError('Gagal mengambil informasi akun.');
        setMemuat(false);
        return;
      }

      const pengguna = hasilAuth.user;
      setEmail(pengguna.email || '');

      const { data, error: errorProfil } = await supabase
        .from('profiles')
        .select('nama_lengkap')
        .eq('id', pengguna.id)
        .maybeSingle();

      if (errorProfil) {
        setError('Gagal mengambil profil: ' + errorProfil.message);
      } else {
        const namaPengguna = data?.nama_lengkap || '';
        setNama(namaPengguna);
        setNamaAwal(namaPengguna);
      }

      setMemuat(false);
    }

    ambilProfil();
  }, []);

  async function simpanNama(event) {
    event.preventDefault();
    setPesan('');
    setError('');

    if (!nama.trim()) {
      setError('Nama tidak boleh kosong.');
      return;
    }

    setMenyimpan(true);

    const { data: hasilAuth, error: errorAuth } =
      await supabase.auth.getUser();

    if (errorAuth || !hasilAuth?.user) {
      setError('Sesi pengguna tidak ditemukan.');
      setMenyimpan(false);
      return;
    }

    const { error: errorUpdate } = await supabase
      .from('profiles')
      .update({ nama_lengkap: nama.trim() })
      .eq('id', hasilAuth.user.id);

    if (errorUpdate) {
      setError('Gagal menyimpan nama: ' + errorUpdate.message);
    } else {
      setNamaAwal(nama.trim());
      setPesan('Nama berhasil diperbarui.');
    }

    setMenyimpan(false);
  }

  async function ubahKataSandi(event) {
    event.preventDefault();
    setPesan('');
    setError('');

    if (kataSandi.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }

    if (kataSandi !== konfirmasiSandi) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setMenyimpan(true);

    const { error: errorUpdate } = await supabase.auth.updateUser({
      password: kataSandi,
    });

    if (errorUpdate) {
      setError('Gagal mengganti kata sandi: ' + errorUpdate.message);
    } else {
      setKataSandi('');
      setKonfirmasiSandi('');
      setPesan('Kata sandi berhasil diperbarui.');
    }

    setMenyimpan(false);
  }

  if (memuat) {
    return <div className="profil-loading">Memuat profil...</div>;
  }

  return (
    <main className="profil-page">
      <header className="profil-header">
        <div>
          <p className="profil-eyebrow">AKUN RABU</p>
          <h1>Profil Saya</h1>
          <p>Kelola informasi dan keamanan akunmu.</p>
        </div>

        <button
          type="button"
          className="profil-button profil-button-secondary"
          onClick={onKembali}
        >
          ← Kembali
        </button>
      </header>

      {pesan && <div className="profil-message">{pesan}</div>}
      {error && <div className="profil-error">{error}</div>}

      <section className="profil-card">
        <div className="profil-avatar">
          {(nama.trim()[0] || email[0] || 'U').toUpperCase()}
        </div>

        <div className="profil-identitas">
          <h2>{nama || 'Pengguna RaBu'}</h2>
          <p>{email}</p>
          <span className="profil-role">
            {role === 'pengelola' ? 'Pengelola' : 'Pekerja'}
          </span>
        </div>
      </section>

      <section className="profil-card profil-form-card">
        <h2>Informasi Profil</h2>
        <p className="profil-description">
          Perbarui nama yang ditampilkan pada akunmu.
        </p>

        <form onSubmit={simpanNama}>
          <label htmlFor="nama-lengkap">Nama lengkap</label>
          <input
            id="nama-lengkap"
            type="text"
            value={nama}
            onChange={(event) => setNama(event.target.value)}
            placeholder="Masukkan nama lengkap"
            required
          />

          <label htmlFor="email-akun">Email akun</label>
          <input
            id="email-akun"
            type="email"
            value={email}
            readOnly
          />

          <button
            className="profil-button"
            type="submit"
            disabled={menyimpan || nama.trim() === namaAwal}
          >
            {menyimpan ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </section>

      <section className="profil-card profil-form-card">
        <h2>Keamanan Akun</h2>
        <p className="profil-description">
          Gunakan kata sandi baru yang sulit ditebak.
        </p>

        <form onSubmit={ubahKataSandi}>
          <label htmlFor="kata-sandi-baru">Kata sandi baru</label>
          <input
            id="kata-sandi-baru"
            type="password"
            value={kataSandi}
            onChange={(event) => setKataSandi(event.target.value)}
            placeholder="Minimal 6 karakter"
            minLength={6}
            required
          />

          <label htmlFor="konfirmasi-sandi">Konfirmasi kata sandi</label>
          <input
            id="konfirmasi-sandi"
            type="password"
            value={konfirmasiSandi}
            onChange={(event) =>
              setKonfirmasiSandi(event.target.value)
            }
            placeholder="Ulangi kata sandi baru"
            minLength={6}
            required
          />

          <button
            className="profil-button"
            type="submit"
            disabled={menyimpan}
          >
            {menyimpan ? 'Memproses...' : 'Ganti Kata Sandi'}
          </button>
        </form>
      </section>

      <section className="profil-card profil-logout-card">
        <div>
          <h2>Keluar dari Akun</h2>
          <p className="profil-description">
            Akhiri sesi penggunaan RaBu pada perangkat ini.
          </p>
        </div>

        <button
          type="button"
          className="profil-button profil-button-danger"
          onClick={onLogout}
        >
          Keluar
        </button>
      </section>
    </main>
  );
}

export default Profil;
