// Halaman pengelolaan pemulihan tanaman
import { useEffect, useState } from "react";
import "./PemulihanTanaman.css";
import { supabase } from "../lib/supabaseClient";

const formAwal = {
  tanamanId: "",
  jadwalId: "",
  masalah: "",
  tindakan: "",
};

function PemulihanTanaman({ bukaHalaman }) {
  const [data, setData] = useState([]);
  const [tanaman, setTanaman] = useState([]);
  const [jadwal, setJadwal] = useState([]);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState("");
  const [memuat, setMemuat] = useState(true);
  const [pesan, setPesan] = useState("");

  const [formTerbuka, setFormTerbuka] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(formAwal);
  const [pencarian, setPencarian] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [menyimpan, setMenyimpan] = useState(false);

  async function muatData() {
    setMemuat(true);
    setPesan("");

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;
      if (!authData.user) {
        throw new Error("Silakan login kembali.");
      }

      const pengguna = authData.user;
      setUserId(pengguna.id);

      const { data: profil, error: profilError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", pengguna.id)
        .single();

      if (profilError) throw profilError;
      setRole(profil.role);

      const { data: tanamanData, error: tanamanError } =
        await supabase
          .from("tanaman")
          .select(`
            id,
            user_id,
            kode,
            nama_tanaman,
            lokasi,
            kondisi,
            penanggung_jawab,
            pekerja:profiles!tanaman_penanggung_jawab_fkey (
              id,
              nama_lengkap
            )
          `)
          .order("id");

      if (tanamanError) throw tanamanError;

      console.log("DATA TANAMAN DARI SUPABASE:", tanamanData);
      setTanaman((tanamanData || []).map((t) => ({
        id: t.id,
        userId: t.user_id,
        kode: t.kode || "",
        nama: t.nama_tanaman,
        lokasi: t.lokasi || "-",
        kondisi: t.kondisi || "-",
        penanggungJawab:
          t.pekerja?.nama_lengkap || "-",
        pekerjaId: t.penanggung_jawab || "",
      })));

      const { data: jadwalData, error: jadwalError } =
        await supabase
          .from("jadwal_perawatan")
          .select(`
            id,
            tanaman_id,
            jenis_perawatan,
            kegiatan,
            tanggal,
            waktu,
            status
          `)
          .order("tanggal");

      if (jadwalError) throw jadwalError;

      setJadwal(jadwalData || []);

      const { data: pemulihanData, error: pemulihanError } =
        await supabase
          .from("pemulihan_tanaman")
          .select(`
            id,
            user_id,
            tanaman_id,
            jadwal_id,
            pekerja_id,
            masalah,
            tindakan,
            status,
            tanggal,
            created_at,
            tanaman (
            nama_tanaman,
            kode,
            lokasi,
            kondisi
          ),
            jadwal_perawatan (
              kegiatan,
              jenis_perawatan,
              tanggal
            ),
            pekerja:profiles!pemulihan_tanaman_pekerja_id_fkey (
              nama_lengkap
            )

        
          `)
          .order("created_at", { ascending: false });

      if (pemulihanError) throw pemulihanError;
      
      const { data: cekProfil, error: cekProfilError } = await supabase
      .from("profiles")
      .select("id, nama_lengkap")
      .eq("id", "16a4a2a5-9d77-4c1e-80d2-1a8ee92615ff");

console.log("CEK PROFIL LANGSUNG:", cekProfil);
console.log("ERROR CEK PROFIL:", cekProfilError);
      console.log("DATA LAPORAN PEMULIHAN:", pemulihanData);

      console.table(
        (pemulihanData || []).map((p) => ({
          id: p.id,
          tanaman_id: p.tanaman_id,
          pekerja_id: p.pekerja_id,
          nama_pj: p.pekerja?.nama_lengkap,
        }))
      );

      setData((pemulihanData || []).map((p) => ({
        id: p.id,
        userId: p.user_id,
        tanamanId: p.tanaman_id,
        jadwalId: p.jadwal_id || "",
        nama: p.tanaman?.nama_tanaman || "Tanaman tidak ditemukan",
        kode: p.tanaman?.kode || "",
        lokasi: p.tanaman?.lokasi || "-",
        kondisiTanaman: p.tanaman?.kondisi || "-",
        penanggungJawab:
          p.pekerja?.nama_lengkap || "-",
        pekerjaId: p.pekerja_id || "",
        kegiatanJadwal:
          p.jadwal_perawatan?.kegiatan ||
          p.jadwal_perawatan?.jenis_perawatan ||
          "",
        masalah: p.masalah,
        tindakan: p.tindakan,
        status: p.status,
        tanggal: p.tanggal,
        laporanTersimpan: true,
      })));
    } catch (error) {
      console.error("Gagal memuat pemulihan:", error);
      setPesan(`Gagal memuat data: ${error.message}`);
    } finally {
      setMemuat(false);
    }
  }

  useEffect(() => {
    muatData();
  }, []);

  const tanamanDipilih = tanaman.find(
    (t) => String(t.id) === String(form.tanamanId)
  );

  const jadwalTersedia = jadwal.filter(
    (j) => String(j.tanaman_id) === String(form.tanamanId)
  );

  function bukaFormTambah() {
    setEditId(null);
    setForm({ ...formAwal });
    setPesan("");
    setFormTerbuka(true);
  }

  function bukaFormUntukTanaman(tanamanId) {
    setEditId(null);
    setForm({
      ...formAwal,
      tanamanId: String(tanamanId),
    });
    setPesan("");
    setFormTerbuka(true);
  }

  function bukaFormEdit(item) {
    setEditId(item.id);
    setForm({
      tanamanId: String(item.tanamanId),
      jadwalId: item.jadwalId ? String(item.jadwalId) : "",
      masalah: item.masalah,
      tindakan: item.tindakan,
    });
    setPesan("");
    setFormTerbuka(true);
  }

  async function simpanLaporan(e) {
    e.preventDefault();
    if (menyimpan) return;

    if (!form.tanamanId || !form.masalah.trim() ||
      !form.tindakan.trim()) {
      setPesan("Lengkapi tanaman, kondisi, dan tindakan.");
      return;
    }

    const tanamanDipilih = tanaman.find(
      (t) => String(t.id) === String(form.tanamanId)
    );

    if (!tanamanDipilih) {
      setPesan("Tanaman tidak ditemukan.");
      return;
    }

    if (
      form.jadwalId &&
      !jadwal.some(
        (j) =>
          String(j.id) === String(form.jadwalId) &&
          String(j.tanaman_id) === String(form.tanamanId)
      )
    ) {
      setPesan("Jadwal tidak sesuai dengan tanaman yang dipilih.");
      return;
    }

    setMenyimpan(true);
    setPesan("");

    try {

      console.log("TANAMAN DIPILIH:", tanamanDipilih);
      console.log("ID PJ TANAMAN:", tanamanDipilih.pekerjaId);

      const payload = {
        tanaman_id: Number(form.tanamanId),
        jadwal_id: form.jadwalId
          ? Number(form.jadwalId)
          : null,
        pekerja_id: tanamanDipilih.pekerjaId || null,
        masalah: form.masalah.trim(),
        tindakan: form.tindakan.trim(),
      };

      if (editId !== null) {
        const { error } = await supabase
          .from("pemulihan_tanaman")
          .update(payload)
          .eq("id", editId);

        if (error) throw error;
        setPesan("Laporan pemulihan berhasil diperbarui.");
      } else {
        const { error } = await supabase
          .from("pemulihan_tanaman")
          .insert({
            ...payload,
            user_id: userId,
            status: "Perlu Ditangani",
          });

        if (error) throw error;
        setPesan("Laporan pemulihan berhasil disimpan.");
      }

      setForm({ ...formAwal });
      setEditId(null);
      setFormTerbuka(false);
      await muatData();
    } catch (error) {
      console.error("Gagal menyimpan laporan:", error);
      setPesan(`Gagal menyimpan laporan: ${error.message}`);
    } finally {
      setMenyimpan(false);
    }
  }

  async function ubahStatus(id, status) {
    setPesan("");

    const { error } = await supabase
      .from("pemulihan_tanaman")
      .update({ status })
      .eq("id", id);

    if (error) {
      setPesan(`Gagal mengubah status: ${error.message}`);
      return;
    }

    setData((daftar) =>
      daftar.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
    setPesan("Status pemulihan berhasil diperbarui.");
  }

  async function hapusLaporan(id) {
    if (!window.confirm("Yakin ingin menghapus laporan ini?")) {
      return;
    }

    const { error } = await supabase
      .from("pemulihan_tanaman")
      .delete()
      .eq("id", id);

    if (error) {
      setPesan(`Gagal menghapus laporan: ${error.message}`);
      return;
    }

    setData((daftar) => daftar.filter((item) => item.id !== id));
    setPesan("Laporan berhasil dihapus.");
  }

        // Tanaman yang perlu perhatian tetapi belum memiliki laporan pemulihan
    const tanamanBelumAdaLaporan = tanaman.filter((t) => {
      const perluPerhatian =
        t.kondisi === "Kritis" ||
        t.kondisi === "Perlu Perawatan";

      const sudahAdaLaporan = data.some(
        (item) => String(item.tanamanId) === String(t.id)
      );

      return perluPerhatian && !sudahAdaLaporan;
    });

    // Gabungkan laporan tersimpan dengan tanaman yang belum dilaporkan
    const dataTampilan = [
      ...data,
      ...tanamanBelumAdaLaporan.map((t) => ({
        id: `tanaman-${t.id}`,
        tanamanId: t.id,
        nama: t.nama,
        kode: t.kode,
        lokasi: t.lokasi,
        kondisiTanaman: t.kondisi,
        penanggungJawab: t.penanggungJawab,
        pekerjaId: t.pekerjaId,
        kegiatanJadwal: "",
        masalah: "Belum ada laporan",
        tindakan: "Belum ada tindakan perawatan",
        status: "Belum Dicatat",
        tanggal: "-",
        laporanTersimpan: false,
      })),
    ];

    console.log("SEMUA TANAMAN:", tanaman);
console.log("TANAMAN BELUM ADA LAPORAN:", tanamanBelumAdaLaporan);
console.log("DATA TAMPILAN:", dataTampilan);

  const hasil = dataTampilan.filter((item) => {
    const kata = pencarian.toLowerCase();

    const cocokKata = [
      item.nama,
      item.lokasi,
      item.masalah,
      item.tindakan,
      item.penanggungJawab,
    ].some((nilai) => (nilai || "").toLowerCase().includes(kata));

    const cocokFilter =
      filter === "Semua" ||
      item.status === filter ||
      (filter === "Perlu Ditangani" &&
        item.status === "Belum Dicatat");

    return cocokKata && cocokFilter;
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
          {role === "pekerja" && (
            <button
              type="button"
              className="pemulihan-btn-secondary pemulihan-btn-kembali"
              onClick={() => bukaHalaman?.("dashboard-pekerja")}
            >
              ← Kembali
            </button>
          )}

          <h1>Pemulihan Tanaman</h1>
        </div>

        {role === "pengelola" && (
          <button
            type="button"
            className="pemulihan-btn"
            onClick={bukaFormTambah}
          >
            + Catat Kondisi
          </button>
        )}
      </header>

      {pesan && (
        <p role="status" className="tanaman-feedback">
          {pesan}
        </p>
      )}

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

      {role === "pengelola" && formTerbuka && (
        <form className="pemulihan-form" onSubmit={simpanLaporan}>
          <h2>
            {editId !== null
              ? "Edit Informasi Tanaman"
              : "Catat Kondisi Tanaman"}
          </h2>

          <div className="pemulihan-form-grid">
            <label>
              Nama tanaman
              <select
                required
                value={form.tanamanId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tanamanId: e.target.value,
                    jadwalId: "",
                  })
                }
              >
                <option value="">Pilih tanaman</option>
                {tanaman.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.kode ? `${t.kode} - ` : ""}{t.nama}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Lokasi
              <input
                readOnly
                value={tanamanDipilih?.lokasi || ""}
                placeholder="Terisi otomatis"
              />
            </label>

           <label>
              Penanggung jawab
              <input
                readOnly
                value={tanamanDipilih?.penanggungJawab || ""}
                placeholder="Terisi otomatis sesuai penanggung jawab tanaman"
              />
            </label>

            <label>
              Jadwal perawatan terkait
              <select
                value={form.jadwalId}
                onChange={(e) =>
                  setForm({ ...form, jadwalId: e.target.value })
                }
              >
                <option value="">Tidak dikaitkan dengan jadwal</option>
                {jadwalTersedia.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.kegiatan || j.jenis_perawatan}
                    {" — "}{j.tanggal}
                    {" ("}{j.status}{")"}
                  </option>
                ))}
              </select>
            </label>

            <label className="pemulihan-full">
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
            <button
              type="submit"
              className="pemulihan-btn"
              disabled={menyimpan}
            >
              {menyimpan
                ? "Menyimpan..."
                : editId !== null
                  ? "Simpan Perubahan"
                  : "Simpan Laporan"}
            </button>
          </div>
        </form>
      )}

      
      <section className="pemulihan-list care-panel">
        <div className="pemulihan-section-heading panel-heading">
          <h2>Daftar Kondisi Tanaman</h2>
        </div>

        <div className="care-table-wrap">
          <table className="care-table">
            <thead>
              <tr>
                <th>Tanaman</th>
                <th>Lokasi</th>
                <th>Kondisi</th>
                <th>Masalah yang Dilaporkan</th>
                <th>Tindakan Perawatan</th>
                <th>Penanggung Jawab</th>
                <th>Status</th>
                {role === "pengelola" && <th>Aksi</th>}
              </tr>
            </thead>

            <tbody>
              {memuat && (
                <tr>
                  <td colSpan={role === "pengelola" ? 10 : 9}>
                    Memuat data pemulihan...
                  </td>
                </tr>
              )}

              {!memuat && hasil.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="table-cell-plant">
                      <strong className="plant-name">{item.nama}</strong>
                      {item.kode && (
                        <span className="plant-code">{item.kode}</span>
                      )}
                    </div>
                  </td>

                  <td>
                    <span className="cell-text">{item.lokasi}</span>
                  </td>

                  <td>
                    <span className="cell-text">{item.kondisiTanaman}</span>
                  </td>

                  <td>
                    <span className="cell-text">{item.masalah}</span>
                  </td>

                  <td>
                    <span className="cell-text">{item.tindakan}</span>
                  </td>

                  <td>
                    <span className="cell-text">
                      {item.penanggungJawab || "-"}
                    </span>
                  </td>

                  <td>
                    {!item.laporanTersimpan ? (
                      <span className="pemulihan-status pemulihan-status-menunggu">
                        Belum Dicatat
                      </span>
                    ) : role === "pekerja" ? (
                      <select
                        value={item.status}
                        onChange={(e) =>
                          ubahStatus(item.id, e.target.value)
                        }
                        aria-label={`Status pemulihan ${item.nama}`}
                      >
                        <option value="Perlu Ditangani">Perlu Ditangani</option>
                        <option value="Dalam Perawatan">Dalam Perawatan</option>
                        <option value="Pulih">Pulih</option>
                      </select>
                    ) : (
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
                    )}
                  </td>
                {role === "pengelola" && (
                  <td>
                    <div className="pemulihan-table-actions">
                      {!item.laporanTersimpan ? (
                        <button
                          type="button"
                          onClick={() => bukaFormUntukTanaman(item.tanamanId)}
                        >
                          Catat Kondisi
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => bukaFormEdit(item)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => hapusLaporan(item.id)}
                          >
                            Hapus
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                )}
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </section>

    </main>
  );
}

export default PemulihanTanaman;
