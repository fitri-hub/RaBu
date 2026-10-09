import { useState } from 'react';
import './Perawatan.css';

function Perawatan() {
  const [jadwal, setJadwal] = useState([
    {
      id: 1,
      tanaman: 'Pohon Mangga',
      kegiatan: 'Penyiraman',
      tanggal: '2026-10-10',
      penanggungJawab: 'Anggota 1',
      status: 'Belum Selesai',
    },
    {
      id: 2,
      tanaman: 'Pohon Ketapang',
      kegiatan: 'Pemeriksaan Kondisi',
      tanggal: '2026-10-11',
      penanggungJawab: 'Anggota 2',
      status: 'Belum Selesai',
    },
    {
      id: 3,
      tanaman: 'Pohon Jambu',
      kegiatan: 'Pemupukan',
      tanggal: '2026-10-12',
      penanggungJawab: 'Anggota 1',
      status: 'Selesai',
    },
  ]);

  const [filter, setFilter] = useState('Semua');

  function ubahStatus(id) {
    setJadwal((daftar) =>
      daftar.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === 'Selesai'
                  ? 'Belum Selesai'
                  : 'Selesai',
            }
          : item
      )
    );
  }

  const jadwalTampil = jadwal.filter((item) =>
    filter === 'Semua' ? true : item.status === filter
  );

  return (
    <section className="page-section">
      <header className="page-header">
        <div>
          <p className="breadcrumb">Halaman / Perawatan</p>
          <h1>Jadwal Perawatan</h1>
          <p>
            Atur kegiatan perawatan agar tanaman tetap sehat
            dan terjaga.
          </p>
        </div>
      </header>

      <div className="care-summary">
        <article className="care-card">
          <span>Total Jadwal</span>
          <h2>{jadwal.length}</h2>
        </article>

        <article className="care-card">
          <span>Belum Selesai</span>
          <h2>
            {jadwal.filter(
              (item) => item.status === 'Belum Selesai'
            ).length}
          </h2>
        </article>

        <article className="care-card">
          <span>Selesai</span>
          <h2>
            {jadwal.filter(
              (item) => item.status === 'Selesai'
            ).length}
          </h2>
        </article>
      </div>

      <section className="panel care-panel">
        <div className="panel-heading">
          <div>
            <h3>Daftar Jadwal</h3>
            <p>Pantau kegiatan perawatan tanaman</p>
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="Semua">Semua Status</option>
            <option value="Belum Selesai">Belum Selesai</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>

        <div className="care-list">
          {jadwalTampil.map((item) => (
            <article className="care-item" key={item.id}>
              <div className="care-item-icon">🌿</div>

              <div className="care-item-info">
                <h4>{item.kegiatan}</h4>
                <p>{item.tanaman}</p>
                <p>Tanggal: {item.tanggal}</p>
                <p>Penanggung jawab: {item.penanggungJawab}</p>
              </div>

              <div className="care-item-action">
                <span
                  className={
                    item.status === 'Selesai'
                      ? 'care-status done'
                      : 'care-status pending'
                  }
                >
                  {item.status}
                </span>

                <button
                  type="button"
                  onClick={() => ubahStatus(item.id)}
                >
                  {item.status === 'Selesai'
                    ? 'Batalkan'
                    : 'Tandai Selesai'}
                </button>
              </div>
            </article>
          ))}

          {jadwalTampil.length === 0 && (
            <p className="care-empty">
              Tidak ada jadwal dengan status ini.
            </p>
          )}
        </div>
      </section>
    </section>
  );
}

export default Perawatan;