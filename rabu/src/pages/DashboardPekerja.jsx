
import './DashboardPekerja.css';

function DashboardPekerja({ bukaHalaman, nama, onLogout }) {
  return (
    <div className="pekerja-dashboard">
      {/* Banner sambutan */}
      <section className="pekerja-welcome">
        <div className="pekerja-welcome-text">
          <span className="pekerja-welcome-label">
            RAWAT BUMI BERSAMA RaBu
          </span>

          <h1>
            Selamat datang, {nama?.trim() || 'Pengguna'}!
          </h1>

          <p>
            Langkah kecil untuk tanaman yang lebih sehat.
            Yuk, lanjutkan tugas perawatan dan ikut menjaga
            lingkungan tetap hijau.
          </p>

          <button
            type="button"
            className="pekerja-welcome-button"
            onClick={() => bukaHalaman('tugas')}
          >
            Lihat Tugas <span>→</span>
          </button>
        </div>

        <img
          className="pekerja-welcome-logo"
          src="/logo-rabu.png"
          alt="Logo RaBu"
        />
      </section>

      {/* Menu utama */}
      <section className="pekerja-section">
        <div className="pekerja-section-heading">
          <span className="pekerja-section-label">
            AREA KERJA
          </span>

          <h2>Menu Utama</h2>

          <p>
            Pilih aktivitas yang ingin kamu lanjutkan hari ini.
          </p>
        </div>

        <div className="pekerja-menu">
          {/* Tugas Perawatan */}
          <button
            type="button"
            className="pekerja-menu-card"
            onClick={() => bukaHalaman('tugas')}
          >
            <div className="pekerja-menu-image-wrap tugas">
              <img
                className="pekerja-menu-photo"
                src="/jadwal.png"
                alt="Jadwal perawatan"
              />
            </div>

            <div className="pekerja-menu-info">
              <span className="pekerja-menu-category">
                KEGIATAN HARIAN
              </span>

              <span className="pekerja-menu-title">
                Tugas Perawatan
              </span>

              <span className="pekerja-menu-description">
                Lihat jadwal dan selesaikan tugas perawatan
                tanaman yang diberikan.
              </span>

              <span className="pekerja-menu-action">
                Lihat tugas <span>→</span>
              </span>
            </div>
          </button>

          {/* Pemulihan Tanaman */}
          <button
            type="button"
            className="pekerja-menu-card"
            onClick={() => bukaHalaman('misi')}
          >
            <div className="pekerja-menu-image-wrap pemulihan">
              <img
                className="pekerja-menu-photo"
                src="/misi.png"
                alt="Pemulihan tanaman"
                onError={(e) => {
                  console.error(
                    'Gambar gagal dimuat:',
                    e.currentTarget.src
                  );
                }}
              />
            </div>

            <div className="pekerja-menu-info">
              <span className="pekerja-menu-category">
                KESEHATAN TANAMAN
              </span>

              <span className="pekerja-menu-title">
                Pemulihan Tanaman
              </span>

              <span className="pekerja-menu-description">
                Periksa laporan kondisi tanaman dan lakukan
                tindakan pemulihan sesuai kebutuhan.
              </span>

              <span className="pekerja-menu-action">
                Lihat pemulihan <span>→</span>
              </span>
            </div>
          </button>

          {/* Profil Saya */}
          <button
            type="button"
            className="pekerja-menu-card"
            onClick={() => bukaHalaman('profil')}
          >
            <div className="pekerja-menu-image-wrap profil">
              <img
                className="pekerja-menu-photo"
                src="/foto-profil.jpg"
                alt="Profil pekerja"
              />
            </div>

            <div className="pekerja-menu-info">
              <span className="pekerja-menu-category">
                AKUN PEKERJA
              </span>

              <span className="pekerja-menu-title">
                Profil Saya
              </span>

              <span className="pekerja-menu-description">
                Lihat informasi akun dan identitasmu
                yang terdaftar di RaBu.
              </span>

              <span className="pekerja-menu-action">
                Lihat profil <span>→</span>
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Pengingat di tengah */}
      <section className="pekerja-reminder">
        <div
          className="pekerja-reminder-icon"
          aria-hidden="true"
        >
          ✳
        </div>

        <div className="pekerja-reminder-content">
          <h3>Jangan lupa rawat tanaman hari ini</h3>

          <p>
            Periksa tugas yang tersedia dan catat kondisi
            tanaman setelah melakukan perawatan.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="pekerja-footer">
        RaBu — Rawat Bumi · Tumbuh bersama lingkungan
      </footer>
    </div>
  );
}

export default DashboardPekerja;