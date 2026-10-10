import './DashboardPekerja.css';

function DashboardPekerja({ bukaHalaman, nama, onLogout }) {
  return (
    <div className="pekerja-dashboard">
      <section className="pekerja-welcome">
        <div className="pekerja-welcome-text">
          <span className="pekerja-welcome-label">
            DASHBOARD PEKERJA
          </span>

          <h1>
            Selamat datang, {nama?.trim() || 'Pengguna'}!
          </h1>

          <p>
            Senang melihatmu kembali di RaBu.
            Mari rawat tanaman dan jaga lingkungan
            agar tetap hijau dan sehat.
          </p>
        </div>

        <img
          className="pekerja-welcome-logo"
          src="/logo-rabu.png"
          alt="Logo RaBu"
        />
      </section>

      <section className="pekerja-section">
        <div className="pekerja-section-heading">
          <h2>Menu Utama</h2>
          <p>Pilih menu yang ingin kamu buka.</p>
        </div>

        <div className="pekerja-menu">
          <button
            type="button"
            className="pekerja-menu-card"
            onClick={() => bukaHalaman('tugas')}
          >
            <img
              className="pekerja-menu-photo"
              src="/jadwal.png"
              alt="Jadwal perawatan"
            />

            <div className="pekerja-menu-info">
              <span className="pekerja-menu-title">
                Tugas Perawatan
              </span>

              <span className="pekerja-menu-description">
                Lihat dan kerjakan tugas perawatan
                tanaman yang diberikan.
              </span>

              <span className="pekerja-menu-action">
                Lihat tugas →
              </span>
            </div>
          </button>

          <button
            type="button"
            className="pekerja-menu-card"
            onClick={() => bukaHalaman('profil')}
          >
            <img
              className="pekerja-menu-photo"
              src="/foto-profil.jpg"
              alt="Profil pekerja"
            />

            <div className="pekerja-menu-info">
              <span className="pekerja-menu-title">
                Profil Saya
              </span>

              <span className="pekerja-menu-description">
                Lihat informasi akun dan identitasmu di RaBu.
              </span>

              <span className="pekerja-menu-action">
                Lihat profil →
              </span>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}

export default DashboardPekerja;
