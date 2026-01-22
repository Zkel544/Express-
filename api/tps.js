const express = require("express");
const cors = require("cors");
const Tps = require("../modules/tps");

const router = express.Router();
router.use(express.json());
router.use(cors());

/* =====================================================
   Helper
===================================================== */
const hitungStatusKapasitas = (maks, terpakai) => {
  if (!maks || terpakai == null) return "aman";

  const persen = (terpakai / maks) * 100;
  if (persen >= 100) return "penuh";
  if (persen >= 80) return "hampir_penuh";
  return "aman";
};

/* =====================================================
   GET - Ambil semua TPS
===================================================== */
router.get("/", async (_, res) => {
  try {
    const data = await Tps.find();
    return res.status(200).json(data);
  } catch (err) {
    console.error("GET /tps error:", err);
    return res.status(500).json({ message: "Gagal mengambil data TPS" });
  }
});

/* =====================================================
   POST - Tambah TPS
===================================================== */
router.post("/add", async (req, res) => {
  try {
    const {
      nama,alamat,latitude,longitude,akses_jalan,kapasitas_maksimal,kapasitas_terpakai,
      unit_kerja,no,type,fasilitas,jam_operasional,hari_operasional,jadwal_angkut,
    } = req.body;

    if (!nama || !alamat || latitude == null || longitude == null) {
      return res.status(400).json({ message: "Data wajib belum lengkap" });
    }

    const tps = await Tps.create({
      nama: nama.trim(),
      alamat: alamat.trim(),
      latitude,longitude,akses_jalan,kapasitas_maksimal,kapasitas_terpakai,
      status_kapasitas: hitungStatusKapasitas(
        kapasitas_maksimal,
        kapasitas_terpakai
      ),
      unit_kerja,no,type,fasilitas,jam_operasional,hari_operasional,jadwal_angkut,
    });

    return res.status(201).json({
      message: "TPS berhasil ditambahkan",
      data: tps,
    });
  } catch (err) {
    console.error("POST /tps/add error:", err);
    return res.status(500).json({ message: "Gagal menambahkan TPS" });
  }
});

/* =====================================================
   PUT - Update TPS
===================================================== */
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    if (payload.nama) payload.nama = payload.nama.trim();
    if (payload.alamat) payload.alamat = payload.alamat.trim();

    if (
      payload.kapasitas_maksimal != null ||
      payload.kapasitas_terpakai != null
    ) {
      payload.status_kapasitas = hitungStatusKapasitas(
        payload.kapasitas_maksimal,
        payload.kapasitas_terpakai
      );
    }

    const updated = await Tps.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "TPS tidak ditemukan" });
    }

    return res.status(200).json({
      message: "TPS berhasil diperbarui",
      data: updated,
    });
  } catch (err) {
    console.error("PUT /tps/update error:", err);
    return res.status(500).json({ message: "Gagal memperbarui TPS" });
  }
});

/* =====================================================
   DELETE - Hapus TPS
===================================================== */
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Tps.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "TPS tidak ditemukan" });
    }

    return res.status(200).json({ message: "TPS berhasil dihapus" });
  } catch (err) {
    console.error("DELETE /tps/delete error:", err);
    return res.status(500).json({ message: "Gagal menghapus TPS" });
  }
});

module.exports = router;
