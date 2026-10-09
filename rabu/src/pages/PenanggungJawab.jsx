
import { useState } from "react";
import "./PenanggungJawab.css";

const dataAwal = [
  {
    id: 1,
    nama: "Pohon Mangga",
    lokasi: "Taman Depan",
    penjaga: "Khalisa",
    tanggal: "2026-08-01",
    riwayat: [],
  },
  {
    id: 2,
    nama: "Pohon Ketapang",
    lokasi: "Halaman Kampus",
    penjaga: "Aulia",
    tanggal: "2026-08-10",
    riwayat: [],
  },
  {
    id: 3,
    nama: "Pohon Jambu",
    lokasi: "Taman Belakang",
    penjaga: "Nadia",
    tanggal: "2026-08-15",
    riwayat: [],
  },
];

function PenanggungJawab() {
  const [tanaman, setTanaman] = useState(() => {
    try {
      const tersimpan = localStorage.getItem("rabu-penanggung-jawab");
      return tersimpan ? JSON.parse(tersimpan) : dataAwal;
    } catch {
      return dataAwal;
    }
  });

  const [pencarian, setPencarian] = useState("");
  const [terpilih, setTerpilih] = useState(null);
  const [penjagaBaru, setPenjagaBaru] = useState("");
  const [alasan, setAlasan] = useState("");
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [pesan, setPesan] = useState("");

  function simpanData(dataBaru) {
    setTanaman(dataBaru);
    localStorage.setItem(
      "rabu-penanggung-jawab",
      JSON.stringify(dataBaru)
    );
  }

  function bukaForm(item) {
    setTerpilih(item);
    setPenjagaBaru("");
    setAlasan("");
    setTanggal(new Date().toISOString().slice(0, 10));
    setPesan("");
  }

  function simpanPergantian(e) {
    e.preventDefault();

    if (!penjagaBaru.trim()) {
      setPesan("Nama penanggung jawab baru wajib diisi.");
      return;
    }

    if (
      penjagaBaru.trim().toLowerCase() ===
      terpilih.penjaga.trim().toLowerCase()
    ) {
      setPesan("Nama baru harus berbeda dari penanggung jawab saat ini.");
      return;
    }

    const dataBaru = tanaman.map((item) => {
      if (item.id !== terpilih.id) return item;

      const catatan = {
        dari: item.penjaga,
        ke: penjagaBaru.trim(),
        tanggal,
        alasan: alasan.trim(),
      };

      return {
        ...item,
        penjaga: penjagaBaru.trim(),
        tanggal,
        riwayat: [catatan, ...(item.riwayat || [])],
      };
    });

    simpanData(dataBaru);
    setTerpilih(null);
  }

  const hasil = tanaman.filter((item) => {
    const kata = pencarian.toLowerCase();

    return (
      item.nama.toLowerCase().includes(kata) ||
      item.lokasi.toLowerCase().includes(kata) ||
      item.penjaga.toLowerCase().includes(kata)
    );
  });

  const totalRiwayat = tanaman.reduce(
    (total, item) => total + (item.riwayat?.length || 0),
    0
  );

  return (
    <main className="pj-page">
      <header className="pj-header">
        <div>
          <p className="pj-eyebrow">RAWATBUMI · PENGELOLAAN TANAMAN</p>
          <h1>Penanggung Jawab Tanaman</h1>
          <p>
            Kelola orang yang bertugas merawat tanaman dan simpan riwayat
            pergantiannya.
          </p>
        </div>
      </header>

      <section className="pj-banner">
        <div className="pj-banner-icon">🌳</div>
        <div>
          <h2>Perawatan yang berkelanjutan</h2>
          <p>
            Setiap tanaman memiliki penanggung jawab. Jika tugas perlu
            dialihkan, catat pergantiannya agar tanggung jawab perawatan
            tetap jelas.
          </p>
        </div>
      </section>

      <section className="pj-stats">
        <article className="pj-stat">
          <span>Total Tanaman</span>
          <strong>{tanaman.length}</strong>
        </article>
        <article className="pj-stat">
          <span>Tanaman dengan Penanggung Jawab</span>
          <strong>{tanaman.filter((item) => item.penjaga).length}</strong>
        </article>
        <article className="pj-stat">
          <span>Total Pergantian</span>
          <strong>{totalRiwayat}</strong>
        </article>
      </section>

      <section className="pj-list-section">
        <div className="pj-section-heading">
          <div>
            <h2>Daftar Penanggung Jawab</h2>
            <p>Pilih tanaman untuk memperbarui penanggung jawabnya.</p>
          </div>
        </div>

        <input
          className="pj-search"
          value={pencarian}
          onChange={(e) => setPencarian(e.target.value)}
          placeholder="Cari nama tanaman, lokasi, atau penanggung jawab..."
        />

        <div className="pj-cards">
          {hasil.map((item) => (
            <article className="pj-card" key={item.id}>
              <div className="pj-tree-icon">🌿</div>

              <h3>{item.nama}</h3>
              <p className="pj-location">📍 {item.lokasi}</p>

              <div className="pj-current">
                <div className="pj-avatar">
                  {item.penjaga.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span>Penanggung jawab saat ini</span>
                  <strong>{item.penjaga}</strong>
                </div>
              </div>

              <div className="pj-date">
                <span>Mulai bertugas / pergantian terakhir</span>
                <strong>{item.tanggal}</strong>
              </div>

              <button className="pj-button" onClick={() => bukaForm(item)}>
                Ganti Penanggung Jawab
              </button>

              <div className="pj-history">
                <h4>Riwayat Pergantian</h4>

                {item.riwayat?.length ? (
                  item.riwayat.map((catatan, index) => (
                    <div className="pj-history-item" key={index}>
                      <strong>
                        {catatan.dari} → {catatan.ke}
                      </strong>
                      <span>{catatan.tanggal}</span>
                      {catatan.alasan && <p>{catatan.alasan}</p>}
                    </div>
                  ))
                ) : (
                  <p className="pj-no-history">
                    Belum ada riwayat pergantian.
                  </p>
                )}
              </div>
            </article>
          ))}

          {hasil.length === 0 && (
            <div className="pj-empty">
              <span>🌱</span>
              <h3>Tanaman tidak ditemukan</h3>
              <p>Coba kata pencarian yang lain.</p>
            </div>
          )}
        </div>
      </section>

      {terpilih && (
        <div
          className="pj-overlay"
          onClick={() => setTerpilih(null)}
        >
          <form
            className="pj-modal"
            onSubmit={simpanPergantian}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="pj-close"
              onClick={() => setTerpilih(null)}
              aria-label="Tutup formulir"
            >
              ×
            </button>

            <p className="pj-eyebrow">PEMBARUAN PENUGASAN</p>
            <h2>Ganti Penanggung Jawab</h2>
            <p className="pj-modal-subtitle">
              {terpilih.nama} · {terpilih.lokasi}
            </p>

            <div className="pj-transfer">
              <div>
                <span>Sebelumnya</span>
                <strong>{terpilih.penjaga}</strong>
              </div>
              <span className="pj-arrow">→</span>
              <div>
                <span>Penanggung jawab baru</span>
                <strong>{penjagaBaru || "Belum dipilih"}</strong>
              </div>
            </div>

            <label>
              Nama penanggung jawab baru
              <input
                required
                value={penjagaBaru}
                onChange={(e) => setPenjagaBaru(e.target.value)}
                placeholder="Masukkan nama"
              />
            </label>

            <label>
              Tanggal pergantian
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
              />
            </label>

            <label>
              Alasan pergantian
              <textarea
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                placeholder="Contoh: Pembagian tugas perawatan diperbarui"
              />
            </label>

            {pesan && <p className="pj-error">{pesan}</p>}

            <div className="pj-modal-actions">
              <button
                type="button"
                className="pj-cancel"
                onClick={() => setTerpilih(null)}
              >
                Batal
              </button>
              <button type="submit" className="pj-button">
                Simpan Pergantian
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default PenanggungJawab;