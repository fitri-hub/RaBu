
import { useEffect, useMemo, useState } from 'react';
import './DataTanaman.css';
import {
  bacaTanaman,
  simpanTanaman,
} from '../data/tanamanStorage';

const FORM_KOSONG = {
  nama: '',
  jenis: 'Pohon Buah',
  lokasi: '',
  tanggalTanam: '',
  kondisi: 'Sehat',
  penanggungJawab: '',
  catatan: '',
};

const PILIHAN_KONDISI = [
  'Sehat',
  'Perlu Perawatan',
  'Kritis',
];

function DataTanaman({ filterAwal = 'Semua' }) {
  const [tanaman, setTanaman] = useState(bacaTanaman);
  const [kataKunci, setKataKunci] = useState('');
  const [filterKondisi, setFilterKondisi] = useState(
    filterAwal === 'Perlu Perhatian' ? 'Perlu Perhatian' : filterAwal
  );
  const [filterJenis, setFilterJenis] = useState('Semua');
  const [formTerbuka, setFormTerbuka] = useState(false);
  const [detailTanaman, setDetailTanaman] = useState(null);
  const [idDiedit, setIdDiedit] = useState(null);
  const [form, setForm] = useState(FORM_KOSONG);
  const [pesan, setPesan] = useState('');

  useEffect(() => {
    simpanTanaman(tanaman);
  }, [tanaman]);

  useEffect(() => {
    setFilterKondisi(
      filterAwal === 'Perlu Perhatian' ? 'Perlu Perhatian' : filterAwal
    );
  }, [filterAwal]);

  const daftarJenis = useMemo(
    () => [...new Set(tanaman.map((item) => item.jenis).filter(Boolean))],
    [tanaman]
  );

  const tanamanTampil = useMemo(() => {
    const kata = kataKunci.toLowerCase().trim();

    return tanaman.filter((item) => {
      const cocokKata = [
        item.kode,
        item.nama,
        item.jenis,
        item.lokasi,
        item.penanggungJawab,
      ].some((nilai) =>
        String(nilai || '').toLowerCase().includes(kata)
      );

      const cocokKondisi =
        filterKondisi === 'Semua' ||
        (
          filterKondisi === 'Perlu Perhatian' &&
          ['Perlu Perawatan', 'Kritis'].includes(item.kondisi)
        ) ||
        item.kondisi === filterKondisi;

      const cocokJenis =
        filterJenis === 'Semua' || item.jenis === filterJenis;

      return cocokKata && cocokKondisi && cocokJenis;
    });
  }, [tanaman, kataKunci, filterKondisi, filterJenis]);

  function bukaTambah() {
    setIdDiedit(null);
    setForm({ ...FORM_KOSONG });
    setPesan('');
    setFormTerbuka(true);
  }

  function bukaEdit(item) {
    setIdDiedit(item.id);
    setForm({
      nama: item.nama || '',
      jenis: item.jenis || 'Pohon Buah',
      lokasi: item.lokasi || '',
      tanggalTanam: item.tanggalTanam || '',
      kondisi: item.kondisi || 'Sehat',
      penanggungJawab: item.penanggungJawab || '',
      catatan: item.catatan || '',
    });
    setDetailTanaman(null);
    setPesan('');
    setFormTerbuka(true);
  }

  function simpanForm(event) {
    event.preventDefault();

    if (!form.nama.trim() || !form.lokasi.trim()) {
      setPesan('Nama tanaman dan lokasi wajib diisi.');
      return;
    }

    if (
      form.tanggalTanam &&
      form.tanggalTanam > new Date().toLocaleDateString('en-CA')
    ) {
      // Validasi tambahan dilakukan di bawah menggunakan format ISO.
      const hariIni = new Date();
      const tahun = hariIni.getFullYear();
      const bulan = String(hariIni.getMonth() + 1).padStart(2, '0');
      const tanggal = String(hariIni.getDate()).padStart(2, '0');
      const isoHariIni = `${tahun}-${bulan}-${tanggal}`;

      if (form.tanggalTanam > isoHariIni) {
        setPesan('Tanggal tanam tidak boleh melebihi hari ini.');
        return;
      }
    }

    if (idDiedit !== null) {
      setTanaman((daftar) =>
        daftar.map((item) =>
          item.id === idDiedit
            ? { ...item, ...form, nama: form.nama.trim() }
            : item
        )
      );
      setPesan('Data tanaman berhasil diperbarui.');
    } else {
      const nomorTerbesar = tanaman.reduce((maks, item) => {
        const angka = Number(
          String(item.kode || '').replace('TNM-', '')
        );
        return Number.isFinite(angka) ? Math.max(maks, angka) : maks;
      }, 0);

      const dataBaru = {
        ...form,
        nama: form.nama.trim(),
        id: Date.now(),
        kode: `TNM-${String(nomorTerbesar + 1).padStart(3, '0')}`,
      };

      setTanaman((daftar) => [...daftar, dataBaru]);
      setPesan('Tanaman baru berhasil ditambahkan.');
    }

    setFormTerbuka(false);
    setIdDiedit(null);
  }

  function hapusTanaman(item) {
    const setuju = window.confirm(
      `Yakin ingin menghapus ${item.nama}?`
    );

    if (!setuju) return;

    setTanaman((daftar) =>
      daftar.filter((data) => data.id !== item.id)
    );
    setDetailTanaman(null);
  }

  function ubahKondisi(id, kondisi) {
    setTanaman((daftar) =>
      daftar.map((item) =>
        item.id === id ? { ...item, kondisi } : item
      )
    );

    setDetailTanaman((item) =>
      item && item.id === id ? { ...item, kondisi } : item
    );
  }

  function kelasStatus(kondisi) {
    if (kondisi === 'Sehat') return 'status-sehat';
    if (kondisi === 'Kritis') return 'status-kritis';
    return 'status-perawatan';
  }

  return (
    <section className="tanaman-page">
      <header className="tanaman-header">
        <div>
          <p className="breadcrumb">Halaman / Data Tanaman</p>
          <h1>Data Tanaman 🌿</h1>
          <p>Kenali, pantau, dan rawat setiap tanaman bersama RaBu.</p>
        </div>

        <button
          type="button"
          className="tanaman-btn-primary"
          onClick={bukaTambah}
        >
          + Tambah Tanaman
        </button>
      </header>

      {pesan && (
        <p className="tanaman-feedback" role="status">
          {pesan}
        </p>
      )}

      <div className="tanaman-summary">
        <button
          type="button"
          className="tanaman-summary-card"
          onClick={() => setFilterKondisi('Semua')}
        >
          <span>🌱 Total Tanaman</span>
          <strong>{tanaman.length}</strong>
          <small>Lihat semua</small>
        </button>

        <button
          type="button"
          className="tanaman-summary-card"
          onClick={() => setFilterKondisi('Sehat')}
        >
          <span>🍃 Tanaman Sehat</span>
          <strong>
            {tanaman.filter((item) => item.kondisi === 'Sehat').length}
          </strong>
          <small>Lihat tanaman sehat</small>
        </button>

        <button
          type="button"
          className="tanaman-summary-card"
          onClick={() => setFilterKondisi('Perlu Perhatian')}
        >
          <span>🪴 Perlu Perhatian</span>
          <strong>
            {
              tanaman.filter((item) =>
                ['Perlu Perawatan', 'Kritis'].includes(item.kondisi)
              ).length
            }
          </strong>
          <small>Perawatan dan kritis</small>
        </button>
      </div>

      <section className="tanaman-card">
        <div className="tanaman-card-heading">
          <div>
            <h2>Daftar Tanaman</h2>
            <p>
              Menampilkan {tanamanTampil.length} dari {tanaman.length} tanaman
            </p>
          </div>
        </div>

        <div className="tanaman-filters">
          <input
            type="search"
            value={kataKunci}
            onChange={(event) => setKataKunci(event.target.value)}
            placeholder="Cari nama, kode, lokasi..."
            aria-label="Cari tanaman"
          />

          <select
            value={filterKondisi}
            onChange={(event) => setFilterKondisi(event.target.value)}
            aria-label="Filter kondisi"
          >
            <option value="Semua">Semua Kondisi</option>
            <option value="Sehat">Sehat</option>
            <option value="Perlu Perhatian">Perlu Perhatian</option>
            <option value="Perlu Perawatan">Perlu Perawatan</option>
            <option value="Kritis">Kritis</option>
          </select>

          <select
            value={filterJenis}
            onChange={(event) => setFilterJenis(event.target.value)}
            aria-label="Filter jenis"
          >
            <option value="Semua">Semua Jenis</option>
            {daftarJenis.map((jenis) => (
              <option value={jenis} key={jenis}>
                {jenis}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="tanaman-btn-secondary"
            onClick={() => {
              setKataKunci('');
              setFilterKondisi('Semua');
              setFilterJenis('Semua');
            }}
          >
            Reset
          </button>
        </div>

        <div className="tanaman-table-wrap">
          <table className="tanaman-table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Tanaman</th>
                <th>Jenis</th>
                <th>Lokasi</th>
                <th>Kondisi</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {tanamanTampil.map((item) => (
                <tr key={item.id}>
                  <td>{item.kode}</td>
                  <td>
                    <strong>{item.nama}</strong>
                  </td>
                  <td>{item.jenis}</td>
                  <td>{item.lokasi}</td>
                  <td>
                    <span className={`tanaman-status ${kelasStatus(item.kondisi)}`}>
                      {item.kondisi}
                    </span>
                  </td>
                  <td>
                    <div className="tanaman-actions">
                      <button
                        type="button"
                        onClick={() => setDetailTanaman(item)}
                        title="Lihat detail"
                      >
                        Detail
                      </button>
                      <button
                        type="button"
                        onClick={() => bukaEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => hapusTanaman(item)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {tanamanTampil.length === 0 && (
                <tr>
                  <td colSpan="6" className="tanaman-empty">
                    <span>🌱</span>
                    <p>Tidak ada tanaman yang cocok dengan filter ini.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setKataKunci('');
                        setFilterKondisi('Semua');
                        setFilterJenis('Semua');
                      }}
                    >
                      Tampilkan semua tanaman
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {formTerbuka && (
        <div
          className="tanaman-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setFormTerbuka(false);
            }
          }}
        >
          <section
            className="tanaman-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-tanaman-title"
          >
            <div className="tanaman-modal-heading">
              <div>
                <p>FORMULIR DATA</p>
                <h2 id="form-tanaman-title">
                  {idDiedit !== null ? 'Edit Tanaman' : 'Tambah Tanaman'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setFormTerbuka(false)}
                aria-label="Tutup formulir"
              >
                ✕
              </button>
            </div>

            <form onSubmit={simpanForm}>
              <label>
                Nama Tanaman *
                <input
                  required
                  value={form.nama}
                  onChange={(event) =>
                    setForm({ ...form, nama: event.target.value })
                  }
                  placeholder="Contoh: Pohon Mangga"
                />
              </label>

              <label>
                Jenis Tanaman
                <select
                  value={form.jenis}
                  onChange={(event) =>
                    setForm({ ...form, jenis: event.target.value })
                  }
                >
                  <option>Pohon Buah</option>
                  <option>Pohon Peneduh</option>
                  <option>Tanaman Hias</option>
                  <option>Tanaman Obat</option>
                  <option>Tanaman Sayur</option>
                  <option>Lainnya</option>
                </select>
              </label>

              <label>
                Lokasi *
                <input
                  required
                  value={form.lokasi}
                  onChange={(event) =>
                    setForm({ ...form, lokasi: event.target.value })
                  }
                  placeholder="Contoh: Taman Depan"
                />
              </label>

              <label>
                Tanggal Tanam
                <input
                  type="date"
                  value={form.tanggalTanam}
                  onChange={(event) =>
                    setForm({ ...form, tanggalTanam: event.target.value })
                  }
                />
              </label>

              <label>
                Kondisi Tanaman
                <select
                  value={form.kondisi}
                  onChange={(event) =>
                    setForm({ ...form, kondisi: event.target.value })
                  }
                >
                  {PILIHAN_KONDISI.map((kondisi) => (
                    <option value={kondisi} key={kondisi}>
                      {kondisi}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Penanggung Jawab
                <input
                  value={form.penanggungJawab}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      penanggungJawab: event.target.value,
                    })
                  }
                  placeholder="Nama penanggung jawab"
                />
              </label>

              <label className="tanaman-full-field">
                Catatan
                <textarea
                  rows="3"
                  value={form.catatan}
                  onChange={(event) =>
                    setForm({ ...form, catatan: event.target.value })
                  }
                  placeholder="Catatan kondisi atau perawatan..."
                />
              </label>

              <div className="tanaman-modal-actions">
                <button
                  type="button"
                  className="tanaman-btn-secondary"
                  onClick={() => setFormTerbuka(false)}
                >
                  Batal
                </button>
                <button type="submit" className="tanaman-btn-primary">
                  Simpan Data
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {detailTanaman && (
        <div
          className="tanaman-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDetailTanaman(null);
            }
          }}
        >
          <section
            className="tanaman-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-tanaman-title"
          >
            <div className="tanaman-modal-heading">
              <div>
                <p>INFORMASI TANAMAN</p>
                <h2 id="detail-tanaman-title">{detailTanaman.nama}</h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailTanaman(null)}
                aria-label="Tutup detail"
              >
                ✕
              </button>
            </div>

            <div className="tanaman-detail-list">
              <p><strong>Kode:</strong> {detailTanaman.kode}</p>
              <p><strong>Jenis:</strong> {detailTanaman.jenis}</p>
              <p><strong>Lokasi:</strong> {detailTanaman.lokasi}</p>
              <p><strong>Tanggal tanam:</strong> {detailTanaman.tanggalTanam || '-'}</p>
              <p><strong>Penanggung jawab:</strong> {detailTanaman.penanggungJawab || '-'}</p>
              <p><strong>Catatan:</strong> {detailTanaman.catatan || '-'}</p>
            </div>

            <label className="tanaman-detail-condition">
              Ubah kondisi tanaman
              <select
                value={detailTanaman.kondisi}
                onChange={(event) =>
                  ubahKondisi(detailTanaman.id, event.target.value)
                }
              >
                {PILIHAN_KONDISI.map((kondisi) => (
                  <option key={kondisi} value={kondisi}>
                    {kondisi}
                  </option>
                ))}
              </select>
            </label>

            <div className="tanaman-modal-actions">
              <button
                type="button"
                className="tanaman-btn-secondary"
                onClick={() => setDetailTanaman(null)}
              >
                Tutup
              </button>
              <button
                type="button"
                className="tanaman-btn-primary"
                onClick={() => bukaEdit(detailTanaman)}
              >
                Edit Data
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

export default DataTanaman;