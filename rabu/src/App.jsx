
import { useState } from 'react';
import './App.css';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Perawatan from './pages/Perawatan';
import Beranda from './pages/Beranda';

function App() {
  // Pengunjung pertama kali melihat halaman beranda
  const [halamanAktif, setHalamanAktif] = useState('beranda');

  function gantiHalaman(halaman) {
    setHalamanAktif(halaman);
  }

  // Tampilkan beranda sebelum pengguna masuk ke aplikasi
  if (halamanAktif === 'beranda') {
    return (
      <Beranda
        onLogin={() => {}}
        onJelajahi={() => {}}
      />
    );
  }

  // Halaman aplikasi setelah pengguna masuk
  return (
    <div className="app">
      <Sidebar
        halamanAktif={halamanAktif}
        gantiHalaman={gantiHalaman}
      />

      <main className="main-content" id={halamanAktif}>
        {halamanAktif === 'dashboard' && <Dashboard />}

        {halamanAktif === 'jadwal' && <Perawatan />}

        {halamanAktif === 'tanaman' && (
          <h1>Halaman Data Tanaman</h1>
        )}

        {halamanAktif === 'misi' && (
          <h1>Halaman Misi Penyelamatan</h1>
        )}

        {halamanAktif === 'estafet' && (
          <h1>Halaman Estafet Penjaga</h1>
        )}
      </main>
    </div>
  );
}

export default App;
