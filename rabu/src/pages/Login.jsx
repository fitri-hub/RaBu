
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Login.css';

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(false);



async function handleLogin(e) {
  e.preventDefault();
  setPesan('');
  setLoading(true);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setPesan(error.message);
      return;
    }

    if (data.session && onLogin) {
      onLogin();
    }
  } catch (error) {
    console.error('Login error:', error);
    setPesan('Terjadi kesalahan saat login. Silakan coba lagi.');
  } finally {
    setLoading(false);
  }
}



  return (
    <div className="login-page">
      <section className="login-intro">
        <a href="/" className="login-brand">
            <img src="/logo-rabu.png" alt="Logo RaBu" />
            <span>RaBu<span className="brand-dot">.</span></span>
        </a>

        <div className="login-intro-content">
          <span className="login-eyebrow">
            TUMBUH BERSAMA, RAWAT BUMI
          </span>

          <h1>
            Selamat Datang
          </h1>

          <p className="login-intro-description">
            Langkah kecil, kepedulian bersama. Mari rawat tanaman
            dan ciptakan lingkungan yang lebih hijau melalui
            RawatBumi.
          </p>

          <div className="login-programs">
            <p className="login-program-heading">
              BERSAMA MERAWAT BUMI
            </p>

           <div className="login-program-item">
            <img
                src="/tanaman.png"
                alt="Data Tanaman"
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
                alt="Jadwal Perawatan"
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
                alt="Misi Penyelamatan"
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
              <h2>Senang melihatmu kembali!</h2>
              <p>Masuk dan lanjutkan perjalanan merawat bumi.</p>
            </div>
          </div>

          <form className="login-card" onSubmit={handleLogin}>
            <div className="login-card-heading">
              <span className="login-card-label">AKUN RA BU</span>
              <h2>Masuk ke Akun</h2>
              <p>Selamat datang kembali!</p>
            </div>

            <div className="login-field">
              <label htmlFor="login-email">Email</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">✉</span>
                <input
                  id="login-email"
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
              <label htmlFor="login-password">Kata Sandi</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">♙</span>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  required
                />
              </div>
            </div>

            {pesan && (
              <p className="login-message" role="alert">
                {pesan}
              </p>
            )}

            <button
              className="login-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Sedang masuk...' : 'Masuk'}
              {!loading && <span>→</span>}
            </button>

            <div className="login-register-divider">
              <span />
              <p>Belum punya akun?</p>
              <span />
            </div>

            <button
              className="login-register-button"
              type="button"
              onClick={onRegister}
            >
              Daftar Sekarang
            </button>

            <div className="login-manager-divider" />

            
            <button
              className="login-manager-button"
              type="button"
              onClick={() => {
                const form = document.querySelector('.login-card');

                if (form) {
                  form.requestSubmit();
                }
              }}
            >
              <span>♙</span>
              Masuk sebagai Pengelola
            </button>

          </form>

          <p className="login-bottom-note">
            Dengan masuk, kamu ikut mengambil langkah kecil untuk bumi.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;
