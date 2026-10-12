function IconDashboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

function IconLeaf() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22v-9" />
      <path d="M9 13a5 5 0 0 1 5-5c2.5 0 4.5 1 5.5 3-1 2.5-3 4-5.5 4H9Z" />
      <path d="M15 11a5 5 0 0 0-5-5c-2.5 0-4.5 1-5.5 3 1 2.5 3 4 5.5 4h5Z" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  );
}

function IconRecovery() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  );
}

function Sidebar({ halamanAktif, gantiHalaman, onLogout }) {
  const menu = [
    { id: 'dashboard', Icon: IconDashboard, nama: 'Dashboard' },
    { id: 'tanaman', Icon: IconLeaf, nama: 'Data Tanaman' },
    { id: 'jadwal', Icon: IconCalendar, nama: 'Jadwal Perawatan' },
    { id: 'misi', Icon: IconRecovery, nama: 'Pemulihan Tanaman' },
    { id: 'profil', Icon: IconUser, nama: 'Profil Saya' },
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
        {menu.map((item) => {
          const isActive = halamanAktif === item.id;
          const { Icon } = item;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={(event) => {
                event.preventDefault();
                gantiHalaman(item.id);
              }}
            >
              <span className="nav-icon">
                <Icon />
              </span>
              <span className="nav-text">{item.nama}</span>
              {isActive && <span className="nav-active-pill" aria-hidden="true" />}
            </a>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-profile-info">
          <div className="profile-avatar">P</div>

          <div className="sidebar-profile-text">
            <strong>Pengelola</strong>
            <p>Tim RaBu</p>
          </div>
        </div>

        {onLogout && (
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={onLogout}
            title="Keluar dari akun"
            aria-label="Keluar"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Keluar</span>
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;