
function Sidebar({ halamanAktif, gantiHalaman }) {
  const menu = [
    { id: 'dashboard', ikon: '▦', nama: 'Dashboard' },
    { id: 'tanaman', ikon: '🌿', nama: 'Data Tanaman' },
    { id: 'jadwal', ikon: '📅', nama: 'Jadwal Perawatan' },
    { id: 'misi', ikon: '🌱', nama: 'Pemulihan Tanaman' },
    { id: 'profil', ikon: '👤', nama: 'Profil Saya' },

    // Pengembangan lanjutan: Estafet Pengelola
    /*
    {
      id: 'estafet',
      ikon: '🪴',
      nama: 'Penanggung Jawab Tanaman',
    },
    */
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <img
          src="/logo-rabu.png"
          alt="Logo RaBu"
          className="brand-logo"
        />

        <div>
          <h2>RaBu</h2>
          <p>RawatBumi</p>
        </div>
      </div>

      <p className="menu-label">MENU UTAMA</p>

      <nav className="navigation">
        {menu.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`nav-link ${
              halamanAktif === item.id ? 'active' : ''
            }`}
            onClick={(event) => {
              event.preventDefault();
              gantiHalaman(item.id);
            }}
          >
            <span>{item.ikon}</span> {item.nama}
          </a>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="profile-avatar">P</div>

        <div>
          <strong>Pengelola</strong>
          <p>Tim RaBu</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;