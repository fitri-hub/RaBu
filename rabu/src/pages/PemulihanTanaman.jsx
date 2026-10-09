
import { useState } from "react";
import "./PemulihanTanaman.css";

const dataAwal = [
  {
    id: 1,
    nama: "Pohon Mangga",
    lokasi: "Taman Depan",
    masalah: "Daun menguning",
    penanggungJawab: "Khalisa",
    tindakan: "Memeriksa kondisi tanah dan penyiraman",
    status: "Perlu Ditangani",
    tanggal: "2026-10-09",
  },
  {
    id: 2,
    nama: "Pohon Ketapang",
    lokasi: "Halaman Kampus",
    masalah: "Daun mulai layu",
    penanggungJawab: "Aulia",
    tindakan: "Penyiraman dan pemeriksaan akar",
    status: "Dalam Perawatan",
    tanggal: "2026-10-09",
  },
];

const formAwal = {
  nama: "",
  lokasi: "",
  masalah: "",
  penanggungJawab: "",
  tindakan: "",
};

function PemulihanTanaman() {
  const [data, setData] = useState(() => {
    try {
      const tersimpan = localStorage.getItem("rabu-pemulihan-tanaman");
      return tersimpan ? JSON.parse(tersimpan) : dataAwal;
    } catch {
      return dataAwal;
    }
  });

  const [formTerbuka, setFormTerbuka] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(formAwal);
  const [pencarian, setPencarian] = useState("");
  const [filter, setFilter] = useState("Semua");

  function simpanData(dataBaru) {
    setData(dataBaru);
    localStorage.setItem(
      "rabu-pemulihan-tanaman",
      JSON.stringify(dataBaru)
    );
  }

  function bukaFormTambah() {
    setEditId(null);
    setForm({ ...formAwal });
    setFormTerbuka(true);
  }

  function bukaFormEdit(item) {
    setEditId(item.id);
    setForm({
      nama: item.nama,
      lokasi: item.lokasi,
      masalah: item.masalah,
      penanggungJawab: item.penanggungJawab,
      tindakan: item.tindakan,
    });
    setFormTerbuka(true);
  }

  function simpanLaporan(e) {
    e.preventDefault();

    if (editId !== null) {
      const dataBaru = data.map((item) =>
        item.id === editId ? { ...item, ...form } : item
      );

      simpanData(dataBaru);
    } else {
      const laporanBaru = {
        ...form,
        id: Date.now(),
        status: "Perlu Ditangani",
        tanggal: new Date().toISOString().slice(0, 10),
      };

      simpanData([laporanBaru, ...data]);
    }

    setForm({ ...formAwal });
    setEditId(null);
    setFormTerbuka(false);
  }

  function ubahStatus(id, status) {
    simpanData(
      data.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  }

  function hapusLaporan(id) {
    const yakin = window.confirm(
      "Yakin ingin menghapus laporan tanaman ini?"
    );

    if (!yakin) return;

    simpanData(data.filter((item) => item.id !== id));
  }

  const hasil = data.filter((item) => {
    const kata = pencarian.toLowerCase();

    const cocokKata =
      item.nama.toLowerCase().includes(kata) ||
      item.lokasi.toLowerCase().includes(kata) ||
      item.masalah.toLowerCase().includes(kata);

    return cocokKata && (filter === "Semua" || item.status === filter);
  });

  const perluDitangani = data.filter(
    (item) => item.status === "Perlu Ditangani"
  ).length;

  const dalamPerawatan = data.filter(
    (item) => item.status === "Dalam Perawatan"
  ).length;

  const selesai = data.filter(
    (item) => item.status === "Pulih"
  ).length;

  return (
    <main className="pemulihan-page">
      <header className="pemulihan-header">
        <div>
          <p className="pemulihan-eyebrow">
            RAWATBUMI · KESEHATAN TANAMAN
          </p>
          <h1>Pemulihan Tanaman</h1>
          <p>
            Pantau tanaman yang bermasalah dan catat tindakan perawatannya.
          </p>
        </div>

        <button className="pemulihan-btn" onClick={bukaFormTambah}>
          + Catat Kondisi
        </button>
      </header>

      <section className="pemulihan-stats">
        <article className="pemulihan-stat">
          <span>Total Laporan</span>
          <strong>{data.length}</strong>
          <small>Tanaman yang tercatat</small>
        </article>

        <article className="pemulihan-stat">
          <span>Perlu Ditangani</span>
          <strong>{perluDitangani}</strong>
          <small>Menunggu perawatan</small>
        </article>

        <article className="pemulihan-stat">
          <span>Dalam Perawatan</span>
          <strong>{dalamPerawatan}</strong>
          <small>Sedang ditangani</small>
        </article>

        <article className="pemulihan-stat">
          <span>Telah Pulih</span>
          <strong>{selesai}</strong>
          <small>Perawatan selesai</small>
        </article>
      </section>

      {formTerbuka && (
        <form className="pemulihan-form" onSubmit={simpanLaporan}>
          <h2>
            {editId !== null
              ? "Edit Informasi Tanaman"
              : "Catat Kondisi Tanaman"}
          </h2>

          <div className="pemulihan-form-grid">
            <label>
              Nama tanaman
              <input
                required
                value={form.nama}
                placeholder="Contoh: Pohon Mangga"
                onChange={(e) =>
                  setForm({ ...form, nama: e.target.value })
                }
              />
            </label>

            <label>
              Lokasi
              <input
                required
                value={form.lokasi}
                placeholder="Contoh: Taman Depan"
                onChange={(e) =>
                  setForm({ ...form, lokasi: e.target.value })
                }
              />
            </label>

            <label>
              Kondisi atau masalah
              <input
                required
                value={form.masalah}
                placeholder="Contoh: Daun menguning"
                onChange={(e) =>
                  setForm({ ...form, masalah: e.target.value })
                }
              />
            </label>

            <label>
              Penanggung jawab
              <input
                required
                value={form.penanggungJawab}
                placeholder="Nama petugas"
                onChange={(e) =>
                  setForm({
                    ...form,
                    penanggungJawab: e.target.value,
                  })
                }
              />
            </label>

            <label className="pemulihan-full">
              Tindakan perawatan
              <textarea
                required
                value={form.tindakan}
                placeholder="Jelaskan tindakan perawatan tanaman"
                onChange={(e) =>
                  setForm({ ...form, tindakan: e.target.value })
                }
              />
            </label>
          </div>

          <div className="pemulihan-form-actions">
            <button
              type="button"
              className="pemulihan-btn-secondary"
              onClick={() => {
                setFormTerbuka(false);
                setEditId(null);
                setForm({ ...formAwal });
              }}
            >
              Batal
            </button>

            <button type="submit" className="pemulihan-btn">
              {editId !== null ? "Simpan Perubahan" : "Simpan Laporan"}
            </button>
          </div>
        </form>
      )}

      <section className="pemulihan-list">
        <div className="pemulihan-section-heading">
          <div>
            <h2>Daftar Kondisi Tanaman</h2>
            <p>
              Informasi masalah dan tindak lanjut perawatan tanaman.
            </p>
          </div>
        </div>

        <div className="pemulihan-toolbar">
          <input
            value={pencarian}
            onChange={(e) => setPencarian(e.target.value)}
            placeholder="Cari nama, lokasi, atau masalah..."
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>Semua</option>
            <option>Perlu Ditangani</option>
            <option>Dalam Perawatan</option>
            <option>Pulih</option>
          </select>
        </div>

        <div className="pemulihan-cards">
          {hasil.map((item) => (
            <article className="pemulihan-card" key={item.id}>
              <div className="pemulihan-card-top">
                <div className="pemulihan-plant-icon">🌱</div>

                <span
                  className={`pemulihan-status ${
                    item.status === "Pulih"
                      ? "pemulihan-status-selesai"
                      : item.status === "Dalam Perawatan"
                      ? "pemulihan-status-proses"
                      : "pemulihan-status-menunggu"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <h3>{item.nama}</h3>
              <p className="pemulihan-location">📍 {item.lokasi}</p>

              <div className="pemulihan-problem">
                <span>Kondisi tanaman</span>
                <strong>{item.masalah}</strong>
              </div>

              <div className="pemulihan-detail">
                <span>Penanggung jawab</span>
                <strong>{item.penanggungJawab}</strong>
              </div>

              <div className="pemulihan-detail">
                <span>Tindakan perawatan</span>
                <strong>{item.tindakan}</strong>
              </div>

              <div className="pemulihan-detail">
                <span>Tanggal laporan</span>
                <strong>{item.tanggal}</strong>
              </div>

              <label className="pemulihan-status-label">
                Perbarui status
                <select
                  value={item.status}
                  onChange={(e) =>
                    ubahStatus(item.id, e.target.value)
                  }
                >
                  <option>Perlu Ditangani</option>
                  <option>Dalam Perawatan</option>
                  <option>Pulih</option>
                </select>
              </label>

              <div className="pemulihan-form-actions">
                <button
                  type="button"
                  className="pemulihan-btn-secondary"
                  onClick={() => bukaFormEdit(item)}
                >
                  ✏️ Edit
                </button>

                <button
                  type="button"
                  className="pemulihan-btn-secondary"
                  onClick={() => hapusLaporan(item.id)}
                >
                  🗑️ Hapus
                </button>
              </div>
            </article>
          ))}

          {hasil.length === 0 && (
            <div className="pemulihan-empty">
              <span>🌿</span>
              <h3>Data tidak ditemukan</h3>
              <p>Coba kata pencarian atau filter status yang lain.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default PemulihanTanaman;