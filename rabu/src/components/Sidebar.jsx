
function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-icon">🌱</span>
        <div>
          <h2>RaBu</h2>
          <p>RawatBumi</p>
        </div>
      </div>

      <p className="menu-label">MENU UTAMA</p>

      <nav className="navigation">
        <a href="#dashboard" className="nav-link active">
          <span>▦</span> Dashboard
        </a>

        <a href="#tanaman" className="nav-link">
          <span>🌿</span> Data Tanaman
        </a>

        <a href="#jadwal" className="nav-link">
          <span>📅</span> Jadwal Perawatan
        </a>

        <a href="#misi" className="nav-link">
          <span>♡</span> Misi Penyelamatan
        </a>

        <a href="#estafet" className="nav-link">
          <span>♧</span> Estafet Penjaga
        </a>
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
