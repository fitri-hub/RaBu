import './Beranda.css';

function Beranda({ onLogin, onJelajahi, onRegister }) {
  const sdgs = [
    {
      nomor: '03',
      nama: 'Kehidupan Sehat dan Sejahtera',
      deskripsi: 'Menciptakan lingkungan yang lebih sehat.',
    },
    {
      nomor: '11',
      nama: 'Kota dan Permukiman Berkelanjutan',
      deskripsi: 'Membangun lingkungan yang nyaman dan hijau.',
    },
    {
      nomor: '12',
      nama: 'Konsumsi dan Produksi yang Bertanggung Jawab',
      deskripsi: 'Mendorong kebiasaan merawat dan menjaga sumber daya.',
    },
    {
      nomor: '13',
      nama: 'Penanganan Perubahan Iklim',
      deskripsi: 'Mengajak masyarakat ikut menjaga bumi.',
    },
    {
      nomor: '15',
      nama: 'Ekosistem Daratan',
      deskripsi: 'Melindungi tanaman dan keanekaragaman hayati.',
    },
  ];

  return (
    <div className="beranda">
      <div className="beranda-background" aria-hidden="true" />

      <header className="beranda-navbar">
        <a href="#beranda" className="beranda-logo">
          <img src="/logo-rabu.png" alt="Logo RaBu" />
        </a>

        <nav className="beranda-nav">
          <a href="#beranda">Beranda</a>
          <a href="#tentang">Tentang RaBu</a>
          <a href="#fitur">Fitur</a>
          <a href="#sdgs">Dukungan SDGs</a>
        </nav>

        <div className="beranda-auth">
          <button className="beranda-login" onClick={onLogin}>
            Login
          </button>
          <button className="beranda-register" onClick={onRegister}>
            Register
          </button>
        </div>
      </header>

      <main>
        <section className="beranda-hero" id="beranda">
          <div className="beranda-hero-text">
            <span className="beranda-label">
              TUMBUH BERSAMA, RAWAT BUMI
            </span>

            <h1>
              Bumi yang hijau
              <br />
              dimulai dari <em>kita.</em>
            </h1>

            <p>
              Langkah kecil, kepedulian bersama. Mari rawat tanaman
              dan ciptakan lingkungan yang lebih hijau melalui
              RawatBumi.
            </p>

            <div className="beranda-actions">
              <button className="beranda-primary" onClick={onJelajahi}>
                Mulai Bersama <span>↗</span>
              </button>

              <a className="beranda-secondary" href="#tentang">
                Kenali RaBu <span>↓</span>
              </a>
            </div>

            <div className="beranda-note">
              Satu tanaman, banyak kepedulian.
            </div>
          </div>

          <div className="beranda-hero-visual">
            <div className="beranda-image-placeholder">
              <img
                src="/komunitas-tanam.jpg"
                alt="Komunitas bersama-sama menanam pohon"
              />
            </div>
          </div>
        </section>

        <section className="beranda-about" id="tentang">
            <div className="beranda-section-heading">
                <span className="beranda-label">TENTANG KAMI</span>
                 <h2>Satu Pohon, Banyak Cerita.</h2>
                <p>
            Setiap pohon punya cerita, dan setiap tangan bisa ikut
            menjaganya. RaBu hadir untuk mempertemukan orang-orang yang
            peduli pada bumi, saling bekerja sama menanam pohon, merawat
            tanaman, dan menumbuhkan lingkungan yang lebih hijau.
            Karena perubahan besar selalu berawal dari langkah kecil
            yang dilakukan bersama.
            </p>
            </div>
        </section>

        <section className="beranda-features-section" id="fitur">
          <div className="beranda-section-title">
            <div>
              <span className="beranda-label">
                YANG BISA KAMU LAKUKAN
              </span>
              <h2>Mulai Menanam, Tumbuh Bersama</h2>
            </div>
          </div>

          <div className="beranda-features">
            <article className="beranda-feature-card">
              <span className="beranda-feature-number">01</span>
              <h3>Data Tanaman</h3>
              <p>
                Kenali tanaman dan pantau kondisinya agar tetap
                tumbuh dengan baik.
              </p>
            </article>

            <article className="beranda-feature-card">
              <span className="beranda-feature-number">02</span>
              <h3>Jadwal Perawatan</h3>
              <p>
                Atur jadwal penyiraman dan perawatan agar tidak ada
                tanaman yang terlewat.
              </p>
            </article>

            <article className="beranda-feature-card">
              <span className="beranda-feature-number">03</span>
              <h3>Misi Penyelamatan</h3>
              <p>
                Ikut berkontribusi dalam aksi nyata untuk merawat
                tanaman dan lingkungan.
              </p>
            </article>
          </div>
        </section>

        <section className="beranda-sdgs" id="sdgs">
          <div className="beranda-sdgs-heading">
            <span className="beranda-label">
              KOMITMEN KEBERLANJUTAN
            </span>
            <h2>RaBu mendukung Tujuan Pembangunan Berkelanjutan</h2>
            <p>
              Melalui perawatan tanaman dan aksi lingkungan,
              RaBu berkontribusi pada beberapa tujuan SDGs.
            </p>
          </div>

          <div className="beranda-sdgs-list">
            {sdgs.map((item) => (
              <article className="beranda-sdgs-item" key={item.nomor}>
                <span className="beranda-sdgs-number">
                  {item.nomor}
                </span>
                <div>
                  <h3>{item.nama}</h3>
                  <p>{item.deskripsi}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="beranda-cta">
          <div>
            <span className="beranda-label">MULAI DARI SEKARANG</span>
            <h2>Lingkungan hijau adalah tanggung jawab bersama.</h2>
            <p>
              Bergabunglah bersama komunitas untuk menciptakan
              lingkungan yang lebih terawat dan berkelanjutan.
            </p>
          </div>

          <button className="beranda-cta-button" onClick={onLogin}>
            Mulai Rawat Bumi ↗
          </button>
        </section>
      </main>

      <footer className="beranda-footer">
        <div>
          <strong>RaBu.</strong>
          <p>RawatBumi — Tumbuh bersama, rawat bumi.</p>
        </div>
        <span>Merawat tanaman, menjaga masa depan.</span>
      </footer>
    </div>
  );
}

export default Beranda;
