
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Register.css';

function Register({ onRegister, onLogin }) {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setPesan('');

    if (password.length < 6) {
      setPesan('Kata sandi minimal 6 karakter.');
      return;
    }

    if (password !== konfirmasiPassword) {
      setPesan('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            nama_lengkap: nama,
          },
        },
      });

      if (error) {
        setPesan(
          error.message === 'User already registered'
            ? 'Email ini sudah terdaftar. Silakan masuk.'
            : error.message
        );
        return;
      }

      
if (data.user) {
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: data.user.id,
        nama_lengkap: nama.trim(),
        role: 'pekerja',
      },
      { onConflict: 'id' }
    );

  if (profileError) {
    console.error('Gagal menyimpan profil:', profileError);

    setPesan(
      `Akun berhasil dibuat, tetapi profil gagal disimpan: ${profileError.message}`
    );
    return;
  }

  setPesan('Pendaftaran berhasil! Silakan masuk ke akun.');
  if (onLogin) onLogin();
  return;
}

setPesan('Pendaftaran gagal. Silakan coba kembali.');


      setPesan(
        'Pendaftaran berhasil! Silakan periksa email untuk melakukan konfirmasi sebelum masuk.'
      );
    } catch {
      setPesan('Terjadi kesalahan. Periksa koneksi internet dan coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <section className="login-intro">
        <a href="/" className="login-brand">
          <img src="/logo-rabu.png" alt="Logo RaBu" />
          <span>
            RaBu<span className="brand-dot">.</span>
          </span>
        </a>

        <div className="login-intro-content">
          <span className="login-eyebrow">
            TUMBUH BERSAMA, RAWAT BUMI
          </span>

          <h1>Mulai Rawat Bumi</h1>

          <p className="login-intro-description">
            Setiap langkah kecil punya arti. Buat akun RaBu dan
            mulai perjalananmu untuk merawat tanaman serta
            menciptakan lingkungan yang lebih hijau.
          </p>

          <div className="login-programs">
            <p className="login-program-heading">
              BERSAMA MERAWAT BUMI
            </p>

            <div className="login-program-item">
              <img
                src="/tanaman.png"
                alt=""
                className="program-image"
              />
              <div>
                <h3>Data Tanaman</h3>
                <p>Kenali dan pantau tanamanmu.</p>
              </div>
            </div>

            <div className="login-program-item">
              <img
                src="/jadwal.png"
                alt=""
                className="program-image"
              />
              <div>
                <h3>Jadwal Perawatan</h3>
                <p>Jaga tanaman tetap terawat.</p>
              </div>
            </div>

            <div className="login-program-item">
              <img
                src="/misi.png"
                alt=""
                className="program-image"
              />
              <div>
                <h3>Misi Penyelamatan</h3>
                <p>Mulai aksi nyata untuk bumi.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="login-copyright">
          © 2026 RaBu — RawatBumi. Tumbuh bersama, rawat bumi.
        </p>
      </section>

      <section className="login-form-section">
        <div className="login-form-wrapper">
          <div className="login-welcome">
            <span className="login-welcome-icon">✳</span>
            <div>
              <h2>Selamat bergabung!</h2>
              <p>
                Buat akun dan mulai perjalanan merawat bumi.
              </p>
            </div>
          </div>

          <form className="login-card register-card" onSubmit={handleRegister}>
            <div className="login-card-heading">
              <span className="login-card-label">AKUN RA BU</span>
              <h2>Daftar Akun</h2>
              <p>Lengkapi data dirimu untuk bergabung.</p>
            </div>

            <div className="login-field">
              <label htmlFor="register-nama">Nama Lengkap</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">♙</span>
                <input
                  id="register-nama"
                  type="text"
                  autoComplete="name"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="register-email">Email</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">✉</span>
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email kamu"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="register-password">Kata Sandi</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">♙</span>
                <input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="register-konfirmasi">
                Konfirmasi Kata Sandi
              </label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">♙</span>
                <input
                  id="register-konfirmasi"
                  type="password"
                  autoComplete="new-password"
                  value={konfirmasiPassword}
                  onChange={(e) =>
                    setKonfirmasiPassword(e.target.value)
                  }
                  placeholder="Ulangi kata sandi"
                  required
                />
              </div>
            </div>

            {pesan && (
              <p className="login-message" role="status">
                {pesan}
              </p>
            )}

            <button
              className="login-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Sedang mendaftar...' : 'Daftar Sekarang'}
              {!loading && <span>→</span>}
            </button>

            <div className="login-register-divider">
              <span />
              <p>Sudah punya akun?</p>
              <span />
            </div>

            <button
              className="login-register-button"
              type="button"
              onClick={onLogin}
            >
              Masuk ke Akun
            </button>
          </form>

          <p className="login-bottom-note">
            Dengan mendaftar, kamu ikut mengambil langkah kecil untuk bumi.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Register;
