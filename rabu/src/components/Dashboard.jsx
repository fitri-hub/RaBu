
function Dashboard() {
  return (
    <>
      <header className="topbar">
        <div>
          <p className="breadcrumb">Halaman / Dashboard</p>
          <h1>Dashboard</h1>
        </div>
        <div className="date-label">
          🌱 Rawat tanaman, jaga masa depan
        </div>
      </header>

      <section className="welcome">
        <div>
          <p className="welcome-tag">SELAMAT DATANG DI RABU</p>
          <h2>Halo, Pengelola! 👋</h2>
          <p>
            Yuk, pantau dan rawat tanaman kita agar terus tumbuh
            dan memberi manfaat bagi lingkungan.
          </p>
        </div>
        <div className="welcome-illustration">🌳</div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon green">🌱</div>
          <p>Total Tanaman</p>
          <h2>0</h2>
          <span>Tanaman terdata</span>
        </article>

        <article className="stat-card">
          <div className="stat-icon mint">🌿</div>
          <p>Tanaman Sehat</p>
          <h2>0</h2>
          <span>Siap terus dirawat</span>
        </article>

        <article className="stat-card">
          <div className="stat-icon orange">🪴</div>
          <p>Perlu Perhatian</p>
          <h2>0</h2>
          <span>Perlu pemeriksaan</span>
        </article>

        <article className="stat-card">
          <div className="stat-icon blue">📅</div>
          <p>Tugas Perawatan</p>
          <h2>0</h2>
          <span>Tugas belum selesai</span>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <h3>Aktivitas Perawatan</h3>
              <p>Ringkasan kegiatan terbaru</p>
            </div>
            <span className="panel-symbol">↗</span>
          </div>

          <div className="empty-state">
            <div>🌿</div>
            <h4>Belum ada aktivitas</h4>
            <p>
              Aktivitas perawatan tanaman akan muncul di sini
              setelah ada kegiatan yang tercatat.
            </p>
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <h3>Perlu Perhatian</h3>
              <p>Tanaman yang perlu diperiksa</p>
            </div>
            <span className="panel-symbol">!</span>
          </div>

          <div className="empty-state">
            <div>🌳</div>
            <h4>Semua masih terkendali</h4>
            <p>
              Tanaman yang membutuhkan penanganan akan
              ditampilkan di bagian ini.
            </p>
          </div>
        </article>
      </section>

      <footer className="footer">
        <p>RaBu — RawatBumi</p>
        <p>Rawat hari ini, hijaukan masa depan. 🌱</p>
      </footer>
    </>
  );
}

export default Dashboard;
