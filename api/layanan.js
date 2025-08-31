const express = require("express");
const cors = require("cors");
const Layanan = require("../modules/layanan");

const router = express.Router();
router.use(express.json());
router.use(cors());

const validateLayanan = ({ name, phone, region, type, status }, requireStatus = true) => {
  if (!phone?.trim() || !region?.trim() || !type?.trim()) return "Isi semua formulir";
  if (requireStatus && !status?.trim()) return "Isi semua formulir";
  return null;
};

// Get semua layanan
router.get("/", async (req, res) => {
  try {
    const layananList = await Layanan.find();
    res.status(200).json(layananList);
  } catch (err) {
    console.error("GET /layanan error:", err);
    res.status(500).json({ message: "Gagal mengambil data layanan" });
  }
});

// Tambah layanan
router.post("/add", async (req, res) => {
  const error = validateLayanan(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    await new Layanan({
      name: req.body.name.trim(),
      phone: req.body.phone.trim(),
      region: req.body.region.trim(),
      note: req.body.note?.trim() || "-",
      type: req.body.type.trim(),
      status: req.body.status.trim()
    }).save();

    res.status(201).json({ message: "Layanan berhasil ditambahkan" });
  } catch (err) {
    console.error("POST /layanan/add error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat menambahkan layanan" });
  }
});

// Update layanan
router.post("/update/:id", async (req, res) => {
  const error = validateLayanan(req.body, false);
  if (error) return res.status(400).json({ message: error });

  try {
    const updatedLayanan = await Layanan.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name.trim(),
        phone: req.body.phone.trim(),
        region: req.body.region.trim(),
        note: req.body.note?.trim() || "-",
        type: req.body.type.trim(),
        status: req.body.status?.trim()
      },
      { new: true }
    );

    if (!updatedLayanan) {
      return res.status(404).json({ message: "Layanan tidak ditemukan" });
    }

    res.status(200).json({
      message: "Layanan berhasil diperbarui",
      data: updatedLayanan
    });
  } catch (err) {
    console.error("POST /layanan/update/:id error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat memperbarui layanan" });
  }
});

// Hapus layanan
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedLayanan = await Layanan.findByIdAndDelete(req.params.id);

    if (!deletedLayanan) {
      return res.status(404).json({ message: "Layanan tidak ditemukan" });
    }

    res.status(200).json({ message: "Layanan berhasil dihapus" });
  } catch (err) {
    console.error("DELETE /layanan/delete/:id error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus layanan" });
  }
});

module.exports = router;
