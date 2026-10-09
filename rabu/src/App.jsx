
import { useState } from 'react';
import './App.css';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Perawatan from './pages/Perawatan';
import DataTanaman from './pages/DataTanaman';

function App() {
  const [halamanAktif, setHalamanAktif] = useState('dashboard');
  const [filterTanaman, setFilterTanaman] = useState('Semua');
  const [filterJadwal, setFilterJadwal] = useState('Semua');

  function bukaHalaman(halaman, filter = 'Semua') {
    if (halaman === 'tanaman') {
      setFilterTanaman(filter);
    }

    if (halaman === 'jadwal') {
      setFilterJadwal(filter);
    }

    setHalamanAktif(halaman);
  }

  return (
    <div className="app">
      <Sidebar
        halamanAktif={halamanAktif}
        gantiHalaman={(halaman) => bukaHalaman(halaman)}
      />

      <main className="main-content">
        {halamanAktif === 'dashboard' && (
          <Dashboard bukaHalaman={bukaHalaman} />
        )}

        {halamanAktif === 'tanaman' && (
          <DataTanaman
            key={filterTanaman}
            filterAwal={filterTanaman}
          />
        )}

        {halamanAktif === 'jadwal' && (
          <Perawatan
            key={filterJadwal}
            filterAwal={filterJadwal}
          />
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