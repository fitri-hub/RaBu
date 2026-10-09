import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Perawatan from './pages/Perawatan';

function App() {
  const [halamanAktif, setHalamanAktif] = useState('dashboard');

  function gantiHalaman(halaman) {
    setHalamanAktif(halaman);
  }

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