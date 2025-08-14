const express = require("express");
const cors = require("cors");
const Kategori = require("../modules/kategori");

const router = express.Router();
router.use(express.json());
router.use(cors());

// Helper validasi
const validateKategori = (name) => {
  if (!name?.trim()) return "Isi semua formulir";
  return null;
};

// Get semua kategori
router.get("/", async (req, res) => {
  try {
    const kategoriList = await Kategori.find();
    res.status(200).json(kategoriList);
  } catch (err) {
    console.error("GET /kategori error:", err);
    res.status(500).json({ message: "Gagal mengambil data kategori" });
  }
});

// Tambah kategori
router.post("/add", async (req, res) => {
  const error = validateKategori(req.body.name);
  if (error) return res.status(400).json({ message: error });

  try {
    await new Kategori({ name: req.body.name.trim() }).save();
    res.status(201).json({ message: "Kategori berhasil ditambahkan" });
  } catch (err) {
    console.error("POST /kategori/add error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat menambahkan kategori" });
  }
});

// Update kategori
router.post("/update/:id", async (req, res) => {
  const error = validateKategori(req.body.name);
  if (error) return res.status(400).json({ message: error });

  try {
    const updatedKategori = await Kategori.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name.trim() },
      { new: true }
    );

    if (!updatedKategori) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    res.status(200).json({
      message: "Kategori berhasil diperbarui",
      data: updatedKategori
    });
  } catch (err) {
    console.error("POST /kategori/update error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat memperbarui kategori" });
  }
});

// Hapus kategori
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedKategori = await Kategori.findByIdAndDelete(req.params.id);

    if (!deletedKategori) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    res.status(200).json({ message: "Kategori berhasil dihapus" });
  } catch (err) {
    console.error("DELETE /kategori/delete error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus kategori" });
  }
});

module.exports = router;
