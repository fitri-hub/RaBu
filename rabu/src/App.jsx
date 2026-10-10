
import { useEffect, useState } from 'react';
import './App.css';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Perawatan from './pages/Perawatan';
import DataTanaman from './pages/DataTanaman';
import Beranda from './pages/Beranda';
import Login from './pages/Login';
import Register from './pages/Register';
import PemulihanTanaman from './pages/PemulihanTanaman';
import PenanggungJawab from './pages/PenanggungJawab';
import DashboardPekerja from './pages/DashboardPekerja';
import { supabase } from './lib/supabaseClient';
import TugasPekerja from './pages/TugasPekerja';

function App() {
  const [halamanAktif, setHalamanAktif] = useState('beranda');
  const [filterTanaman, setFilterTanaman] = useState('Semua');
  const [filterJadwal, setFilterJadwal] = useState('Semua');
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [namaPengguna, setNamaPengguna] = useState('');
  const [memeriksaSesi, setMemeriksaSesi] = useState(true);

  useEffect(() => {
    let masihAktif = true;

    async function perbaruiPengguna(sesi) {
      if (!sesi?.user) {
        if (masihAktif) {
          setRole(null);
          setNamaPengguna('');
        }
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role, nama_lengkap')
        .eq('id', sesi.user.id)
        .maybeSingle();

      if (!masihAktif) return;

      if (error || !data) {
        console.error(
          'Gagal mengambil profil:',
          error?.message || 'Profil tidak ditemukan'
        );
        setRole(null);
        setNamaPengguna('');
        return;
      }

      setRole(data.role);
      setNamaPengguna(data.nama_lengkap || '');
    }

    async function mulai() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Gagal memeriksa sesi:', error.message);
      }

      if (!masihAktif) return;

      const sesiAwal = data?.session ?? null;
      setSession(sesiAwal);

      await perbaruiPengguna(sesiAwal);

      if (masihAktif) {
        setMemeriksaSesi(false);
      }
    }

    mulai();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sesiBaru) => {
      setSession(sesiBaru);

      if (!sesiBaru) {
        setRole(null);
        setNamaPengguna('');
        setHalamanAktif('beranda');
        return;
      }

      // Jalankan pengambilan profil setelah callback autentikasi selesai.
      Promise.resolve().then(() => perbaruiPengguna(sesiBaru));
    });

    return () => {
      masihAktif = false;
      subscription.unsubscribe();
    };
  }, []);

  function bukaHalaman(halaman, filter = 'Semua') {
    const halamanPengelola = [
      'dashboard',
      'tanaman',
      'jadwal',
      'misi',
      'estafet',
    ];

    const halamanPekerja = [
      'dashboard-pekerja',
      'tugas',
      'profil',
    ];

    if (!session) {
      setHalamanAktif('login');
      return;
    }

    if (role === 'pekerja' && halamanPengelola.includes(halaman)) {
      setHalamanAktif('dashboard-pekerja');
      return;
    }

    if (role !== 'pengelola' && halamanPengelola.includes(halaman)) {
      setHalamanAktif('dashboard-pekerja');
      return;
    }

    if (role === 'pengelola' && halamanPekerja.includes(halaman)) {
      setHalamanAktif('dashboard');
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

    setSession(null);
    setRole(null);
    setNamaPengguna('');
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
        onJelajahi={() => {
          if (!session) {
            bukaHalaman('login');
          } else if (role === 'pengelola') {
            bukaHalaman('dashboard');
          } else if (role === 'pekerja') {
            bukaHalaman('dashboard-pekerja');
          }
        }}
      />
    );
  }

  if (halamanAktif === 'login') {
    return (
      <Login
        onLogin={() => {
          if (role === 'pengelola') {
            bukaHalaman('dashboard');
          } else {
            bukaHalaman('dashboard-pekerja');
          }
        }}
        onRegister={() => bukaHalaman('register')}
      />
    );
  }

  if (halamanAktif === 'register') {
    return (
      <Register
        onRegister={() => bukaHalaman('login')}
        onLogin={() => bukaHalaman('login')}
      />
    );
  }

  if (!session) {
    return (
      <Login
        onLogin={() => bukaHalaman('dashboard-pekerja')}
        onRegister={() => bukaHalaman('register')}
      />
    );
  }

  if (memeriksaSesi || !role) {
    return (
      <div className="app-loading">
        <p>Memuat profil pengguna...</p>
        <button onClick={logout}>Keluar</button>
      </div>
    );
  }

if (role === 'pekerja') {
  if (halamanAktif === 'tugas') {
    return <TugasPekerja />;
  }

  if (halamanAktif === 'profil') {
    return (
      <DashboardPekerja
        nama={namaPengguna}
        bukaHalaman={bukaHalaman}
        onLogout={logout}
      />
    );
  }

  return (
    <DashboardPekerja
      nama={namaPengguna}
      bukaHalaman={bukaHalaman}
      onLogout={logout}
    />
  );
}

  if (role !== 'pengelola') {
    return (
      <div className="app-loading">
        <p>Peran akun belum tersedia. Silakan hubungi pengelola.</p>
        <button onClick={logout}>Keluar</button>
      </div>
    );
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

        {halamanAktif === 'misi' && <PemulihanTanaman />}

        {halamanAktif === 'estafet' && <PenanggungJawab />}

        <button onClick={logout}>Keluar</button>
      </main>
    </div>
  );
}

export default App;
