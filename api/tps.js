const express = require("express");
const cors = require("cors");
const Tps = require("../modules/tps");

const router = express.Router();
router.use(express.json());
router.use(cors());

// Ambil semua TPS
router.get("/", async (req, res) => {
  try {
    const tpsList = await Tps.find();
    res.status(200).json(tpsList);
  } catch (err) {
    console.error("GET /tps error:", err);
    res.status(500).json({ message: "Gagal mengambil data TPS" });
  }
});

// Tambah TPS
router.post("/add", async (req, res) => {
  const { nama, alamat, latitude, longitude, kapasitas } = req.body;

  if (![nama, alamat, latitude, longitude, kapasitas].every(Boolean)) {
    return res.status(400).json({ message: "Isi semua formulir" });
  }

  try {
    await new Tps({
      nama: nama.trim(),
      alamat: alamat.trim(),
      latitude,
      longitude,
      kapasitas
    }).save();

    res.status(201).json({ message: "TPS berhasil ditambahkan" });
  } catch (err) {
    console.error("POST /tps/add error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat menambahkan TPS" });
  }
});

// Update TPS
router.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { nama, alamat, latitude, longitude, kapasitas } = req.body;

  if (![nama, alamat, latitude, longitude, kapasitas].every(Boolean)) {
    return res.status(400).json({ message: "Isi semua formulir" });
  }

  try {
    const updatedTps = await Tps.findByIdAndUpdate(
      id,
      {
        nama: nama.trim(),
        alamat: alamat.trim(),
        latitude,
        longitude,
        kapasitas
      },
      { new: true }
    );

    if (!updatedTps) {
      return res.status(404).json({ message: "TPS tidak ditemukan" });
    }

    res.status(200).json({
      message: "TPS berhasil diperbarui",
      data: updatedTps
    });
  } catch (err) {
    console.error("POST /tps/update error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat memperbarui TPS" });
  }
});

// Hapus TPS
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTps = await Tps.findByIdAndDelete(id);

    if (!deletedTps) {
      return res.status(404).json({ message: "TPS tidak ditemukan" });
    }

    res.status(200).json({ message: "TPS berhasil dihapus" });
  } catch (err) {
    console.error("DELETE /tps/delete error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus TPS" });
  }
});

module.exports = router;
