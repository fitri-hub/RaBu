
import { useEffect, useState } from 'react';
import './App.css';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Perawatan from './pages/Perawatan';
import DataTanaman from './pages/DataTanaman';
import Beranda from './pages/Beranda';
import Login from './pages/Login';
import Register from './pages/Register';
import { supabase } from './lib/supabaseClient';

function App() {
  const [halamanAktif, setHalamanAktif] = useState('beranda');
  const [filterTanaman, setFilterTanaman] = useState('Semua');
  const [filterJadwal, setFilterJadwal] = useState('Semua');
  const [session, setSession] = useState(null);
  const [memeriksaSesi, setMemeriksaSesi] = useState(true);


useEffect(() => {
  let masihAktif = true;

  async function periksaSesi() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Gagal memeriksa sesi:', error.message);
    }

    if (masihAktif) {
      setSession(data?.session ?? null);
      setMemeriksaSesi(false);
    }
  }

  periksaSesi();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, sessionBaru) => {
    setSession(sessionBaru);
  });

  return () => {
    masihAktif = false;
    subscription.unsubscribe();
  };
}, []);


  function bukaHalaman(halaman, filter = 'Semua') {
    if (
      ['dashboard', 'tanaman', 'jadwal', 'misi', 'estafet'].includes(halaman) &&
      !session
    ) {
      setHalamanAktif('login');
      return;
    }

    if (halaman === 'tanaman') setFilterTanaman(filter);
    if (halaman === 'jadwal') setFilterJadwal(filter);

    setHalamanAktif(halaman);
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert('Gagal keluar: ' + error.message);
      return;
    }

    setHalamanAktif('beranda');
  }

  if (memeriksaSesi) {
    return <p>Memeriksa sesi pengguna...</p>;
  }

 if (halamanAktif === 'beranda') {
  return (
    <Beranda
      onLogin={() => bukaHalaman('login')}
      onRegister={() => bukaHalaman('register')}
      onJelajahi={() =>
        bukaHalaman(session ? 'dashboard' : 'login')
      }
    />
  );
}

  if (halamanAktif === 'login') {
    return (
      <Login
        onLogin={() => bukaHalaman('dashboard')}
        onRegister={() => bukaHalaman('register')}
      />
    );
  }

  if (halamanAktif === 'register') {
    return (
      <Register
        onRegister={() => bukaHalaman('dashboard')}
        onLogin={() => bukaHalaman('login')}
      />
    );
  }

  if (!session) {
    return <Login onLogin={() => bukaHalaman('dashboard')} onRegister={() => bukaHalaman('register')} />;
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

        <button onClick={logout}>Keluar</button>
      </main>
    </div>
  );
}

export default App;
